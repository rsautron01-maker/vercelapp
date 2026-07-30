import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("surface lift p-5", accent && "gradient-emerald border-transparent")}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            accent ? "bg-white/15 text-primary-foreground" : "bg-primary-soft text-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wide",
            accent ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      </div>
      <p
        className={cn(
          "mt-4 font-display text-3xl font-semibold",
          accent && "text-primary-foreground",
        )}
      >
        {value}
      </p>
      {hint && (
        <p className={cn("mt-1 text-xs", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {hint}
        </p>
      )}
    </motion.div>
  );
}

export function ProgressRing({
  percent,
  size = 168,
  label,
  sublabel,
}: {
  percent: number;
  size?: number;
  label: string;
  sublabel?: string;
}) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, percent / 100));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-primary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold lg:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
