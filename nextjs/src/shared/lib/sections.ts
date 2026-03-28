import type { GuidebookSection, HeadingSection } from "@/shared/lib/api-types";

export type TocItem = {
  id: string;
  label: string;
  level: number;
};

export function extractTableOfContents(sections: GuidebookSection[]) {
  const items: TocItem[] = [];
  sections.forEach((section, index) => {
    if (section.type !== "HEADING") {
      return;
    }

    items.push({
      id: section.id ?? headingId(section, index),
      label: section.text,
      level: section.level,
    });
  });
  return items;
}

export function summarizeSections(sections: GuidebookSection[]) {
  const values: string[] = [];

  const walk = (entries: GuidebookSection[]) => {
    entries.forEach((section) => {
      switch (section.type) {
        case "HEADING":
          values.push(section.text);
          break;
        case "MARKDOWN":
        case "CODE":
          values.push(section.content);
          break;
        case "CALLOUT":
          values.push([section.title, section.content].filter(Boolean).join(" "));
          break;
        case "TABLE":
          if (section.headers?.length) {
            values.push(section.headers.join(" "));
          }
          values.push(section.rows.flat().join(" "));
          break;
        case "IMAGE":
          if (section.alt) {
            values.push(section.alt);
          }
          break;
        case "VIDEO":
          if (section.title) {
            values.push(section.title);
          }
          break;
        case "TABS":
          section.items.forEach((item) => {
            values.push(item.label);
            walk(item.content);
          });
          break;
      }
    });
  };

  walk(sections);
  return values
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingId(section: HeadingSection, index: number) {
  const base = section.text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || `section-${index + 1}`;
}
