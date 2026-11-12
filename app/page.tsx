"use client";

import { useState } from "react";
import { Brain, User, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import SinglePredictionForm from "@/components/SinglePredictionForm";
import BulkUploadForm from "@/components/BulkUploadForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Brain size={32} />
          <div>
            <h1 className="text-xl font-bold">Burnout</h1>
            <p className="text-xs text-blue-200">Risk Classifier</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("single")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "single"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <User size={20} />
            Single Prediction
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "bulk"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <Users size={20} />
            Bulk Upload
          </button>
          <Link
            href="/metrics"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-700 text-white"
          >
            <BarChart3 size={20} />
            Model Metrics
          </Link>
        </nav>

        <div className="mt-8 pt-6 border-t border-blue-500">
          <p className="text-xs text-blue-200">
            WFH Employee Burnout Risk Assessment System
          </p>
          <p className="text-xs text-blue-300 mt-2">
            Powered by Machine Learning
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === "single"
                ? "Single Employee Prediction"
                : "Bulk CSV/Excel Upload"}
            </h1>
            <p className="text-gray-700 font-medium">
              {activeTab === "single"
                ? "Masukkan data karyawan untuk memprediksi tingkat risiko burnout"
                : "Upload file CSV untuk prediksi massal risiko burnout"}
            </p>
          </div>

          {/* Content */}
          {activeTab === "single" ? (
            <SinglePredictionForm />
          ) : (
            <BulkUploadForm />
          )}
        </div>
      </main>
    </div>
  );
}
