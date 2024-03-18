import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

import {
  Slot,
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { FirebaseConfigContext } from "./auth";
import { UserModel } from "../models/user.model";

import { CRYPTER } from "../utils/crypter.util";
import { AuthService } from "../services/auth.service";

import "./google-authenticator.css";

interface Props {}

export const GoogleAuthenticator = component$<Props>(() => {
  const firebaseConfig = useContext(FirebaseConfigContext);
  const userSigned = useSignal<UserModel>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const currentUser = await new AuthService(
      JSON.parse(CRYPTER.decrypt(firebaseConfig))
    ).currentUser();

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
  });

  return (
    <>
      {userSigned.value ? (
        <button class="btn btn-profile-signed">
          <span>
            <strong>{userSigned.value.displayName}</strong>
            <small>{userSigned.value.email}</small>
            {/* <button
              onClick$={async () => {
                try {
                  await new AuthService(firebaseConfig).signOut();
                  userSigned.value = undefined;
                } catch (error) {
                  console.error("Error signing out", error);
                }
              }}
            >
              Salir
            </button> */}
          </span>
          {userSigned.value.photoURL && (
            <img
              src={userSigned.value.photoURL}
              alt={`Foto de perfil de ${userSigned.value.displayName}`}
              width={70}
              height={70}
            />
          )}
        </button>
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
            } catch (error) {
              console.error("Error signing in with Google", error);
            }
          }}
        >
          <Slot />
        </button>
      )}
    </>
  );
});
