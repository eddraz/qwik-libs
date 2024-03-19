import { FirebaseError } from "firebase/app";

import { QRL, Slot, component$, useContext, useSignal } from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";
import { UserModel } from "../../models/user.model";

import { CRYPTER } from "../../utils/crypter.util";
import { AuthService } from "../../services/auth.service";

interface Props {
  fields?: {
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
  buttons?: {
    submit: string;
  };
  onSignIn$?: QRL<(user: UserModel) => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const SigninForm = component$<Props>(
  ({ fields, buttons, onSignIn$, onError$ }) => {
    const firebaseConfig = useContext(FirebaseConfigContext);
    const userSigned = useSignal<UserModel>();
    const email = useSignal<string>(fields?.email.value || "");
    const password = useSignal<string>(fields?.password.value || "");

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            const user = await new AuthService(
              JSON.parse(CRYPTER.decrypt(firebaseConfig))
            ).signinWithEmailAndPassword(email.value, password.value);

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
        <label for="signin_email" class="fieldset">
          {fields?.email.label || "Email"}
          <input
            type="email"
            id="signin_email"
            name="email"
            autocapitalize="none"
            placeholder={fields?.email.placeholder || "Email"}
            bind:value={email}
          />
        </label>
        <Slot name="under-email" />
        <label for="signin_password" class="fieldset">
          {fields?.password.label || "Password"}
          <input
            type="password"
            id="signin_password"
            name="password"
            placeholder={fields?.password.placeholder || "Password"}
            bind:value={password}
          />
        </label>
        <Slot name="under-password" />
        <button type="submit" class="submit">
          {buttons?.submit || "Signin"}
        </button>
      </form>
    );
  }
);
