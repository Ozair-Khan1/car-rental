import { db } from "./db";

export interface LocationItem {
  id: string | number;
  city: string;
  country: string;
  image: string;
}

export interface GetLocationsResult {
  locations: LocationItem[];
  fromDb: boolean;
}

// Global flagship hubs used if network/API is unavailable
export const DEFAULT_LOCATIONS: LocationItem[] = [
  {
    id: 1,
    city: "Dubai",
    country: "United Arab Emirates",
    image:
      "https://thumb.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/330px-Burj_Khalifa_2021.jpg",
  },
  {
    id: 2,
    city: "New York City",
    country: "United States",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
  },
  {
    id: 3,
    city: "London",
    country: "United Kingdom",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Montage_L.jpg/330px-London_Montage_L.jpg",
  },
  {
    id: 4,
    city: "Tokyo",
    country: "Japan",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  },
];

// In-memory cache to avoid duplicate remote calls
const countryCache = new Map<string, { timestamp: number; data: LocationItem[] }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetch Wikimedia photo for a specific city name.
 */
async function fetchWikimediaCityImage(cityName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`,
      {
        headers: {
          "User-Agent": "CarRentalApp/1.0 (https://car-rental.local; info@car-rental.local)",
        },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    // Priority 1: High-resolution original image
    if (data.originalimage?.source) {
      return data.originalimage.source;
    }

    // Priority 2: Upscale thumbnail to crisp 1600px width
    if (data.thumbnail?.source) {
      return data.thumbnail.source.replace(/\/\d+px-/, "/1600px-");
    }

    return null;
  } catch (err) {
    console.error(`Failed to fetch Wikimedia image for ${cityName}:`, err);
    return null;
  }
}

/**
 * Persists locations into PostgreSQL for future visits.
 */
export async function saveLocationsToDb(
  countryCode: string,
  locations: LocationItem[]
): Promise<boolean> {
  const code = (countryCode || "US").toUpperCase().trim();
  try {
    for (const item of locations) {
      await db.$executeRawUnsafe(
        `INSERT INTO "Location" ("id", "city", "country", "countryCode", "imageUrl", "isFeatured", "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, false, true, NOW(), NOW())
         ON CONFLICT ("city", "countryCode") DO UPDATE
         SET "imageUrl" = EXCLUDED."imageUrl", "updatedAt" = NOW()`,
        item.city,
        item.country,
        code,
        item.image
      );
    }
    // Update cache so subsequent queries are marked as from DB
    countryCache.set(code, { timestamp: Date.now(), data: locations });
    return true;
  } catch (err) {
    console.error(`Failed to persist locations for ${code} to DB:`, err);
    return false;
  }
}

/**
 * Fetches locations by country code:
 * 1. Checks Database (Location table in Postgres)
 *    If found -> returns immediately with fromDb: true
 * 2. If empty -> falls back to OpenDataSoft GeoNames + Wikimedia images
 *    Returns immediately with fromDb: false (UI displays it instantly first!)
 * 3. If all fails, falls back to DEFAULT_LOCATIONS
 */
export async function getLocationsByCountry(countryCode: string): Promise<GetLocationsResult> {
  const code = (countryCode || "US").toUpperCase().trim();

  // 1. Try DB first (Queries PostgreSQL Location table)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbLocations = await db.$queryRawUnsafe<any[]>(
      `SELECT "id", "city", "country", "countryCode", "imageUrl" 
       FROM "Location" 
       WHERE UPPER("countryCode") = $1 AND "isActive" = true 
       ORDER BY "createdAt" ASC 
       LIMIT 4`,
      code
    );

    if (dbLocations && dbLocations.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: LocationItem[] = dbLocations.map((loc: any, idx: number) => ({
        id: loc.id || `${code}-${idx + 1}`,
        city: loc.city,
        country: loc.country || code,
        image: loc.imageUrl || DEFAULT_LOCATIONS[idx % DEFAULT_LOCATIONS.length].image,
      }));
      countryCache.set(code, { timestamp: Date.now(), data: mapped });
      return { locations: mapped, fromDb: true };
    }
  } catch (dbErr) {
    console.warn("DB check for locations skipped or failed, falling back to dynamic API:", dbErr);
  }

  // Check in-memory cache if DB had no rows
  const cached = countryCache.get(code);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { locations: cached.data, fromDb: false };
  }

  // 2. Dynamic Fallback: OpenDataSoft GeoNames API (Largest cities by population) + Wikimedia Photos
  try {
    const geoUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=country_code%3D%22${code}%22&order_by=population%20desc&limit=4`;
    const geoRes = await fetch(geoUrl, {
      next: { revalidate: 86400 },
    });

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const records = geoData.results || [];

      if (records.length > 0) {
        const countryName = records[0].cou_name_en || code;

        // Fetch Wikimedia photos in parallel
        const dynamicLocations: LocationItem[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          records.map(async (rec: any, idx: number) => {
            const cityName = rec.name;
            const wikiImage = await fetchWikimediaCityImage(cityName);

            return {
              id: `${code.toLowerCase()}-${idx + 1}`,
              city: cityName,
              country: countryName,
              image: wikiImage || DEFAULT_LOCATIONS[idx % DEFAULT_LOCATIONS.length].image,
            };
          })
        );

        countryCache.set(code, { timestamp: Date.now(), data: dynamicLocations });

        // Return immediately so the website shows the data first!
        return { locations: dynamicLocations, fromDb: false };
      }
    }
  } catch (apiErr) {
    console.error(`Failed to fetch dynamic cities for country ${code}:`, apiErr);
  }

  // 3. Fallback to default flagship hubs
  return { locations: DEFAULT_LOCATIONS, fromDb: false };
}
