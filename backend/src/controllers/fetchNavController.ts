import { Request, Response } from "express";
import fetch from "node-fetch";
import cron from "node-cron";
import fs from "fs/promises";

const CACHE_FILE = "./nav-data.json";
const SHUFFLED_FILE = "./nav-shuffled.json";
const FINAL_FILE = "./nav-final.json";

let cachedNAVData: any[] = [];
let cachedShuffledData: any[] = [];
let cachedFinalData: any[] = [];

// Fisher-Yates shuffle
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

interface MfApiResponse {
    meta?: {
        scheme_category?: string;
        scheme_type?: string;
    };
}

async function fetchSchemeMeta(schemeCode: string) {
    try {
        const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
        if (!res.ok) return null;

        const json = (await res.json()) as MfApiResponse;
        return {
            category: json.meta?.scheme_category || "Unknown",
            type: json.meta?.scheme_type || "Unknown",
        };
    } catch {
        return null;
    }
}

// Batch enrich to avoid API overload
async function enrichFunds(funds: any[], batchSize = 20) {
    const result: any[] = [];
    for (let i = 0; i < funds.length; i += batchSize) {
        const batch = funds.slice(i, i + batchSize);
        const enrichedBatch = await Promise.all(
            batch.map(async (row) => {
                const schemeCode = row["Scheme Code"];
                if (!schemeCode) {
                    return { ...row, category: "Unknown", type: "Unknown" };
                }
                const meta = await fetchSchemeMeta(schemeCode);
                return {
                    ...row,
                    category: meta?.category || "Unknown",
                    type: meta?.type || "Unknown",
                };
            })
        );
        result.push(...enrichedBatch);
    }
    return result;
}

async function fetchAndCacheNAVData() {
    const url = "https://portal.amfiindia.com/spages/NAVAll.txt";

    try {
        const response = await fetch(url);
        const text = await response.text();

        const lines = text.split("\n").map((line) => line.trim());
        const headerIndex = lines.findIndex((line) =>
            line.includes("Scheme Code")
        );
        const headers = lines[headerIndex].split(";").map((h) => h.trim());

        const data: any[] = [];
        for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line === "" || !line.includes(";")) continue;
            const values = line.split(";").map((v) => v.trim());
            if (values.length === headers.length) {
                const row: any = {};
                headers.forEach((key, idx) => {
                    row[key] = values[idx];
                });
                data.push(row);
            }
        }

        // ✅ Step 1: Filter out funds older than 2025
        const filteredData = data.filter((row) => {
            const dateStr = row["Date"];
            if (!dateStr) return false;
            const [dd, mm, yyyy] = dateStr.split("-");
            return parseInt(yyyy, 10) >= 2025;
        });

        // ✅ Step 2: Remove duplicates (latest only)
        const uniqueMap = new Map<string, any>();
        filteredData.forEach((row) => {
            const code = row["Scheme Code"];
            const dateStr = row["Date"];
            const [dd, mm, yyyy] = dateStr.split("-");
            const currentDate = new Date(+yyyy, +mm - 1, +dd);

            if (!uniqueMap.has(code)) {
                uniqueMap.set(code, row);
            } else {
                const existing = uniqueMap.get(code);
                const [edd, emm, eyyy] = existing["Date"].split("-");
                const existingDate = new Date(+eyyy, +emm - 1, +edd);
                if (currentDate > existingDate) {
                    uniqueMap.set(code, row);
                }
            }
        });

        const cleanedData = Array.from(uniqueMap.values());
        cachedNAVData = cleanedData;
        await fs.writeFile(CACHE_FILE, JSON.stringify(cleanedData, null, 2));

        // ✅ Shuffle once & save
        const shuffled = shuffleArray([...cleanedData]);
        cachedShuffledData = shuffled;
        await fs.writeFile(SHUFFLED_FILE, JSON.stringify(shuffled, null, 2));

        console.log(`✅ NAV cleaned (${cleanedData.length}), shuffled, cached`);

        // 🔄 Enrich top 400 in background (non-blocking for API)
        (async () => {
            try {
                console.log("🔄 Starting enrichment of top 400 funds...");
                const top400 = shuffled.slice(0, 400);
                const enrichedTop400 = await enrichFunds(top400);
                console.log("Enriched funds count:", enrichedTop400.length);
                cachedFinalData = enrichedTop400;
                await fs.writeFile(
                    FINAL_FILE,
                    JSON.stringify(enrichedTop400, null, 2)
                );
                console.log("✅ nav-final.json updated with enriched top 400");
            } catch (err) {
                console.error(
                    "❌ Failed to enrich and write nav-final.json:",
                    err
                );
            }
        })();
    } catch (err) {
        console.error("❌ Failed to fetch NAV data:", err);
    }
}

// Load cache at startup
async function loadCacheFromFile() {
    // try {
    //     const shuffledContent = await fs.readFile(SHUFFLED_FILE, "utf-8");
    //     cachedShuffledData = JSON.parse(shuffledContent);
    // } catch {
    //     console.log("⚠️ No shuffled cache file found");
    // }

    try {
        const finalContent = await fs.readFile(FINAL_FILE, "utf-8");
        cachedFinalData = JSON.parse(finalContent);
    } catch {
        console.log("⚠️ No final.json cache file found");
    }
}

// Cron at 10AM IST
cron.schedule("0 10 * * *", () => {
    fetchAndCacheNAVData();
});

// Startup fetch
loadCacheFromFile();
// fetchAndCacheNAVData();

// ✅ API: serve shuffled data instantly
// export function fetchNAVData(req: Request, res: Response) {
//     if (!cachedShuffledData.length) {
//         return res.status(503).send({ message: "Data not ready yet" });
//     }
//     res.json(cachedShuffledData.slice(0, 400));
// }

// ✅ Optional: another API to serve enriched final.json
export function fetchNAVData(req: Request, res: Response) {
    if (!cachedFinalData.length) {
        return res.status(503).send({ message: "Final data not ready yet" });
    }
    res.json(cachedFinalData);
}
