import {
  Slot,
  component$,
  createContextId,
  useContextProvider,
} from "@builder.io/qwik";

interface Props {
  firebaseConfig: string;
}

export const FirebaseConfigContext = createContextId<string>("firebase-config");

export const Auth = component$<Props>(({ firebaseConfig }) => {
  useContextProvider(FirebaseConfigContext, firebaseConfig);

  return (
    <section class="auth-container">
      <Slot />
    </section>
  );
});
