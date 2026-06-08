'use client';

import { useMemo } from 'react';
import type { SixDimScore } from '@/lib/types';

const LABELS = ['市场需求', '蓝海度', '变现潜力', '技术可行', '启动门槛', '增长飞轮'];

interface RadarChartProps {
  scores?: SixDimScore;
  /** 兼容别名 */
  sixDim?: SixDimScore;
  size?: number;
  className?: string;
  showLabels?: boolean;
  accentColor?: string; // 雷达多边形颜色
}

export function RadarChart({ scores: scoresProp, sixDim, size = 320, className, showLabels = true, accentColor }: RadarChartProps) {
  const scores = scoresProp ?? sixDim;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const stroke = accentColor ?? 'var(--color-primary)';
  const fill = accentColor ? `${accentColor}26` : 'color-mix(in oklch, var(--color-primary) 15%, transparent)';

  // hooks 必须在 early return 之前
  const points = useMemo(() => {
    if (!scores) return [] as { x: number; y: number; angle: number; value: number; label: string }[];
    const vals = [
      scores.demand, scores.blue_ocean, scores.monetize,
      scores.tech_feasible, scores.entry_barrier, scores.growth,
    ];
    return vals.map((v, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (v / 10) * radius;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        angle,
        value: v,
        label: LABELS[i] ?? '',
      };
    });
  }, [scores, cx, cy, radius]);

  if (!scores) return null;

  const ringRadii = [0.2, 0.4, 0.6, 0.8, 1.0].map((p) => p * radius);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} aria-label="六维评分雷达图">
      {/* 5 圈背景网格（六边形） */}
      {ringRadii.map((r, idx) => {
        const pts = Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="var(--color-outline-variant)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        );
      })}

      {/* 6 轴线 */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + radius * Math.cos(p.angle)}
          y2={cy + radius * Math.sin(p.angle)}
          stroke="var(--color-outline-variant)"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      ))}

      {/* 数据多边形 */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* 数据点 + 标签 */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={stroke} stroke="var(--color-background)" strokeWidth={2} />
          {showLabels && (
            <>
              <text
                x={cx + (radius + 24) * Math.cos(p.angle)}
                y={cy + (radius + 24) * Math.sin(p.angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-on-surface-variant font-mono"
                style={{ fontSize: 11 }}
              >
                {p.label}
              </text>
              <text
                x={cx + (radius + 24) * Math.cos(p.angle)}
                y={cy + (radius + 24) * Math.sin(p.angle) + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground font-display font-bold font-mono"
                style={{ fontSize: 12 }}
              >
                {p.value.toFixed(1)}
              </text>
            </>
          )}
        </g>
      ))}

      {/* 中心点 */}
      <circle cx={cx} cy={cy} r={2} fill={stroke} opacity={0.6} />
    </svg>
  );
}

/** 紧凑版 mini 雷达（用于历史记录 / 卡片） */
export function MiniRadar({ scores, sixDim, size = 80, color = 'var(--color-primary)' }: { scores?: SixDimScore; sixDim?: SixDimScore; size?: number; color?: string }) {
  const data = scores ?? sixDim;
  if (!data) return null;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.4;
  const values = [
    data.demand, data.blue_ocean, data.monetize,
    data.tech_feasible, data.entry_barrier, data.growth,
  ];
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (v / 10) * radius;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <polygon
        points={Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
        }).join(' ')}
        fill="none"
        stroke="var(--color-outline-variant)"
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      <polygon
        points={points}
        fill={`color-mix(in oklch, ${color} 20%, transparent)`}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
