import React from "react";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = ({ redirectUrl }) => {
  return (
    <div className="grid w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <SignIn>
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
          >
            <h1>Attendance System</h1>
            <h2>Sign in to your account</h2>
            <SignIn.GlobalError />

            <SignIn.Field name="identifier">
              <SignIn.Label>UserName</SignIn.Label>
              <SignIn.Input type="text" required />
              <SignIn.FieldError />
            </SignIn.Field>

            <SignIn.Field name="password">
              <SignIn.Label>Password</SignIn.Label>
              <SignIn.Input type="password" required />
              <SignIn.FieldError />
            </SignIn.Field>

            <SignIn.Action submit>Sign In</SignIn.Action>
          </SignIn.Step>
        </SignIn.Root>
      </SignIn>
    </div>
  );
};

export default SignInPage;
