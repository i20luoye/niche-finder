'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  steps?: string[];
  currentStep?: number;
  className?: string;
}

export function LoadingState({ title = '正在生成报告', steps, currentStep = 0, className }: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="rounded-2xl border border-outline-variant/30 bg-surface p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
            <Sparkles className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
            <p className="text-sm text-on-surface-variant font-mono">预计 60-90 秒</p>
          </div>
          <Loader2 className="ml-auto h-5 w-5 text-primary animate-spin" />
        </div>

        {steps && (
          <div className="space-y-2.5">
            {steps.map((s, i) => {
              const status = i < currentStep ? 'done' : i === currentStep ? 'running' : 'pending';
              return (
                <div
                  key={i}
                  className={
                    'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-all ' +
                    (status === 'done'
                      ? 'border-success/30 bg-success/5 text-foreground'
                      : status === 'running'
                      ? 'border-primary/40 bg-primary/5 text-foreground'
                      : 'border-outline-variant/15 bg-surface-container/20 text-on-surface-variant')
                  }
                >
                  <span
                    className={
                      'inline-flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] ' +
                      (status === 'done'
                        ? 'bg-success/20 text-success'
                        : status === 'running'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-container text-on-surface-variant')
                    }
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{s}</span>
                  {status === 'running' && <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />}
                  {status === 'done' && <span className="text-success text-xs">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
