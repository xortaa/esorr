"use client";
import { useState } from "react";
import { GraduationCap, Gavel, Building2, UserPlus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserRegistrationInput } from "@/types";
import axios from "axios";
import { User } from "@/types";

const CreateAccountSidebar = ({ setUsers }: { setUsers: React.Dispatch<React.SetStateAction<User[]>> }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserRegistrationInput>();

  const [selectedRole, setSelectedRole] = useState<"RSO" | "SOCC" | "AU" | "">("");

  const onSubmit: SubmitHandler<UserRegistrationInput> = async (data) => {
    try {
      await axios.post("/api/users", data).then((response) => {
        setUsers((prevUsers) => [...prevUsers, response.data]);
      });
    } catch (error) {
      console.error("Error creating account", error);
    }
  };

  const handleRoleClick = (role: "RSO" | "SOCC" | "AU") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Create Account
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form
          className="menu bg-white text-base-content min-h-full w-5/6 sm:w-4/6 xl:w-2/6 p-4 border-t-8 border-primary"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-sm text-slate-500">Enter the details below to create an account for a user</p>
          </div>
          <div className="flex flex-col items-start w-full justify-center gap-2">
            <div className="w-full">
              <label htmlFor="email" className="label mb-1">
                Email
              </label>
              <input
                className="input input-bordered input-secondary w-full"
                id="email"
                placeholder="example@ust.edu.ph"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="password" className="label mb-1">
                Password
              </label>
              <input
                className="input input-bordered input-secondary w-full"
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="confirm-password" className="label mb-1">
                Confirm Password
              </label>
              <input
                className="input input-bordered input-secondary w-full"
                id="confirm-password"
                type="password"
                {...register("confirm_password", {
                  required: "Confirm password is required",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="role" className="label mb-1">
                Role
              </label>
              <div className="flex items-center justify-evenly gap-2 w-full">
                <div
                  className={`flex flex-col items-center justify-center border border-slate-200 shadow-sm rounded-md p-5 w-1/4 gap-2 cursor-pointer hover:shadow-xl ${
                    selectedRole === "RSO" ? "bg-primary border-2 border-secondary shadow-lg" : ""
                  }`}
                  onClick={() => handleRoleClick("RSO")}
                >
                  <GraduationCap size={30} />
                  <p className="text-xs font-bold">RSO</p>
                </div>
                <div
                  className={`flex flex-col items-center justify-center border border-slate-200 shadow-sm rounded-md p-5 w-1/4 gap-2 cursor-pointer hover:shadow-xl ${
                    selectedRole === "SOCC" ? "bg-primary border-2 border-secondary shadow-lg" : ""
                  }`}
                  onClick={() => handleRoleClick("SOCC")}
                >
                  <Gavel size={30} />
                  <p className="text-xs font-bold">SOCC</p>
                </div>
                <div
                  className={`flex flex-col items-center justify-center border border-slate-200 shadow-sm rounded-md p-5 w-1/4 gap-2 cursor-pointer hover:shadow-lg ${
                    selectedRole === "AU" ? "bg-primary border-2 border-secondary shadow-lg" : ""
                  }`}
                  onClick={() => handleRoleClick("AU")}
                >
                  <Building2 size={30} />
                  <p className="text-xs font-bold">AU</p>
                </div>
              </div>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <button className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateAccountSidebar;
