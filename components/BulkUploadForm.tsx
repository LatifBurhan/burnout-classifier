"use client";

import { useState, useRef } from "react";
import { Upload, Download, Loader2, AlertCircle, FileText } from "lucide-react";
import Papa from "papaparse";
import { getRiskColor } from "@/lib/utils";

interface BulkResult {
  results: any[];
  statistics: {
    total_records: number;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
}

export default function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const downloadTemplate = () => {
    const template = `employee_id,is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate
EMP001,0,8,6,3,2,0,7,0.85
EMP002,1,4,3,1,3,0,8,0.90
EMP003,0,10,9,5,1,1,6,0.75`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "burnout_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        complete: async (parseResult) => {
          try {
            const data = parseResult.data.filter((row: any) => {
              // Filter out empty rows
              return Object.values(row).some((val) => val !== "");
            });

            if (data.length === 0) {
              throw new Error("No valid data found in CSV");
            }

            // Send to API
            const response = await fetch("/api/predict-bulk", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ data }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Failed to process bulk prediction");
            }

            setResults(result);
          } catch (err: any) {
            setError(err.message || "An error occurred during processing");
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          setError(`CSV parsing error: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const csv = Papa.unparse(results.results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `burnout_results_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredResults = results?.results.filter((row) => {
    const matchesSearch = searchTerm
      ? Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const matchesFilter =
      filterRisk === "all" ? true : row.predicted_risk === filterRisk;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Upload CSV File</h2>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Download size={20} />
            Download Template
          </button>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">
            {file ? file.name : "Drag and drop CSV file here, or click to browse"}
          </p>
          <p className="text-sm text-gray-400">Supported format: .csv</p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-2" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2" size={20} />
              Process File
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">
                {results.statistics.total_records}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
              <p className="text-sm text-red-600 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-red-700">
                {results.statistics.high_risk}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
              <p className="text-sm text-yellow-600 mb-1">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-700">
                {results.statistics.medium_risk}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
              <p className="text-sm text-green-600 mb-1">Low Risk</p>
              <p className="text-3xl font-bold text-green-700">
                {results.statistics.low_risk}
              </p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Prediction Results
              </h3>
              <button
                onClick={exportResults}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Download size={18} />
                Export Results
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risks</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-900">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Employee ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Work Hours
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Sleep Hours
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Meetings
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Predicted Risk
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults && filteredResults.length > 0 ? (
                    filteredResults.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {row.employee_id || `Employee ${index + 1}`}
                        </td>
                        <td className="px-4 py-3">{row.work_hours}</td>
                        <td className="px-4 py-3">{row.sleep_hours}</td>
                        <td className="px-4 py-3">{row.meetings_count}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(
                              row.predicted_risk
                            )}`}
                          >
                            {row.predicted_risk}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(row.confidence_score * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
