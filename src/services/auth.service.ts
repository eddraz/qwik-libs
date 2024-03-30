import { FirebaseError } from "firebase/app";
import {
  Auth,
  User,
  signOut,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";

export class AuthService {
  readonly auth: Auth | undefined;
  private userData: User | undefined = undefined;
  readonly user = this.userData;
  private confirmationRecaptchaResult: ConfirmationResult | undefined =
    undefined;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  async signInWithPopup(
    credentials: UserCredential,
  ): Promise<User | undefined | FirebaseError> {
    try {
      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signinWithEmailAndPassword(
    credentials: UserCredential,
  ): Promise<User | undefined | FirebaseError> {
    try {
      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signUpWithEmailAndPassword(
    credentials: UserCredential,
  ): Promise<User | undefined | FirebaseError> {
    try {
      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async signOut(auth: Auth): Promise<void | FirebaseError> {
    try {
      return await signOut(auth);
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }

  async confirmCode(
    code: string,
    confirmationResult: ConfirmationResult,
  ): Promise<User | undefined | FirebaseError> {
    console.log(confirmationResult, "confirmationResult", code, "code");
    try {
      if (!code) {
        throw new Error("Code is required");
      }

      const credentials = await confirmationResult.confirm(code);
      console.log(credentials, "User signed in successfully");

      return credentials.user;
    } catch (error) {
      return error as unknown as FirebaseError;
    }
  }
}
