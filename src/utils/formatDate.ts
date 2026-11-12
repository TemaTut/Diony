export function formatDate(locale: "ru" | "en") {
    return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(new Date());
}
