import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";

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
  .add({
    first: "Alan",
    middle: "Mathison",
    last: "Turing",
    born: 1912
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
