import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  let url: URL;

  try {
    url = new URL(source ?? "");
  } catch {
    return new Response("Некорректная ссылка", { status: 400 });
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "atlas-media.oss-us-west-1.aliyuncs.com" ||
    url.port || url.username || url.password ||
    !url.pathname.startsWith("/assetd-history/")
  ) {
    return new Response("Недопустимый адрес", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok || !response.body) {
      return new Response("Не удалось скачать изображение", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
        "Content-Disposition": 'attachment; filename="diony-generation.jpg"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Хранилище изображения недоступно", { status: 502 });
  }
}
