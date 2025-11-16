import { DataSourceOptions } from "typeorm";
import { Database } from "./Database";
import Authenticator from "./Authenticator";

class App {
  static config: DataSourceOptions;
  constructor(config: DataSourceOptions) {
    App.config = config;
  }

  async init(){
    try {
      App.config ? await Database.init(App.config) : false;

      Authenticator.init({
        token: {
          secret: process.env.JWT_SECRET,
          options: {
            expiresIn: 86400 * 15 
          }
        }
      });

    } catch (error) {
      console.error(error);
    }
  }
}

export {
  App
}