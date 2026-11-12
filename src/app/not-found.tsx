import ButtonLink from "@/components/UI/ButtonLink";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-h1">Страница не найдена</h1>
      <ButtonLink href="/">На главную</ButtonLink>
    </main>
  );
}
