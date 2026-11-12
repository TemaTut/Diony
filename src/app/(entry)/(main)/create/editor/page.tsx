import EditorScreen from "@/screens/create/EditorScreen";

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ media?: string; reference?: string }> }) {
  const params = await searchParams;
  return <EditorScreen key={`${params.media}-${params.reference ?? "custom"}`} media={params.media === "video" ? "video" : "photo"} referenceId={params.reference} />;
}
