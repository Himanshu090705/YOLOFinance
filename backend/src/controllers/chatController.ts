import { Request, Response } from "express";
import OpenAI from "openai";

export async function chatController(req: Request, res: Response) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body;

    try {
        const classification = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                {
                    role: "user",
                    content:
                        "You are a classifier. Only answer with 'finance' if the user's query is about investments, mutual funds, SIPs, stock market, risk, portfolio, or financial planning. Answer with 'other' if it's about anything else (weather, sports, chit-chat, etc.).",
                },
                { role: "user", content: message },
            ],
        });

        const classificationResult =
            classification.choices[0].message?.content?.toLowerCase() ||
            "other";

        if (!classificationResult.includes("finance")) {
            res.json({
                reply: "I'm designed to answer finance-related queries only. Please ask me about investments, mutual funds, SIPs, stocks, or portfolio management.",
            });
            return; // 👈 Explicit stop, avoids returning Response
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a financial assistant specialized in portfolio management. \
                        Only answer finance-related queries (mutual funds, SIPs, investments, stock markets, risk, financial planning). \
                        Always reply in plain text suitable for a chat bubble. \
                        You may include numerical data (like amounts, percentages, returns, or years) if relevant. \
                        Do NOT use tables, markdown, bullet points, special formatting, or code blocks. \
                        If you need to present multiple items, write them as short sentences separated by line breaks. \
                        Keep answers clear and professional.",
                },

                { role: "user", content: message },
            ],
        });

        const reply = completion.choices[0].message?.content || "No response.";
        res.json({ reply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "Error generating response." });
    }
}
