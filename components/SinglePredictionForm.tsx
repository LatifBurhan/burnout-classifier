"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { getRiskColor, getRiskRecommendation } from "@/lib/utils";
import RiskGauge from "./RiskGauge";

interface FormData {
  is_weekend: number;
  work_hours: number;
  screen_time_hours: number;
  meetings_count: number;
  breaks_taken: number;
  after_hours_work: number;
  sleep_hours: number;
  task_completion_rate: number;
}

interface PredictionResult {
  predicted_risk: string;
  confidence_score: number;
}

export default function SinglePredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    is_weekend: 0,
    work_hours: 8,
    screen_time_hours: 6,
    meetings_count: 3,
    breaks_taken: 2,
    after_hours_work: 0,
    sleep_hours: 7,
    task_completion_rate: 0.85,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to make prediction");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
            ? 1
            : 0
          : name === "task_completion_rate"
          ? parseFloat(value)
          : parseInt(value),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Input Data Karyawan
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tipe Hari
            </label>
            <select
              name="is_weekend"
              value={formData.is_weekend}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Weekday</option>
              <option value={1}>Weekend</option>
            </select>
          </div>

          {/* Work Hours */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jam Kerja (hours): {formData.work_hours}
            </label>
            <input
              type="range"
              name="work_hours"
              min="0"
              max="16"
              step="0.5"
              value={formData.work_hours}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Screen Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Screen Time (hours): {formData.screen_time_hours}
            </label>
            <input
              type="range"
              name="screen_time_hours"
              min="0"
              max="16"
              step="0.5"
              value={formData.screen_time_hours}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Meetings Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jumlah Meeting
            </label>
            <input
              type="number"
              name="meetings_count"
              min="0"
              max="20"
              value={formData.meetings_count}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Breaks Taken */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jumlah Istirahat
            </label>
            <input
              type="number"
              name="breaks_taken"
              min="0"
              max="10"
              value={formData.breaks_taken}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* After Hours Work */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="after_hours_work"
              checked={formData.after_hours_work === 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  after_hours_work: e.target.checked ? 1 : 0,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-semibold text-gray-800">
              Kerja Lembur (After Hours)
            </label>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jam Tidur (hours): {formData.sleep_hours}
            </label>
            <input
              type="range"
              name="sleep_hours"
              min="0"
              max="12"
              step="0.5"
              value={formData.sleep_hours}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Task Completion Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Task Completion Rate: {(formData.task_completion_rate * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              name="task_completion_rate"
              min="0"
              max="1"
              step="0.01"
              value={formData.task_completion_rate}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Memproses...
              </>
            ) : (
              "Prediksi Risiko Burnout"
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Hasil Prediksi
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-2" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {result ? (
          <div className="space-y-6">
            {/* Risk Gauge */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg border border-gray-200">
              <RiskGauge
                risk={result.predicted_risk}
                confidence={result.confidence_score}
              />
            </div>

            {/* Input Summary */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Ringkasan Input
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Tipe Hari</p>
                  <p className="font-semibold text-gray-900">
                    {formData.is_weekend ? "Weekend" : "Weekday"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Jam Kerja</p>
                  <p className="font-semibold text-gray-900">{formData.work_hours} jam</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Screen Time</p>
                  <p className="font-semibold text-gray-900">
                    {formData.screen_time_hours} jam
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Jumlah Meeting</p>
                  <p className="font-semibold text-gray-900">{formData.meetings_count}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Istirahat</p>
                  <p className="font-semibold text-gray-900">{formData.breaks_taken}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Jam Tidur</p>
                  <p className="font-semibold text-gray-900">{formData.sleep_hours} jam</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Lembur</p>
                  <p className="font-semibold text-gray-900">
                    {formData.after_hours_work ? "Ya" : "Tidak"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700 font-medium">Task Rate</p>
                  <p className="font-semibold text-gray-900">
                    {(formData.task_completion_rate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Rekomendasi
              </p>
              <p className="text-sm text-blue-800">
                {getRiskRecommendation(result.predicted_risk)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Silakan isi form dan klik tombol prediksi untuk melihat hasil</p>
          </div>
        )}
      </div>
    </div>
  );
}
