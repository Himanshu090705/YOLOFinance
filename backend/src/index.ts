import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes";
import { connectToMongodb } from "./database/config";
import cookieParser from "cookie-parser";
import { fetchNAVData } from "./controllers/fetchNavController";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 4000;

// Connect to MongoDB
connectToMongodb(process.env.CONNECTION_STRING as string);

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(
  cors({
    origin: process.env.ORIGIN as string,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);
app.get("/fetch-mf-data", fetchNAVData);

// Chat endpoint
app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  try {
    const classification = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a classifier. Only answer with 'finance' if the user's query is about investments, mutual funds, SIPs, stock market, risk, portfolio, or financial planning. Answer with 'other' if it's about anything else (weather, sports, chit-chat, etc.).",
        },
        { role: "user", content: message },
      ],
      max_tokens: 5,
    });

    const classificationResult =
      classification.choices[0].message?.content?.toLowerCase() || "other";

    if (!classificationResult.includes("finance")) {
      res.json({
        reply:
          "I'm designed to answer finance-related queries only. Please ask me about investments, mutual funds, SIPs, stocks, or portfolio management.",
      });
      return; // 👈 Explicit stop, avoids returning Response
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a financial assistant specialized in portfolio management. Only answer finance-related queries (mutual funds, SIPs, investments, stock markets, risk, financial planning). Keep answers clear, concise, and professional.",
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
});


// Start server
app.listen(port, function () {
  console.log(`✅ Server started at port ${port}`);
});
