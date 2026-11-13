import { NextRequest } from "next/server";

function imageFormat(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { type: "image/jpeg", extension: "jpg" };
  }
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) {
    return { type: "image/png", extension: "png" };
  }
  const text = new TextDecoder("ascii").decode(bytes.subarray(0, 32));
  if (text.startsWith("RIFF") && text.slice(8, 12) === "WEBP") {
    return { type: "image/webp", extension: "webp" };
  }
  if (text.startsWith("GIF87a") || text.startsWith("GIF89a")) {
    return { type: "image/gif", extension: "gif" };
  }
  if (text.slice(4, 8) === "ftyp" && /avif|avis/.test(text.slice(8))) {
    return { type: "image/avif", extension: "avif" };
  }
  return null;
}

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

    const image = await response.arrayBuffer();
    const format = imageFormat(new Uint8Array(image));
    if (!format) {
      return new Response("Хранилище вернуло неподдерживаемый формат изображения", { status: 502 });
    }

    return new Response(image, {
      headers: {
        "Content-Type": format.type,
        "Content-Disposition": `${request.nextUrl.searchParams.get("inline") === "1" ? "inline" : "attachment"}; filename="diony-generation.${format.extension}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Хранилище изображения недоступно", { status: 502 });
  }
}
