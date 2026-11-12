import ButtonLink from "@/components/UI/ButtonLink";

export default function ProfileScreen() {
  return (
    <section className="mx-auto max-w-content py-10">
      <h1 className="text-h1 max-md:text-h2">Профиль</h1>
      <p className="mt-3 max-w-xl text-base text-muted">
        Этот раздел появится позже. Пока можно посмотреть референсы на главной.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/settings">Настройки</ButtonLink>
        <ButtonLink href="/partnership">Партнёрская программа</ButtonLink>
      </div>
    </section>
  );
}
