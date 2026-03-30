"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import type {
  CalloutSection,
  CodeSection,
  GuidebookSection,
  HeadingSection,
  ImageSection,
  MarkdownSection,
  TableSection,
  TabsSection,
  VideoSection,
} from "@/shared/lib/api-types";

type EditableTabsItem = {
  key: string;
  label: string;
  content: GuidebookSection[];
  contentDraft: string;
};

type EditableTabsSection = {
  type: "TABS";
  items: EditableTabsItem[];
};

type UnsupportedEditableSection = {
  kind: "UNSUPPORTED";
  rawType: string;
  rawJson: string;
};

type EditableSection =
  | HeadingSection
  | MarkdownSection
  | CalloutSection
  | CodeSection
  | TableSection
  | ImageSection
  | VideoSection
  | EditableTabsSection
  | UnsupportedEditableSection;

const SECTION_OPTIONS = ["HEADING", "MARKDOWN", "CALLOUT", "CODE", "TABLE", "TABS"] as const;

export function PageSectionEditor({ initialSections }: { initialSections: GuidebookSection[] }) {
  const [sections, setSections] = useState<EditableSection[]>(() => initialSections.map(toEditableSection));
  const serializedSections = useMemo(() => JSON.stringify(serializeSections(sections)), [sections]);

  return (
    <div className="space-y-5">
      <input type="hidden" name="sectionsJson" value={serializedSections} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border bg-background/45 px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Sections</p>
          <p className="mt-1 text-sm text-muted-foreground">핵심 문서 블록은 구조화 UI로 편집하고, 지원하지 않는 블록은 raw JSON으로 보존합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SECTION_OPTIONS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSections((current) => [...current, createEmptySection(type)])}
              className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background"
            >
              {type} 추가
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={sectionKey(section, index)} className="rounded-[26px] border border-border bg-background/35 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Section {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-foreground">{sectionLabel(section)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => moveSection(index, -1, setSections)} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background">
                  위로
                </button>
                <button type="button" onClick={() => moveSection(index, 1, setSections)} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background">
                  아래로
                </button>
                <button type="button" onClick={() => removeSection(index, setSections)} className="inline-flex h-9 items-center rounded-xl border border-red-300/60 px-3 text-xs font-medium text-red-700 hover:bg-red-50">
                  삭제
                </button>
              </div>
            </div>
            <div className="mt-4">{renderSectionEditor(section, index, setSections)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSectionEditor(section: EditableSection, index: number, setSections: Dispatch<SetStateAction<EditableSection[]>>) {
  if (isUnsupportedSection(section)) {
    return (
      <TextareaField
        label="Raw JSON"
        rows={10}
        value={section.rawJson}
        onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as UnsupportedEditableSection), rawJson: value }))}
        className="font-mono text-xs"
      />
    );
  }

  switch (section.type) {
    case "HEADING":
      return (
        <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
          <SelectField label="Level" value={String(section.level)} options={["1", "2", "3", "4", "5", "6"]} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as HeadingSection), level: Number(value) }))} />
          <TextField label="Text" value={section.text} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as HeadingSection), text: value }))} />
        </div>
      );
    case "MARKDOWN":
      return <TextareaField label="Content" value={section.content} rows={8} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as MarkdownSection), content: value }))} />;
    case "CALLOUT":
      return (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
            <SelectField
              label="Variant"
              value={section.variant}
              options={["INFO", "WARNING", "DANGER", "SUCCESS"]}
              onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as CalloutSection), variant: value as CalloutSection["variant"] }))}
            />
            <TextField label="Title" value={section.title ?? ""} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as CalloutSection), title: value || null }))} />
          </div>
          <TextareaField label="Content" value={section.content} rows={6} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as CalloutSection), content: value }))} />
        </div>
      );
    case "CODE":
      return (
        <div className="grid gap-4">
          <TextField label="Language" value={section.lang ?? ""} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as CodeSection), lang: value || null }))} />
          <TextareaField label="Code" value={section.content} rows={10} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as CodeSection), content: value }))} className="font-mono text-xs" />
        </div>
      );
    case "TABLE":
      return (
        <div className="grid gap-4">
          <TextField label="Headers" value={(section.headers ?? []).join(" | ")} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as TableSection), headers: parseDelimitedLine(value) }))} />
          <TextareaField
            label="Rows"
            rows={8}
            value={section.rows.map((row: string[]) => row.join(" | ")).join("\n")}
            onChange={(value) =>
              updateSection(index, setSections, (current) => ({
                ...(current as TableSection),
                rows: value
                  .split("\n")
                  .map((line) => parseDelimitedLine(line))
                  .filter((row) => row.length > 0),
              }))
            }
          />
        </div>
      );
    case "IMAGE":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Alt" value={section.alt ?? ""} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as ImageSection), alt: value || null }))} />
          <TextField label="URL" value={section.url ?? ""} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as ImageSection), url: value || null }))} />
          <TextField
            label="fileId"
            value={section.fileId != null ? String(section.fileId) : ""}
            onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as ImageSection), fileId: value ? Number(value) : null }))}
          />
          <TextField
            label="width × height"
            value={[section.width ?? "", section.height ?? ""].join(" x ")}
            onChange={(value) => {
              const [width, height] = value.split("x").map((item) => item.trim());
              updateSection(index, setSections, (current) => ({
                ...(current as ImageSection),
                width: width ? Number(width) : null,
                height: height ? Number(height) : null,
              }));
            }}
          />
        </div>
      );
    case "VIDEO":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Title" value={section.title ?? ""} onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as VideoSection), title: value || null }))} />
          <TextField
            label="fileId"
            value={section.fileId != null ? String(section.fileId) : ""}
            onChange={(value) => updateSection(index, setSections, (current) => ({ ...(current as VideoSection), fileId: value ? Number(value) : null }))}
          />
        </div>
      );
    case "TABS":
      {
        const tabsSection = section as EditableTabsSection;
        return (
          <div className="space-y-4">
            {tabsSection.items.map((item, itemIndex) => (
              <div key={`${item.key}-${itemIndex}`} className="rounded-2xl border border-border bg-background/55 px-4 py-4">
                <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
                  <TextField label="Key" value={item.key} onChange={(value) => updateTabItem(index, itemIndex, setSections, (current) => ({ ...current, key: value }))} />
                  <TextField label="Label" value={item.label} onChange={(value) => updateTabItem(index, itemIndex, setSections, (current) => ({ ...current, label: value }))} />
                </div>
                <div className="mt-4">
                  <TextareaField
                    label="Content JSON"
                    rows={8}
                    value={item.contentDraft}
                    onChange={(value) =>
                      updateTabItem(index, itemIndex, setSections, (current) => {
                        const parsed = parseSectionsJson(value);
                        return {
                          ...current,
                          contentDraft: value,
                          content: parsed ?? current.content,
                        };
                      })
                    }
                    className="font-mono text-xs"
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => moveTabItem(index, itemIndex, -1, setSections)} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background">
                    탭 위로
                  </button>
                  <button type="button" onClick={() => moveTabItem(index, itemIndex, 1, setSections)} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background">
                    탭 아래로
                  </button>
                  <button type="button" onClick={() => removeTabItem(index, itemIndex, setSections)} className="inline-flex h-9 items-center rounded-xl border border-red-300/60 px-3 text-xs font-medium text-red-700 hover:bg-red-50">
                    탭 삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateSection(index, setSections, (current) => {
                  const tabs = current as EditableTabsSection;
                  return {
                    ...tabs,
                    items: [
                      ...tabs.items,
                      {
                        key: `tab-${tabs.items.length + 1}`,
                        label: `Tab ${tabs.items.length + 1}`,
                        content: [{ type: "MARKDOWN", content: "새 탭 내용을 입력하세요." }],
                        contentDraft: JSON.stringify([{ type: "MARKDOWN", content: "새 탭 내용을 입력하세요." }], null, 2),
                      },
                    ],
                  };
                })
              }
              className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background"
            >
              탭 추가
            </button>
          </div>
        );
      }
    default:
      return null;
  }
}

function TextField({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${className}`.trim()}
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  rows,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary ${className}`.trim()}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function updateSection(index: number, setSections: Dispatch<SetStateAction<EditableSection[]>>, updater: (current: EditableSection) => EditableSection) {
  setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? updater(item) : item)));
}

function moveSection(index: number, delta: -1 | 1, setSections: Dispatch<SetStateAction<EditableSection[]>>) {
  setSections((current) => {
    const target = index + delta;
    if (target < 0 || target >= current.length) {
      return current;
    }
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
}

function removeSection(index: number, setSections: Dispatch<SetStateAction<EditableSection[]>>) {
  setSections((current) => current.filter((_, itemIndex) => itemIndex !== index));
}

function updateTabItem(
  sectionIndex: number,
  itemIndex: number,
  setSections: Dispatch<SetStateAction<EditableSection[]>>,
  updater: (current: EditableTabsItem) => EditableTabsItem,
) {
  updateSection(sectionIndex, setSections, (current) => {
    const tabs = current as EditableTabsSection;
    return {
      ...tabs,
      items: tabs.items.map((item, currentItemIndex) => (currentItemIndex === itemIndex ? updater(item) : item)),
    };
  });
}

function moveTabItem(sectionIndex: number, itemIndex: number, delta: -1 | 1, setSections: Dispatch<SetStateAction<EditableSection[]>>) {
  updateSection(sectionIndex, setSections, (current) => {
    const tabs = current as EditableTabsSection;
    const target = itemIndex + delta;
    if (target < 0 || target >= tabs.items.length) {
      return current;
    }
    const nextItems = [...tabs.items];
    [nextItems[itemIndex], nextItems[target]] = [nextItems[target], nextItems[itemIndex]];
    return { ...tabs, items: nextItems };
  });
}

function removeTabItem(sectionIndex: number, itemIndex: number, setSections: Dispatch<SetStateAction<EditableSection[]>>) {
  updateSection(sectionIndex, setSections, (current) => {
    const tabs = current as EditableTabsSection;
    return {
      ...tabs,
      items: tabs.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
    };
  });
}

function createEmptySection(type: (typeof SECTION_OPTIONS)[number]): EditableSection {
  switch (type) {
    case "HEADING":
      return { type: "HEADING", level: 2, text: "새 헤딩" };
    case "MARKDOWN":
      return { type: "MARKDOWN", content: "새 문단을 입력하세요." };
    case "CALLOUT":
      return { type: "CALLOUT", variant: "INFO", title: "안내", content: "안내 메시지를 입력하세요." };
    case "CODE":
      return { type: "CODE", lang: "ts", content: "console.log('guidebook');" };
    case "TABLE":
      return { type: "TABLE", headers: ["Column 1", "Column 2"], rows: [["Value 1", "Value 2"]] };
    case "TABS":
      return {
        type: "TABS",
        items: [
          {
            key: "tab-1",
            label: "Tab 1",
            content: [{ type: "MARKDOWN", content: "탭 문서를 입력하세요." }],
            contentDraft: JSON.stringify([{ type: "MARKDOWN", content: "탭 문서를 입력하세요." }], null, 2),
          },
        ],
      };
  }
}

function serializeSections(sections: EditableSection[]) {
  return sections.map((section) => {
    if (isEditableTabsSection(section)) {
      return {
        type: "TABS",
        items: section.items.map((item) => ({
          key: item.key,
          label: item.label,
          content: parseSectionsJson(item.contentDraft) ?? item.content,
        })),
      };
    }

    if (isUnsupportedSection(section)) {
      return parseRawSection(section.rawJson);
    }

    return section;
  });
}

function toEditableSection(section: GuidebookSection): EditableSection {
  if (section.type === "TABS") {
    const tabs = section as TabsSection;
    return {
      type: "TABS",
      items: tabs.items.map((item) => ({
        key: item.key,
        label: item.label,
        content: item.content,
        contentDraft: JSON.stringify(item.content, null, 2),
      })),
    };
  }

  const supported = ["HEADING", "MARKDOWN", "CALLOUT", "CODE", "TABLE", "IMAGE", "VIDEO"] as const;
  if (supported.includes(section.type as (typeof supported)[number])) {
    return section as EditableSection;
  }

  return {
    kind: "UNSUPPORTED",
    rawType: (section as { type: string }).type,
    rawJson: JSON.stringify(section, null, 2),
  };
}

function parseSectionsJson(value: string): GuidebookSection[] | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as GuidebookSection[]) : null;
  } catch {
    return null;
  }
}

function parseRawSection(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === "object" && "type" in parsed) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fallback below
  }

  return {
    type: "MARKDOWN",
    content: value,
  };
}

function parseDelimitedLine(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sectionLabel(section: EditableSection) {
  return isUnsupportedSection(section) ? section.rawType : section.type;
}

function sectionKey(section: EditableSection, index: number) {
  if (isUnsupportedSection(section)) {
    return `${section.rawType}-${index}`;
  }
  if (section.type === "HEADING") {
    return `${section.type}-${section.text}-${index}`;
  }
  if (section.type === "MARKDOWN") {
    return `${section.type}-${section.content.slice(0, 12)}-${index}`;
  }
  if (isEditableTabsSection(section)) {
    return `${section.type}-${section.items.length}-${index}`;
  }
  return `${section.type}-${index}`;
}

function isUnsupportedSection(section: EditableSection): section is UnsupportedEditableSection {
  return "kind" in section && section.kind === "UNSUPPORTED";
}

function isEditableTabsSection(section: EditableSection): section is EditableTabsSection {
  return !isUnsupportedSection(section) && section.type === "TABS";
}
