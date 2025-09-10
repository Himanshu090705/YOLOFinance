import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes";
import { connectToMongodb } from "./database/config";
import cookieParser from "cookie-parser";
import { fetchNAVData } from "./controllers/fetchNavController";
import { fetchFinanceNews } from "./controllers/newsController";



// import "./cron/emailReminderCron";

const app = express();
dotenv.config();
connectToMongodb(process.env.CONNECTION_STRING as string);

app.use(
  cors({
    origin: process.env.ORIGIN as string,
    methods: ["GET", "POST"],
    credentials: true
  }),
);

const port = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.get("/fetch-mf-data", fetchNAVData);

app.get("/api/news", fetchFinanceNews);

app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
