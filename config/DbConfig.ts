import path from "path";
import { DataSourceOptions } from "typeorm"


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
}

export {
  dbConfig
}