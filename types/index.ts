import { SignOptions } from "jsonwebtoken";

export interface IAuth {
    token: {
        secret?: string;
        options: SignOptions;
    }
}
