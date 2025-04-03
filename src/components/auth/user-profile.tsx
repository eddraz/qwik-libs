import { FirebaseError } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { TbChevronDown, TbChevronUp } from "@qwikest/icons/tablericons";
import {
  QRL,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { FirebaseContext, UserContext } from "./auth";
import { UserModel } from "../../models/user.model";
import { OptimizedImage } from "../optimized-image";
import { Overlay } from "../overlay";

import { FirebaseService } from "../../services/firebase.service";

interface Props {
  user?: UserModel;
  onProfile$?: QRL<() => void>;
  onSignOut$?: QRL<() => void>;
  onError$?: QRL<(error: FirebaseError) => void>;
}

export const UserProfile = component$<Props>(
  ({ user, onProfile$, onSignOut$, onError$ }) => {
    const _user = useContext(UserContext);
    const firebaseConfig = useContext(FirebaseContext);
    const toggleIcon = useSignal<"chevron-down" | "chevron-up">("chevron-down");
    const toggleList = useSignal<boolean>();

    return (
      <>
        {toggleList.value && (
          <Overlay
            onClick$={() => {
              toggleList.value = false;
              toggleIcon.value =
                toggleIcon.value === "chevron-down"
                  ? "chevron-up"
                  : "chevron-down";
            }}
          />
        )}
        {(user || _user).uid && (
          <div class="btn-list">
            <button
              class="btn btn-profile-signed"
              onClick$={() => {
                toggleList.value = !toggleList.value;
                toggleIcon.value =
                  toggleIcon.value === "chevron-down"
                    ? "chevron-up"
                    : "chevron-down";
              }}
            >
              {(user || _user).photoURL && (
                <OptimizedImage
                  src={(user || _user).photoURL || undefined}
                  alt={`Foto de perfil de ${_user.displayName}`}
                  width={30}
                  height={30}
                />
              )}
              <span>
                <strong>{(user || _user).displayName}</strong>
                <small>{(user || _user).email}</small>
              </span>
              {toggleIcon.value === "chevron-down" && (
                <TbChevronDown class="size-6" />
              )}
              {toggleIcon.value === "chevron-up" && (
                <TbChevronUp class="size-6" />
              )}
            </button>
            {toggleList.value && (
              <div class="absolute z-50 mt-14 min-w-[150px] border-2 bg-white shadow">
                <button
                  class="btn w-full"
                  onClick$={async () => {
                    onProfile$?.();
                  }}
                >
                  Profile
                </button>
                <button
                  class="btn-sign-out"
                  onClick$={async () => {
                    try {
                      if (firebaseConfig) {
                        const firebase = noSerialize(
                          new FirebaseService(firebaseConfig),
                        );
                        await signOut(getAuth(firebase?.app));

                        delete _user.uid;
                        delete _user.phoneNumber;
                        delete _user.email;
                        delete _user.disabled;
                        delete _user.displayName;
                        delete _user.emailVerified;
                        delete _user.photoURL;
                        delete _user.provider;

                        onSignOut$ && onSignOut$();
                      } else {
                        console.error("Firebase config not found");
                      }
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
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);
