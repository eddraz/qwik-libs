import { FirebaseApp, FirebaseError } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { FirebaseService } from "./firebase.service";
import { FirebaseConfigModel } from "../models/firebase-config.model";

export class AuthService {
  initApp: FirebaseApp;
  auth: Auth;

  constructor(firebaseConfig: FirebaseConfigModel) {
    const app = new FirebaseService(firebaseConfig).app;

    if (!app) {
      throw new Error("Firebase app not initialized");
    }

    this.initApp = app;
    this.auth = getAuth(app);
  }

  currentUser(callback: (data: User | FirebaseError | null) => void) {
    if (this.auth.currentUser) callback(this.auth.currentUser);
    else {
      onAuthStateChanged(
        this.auth,
        (user) => {
          callback(user);
        },
        (error) => {
          callback(error as FirebaseError);
        }
      );
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

  async sendPasswordResetEmail(email: string): Promise<void | FirebaseError> {
    try {
      return await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signinWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | FirebaseError> {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const credentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signUpWithEmailAndPassword(
    email: string,
    password: string,
    moreInfo?: { displayName?: string }
  ): Promise<User | FirebaseError> {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const credentials = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (moreInfo?.displayName) {
        await updateProfile(credentials.user, {
          displayName: moreInfo.displayName,
        });
      }

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
