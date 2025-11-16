import { Database } from "../libs/Database";

export const getRepo = (name: string) => {
  return Database.getDataSource().getRepository(name);
}