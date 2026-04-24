import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runScoringEngine } from "@/lib/scoring";
import { z } from "zod";

const wlaItemSchema = z.object({
  taskName: z.string().min(1),
  duration: z.number().positive(),
  frequency: z.number().positive(),
  frequencyType: z.enum(["daily", "weekly", "monthly"]),
  difficultyScale: z.number().int().min(1).max(5),
});

const surveyResponseSchema = z.object({
  questionCode: z.string().regex(/^[SU]\d$/),
  rawValue: z.number().int().min(1).max(7),
});

const submitSchema = z.object({
  userId: z.number().int().positive(),
  periodName: z.string().min(1),
  wlaItems: z.array(wlaItemSchema).min(1),
  surveyResponses: z.array(surveyResponseSchema).min(12), // S1-S9 + U1-U3
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { userId, periodName, wlaItems, surveyResponses } = parsed.data;

    // Jalankan scoring engine
    const scores = runScoringEngine(wlaItems, surveyResponses);

    // Simpan ke database
    const log = await prisma.assessmentLog.create({
      data: {
        userId,
        periodName,
        finalFteScore: scores.fte,
        finalSdtIndex: scores.sdtIndex,
        finalUwesIndex: scores.uwesIndex,
        riskLevel: scores.riskLevel,
        wlaItems: {
          create: wlaItems.map((item) => ({
            taskName: item.taskName,
            duration: item.duration,
            frequency: item.frequency,
            frequencyType: item.frequencyType,
            difficultyScale: item.difficultyScale,
          })),
        },
        surveyResponses: {
          create: surveyResponses.map((r) => ({
            questionCode: r.questionCode,
            rawValue: r.rawValue,
          })),
        },
      },
    });

    return NextResponse.json({ id: log.id, scores });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logs = await prisma.assessmentLog.findMany({
      include: {
        user: { include: { department: true } },
        wlaItems: true,
        surveyResponses: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
