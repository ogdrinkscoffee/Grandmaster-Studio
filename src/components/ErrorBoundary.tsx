import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected rendering error occurred.'
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Grandmaster Studio boundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ backgroundColor: '#0b0e14', color: '#f3f4f6' }}
        >
          <div
            className="max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-2xl"
            style={{ backgroundColor: '#131822', borderColor: '#253042' }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold">Studio View Interrupted</h1>
                <p className="text-xs text-slate-400">
                  A component failed to render cleanly. Your saved matches and settings remain intact.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-xs font-mono text-rose-300 break-words">
              {this.state.message}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:opacity-90 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Studio</span>
              </button>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/15 text-slate-200 hover:bg-white/5 transition"
              >
                Retry Render
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
