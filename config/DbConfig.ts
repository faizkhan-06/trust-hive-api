import path from "path";
import { DataSourceOptions } from "typeorm"
import * as fs from "fs";


const sslFilePath = path.join(process.cwd(), "cert/trust-hive.pem");
console.log("SSL file path:", sslFilePath);

let sslConfig;

if (fs.existsSync(sslFilePath)) {
  sslConfig = {
    ca: fs.readFileSync(sslFilePath).toString(),
    rejectUnauthorized: true
  };
  console.log("SSL file loaded successfully.");
} else {
  console.error("SSL file not found at path:", sslFilePath);
}


const isCompiled = path.extname(__filename) === ".js";

const dbConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [isCompiled ? "build/src/models/**/*.js" : "src/models/**/*.ts"],
  synchronize: false,
  logging: true,

  ssl: sslConfig
}

export {
  dbConfig
}