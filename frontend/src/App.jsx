import React from "react";
import "./App.css";
import Attendance from "./Components/Attendance/Attendance";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import SignInPage from "./Components/SignInPage/SignInPage";

function App() {
  return (
    <div className="attendance-app">
      <header>
        {/* Show the SignInButton when the user is signed out */}
        <SignedOut>
          {/* <SignIn redirectUrl="/" /> */}
          <SignInPage redirectUrl="/" />
        </SignedOut>

        {/* Show the UserButton and Attendance component when the user is signed in */}
        <SignedIn>
          {/* <UserButton /> */}
          <Attendance />
        </SignedIn>
      </header>
    </div>
  );
}

export default App;
