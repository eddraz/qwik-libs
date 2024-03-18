import { Auth } from "./components/auth";
import { GoogleAuthenticator } from "./components/google-authenticator";
import { BrandGoogleFilledIcon } from "./components/icons/brand-google-filled";

import { CRYPTER } from "./utils/crypter.util";

export const firebaseConfig = CRYPTER.encrypt({
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Auth firebaseConfig={firebaseConfig}>
          <GoogleAuthenticator>
            Signin with Google
            <BrandGoogleFilledIcon color="#fffffff" height="24" width="24" />
          </GoogleAuthenticator>
        </Auth>
      </body>
    </>
  );
};
