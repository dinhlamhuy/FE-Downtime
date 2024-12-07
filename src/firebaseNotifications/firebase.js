// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Toast } from "../utils/toast";

// var firebaseConfig = {
//     apiKey: "AIzaSyAk17G8hWfCK2y5zct66gitNEzCkT3c6i8",
//     authDomain: "downtime-1a6e1.firebaseapp.com",
//     projectId: "downtime-1a6e1",
//     storageBucket: "downtime-1a6e1.appspot.com",
//     messagingSenderId: "1092351827822",
//     appId: "1:1092351827822:web:6b597128a1c52f5b396b7f"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDxvwxJQwPYnzTmIb2XMMHKclwMvtdf5eI",
  authDomain: "notidowntime.firebaseapp.com",
  projectId: "notidowntime",
  storageBucket: "notidowntime.firebasestorage.app",
  messagingSenderId: "45162176504",
  appId: "1:45162176504:web:02a69ea8ef04ca63c1800d",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  //   return getToken(messaging, {
  //     vapidKey:
  //       "BFKo_K0bdHOV5h2lUxzlhDFx4gz0dIEScfhVlJtmcxAvtJOv4p-GewFhrK0qIHGEAVSYVSbdqdDXC7GcqhZcV7c",
  //   })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         console.log("current token for client: ", currentToken);
  //         // Perform any other neccessary action with the token
  //         return currentToken;
  //       } else {
  //         // Show permission request UI
  //         console.log(
  //           "No registration token available. Request permission to generate one."
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //     });

  return  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        // Nếu được cấp phép, lấy token
        getToken(messaging, {
          vapidKey:
            "BFKo_K0bdHOV5h2lUxzlhDFx4gz0dIEScfhVlJtmcxAvtJOv4p-GewFhrK0qIHGEAVSYVSbdqdDXC7GcqhZcV7c",
        })
          .then((currentToken) => {
            if (currentToken) {
                console.log("current token for client: ", currentToken);
                //         // Perform any other neccessary action with the token
                        return currentToken;
            } else {
              console.log("No registration token available.");
             
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });
      } else {
        console.log("Notification permission denied.");
        Toast.fire({
          icon: "error",
          title:
            "Notification permission denied. Please enable it in browser settings.",
        });
      }
    })
    .catch((error) => {
      console.error("Error requesting notification permission:", error);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
