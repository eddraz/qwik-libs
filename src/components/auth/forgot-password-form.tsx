import { FirebaseError } from "firebase/app";

import { QRL, Slot, component$, useContext, useSignal } from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";

import { CRYPTER } from "../../utils/crypter.util";
import { AuthService } from "../../services/auth.service";

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
    const firebaseConfig = useContext(FirebaseConfigContext);
    const email = useSignal<string>(fields?.email.value || "");

    return (
      <form
        class="form"
        preventdefault:submit
        onSubmit$={async (e) => {
          e.stopPropagation();

          try {
            const user = await new AuthService(
              JSON.parse(CRYPTER.decrypt(firebaseConfig))
            ).sendPasswordResetEmail(email.value);

            if (user instanceof FirebaseError) {
              console.error("Error signing in with Google", user);
              return;
            }

            onSended$ && onSended$();
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
        <label for="forgot_password_email" class="fieldset">
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
  }
);
