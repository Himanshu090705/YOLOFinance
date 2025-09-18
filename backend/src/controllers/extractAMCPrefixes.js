// This script can be run in Node.js or temporarily in your backend controller

const fs = require("fs");
const fetch = require("node-fetch");

async function extractAMCPrefixes() {
    const url = "https://portal.amfiindia.com/spages/NAVAll.txt";
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split("\n").map((line) => line.trim());
    const headerIndex = lines.findIndex((line) => line.includes("Scheme Code"));
    const headers = lines[headerIndex].split(";").map((h) => h.trim());

    const amcPrefixes = new Set();

    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line === "" || !line.includes(";")) continue;
        const values = line.split(";").map((v) => v.trim());
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((key, idx) => {
                row[key] = values[idx];
            });
            // Extract AMC prefix (first word(s) before first space or " - ")
            const schemeName = row["Scheme Name"] || "";
            const prefix = schemeName.split(" ")[0].replace(/-$/, "");
            amcPrefixes.add(prefix);
        }
    }

    // Output all unique AMC prefixes
    console.log("Unique AMC prefixes found:");
    console.log([...amcPrefixes].sort().join("\n"));
}

extractAMCPrefixes();
