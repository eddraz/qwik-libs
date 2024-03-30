import { FirebaseError } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import {
  QRL,
  Slot,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { FirebaseContext } from "./auth";

import { FirebaseService } from "../../services/firebase.service";

interface Props {
  fields?: {
    email: {
      label: string;
      placeholder: string;
      value: string;
    };
  };
  buttons?: {
    submit: string;
  };
  onSended$?: QRL<() => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const ForgotPasswordForm = component$<Props>(
  ({ fields, buttons, onSended$, onError$ }) => {
    const _firebaseConfig = useContext(FirebaseContext);
    const email = useSignal<string>(fields?.email.value || "");

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            const firebase = noSerialize(new FirebaseService(_firebaseConfig));
            const auth = getAuth(firebase?.app);
            await sendPasswordResetEmail(auth, email.value);

            onSended$?.();
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
        <label for="forgot_password_email">
          {fields?.email.label || "Email"}
          <input
            type="email"
            id="forgot_password_email"
            name="email"
            autocapitalize="none"
            placeholder={fields?.email.placeholder || "Email"}
            bind:value={email}
          />
        </label>
        <Slot name="under-name" />
        <button type="submit" class="submit">
          {buttons?.submit || "Forgot Password?"}
        </button>
      </form>
    );
  },
);
