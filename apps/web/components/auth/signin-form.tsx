"use client";

import { AlertCircle } from "lucide-react";
import { signIn } from "@/actions/auth";

import { useActionState } from "react";
import InputField from "../common/input-field";
import { SubmitButton } from "./submit-button";

const SignInForm = () => {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <form action={action} className="w-full">
      {/* Email Field */}
      <InputField
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={state?.error?.email}
      />

      {/* Password Field */}
      <InputField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={state?.error?.password}
        showPasswordToggle={true} // Enable password visibility toggle
      />

      {state?.message && (
        <div
          role="alert"
          className="mt-2 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-sm">{state.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <SubmitButton>Sign In</SubmitButton>
      </div>
    </form>
  );
};

export default SignInForm;
