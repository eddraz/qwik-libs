import { Auth } from "./components/auth";
import { GoogleAuthenticator } from "./components/google-authenticator";

import { CRYPTER } from "./utils/crypter.util";

export const firebaseConfig = CRYPTER.encrypt({
  apiKey: "AIzaSyDzoEjlBumgQQRTErQSIym6cJwd5DD8sBw",
  authDomain: "qwik-editor.firebaseapp.com",
  projectId: "qwik-editor",
  storageBucket: "qwik-editor.appspot.com",
  messagingSenderId: "323387459425",
  appId: "1:323387459425:web:449b90abb12ae9d1f76720",
  prueba: "asdasd",
  measurementId: "G-DH53JW6K09",
});

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        {firebaseConfig}
        <Auth firebaseConfig={firebaseConfig}>
          <GoogleAuthenticator>
            Signin with Google
            <img
              src="https://www.svgrepo.com/show/327365/logo-google.svg"
              alt="Logo de Google"
              width={30}
              height={30}
            />
          </GoogleAuthenticator>
        </Auth>
      </body>
    </>
  );
};
