import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HERIS — Employee Assessment System",
  description: "Sistem Asesmen Karyawan berbasis WLA, SDT, dan UWES",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-indigo-700 tracking-tight">
              HERIS <span className="text-gray-400 font-normal text-sm ml-1">Assessment</span>
            </a>
            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</a>
              <a href="/assessment" className="text-gray-600 hover:text-indigo-600 transition-colors">Asesmen</a>
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors">Dashboard</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
