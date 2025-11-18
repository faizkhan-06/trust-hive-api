import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "reflect-metadata";
import cors from "cors";
import { App } from "./libs/App";
import { dbConfig } from "./config/DbConfig";
import ApiRouter from "./src/routes";

const app = express();
const PORT = process.env.PORT || 3100;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
const service = new App(dbConfig);
service.init();

app.use("/api", ApiRouter())

const server = app.listen(PORT, () => {
  console.log("Server listning at port %s", server.address())
});
