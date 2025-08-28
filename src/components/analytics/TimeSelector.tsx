import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function TimeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "7d", label: "7D", fullLabel: "7 Days" },
    { value: "30d", label: "30D", fullLabel: "30 Days" },
    { value: "90d", label: "90D", fullLabel: "90 Days" },
    { value: "1y", label: "1Y", fullLabel: "1 Year" },
  ];

  return (
    <div className="flex items-center gap-1 bg-pink-100 dark:bg-slate-700 rounded-xl p-1">
      <div className="flex items-center gap-2 px-3 py-1 text-slate-600 dark:text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Time:</span>
      </div>
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            value === opt.value
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              : "hover:bg-pink-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
          }`}
          title={opt.fullLabel}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
