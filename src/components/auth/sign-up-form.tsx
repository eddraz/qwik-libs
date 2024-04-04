import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import {
  QRL,
  Slot,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import {
  FirebaseContext,
  UserContext,
  UserDisplayNameContext,
  UserPhotoUrlContext,
} from "./auth";
import { UserModel } from "../../models/user.model";

import { FirebaseService } from "../../services/firebase.service";

interface Props {
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
      title?: string;
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
  ({ fields, buttons, onSignIn$, onError$ }) => {
    const _firebaseConfig = useContext(FirebaseContext);
    const _user = useContext(UserContext);
    const _displayName = useContext(UserDisplayNameContext);
    const _photoURL = useContext(UserPhotoUrlContext);
    const name = useSignal<string>(fields?.name.value || "");
    const email = useSignal<string>(fields?.email.value || "");
    const password = useSignal<string>(fields?.password.value || "");
    const passwordConfirm = useSignal<string>(
      fields?.passwordConfirm.value || "",
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

            const firebase = noSerialize(new FirebaseService(_firebaseConfig));

            if (firebase?.app) {
              const auth = getAuth(firebase?.app);

              const credential = await createUserWithEmailAndPassword(
                auth,
                email.value,
                password.value,
              );
              const user = credential.user;

              if (user instanceof FirebaseError) {
                console.error("Error signing in with Google", user);
                return;
              }

              _user.disabled = false;
              _user.email = user?.email;
              _user.emailVerified = user.emailVerified;
              _user.phoneNumber = user.phoneNumber;
              _user.uid = user.uid;
              _user.provider = user.providerId as UserModel["provider"];
              _user.displayName =
                name.value || user.displayName || _displayName;
              _user.photoURL = user.photoURL || _photoURL;

              onSignIn$?.(_user);
            } else {
              console.error("Firebase doesn't connect");
            }
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
        <label for="sign_up_name">
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
        <label for="sign_up_email">
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
          <legend>{fields?.password?.title || "Set Password"}</legend>
          <label for="sign_up_password">
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
          <label for="sign_up_password_confirm">
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
                        "Password do not match",
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
  },
);
