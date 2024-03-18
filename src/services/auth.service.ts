import { FirebaseApp, FirebaseError } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { FirebaseService } from "./firebase.service";
import { FirebaseConfigModel } from "../models/firebase-config.model";

export class AuthService {
  private initApp: FirebaseApp;
  private auth: Auth;

  constructor(firebaseConfig: FirebaseConfigModel) {
    const app = new FirebaseService(firebaseConfig).app;

    if (!app) {
      throw new Error("Firebase app not initialized");
    }

    this.initApp = app;
    this.auth = getAuth(app);
  }

  async currentUser(): Promise<User | FirebaseError | null> {
    try {
      return new Promise((resolve) => {
        if (this.auth.currentUser) resolve(this.auth.currentUser);
        else {
          onAuthStateChanged(this.auth, (user) => {
            resolve(user);
          });
        }
      });
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signInWithPopup(
    provider: GoogleAuthProvider
  ): Promise<User | FirebaseError> {
    try {
      const credentials = await signInWithPopup(this.auth, provider);
      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signOut(): Promise<void | FirebaseError> {
    try {
      return await signOut(this.auth);
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }
}
