export interface UserModel {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  disabled: boolean;
  provider:
    | "gql"
    | "google"
    | "facebook"
    | "twitter"
    | "github"
    | "password"
    | "apple";
}
