import { Auth } from "./components/auth/auth";
import { ForgotPasswordForm } from "./components/auth/forgot-password-form";
import { GoogleAuthenticator } from "./components/auth/google-authenticator";
import { SignUpForm } from "./components/auth/sign-up-form";
import { SigninForm } from "./components/auth/signin-form";
import { SigninPhone } from "./components/auth/signin-phone";
import { UserProfile } from "./components/auth/user-profile";
import { BrandGoogleFilledIcon } from "./components/icons/brand-google-filled";
import { component$, useSignal } from "@builder.io/qwik";
import { UserModel } from "./models/user.model";

import { CRYPTER } from "./utils/crypter.util";

import "./global.css";

export const firebaseConfig = CRYPTER.encrypt({
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export default component$(() => {
  const _user = useSignal<UserModel | undefined>();

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Auth
          firebaseConfig={firebaseConfig}
          onAuth$={(user) => {
            _user.value = user;
          }}
        >
          <UserProfile
            user={_user.value}
            onSignOut$={() => {
              _user.value = undefined;
            }}
          />
        </Auth>
        <Auth
          firebaseConfig={firebaseConfig}
          onAuth$={(user) => {
            _user.value = user;
          }}
        >
          <GoogleAuthenticator
            onSignIn$={(user) => {
              _user.value = user;
            }}
          >
            Signin with Google
            <BrandGoogleFilledIcon color="#fffffff" height="24" width="24" />
          </GoogleAuthenticator>
        </Auth>
        <Auth
          firebaseConfig={firebaseConfig}
          onAuth$={(user) => {
            _user.value = user;
          }}
        >
          <h1 class="my-10 border-b-2 border-b-zinc-400 py-8 text-5xl">
            Sign Up
          </h1>
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
            onSignIn$={(user) => {
              _user.value = user;
            }}
            onError$={(error) => {
              console.error(error);
            }}
          />
          <h1 class="my-10 border-b-2 border-b-zinc-400 py-8 text-5xl">
            Signin
          </h1>
          <SigninForm
            onSignIn$={(user) => {
              _user.value = user;
            }}
            onError$={(error) => {
              console.error(error);
            }}
          >
            <div q:slot="under-password" align="right">
              <a href="/">Forgot password?</a>
            </div>
          </SigninForm>
          <h1 class="my-10 border-b-2 border-b-zinc-400 py-8 text-5xl">
            Recovery Password
          </h1>
          <ForgotPasswordForm
            onSended$={() => {
              console.log("sended message");
            }}
            onError$={(error) => {
              console.error(error);
            }}
          />
          <h1 class="my-10 border-b-2 border-b-zinc-400 py-8 text-5xl">
            Signin Phone
          </h1>
          <SigninPhone />
        </Auth>
      </body>
    </>
  );
});
