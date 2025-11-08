import { ImageResponse } from "next/og";

export function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get("title") || "";

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        }}
      >
        <div tw="flex flex-col w-full px-16 py-12">
          <h1
            tw="text-6xl font-bold text-white leading-tight"
            style={{
              fontFamily: "system-ui, -apple-system",
            }}
          >
            {title}
          </h1>
          <p
            tw="text-2xl text-gray-400 mt-4"
            style={{
              fontFamily: "system-ui, -apple-system",
            }}
          >
            Rohan Kiratsata
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
