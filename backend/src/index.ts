import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes";
import { connectToMongodb } from "./database/config";

const app = express();
dotenv.config();
connectToMongodb(process.env.CONNECTION_STRING as string);

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  }),
);

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
