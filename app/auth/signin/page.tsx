"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
const SigninPage = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });

  const loginUser = async (e) => {
    e.preventDefault();
    signIn("credentials", { ...data, redirect: true });
  };

  return (
    <div>
      <h1>SigninPage</h1>
      {/* add signin with google button */}
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <form onSubmit={loginUser}>
        <label>email</label>
        <input type="text" placeholder="email" onChange={(e) => setData({ ...data, email: e.target.value })} />{" "}
        <label>password</label>
        <input type="text" placeholder="password" onChange={(e) => setData({ ...data, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default SigninPage;
