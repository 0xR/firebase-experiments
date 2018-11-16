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
  const [{ message } = { message: "no message..." }, setMessage] = useState({
    message: "loading..."
  });
  const [messagesHistory, setMessageHistory] = useState([]);
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

    db.collection("messages")
      .orderBy("created", "desc")
      .limit(10)
      .onSnapshot(querySnapshot => {
        const newHistory = [];
        querySnapshot.forEach(doc => {
          if (doc.id !== "latest") {
            newHistory.push(doc.data());
          }
        });
        setMessageHistory(newHistory);
      }, console.error.bind(console, "onSnapshot"));
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
                let newMessage = {
                  message: `The time is ${new Date().toLocaleString()}`,
                  created: firebase.firestore.FieldValue.serverTimestamp()
                };
                db.collection("messages").add(newMessage);
                db.collection("messages")
                  .doc("latest")
                  .set(newMessage);
              }}
            >
              new message
            </button>
          </p>
          <h3>The latest message is:</h3>
          <p>{message}</p>
          <h3>Message history:</h3>
          {messagesHistory.map(({ message, id }) => (
            <p key={id}>{message}</p>
          ))}
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
