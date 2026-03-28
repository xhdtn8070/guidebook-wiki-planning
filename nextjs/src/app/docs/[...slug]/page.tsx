import { redirect } from "next/navigation";

export default async function LegacyDocsPage() {
  redirect("/search");
}
