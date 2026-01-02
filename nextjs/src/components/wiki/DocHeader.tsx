import { Button } from "../ui/button";
import { Edit, Star } from "@/components/icons";
import { DocPage } from "@/lib/mockData";

interface DocHeaderProps {
  page: DocPage;
}

export function DocHeader({ page }: DocHeaderProps) {
  return (
    <header className="pb-4 mb-6 border-b border-border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="pill text-xs mb-2">{(page.gateType ?? "public").toUpperCase()}</span>
          <h1 className="text-2xl font-bold mt-2">{page.title}</h1>
          <p className="text-muted-foreground mt-1">{page.lead}</p>
          <p className="text-xs text-muted-foreground mt-2">업데이트: {page.updated}</p>
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
