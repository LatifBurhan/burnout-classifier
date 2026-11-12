import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getRiskRecommendation(risk: string): string {
  switch (risk.toLowerCase()) {
    case "low":
      return "Tingkat risiko burnout rendah. Pertahankan keseimbangan kerja yang baik dan terus jaga kesehatan mental.";
    case "medium":
      return "Tingkat risiko burnout sedang. Disarankan untuk meningkatkan waktu istirahat, mengurangi screen time, dan memastikan tidur yang cukup.";
    case "high":
      return "Tingkat risiko burnout tinggi! Segera ambil tindakan: kurangi jam kerja overtime, tingkatkan frekuensi istirahat, dan konsultasi dengan HR atau profesional kesehatan mental.";
    default:
      return "Tidak dapat menentukan rekomendasi.";
  }
}
