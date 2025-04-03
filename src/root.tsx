import { component$, useSignal } from "@builder.io/qwik";
import { UserModel } from "./models/user.model";
import { Crypter } from "./utils/crypter.util";
import { Auth } from "./components/auth/auth";
import { UserProfile } from "./components/auth/user-profile";
import { GoogleAuthenticator } from "./components/auth/google-authenticator";
import { TbBrandGoogle } from "@qwikest/icons/tablericons";
import { SignUpForm } from "./components/auth/sign-up-form";
import { SigninForm } from "./components/auth/signin-form";
import { ForgotPasswordForm } from "./components/auth/forgot-password-form";
import { SigninPhone } from "./components/auth/signin-phone";
import { Pay } from "./components/pay/pay";

export const firebaseConfig = Crypter.encrypt(
  JSON.stringify({
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
  }),
);
export const epaycoConfig = Crypter.encrypt(
  JSON.stringify({
    key: "93451b4bb7263b285ce2577efa3b3844",
    test: true,
  }),
);

export default component$(() => {
  const _user = useSignal<UserModel>();
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Auth
          firebaseConfig={Crypter.decrypt(firebaseConfig)}
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
          firebaseConfig={Crypter.decrypt(firebaseConfig)}
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
            <TbBrandGoogle class="size-6 text-white" />
          </GoogleAuthenticator>
        </Auth>
        <Auth
          firebaseConfig={Crypter.decrypt(firebaseConfig)}
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
        <main class="p-5">
          <h1 class="my-10 border-b-2 border-b-zinc-400 py-8 text-5xl">
            Pagos en linea
          </h1>
          <Pay
            class="btn btn-primary"
            config={Crypter.decrypt(epaycoConfig)}
            product={{
              name: "Vestido Mujer Primavera",
              description: "Vestido Mujer Primavera",
              invoice: "FAC-2222",
              currency: "cop",
              amount: "5000",
              tax_base: "4000",
              tax: "500",
              tax_ico: "500",
              country: "co",
              lang: "en",
            }}
            customer={{
              name_billing: "Jhon Doe",
              address_billing: "Carrera 19 numero 14 91",
              type_doc_billing: "cc",
              mobilephone_billing: "3050000000",
              number_doc_billing: "100000000",
              methodsDisable: [],
            }}
            optional={{
              external: "true",
              confirmation: "http://localhost:3000",
              response: "http://localhost:3000",
            }}
          >
            Pagar
          </Pay>
        </main>
      </body>
    </>
  );
});
