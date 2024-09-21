"use client";

import GoogleButton from "react-google-button";
import { BadgeInfo } from "lucide-react";
import { signIn } from "next-auth/react";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row text-neutral bg-slate-50">
      <div className="w-full md:w-3/6 flex flex-col justify-center items-center p-5 gap-2 relative">
        <span className="absolute top-0 h-2 bg-primary w-full" />
        <div className="mt-auto">
          <h1 className="text-3xl font-bold">Sign in to your E-SORR account</h1>
          <div className="my-6 text-slate-500">
            <p className="text-md mt-2 mb-8">
              To access E-SORR, please make sure you meet the following requirements:
            </p>
            <ol className="list-decimal list-inside">
              <li>UST Google Workspace Personal Account</li>
              <li>Google Authenticator Application</li>
            </ol>
          </div>
          <div className="mt-4 flex flex-col justify-center items-start gap-8">
            <div>
              <GoogleButton onClick={() => signIn("google")} />
              <div className="flex flex-nowrap items-center gap-2 mt-3">
                <BadgeInfo size={20} className="text-secondary flex-shrink-0" />
                <p className="text-xs text-slate-500">
                  Don't have an account yet? Contact OSA at placeholder@gmail to have your account created.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 mt-auto"></div>
      </div>
      <div className="hidden md:flex w-full md:w-4/6 bg-slate-50 items-center justify-center">
        <img className="object-cover object-left w-full h-full" src="/assets/ust-background.JPG" />
      </div>
    </div>
  );
};

export default HomePage;
