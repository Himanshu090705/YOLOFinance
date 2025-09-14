import { Request, Response } from "express";

export async function fetchNAVData(req: Request, res: Response) {
  // const url = 'https://www.amfiindia.com/spages/NAVAll.txt';
  const url = 'https://portal.amfiindia.com/spages/NAVAll.txt'; // alternate api if first one fails

  try {
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split('\n').map(line => line.trim());
    const headerIndex = lines.findIndex(line => line.includes('Scheme Code'));
    const headers = lines[headerIndex].split(';').map(h => h.trim());

    const data = [];

    for (let i = headerIndex + 1; i < 400; i++) {
      const line = lines[i];

      if (line === '' || !line.includes(';')) continue;

      const values = line.split(';').map(v => v.trim());

      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((key, idx) => {
          row[key] = values[idx];
        });
        data.push(row);
      }
    }

    res.send(data);
  } catch (err) {
    console.error('Failed to fetch NAV data:', err);
  }
}