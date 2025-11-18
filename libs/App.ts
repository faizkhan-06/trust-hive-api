import { DataSourceOptions } from "typeorm";
import { Database } from "./Database";
import Authenticator from "./Authenticator";
import auth from "../config/Auth";

class App {
  static config: DataSourceOptions;
  constructor(config: DataSourceOptions) {
    App.config = config;
  }

  async init(){
    try {
      App.config ? await Database.init(App.config) : false;

      Authenticator.init(auth);

    } catch (error) {
      console.error(error);
    }
  }
}

export {
  App
}