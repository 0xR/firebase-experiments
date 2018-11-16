import React, { Component } from "react";
import logo from "./logo.svg";
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

db.collection("collection")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(`${doc.id} => `, doc.data());
    });
  });

class App extends Component {
  render() {
    return (
      <div className="App">
        <button
          onClick={() => {
            firebase
              .auth()
              .signInWithPopup(new firebase.auth.GoogleAuthProvider())
              .then(function(result) {
                console.log("auth", { result });
              })
              .catch(function(error) {
                console.log({ error });
              });
          }}
        >
          sign in
        </button>
      </div>
    );
  }
}

export default App;
