import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
    const _firebaseConfig = useContext(FirebaseContext);
    const _user = useContext(UserContext);
    const _displayName = useContext(UserDisplayNameContext);
    const _photoURL = useContext(UserPhotoUrlContext);
    // const firebaseConfig = useContext(FirebaseConfigContext);
    // const userSigned = useSignal<UserModel>();
    const email = useSignal<string>(fields?.email.value || "");
    const password = useSignal<string>(fields?.password.value || "");

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            const firebase = noSerialize(new FirebaseService(_firebaseConfig));
            const auth = getAuth(firebase?.app);

            const credential = await signInWithEmailAndPassword(
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
            _user.displayName = user.displayName || _displayName;
            _user.photoURL = user.photoURL || _photoURL;

            onSignIn$?.(_user);
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
        <label for="signin_email">
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
        <label for="signin_password">
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
  },
);
