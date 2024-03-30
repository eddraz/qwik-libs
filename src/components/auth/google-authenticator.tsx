import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import {
  QRL,
  Slot,
  component$,
  noSerialize,
  useContext,
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
  onSignIn$?: QRL<(user: UserModel) => void>;
  onSignOut$?: QRL<() => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const GoogleAuthenticator = component$<Props>(
  ({ onSignIn$, onError$ }) => {
    const _firebaseConfig = useContext(FirebaseContext);
    const _user = useContext(UserContext);
    const _displayName = useContext(UserDisplayNameContext);
    const _photoURL = useContext(UserPhotoUrlContext);

    return (
      <button
        class="btn btn-signin-google"
        onClick$={async () => {
          try {
            const firebase = noSerialize(new FirebaseService(_firebaseConfig));
            const auth = getAuth(firebase?.app);
            const credential = await signInWithPopup(
              auth,
              new GoogleAuthProvider(),
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

            onSignIn$ && onSignIn$(_user);
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
    );
  },
);
