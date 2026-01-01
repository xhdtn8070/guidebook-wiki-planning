import React, { useState } from 'react';
import { LayoutRoot } from '@/components/layout';
import { mockSearchResults } from '@/lib/mockData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  };

  const results = query ? mockSearchResults : [];

  return (
    <LayoutRoot>
      <main className="container max-w-3xl py-12 px-6">
        <h1 className="text-2xl font-bold mb-6">문서 검색</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="검색어를 입력하세요..."
            className="pl-12 h-12 text-lg"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="h-5 w-48 skeleton-pulse rounded mb-2" />
                <div className="h-4 w-full skeleton-pulse rounded mb-2" />
                <div className="h-3 w-24 skeleton-pulse rounded" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <a
                key={result.id}
                href={result.path}
                className="block p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-theme-sm transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-primary">{result.title}</h3>
                  <span className="text-xs text-muted-foreground">점수: {(result.score * 100).toFixed(0)}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.summary}</p>
                <div className="flex gap-2">
                  {result.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        ) : query ? (
          <p className="text-muted-foreground text-center py-12">검색 결과가 없습니다.</p>
        ) : (
          <p className="text-muted-foreground text-center py-12">검색어를 입력해주세요.</p>
        )}
      </main>
    </LayoutRoot>
  );
};

export default SearchPage;
