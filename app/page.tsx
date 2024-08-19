import LoginForm from "@/components/LoginForm";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row text-neutral bg-slate-50">
      <div className="w-full md:w-2/6 flex flex-col justify-center items-center p-5 gap-2 relative">
        <span className="absolute top-0 h-2 bg-primary w-full" />
        <div className="mt-auto">
          <h1 className="text-3xl font-bold">Sign in to your account</h1>
          <p className="text-md my-2">Welcome back! Please enter your details.</p>
          <LoginForm />
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 mt-auto">
          <p className="text-sm text-slate-500">
            Don't have an account yet? Contact OSA at osa@ust.edu.ph to have your account created.
          </p>
        </div>
      </div>
      <div className="hidden md:flex w-full md:w-4/6 bg-slate-50 items-center justify-center">
        <img className="object-cover object-left w-full h-full" src="/assets/1-scaled.jpg" />
      </div>
    </div>
  );
};

export default HomePage;
