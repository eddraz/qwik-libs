import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

import {
  QRL,
  Slot,
  component$,
  createContextId,
  noSerialize,
  useContext,
  useContextProvider,
  useVisibleTask$,
} from "@builder.io/qwik";
import { FirebaseConfigModel } from "../../models/firebase-config.model";
import { UserModel } from "../../models/user.model";

import { CRYPTER } from "../../utils/crypter.util";
import { removeAccents } from "../../utils/remove-accents.util";
import { FirebaseService } from "../../services/firebase.service";

interface Props {
  firebaseConfig: string;
  onAuth$?: QRL<(user: UserModel) => void>;
}

export const FirebaseContext = createContextId<FirebaseConfigModel>("firebase");
export const UserContext = createContextId<UserModel>("user");
export const UserDisplayNameContext =
  createContextId<string>("userDisplayName");
export const UserPhotoUrlContext = createContextId<string>("userPhotoUrl");

export const Auth = component$<Props>(({ firebaseConfig, onAuth$ }) => {
  const displayName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    length: 2,
    style: "capital",
  });

  useContextProvider(
    FirebaseContext,
    JSON.parse(CRYPTER.decrypt(firebaseConfig)),
  );
  useContextProvider(UserContext, {});
  useContextProvider(UserDisplayNameContext, displayName);
  useContextProvider(
    UserPhotoUrlContext,
    `https://robohash.org/${removeAccents(displayName).toLowerCase().replace(/ /g, "-")}`,
  );

  const _firebaseConfig = useContext(FirebaseContext);
  const _user = useContext(UserContext);
  const _displayName = useContext(UserDisplayNameContext);
  const _photoURL = useContext(UserPhotoUrlContext);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (firebaseConfig) {
      const firebase = noSerialize(new FirebaseService(_firebaseConfig));
      const auth = getAuth(firebase?.app);

      _user.displayName = _displayName;
      _user.photoURL = _photoURL;

      if (auth.currentUser) {
        _user.displayName = auth.currentUser.displayName || _displayName;
        _user.photoURL = auth.currentUser.photoURL || _photoURL;
        _user.uid = auth.currentUser.uid;
        _user.disabled = false;
        _user.email = auth.currentUser.email;
        _user.emailVerified = auth.currentUser.emailVerified;
        _user.phoneNumber = auth.currentUser.phoneNumber;
        _user.provider = (auth.currentUser.providerId ||
          "email") as UserModel["provider"];

        onAuth$?.(_user);
      }

      onAuthStateChanged(
        auth,
        (credentialUser) => {
          if (credentialUser) {
            _user.displayName =
              credentialUser.displayName || _user.displayName || _displayName;
            _user.photoURL =
              credentialUser.photoURL || _user.phoneNumber || _photoURL;
            _user.uid = credentialUser.uid || _user.uid;
            _user.disabled = _user.disabled || false;
            _user.email = credentialUser.email || _user.email;
            _user.emailVerified =
              credentialUser.emailVerified || _user.emailVerified;
            _user.phoneNumber = credentialUser.phoneNumber || _user.phoneNumber;
            _user.provider = (credentialUser.providerId ||
              _user.provider) as UserModel["provider"];

            onAuth$?.(_user);
          }
        },
        (error: any) => {
          console.error("Auth state changed error", error);
        },
      );
    } else {
      console.error("Firebase config not found");
    }
  });

  return (
    <section class="auth-container">
      <Slot />
    </section>
  );
});
