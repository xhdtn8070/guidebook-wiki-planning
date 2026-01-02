import React from 'react';
import { cn } from '@/lib/utils';

interface ActionBlockProps {
  type: string;
  endpoint: string;
  className?: string;
}

export function ActionBlock({ type, endpoint, className }: ActionBlockProps) {
  const [apiUrl, setApiUrl] = React.useState('https://api.guidebook.wiki/v1/demo');
  const [authType, setAuthType] = React.useState('bearer');
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setResult(JSON.stringify({
      success: true,
      data: {
        message: 'API 호출 결과 예시입니다.',
        timestamp: new Date().toISOString(),
        endpoint: apiUrl,
      }
    }, null, 2));
    setLoading(false);
  };

  const handleLoadSample = () => {
    setApiUrl('https://api.guidebook.wiki/v1/sample');
    setAuthType('api-key');
  };

  return (
    <div className={cn(
      'rounded-lg border border-dashed border-primary/50 p-4',
      'bg-primary/5',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="pill">{type}</span>
        <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {endpoint}
        </code>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Authorization</label>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="bearer">Bearer 토큰</option>
            <option value="api-key">API Key</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '실행 중...' : '실행'}
          </button>
          <button
            onClick={handleLoadSample}
            className="px-4 py-2 rounded-lg border border-primary/40 text-foreground text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            샘플 로드
          </button>
          <button className="px-4 py-2 text-primary text-sm font-semibold hover:underline">
            액션 설명 보기 →
          </button>
        </div>

        {/* Result */}
        {(result || loading) && (
          <div className="mt-3 p-3 rounded-lg border border-dashed border-border bg-primary/5 font-mono text-xs">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                API 호출 중...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-foreground">{result}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
