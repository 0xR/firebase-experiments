import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyACG4clL2NUOduEBtKd2YnOkWVwn4H0vIE",
  authDomain: "ruben-oostinga-speeltuin.firebaseapp.com",
  databaseURL: "https://ruben-oostinga-speeltuin.firebaseio.com",
  projectId: "ruben-oostinga-speeltuin",
  storageBucket: "ruben-oostinga-speeltuin.appspot.com",
  messagingSenderId: "390028126702"
});

const db = firebaseApp.firestore();
db.settings({ timestampsInSnapshots: true });

const App = () => {
  const [user, setUser] = useState(null);
  const [{ message }, setMessage] = useState({ message: "loading..." });
  const [subscribed, setSubscribed] = useState(false);

  if (!subscribed) {
    firebase.auth().onAuthStateChanged(async function(user) {
      setUser(user);
      db.collection("messages")
        .doc("latest")
        .onSnapshot(latest => {
          setMessage(latest.data());
        });
    });
    setSubscribed(true);
  }

  return (
    <div className="App">
      {user ? (
        <>
          <h1>welcome back {user.displayName}</h1>
          <p>
          <button
            onClick={() => {
              firebase
                .auth()
                .signOut()
                .catch(console.log.bind(console, "signout error"));
            }}
          >
            sign out
          </button>
          </p>
          <p>
          <button
            onClick={async () => {
              let message = {
                message: `The time is ${new Date().toLocaleString()}`
              };
              db.collection("messages").add(message);
              db.collection("messages")
                .doc("latest")
                .set(message);
            }}
          >
            new message
          </button>
          </p>
          <h3>The latest message is:</h3>
          <p>{message}</p>
        </>
      ) : (
        <button
          onClick={() => {
            firebase
              .auth()
              .signInWithPopup(new firebase.auth.GoogleAuthProvider())
              .then(function({ user }) {
                setUser(user);
              })
              .catch(function(error) {
                console.log({ error });
              });
          }}
        >
          sign in
        </button>
      )}
    </div>
  );
};

export default App;
