import { AES, enc } from "crypto-ts";

export class Crypter {
  encrypt(message: string | object | number | Array<any>) {
    return AES.encrypt(JSON.stringify(message), "test").toString();
  }

  decrypt(message: string) {
    return AES.decrypt(message.toString(), "test").toString(enc.Utf8);
  }
}

export const CRYPTER = new Crypter();
