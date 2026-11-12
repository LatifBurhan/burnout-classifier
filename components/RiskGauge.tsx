"use client";

interface RiskGaugeProps {
  risk: string;
  confidence: number;
}

export default function RiskGauge({ risk, confidence }: RiskGaugeProps) {
  // Get color and position based on risk
  const getRiskInfo = () => {
    switch (risk.toLowerCase()) {
      case "low":
        return {
          color: "#10b981",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          position: 16.67, // 1/6 of the bar
        };
      case "medium":
        return {
          color: "#f59e0b",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          position: 50, // Middle
        };
      case "high":
        return {
          color: "#ef4444",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          position: 83.33, // 5/6 of the bar
        };
      default:
        return {
          color: "#6b7280",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          position: 50,
        };
    }
  };

  const riskInfo = getRiskInfo();

  return (
    <div className="w-full">
      {/* Risk Level Indicator Bar */}
      <div className="relative">
        {/* Color Zones */}
        <div className="flex h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
          {/* Low Zone */}
          <div className="flex-1 bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">LOW</span>
          </div>
          {/* Medium Zone */}
          <div className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MEDIUM</span>
          </div>
          {/* High Zone */}
          <div className="flex-1 bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HIGH</span>
          </div>
        </div>

        {/* Indicator Arrow */}
        <div
          className="absolute -bottom-3 transform -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${riskInfo.position}%` }}
        >
          <div
            className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px]"
            style={{ borderTopColor: riskInfo.color }}
          ></div>
          <div
            className="w-1 h-6 mx-auto -mt-1"
            style={{ backgroundColor: riskInfo.color }}
          ></div>
        </div>
      </div>

      {/* Result Details */}
      <div className="mt-8 text-center space-y-3">
        {/* Risk Badge */}
        <div className={`inline-block px-6 py-3 rounded-lg ${riskInfo.bgColor} border-2`} style={{ borderColor: riskInfo.color }}>
          <p className={`text-2xl font-bold ${riskInfo.textColor}`}>
            {risk.toUpperCase()} RISK
          </p>
        </div>

        {/* Confidence Bar */}
        <div>
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-sm font-semibold text-gray-700">Confidence Score</span>
            <span className="text-sm font-bold text-gray-900">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${confidence * 100}%`,
                backgroundColor: riskInfo.color,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
