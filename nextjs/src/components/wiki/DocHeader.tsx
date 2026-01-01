import { Button } from "../ui/button";
import { Edit, Star } from "lucide-react";
import { WikiDocPage } from "@/lib/wikiData";

interface DocHeaderProps {
  page: WikiDocPage;
}

export function DocHeader({ page }: DocHeaderProps) {
  return (
    <header className="pb-4 mb-6 border-b border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="pill text-xs">{page.gateType}</span>
            <span className="pill text-xs bg-muted text-muted-foreground">{page.visibility}</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">{page.title}</h1>
          <p className="text-muted-foreground">{page.summary}</p>
          <p className="text-xs text-muted-foreground">
            업데이트: {new Date(page.updatedAt).toLocaleDateString()} · {page.updatedBy.displayName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-1" /> 수정
          </Button>
        </div>
      </div>
    </header>
  );
}
