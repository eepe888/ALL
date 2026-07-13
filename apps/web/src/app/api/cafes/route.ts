import { NextRequest } from "next/server";
import { fetchNearbyCafes } from "@/lib/overpass";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Number(searchParams.get("radius") ?? "1500");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json(
      { error: "lat and lon query params are required" },
      { status: 400 }
    );
  }

  try {
    const cafes = await fetchNearbyCafes(lat, lon, radius);
    return Response.json({ cafes });
  } catch (error) {
    console.error("Failed to fetch cafes from Overpass API", error);
    return Response.json(
      { error: "周辺のカフェ情報の取得に失敗しました。時間をおいて再度お試しください。" },
      { status: 502 }
    );
  }
}
