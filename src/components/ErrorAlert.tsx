import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, CloudOff } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, isRetrying }) => {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
        {isOffline ? <WifiOff className="w-6 h-6" /> : <CloudOff className="w-6 h-6" />}
      </div>

      <h3 className="text-lg font-bold text-white tracking-tight">
        {isOffline ? 'Internet Connection Unavailable' : 'Unable to Retrieve Weather Telemetry'}
      </h3>

      <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
        {message || 'The Open-Meteo meteorological API did not return data for the requested location.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/30"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying Telemetry...' : 'Retry Connection'}</span>
        </button>
      </div>
    </div>
  );
};
