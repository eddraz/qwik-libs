import { FirebaseError } from "firebase/app";

import { QRL, Slot, component$, useContext, useSignal } from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";
import { UserModel } from "../../models/user.model";

import { CRYPTER } from "../../utils/crypter.util";
import { AuthService } from "../../services/auth.service";

import "./sign-up-form.css";

interface Props {
  title?: {
    password: string;
  };
  fields?: {
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
    passwordConfirm: {
      label: string;
      placeholder: string;
      value: string;
      validator?: Record<"passwordDoNotMatch", string>;
    };
  };
  buttons?: {
    submit: string;
  };
  onSignIn$?: QRL<(user: UserModel) => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const SignUpForm = component$<Props>(
  ({ title, fields, buttons, onSignIn$, onError$ }) => {
    const firebaseConfig = useContext(FirebaseConfigContext);
    const userSigned = useSignal<UserModel>();
    const name = useSignal<string>(fields?.name.value || "");
    const email = useSignal<string>(fields?.email.value || "");
    const password = useSignal<string>(fields?.password.value || "");
    const passwordConfirm = useSignal<string>(
      fields?.passwordConfirm.value || ""
    );

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            if (password.value !== passwordConfirm.value) {
              throw new Error("Passwords do not match");
            }

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
        <label for="sign_up_name" class="fieldset">
          {fields?.name.label || "Name"}
          <input
            type="text"
            id="sign_up_name"
            name="name"
            placeholder={fields?.name.placeholder || "Name"}
            bind:value={name}
          />
        </label>
        <Slot name="under-name" />
        <label for="sign_up_email" class="fieldset">
          {fields?.email.label || "Email"}
          <input
            type="email"
            id="sign_up_email"
            name="email"
            autocapitalize="none"
            placeholder={fields?.email.placeholder || "Email"}
            bind:value={email}
          />
        </label>
        <Slot name="under-email" />
        <fieldset class="fields-group">
          <legend>{title?.password || "Set Password"}</legend>
          <label for="sign_up_password" class="fieldset">
            {fields?.password.label || "Password"}
            <input
              type="password"
              id="sign_up_password"
              name="password"
              placeholder={fields?.password.placeholder || "Password"}
              bind:value={password}
            />
          </label>
          <Slot name="under-password" />
          <label for="sign_up_password" class="fieldset">
            {fields?.passwordConfirm.label || "Confirm Password"}
            <input
              type="password"
              id="sign_up_password_confirm"
              name="password_confirm"
              placeholder={
                fields?.passwordConfirm.placeholder || "Confirm Password"
              }
              bind:value={passwordConfirm}
              onChange$={(e) => {
                const elem = e.target as HTMLInputElement;
                if (fields?.passwordConfirm.validator) {
                  if (elem.value !== password.value) {
                    elem.setCustomValidity(
                      fields?.passwordConfirm.validator.passwordDoNotMatch ||
                        "Password do not match"
                    );
                  } else {
                    elem.setCustomValidity("");
                  }
                }
              }}
            />
          </label>
        </fieldset>
        <Slot name="under-password-confirm" />
        <button type="submit" class="submit">
          {buttons?.submit || "Sign Up"}
        </button>
      </form>
    );
  }
);
