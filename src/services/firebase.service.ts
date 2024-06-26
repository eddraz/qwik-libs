import { FirebaseApp, initializeApp } from "firebase/app";

import { FirebaseConfigModel } from "../models/firebase-config.model";

export class FirebaseService {
  readonly app: FirebaseApp | undefined;

  constructor(config: FirebaseConfigModel) {
    if (!this.app) this.app = initializeApp(config);
  }
}
