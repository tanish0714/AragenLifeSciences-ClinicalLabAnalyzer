
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const SEVERITY_CONFIG = {
  Critical: {
    icon: AlertCircle,
    label: "Critical",
    className:
      "border-red-400/20 bg-red-400/[0.08] text-red-300",
  },

  Warning: {
    icon: AlertTriangle,
    label: "Warning",
    className:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
  },

  Normal: {
    icon: CheckCircle2,
    label: "Normal",
    className:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
  },
};

export default function SeverityBadge({ severity = "Normal" }) {
  const config =
    SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Normal;

  const Icon = config.icon;

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide " +
        config.className
      }
    >
      <Icon
        size={13}
        strokeWidth={2}
        aria-hidden="true"
      />

      <span>{config.label}</span>
    </span>
  );
}

