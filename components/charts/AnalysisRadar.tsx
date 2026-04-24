"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

interface AnalysisRadarProps {
  surveyResponses: { questionCode: string; rawValue: number }[];
}

const SDT_LABELS: Record<string, string> = {
  S1: "Otonomi",
  S2: "Kompetensi",
  S3: "Keterikatan",
  S7: "Nilai",
  S8: "Identitas",
  S9: "Motivasi Intrinsik",
};

export function AnalysisRadar({ surveyResponses }: AnalysisRadarProps) {
  const data: RadarDataPoint[] = Object.entries(SDT_LABELS).map(([code, label]) => {
    const response = surveyResponses.find((r) => r.questionCode === code);
    return {
      subject: label,
      score: response ? (response.rawValue / 7) * 100 : 0,
      fullMark: 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Radar
          name="Skor"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Skor"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
