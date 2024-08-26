"use client";
import { Mail, KeyRound } from "lucide-react";
import GoogleButton from "react-google-button";
import { BadgeInfo } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserInput } from "@/types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserInput>();
  const router = useRouter();

  const [signInError, setSignInError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<UserInput> = async (data) => {
    const result = await signIn("credentials", { ...data, redirect: false });

    if (result?.error) {
      setSignInError(result.error);
    } else {
      router.push("/organizations");
    }
  };

  return (
    <div className="mt-">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="input input-bordered flex items-center gap-2">
          <Mail size={20} className="text-slate-400" />
          <input
            type="text"
            className="grow"
            placeholder="email"
            {...register("email", { required: "Email is required" })}
          />
        </label>
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        <label className="input input-bordered flex items-center gap-2">
          <KeyRound size={20} className="text-slate-400" />
          <input
            type="password"
            className="grow"
            placeholder="password"
            {...register("password", { required: "Password is required" })}
          />
        </label>
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        {signInError && <p className="text-red-500 text-xs">{signInError}</p>}
        <button className="btn btn-neutral hover:btn-primary" type="submit">
          Login
        </button>
      </form>
      <div className="mt-4 flex flex-col justify-center items-center">
        <div className="relative flex items-center justify-center w-full">
          <hr className="w-64 h-px my-8 bg-slate-400 border-0" />
          <span className="absolute px-3 font-medium text-slate-500 -translate-x-1/2 bg-slate-50 left-1/2">or</span>
        </div>
        <GoogleButton onClick={() => signIn("google")} />
        <div>
          <div className="flex flex-nowrap items-center gap-2 mt-3">
            <BadgeInfo size={20} className="text-secondary flex-shrink-0" />
            <p className="text-slate-500 text-xs">
              Only users with an existing account with E-SORR are permitted to sign in via Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
