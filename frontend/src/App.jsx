import React from "react";
import "./App.css";
import Attendance from "./Components/Attendance/Attendance";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import SignInPage from "./Components/SignInPage/SignInPage";

function App() {
  return (
    <div className="attendance-app">
      <header>
        <SignedOut>
          <SignInPage redirectUrl="/" />
        </SignedOut>

        <SignedIn>
          <Attendance />
        </SignedIn>
      </header>
    </div>
  );
}

export default App;
