import React from "react";

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "primary" | "success" | "warning" | "info";
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "primary"
}: MetricsCardProps) {
  const variants = {
    primary: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    info: "bg-slate-50 border-slate-200 text-slate-900"
  };

  const iconVariants = {
    primary: "text-blue-600 bg-blue-100",
    success: "text-green-600 bg-green-100",
    warning: "text-amber-600 bg-amber-100",
    info: "text-slate-600 bg-slate-100"
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${variants[variant]} transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconVariants[variant]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-semibold ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className={`mr-1 ${trend.isPositive ? '↗' : '↘'}`}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {trend.value}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold text-slate-900">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
