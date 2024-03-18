import { FirebaseError } from "firebase/app";

import { QRL, component$, useContext, useSignal } from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";
import { UserModel } from "../models/user.model";

import { CRYPTER } from "../utils/crypter.util";
import { AuthService } from "../services/auth.service";

import "./sign-up-form.css";

interface Props {
  fields: {
    name: {
      label: string;
      placeholder: string;
      value: string;
    };
    email: {
      label: string;
      placeholder: string;
      value: string;
    };
    password: {
      label: string;
      placeholder: string;
      value: string;
    };
  };
  onSignIn$?: QRL<(user: UserModel) => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const SignUpForm = component$<Props>(
  ({ fields, onSignIn$, onError$ }) => {
    const firebaseConfig = useContext(FirebaseConfigContext);
    const userSigned = useSignal<UserModel>();
    const name = useSignal<string>(fields.name.value);
    const email = useSignal<string>(fields.email.value);
    const password = useSignal<string>(fields.password.value);

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            const user = await new AuthService(
              JSON.parse(CRYPTER.decrypt(firebaseConfig))
            ).signUpWithEmailAndPassword(email.value, password.value, {
              displayName: name.value,
            });

            if (user instanceof FirebaseError) {
              console.error("Error signing in with Google", user);
              return;
            }

            userSigned.value = {
              disabled: false,
              email: user?.email,
              displayName: user?.displayName,
              photoURL: user?.photoURL,
              uid: user?.uid,
              emailVerified: user?.emailVerified,
              phoneNumber: user?.phoneNumber,
              provider: user?.providerId as UserModel["provider"],
            };

            onSignIn$ && onSignIn$(userSigned.value);
          } catch (error: any) {
            onError$ &&
              onError$({
                code: error.code,
                message: error.message,
                name: "GOOGLE_SIGNIN_POPUP_ERROR",
              });

            console.error("Google sign in popup error", error);
          }
        }}
      >
        <div class="fieldset">
          <label for="name">{fields.name.label || "Name"}</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={fields.name.placeholder || "Name"}
            bind:value={name}
          />
        </div>
        <div class="fieldset">
          <label for="email">{fields.email.label || "Email"}</label>
          <input
            type="email"
            id="email"
            name="email"
            autocapitalize="none"
            placeholder={fields.email.placeholder || "Email"}
            bind:value={email}
          />
        </div>
        <div class="fieldset">
          <label for="password">{fields.password.label || "Password"}</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder={fields.password.placeholder || "Password"}
            bind:value={password}
          />
        </div>
        <button type="submit" class="submit">
          Sign Up
        </button>
      </form>
    );
  }
);
