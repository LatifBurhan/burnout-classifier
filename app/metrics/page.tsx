"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import Link from "next/link";

interface ModelMetrics {
  model_type: string;
  training_date: string;
  dataset_size: number;
  train_size: number;
  test_size: number;
  train_percentage: number;
  test_percentage: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  class_distribution: {
    Low: number;
    Medium: number;
    High: number;
  };
  confusion_matrix: number[][];
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/model_metrics.json")
      .then((res) => {
        if (!res.ok) throw new Error("Metrics not found");
        return res.json();
      })
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load metrics");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <XCircle className="text-red-600 mr-2" size={24} />
            <h2 className="text-lg font-semibold text-red-800">
              Metrics Not Available
            </h2>
          </div>
          <p className="text-red-700 mb-4">
            Model metrics file not found. Please train the model first by running:
          </p>
          <code className="block bg-red-100 p-2 rounded text-sm mb-4">
            python3 train_naive_bayes_model.py
          </code>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { accuracy, precision, recall, f1_score } = metrics.metrics;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Model Performance Metrics</h1>
          </div>
          <p className="text-gray-600">
            Training results and evaluation metrics for Naive Bayes classifier
          </p>
        </div>

        {/* Model Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="text-green-600 mr-2" size={24} />
            Model Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-1">Algorithm</p>
              <p className="text-lg font-bold text-blue-900">{metrics.model_type}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-1">Training Date</p>
              <p className="text-lg font-bold text-green-900">
                {new Date(metrics.training_date).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-1">Dataset Size</p>
              <p className="text-lg font-bold text-purple-900">
                {metrics.dataset_size} records
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-1">Split Ratio</p>
              <p className="text-lg font-bold text-orange-900">
                {metrics.train_percentage}% / {metrics.test_percentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <MetricCard
            title="Accuracy"
            value={accuracy}
            description="Overall correctness"
            color="blue"
          />
          <MetricCard
            title="Precision"
            value={precision}
            description="Positive predictions accuracy"
            color="green"
          />
          <MetricCard
            title="Recall"
            value={recall}
            description="Actual positives found"
            color="yellow"
          />
          <MetricCard
            title="F1-Score"
            value={f1_score}
            description="Harmonic mean"
            color="purple"
          />
        </div>

        {/* Data Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Data Split (Train/Test)</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Training Data (80%)
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metrics.train_size} samples
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Testing Data (20%)
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metrics.test_size} samples
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Model trained on 80% of data and validated on remaining 20% to ensure unbiased evaluation.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Class Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(metrics.class_distribution).map(([cls, count]) => {
                const percentage = (count / metrics.dataset_size) * 100;
                const colors = {
                  Low: { bg: "bg-green-500", from: "from-green-400", to: "to-green-600" },
                  Medium: { bg: "bg-yellow-500", from: "from-yellow-400", to: "to-yellow-600" },
                  High: { bg: "bg-red-500", from: "from-red-400", to: "to-red-600" },
                };
                const color = colors[cls as keyof typeof colors];
                return (
                  <div key={cls}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {cls} Risk
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`bg-gradient-to-r ${color.from} ${color.to} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Confusion Matrix
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Shows how well the model predicted each class. Diagonal values (highlighted) represent correct predictions.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-2 border-gray-300 p-3 bg-gray-100 font-bold text-gray-800"></th>
                  <th className="border-2 border-gray-300 p-3 bg-blue-50 font-bold text-blue-900">
                    Predicted<br />Low
                  </th>
                  <th className="border-2 border-gray-300 p-3 bg-blue-50 font-bold text-blue-900">
                    Predicted<br />Medium
                  </th>
                  <th className="border-2 border-gray-300 p-3 bg-blue-50 font-bold text-blue-900">
                    Predicted<br />High
                  </th>
                </tr>
              </thead>
              <tbody>
                {["Low", "Medium", "High"].map((actual, i) => (
                  <tr key={actual}>
                    <td className="border-2 border-gray-300 p-3 bg-blue-50 font-bold text-blue-900">
                      Actual {actual}
                    </td>
                    {metrics.confusion_matrix[i].map((value, j) => (
                      <td
                        key={j}
                        className={`border-2 border-gray-300 p-4 text-center text-lg font-bold ${
                          i === j 
                            ? "bg-green-100 text-green-800" 
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✓ Green cells</strong> represent correct predictions where the model predicted the same risk level as actual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: number;
  description: string;
  color: string;
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-lg shadow-lg p-6 text-white transform transition-transform hover:scale-105`}
    >
      <h3 className="text-sm font-semibold opacity-90 mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-4xl font-bold mb-2">{(value * 100).toFixed(2)}%</p>
      <p className="text-xs opacity-90">{description}</p>
    </div>
  );
}
