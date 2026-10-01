import { NextRequest, NextResponse } from "next/server";
import { getLocationsByCountry, saveLocationsToDb, LocationItem } from "@/lib/locations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryCountry = searchParams.get("country");

    let countryCode = queryCountry;

    // If no query param, check edge headers
    if (!countryCode) {
      countryCode =
        req.headers.get("x-vercel-ip-country") ||
        req.headers.get("cf-ipcountry") ||
        req.headers.get("x-country-code") ||
        null;
    }

    // In local dev, if headers are not present, detect real public IP country
    if (!countryCode || countryCode === "localhost") {
      try {
        const ipRes = await fetch("https://get.geojs.io/v1/ip/country.json", {
          signal: AbortSignal.timeout(2000),
        });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          countryCode = ipData.country;
        }
      } catch {
        countryCode = "US";
      }
    }

    countryCode = (countryCode || "US").toUpperCase();

    const { locations, fromDb } = await getLocationsByCountry(countryCode);

    return NextResponse.json({
      country: countryCode,
      fromDb,
      locations,
    });
  } catch (err) {
    console.error("API error in GET /api/locations:", err);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countryCode, locations } = body as {
      countryCode: string;
      locations: LocationItem[];
    };

    if (!countryCode || !Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: countryCode and locations array required" },
        { status: 400 }
      );
    }

    // Save to PostgreSQL database
    const success = await saveLocationsToDb(countryCode, locations);

    return NextResponse.json({
      success,
      message: `Persisted ${locations.length} locations for ${countryCode} in DB`,
    });
  } catch (err) {
    console.error("API error in POST /api/locations:", err);
    return NextResponse.json(
      { error: "Failed to persist locations" },
      { status: 500 }
    );
  }
}
