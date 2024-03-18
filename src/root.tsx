import { Auth } from "./components/auth/auth";
import { ForgotPasswordForm } from "./components/auth/forgot-password-form";
import { GoogleAuthenticator } from "./components/auth/google-authenticator";
import { BrandGoogleFilledIcon } from "./components/icons/brand-google-filled";
import { SignUpForm } from "./components/auth/sign-up-form";
import { SigninForm } from "./components/auth/signin-form";

import { CRYPTER } from "./utils/crypter.util";

export const firebaseConfig = CRYPTER.encrypt({
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Auth firebaseConfig={firebaseConfig}>
          <GoogleAuthenticator>
            Signin with Google
            <BrandGoogleFilledIcon color="#fffffff" height="24" width="24" />
          </GoogleAuthenticator>
        </Auth>
        <Auth firebaseConfig={firebaseConfig}>
          <h1>Sign Up</h1>
          <SignUpForm
            fields={{
              name: {
                label: "Name",
                placeholder: "Your name",
                value: "",
              },
              email: {
                label: "Email",
                placeholder: "Your email",
                value: "",
              },
              password: {
                label: "Password",
                placeholder: "Your password",
                value: "",
              },
              passwordConfirm: {
                label: "Confirm Password",
                placeholder: "Confirm your password",
                value: "",
                validator: {
                  passwordDoNotMatch: "Password do not match",
                },
              },
            }}
            onSignIn$={(values) => {
              console.log(values);
            }}
            onError$={(error) => {
              console.error(error);
            }}
          />
          <h1>Signin</h1>
          <SigninForm
            onSignIn$={(values) => {
              console.log(values);
            }}
            onError$={(error) => {
              console.error(error);
            }}
          >
            <div q:slot="under-password" align="right">
              <a href="/">Forgot password?</a>
            </div>
          </SigninForm>
          <h1>Recovery Password</h1>
          <ForgotPasswordForm
            onSended$={() => {
              console.log("sended message");
            }}
            onError$={(error) => {
              console.error(error);
            }}
          />
        </Auth>
      </body>
    </>
  );
};
