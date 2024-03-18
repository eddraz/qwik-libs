import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

import {
  QRL,
  Slot,
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";
import { ChevronDownIcon } from "../icons/chevron-down";
import { UserModel } from "../../models/user.model";

import { CRYPTER } from "../../utils/crypter.util";
import { AuthService } from "../../services/auth.service";

import "./google-authenticator.css";

interface Props {
  onSignIn$?: QRL<(user: UserModel) => void>;
  onSignOut$?: QRL<() => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const GoogleAuthenticator = component$<Props>(
  ({ onSignIn$, onSignOut$, onError$ }) => {
    const firebaseConfig = useContext(FirebaseConfigContext);
    const userSigned = useSignal<UserModel>();
    const profileButtonList = useSignal<boolean>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      new AuthService(JSON.parse(CRYPTER.decrypt(firebaseConfig))).currentUser(
        (currentUser) => {
          if (!currentUser || currentUser instanceof FirebaseError)
            return console.error("Error getting current user");

          userSigned.value = {
            disabled: false,
            email: currentUser?.email,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
            uid: currentUser?.uid,
            emailVerified: currentUser?.emailVerified,
            phoneNumber: currentUser?.phoneNumber,
            provider: currentUser?.providerId as UserModel["provider"],
          };
        }
      );
    });

    return (
      <>
        {userSigned.value ? (
          <div class="btn-list">
            <button
              class="btn btn-profile-signed"
              onClick$={() =>
                (profileButtonList.value = !profileButtonList.value)
              }
            >
              <span>
                <strong>{userSigned.value.displayName}</strong>
                <small>{userSigned.value.email}</small>
              </span>
              {userSigned.value.photoURL && (
                <img
                  src={userSigned.value.photoURL}
                  alt={`Foto de perfil de ${userSigned.value.displayName}`}
                  width={70}
                  height={70}
                />
              )}
              <ChevronDownIcon color="#000000" width="20" height="20" />
            </button>
            {profileButtonList.value && (
              <button
                class="btn-sign-out"
                onClick$={async () => {
                  try {
                    await new AuthService(
                      JSON.parse(CRYPTER.decrypt(firebaseConfig))
                    ).signOut();
                    userSigned.value = undefined;
                    onSignOut$ && onSignOut$();
                  } catch (error: any) {
                    onError$ &&
                      onError$({
                        code: error.code,
                        message: error.message,
                        name: "SIGN_OUT_ERROR",
                      });

                    console.error("signing out error", error);
                  }
                }}
              >
                Salir
              </button>
            )}
          </div>
        ) : (
          <button
            class="btn btn-signin-google"
            onClick$={async () => {
              try {
                const user = await new AuthService(
                  JSON.parse(CRYPTER.decrypt(firebaseConfig))
                ).signInWithPopup(new GoogleAuthProvider());

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
            <Slot />
          </button>
        )}
      </>
    );
  }
);
