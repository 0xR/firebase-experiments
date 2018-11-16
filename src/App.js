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

db.collection("users")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(`${doc.id} => `, doc.data());
    });
  });

// real time watch
db.collection("users").onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function (change) {
    console.log("User change: ", change.doc.data());
  });
});

const App = () => {
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  if (!subscribed) {
    firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
    });
    setSubscribed(true);
  }

  return (
    <div className="App">
      {user ? (
        <h1>welcome back {user.displayName}</h1>
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
