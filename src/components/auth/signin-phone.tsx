import { FirebaseError } from "firebase/app";
import {
  ConfirmationResult,
  RecaptchaParameters,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";

import {
  NoSerialize,
  QRL,
  Slot,
  component$,
  noSerialize,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { FirebaseContext } from "./auth";
import { UserModel } from "../../models/user.model";

import { FirebaseService } from "../../services/firebase.service";

interface WindowProps extends Window {
  confirmationResult?: ConfirmationResult;
}

interface Props {
  fields?: {
    phone: {
      label: string;
      placeholder: string;
      value: string;
    };
    code: {
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

export const SigninPhone = component$<Props>(
  ({ fields, buttons, onSignIn$, onError$ }) => {
    const _firebaseConfig = useContext(FirebaseContext);
    const phone = useSignal(fields?.phone?.value || "");
    const code = useSignal(fields?.code?.value || "");
    const verificationCode = useSignal(false);
    const recaptchaVerifier = useSignal<NoSerialize<RecaptchaVerifier>>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const firebase = noSerialize(new FirebaseService(_firebaseConfig));
      const auth = getAuth(firebase?.app);

      recaptchaVerifier.value = noSerialize(
        new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "normal",
          callback: (response: RecaptchaParameters) => {
            console.info(response, "Recaptcha verified");
          },
          "expired-callback": (e: any) => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
            console.error("expired-callback called", e);
          },
        }),
      );
    });

    return (
      <>
        {!verificationCode.value ? (
          <form
            class="form"
            preventdefault:submit
            onSubmit$={async (e) => {
              e.stopPropagation();

              try {
                const firebase = noSerialize(
                  new FirebaseService(_firebaseConfig),
                );
                const auth = getAuth(firebase?.app);

                const _recaptchaVerifier =
                  recaptchaVerifier.value as RecaptchaVerifier;
                const confirmationResult = await signInWithPhoneNumber(
                  auth,
                  phone.value,
                  _recaptchaVerifier,
                );

                if (confirmationResult instanceof FirebaseError) {
                  console.error(
                    "Error sign in phone error",
                    confirmationResult,
                  );
                  return;
                }

                (window as WindowProps).confirmationResult = confirmationResult;
                verificationCode.value = true;
              } catch (error: any) {
                onError$?.({
                  code: error.code,
                  message: error.message,
                  name: "GOOGLE_SIGNIN_PHONE_ERROR",
                });

                console.error("Sign in phone error", error);
              }
            }}
          >
            <label for="signin_phone_number">
              {fields?.phone.label || "Phone Number"}
              <input
                type="tel"
                id="signin_phone_number"
                name="phone"
                autocapitalize="none"
                placeholder={fields?.phone.placeholder || "Phone Number"}
                bind:value={phone}
              />
            </label>
            <Slot name="under-phone" />
            <div id="recaptcha-container" />
            <Slot name="under-recaptcha" />
            <button type="submit" class="submit">
              {buttons?.submit || "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form
            class="form"
            preventdefault:submit
            onSubmit$={async (e) => {
              e.stopPropagation();

              try {
                const confirmationResult = (window as WindowProps)
                  .confirmationResult;

                if (confirmationResult) {
                  const credential = await confirmationResult.confirm(
                    code.value,
                  );

                  onSignIn$?.(credential.user);

                  if (confirmationResult instanceof FirebaseError) {
                    console.error(
                      "Error sign in phone code error",
                      confirmationResult,
                    );
                    return;
                  } else {
                    verificationCode.value = false;
                    return false;
                  }
                }
              } catch (error: any) {
                onError$?.({
                  code: error.code,
                  message: error.message,
                  name: "GOOGLE_SIGNIN_PHONE_ERROR",
                });
              }
            }}
          >
            <label for="signin_verification_code">
              {fields?.code.label || "Verification Code"}
              <input
                type="text"
                id="signin_verification_code"
                name="code"
                autocapitalize="none"
                placeholder={fields?.code.placeholder || "Verification Code"}
                bind:value={code}
              />
            </label>
            <Slot name="under-code" />
            <button type="submit" class="submit">
              {buttons?.submit || "Send Verification Code"}
            </button>
          </form>
        )}
      </>
    );
  },
);
