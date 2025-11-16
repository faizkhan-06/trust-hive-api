import { DataSource, DataSourceOptions } from "typeorm";

class Database {
  static config: DataSourceOptions;
  private static dataSource: DataSource;

  static init(config: DataSourceOptions){
    Database.config = config;
    return new Promise((resolve, reject) => {
      Database.createConnection().then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  private static createConnection(){
    return new Promise((resolve, reject) => {
      Database.dataSource = new DataSource(Database.config);
      Database.dataSource.initialize().then(() => {
        console.info("Database is connected");
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  static getDataSource(): DataSource {
    if (!Database.dataSource) {
      throw new Error("DataSource not initialized. Call Database.init() first.");
    }
    return Database.dataSource;
  }
}

export {
  Database
}