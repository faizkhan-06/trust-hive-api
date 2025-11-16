import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "reflect-metadata";
import cors from "cors";
import { App } from "./libs/App";
import { dbConfig } from "./config/DbConfig";

const app = express();
const PORT = process.env.PORT || 3000;

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

const server = app.listen(PORT, () => {
  console.log("Server listning at port %s", server.address())
});
