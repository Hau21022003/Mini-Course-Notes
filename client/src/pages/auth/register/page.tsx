import { SignUpForm } from "@/pages/auth/register/components/signup-form";
import bgAuth from "@/assets/bg-auth.jpg";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch h-full">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 px-6 md:px-12 py-8 space-y-2">
            {/* <img src="/logo.svg" alt="Logo" className="w-10 h-10" /> */}
            <p className={`font-light tracking-wider text-2xl`}>EduLite</p>
            <h3 className="text-2xl font-bold">Create an account</h3>
            <p className="text-gray-600 mb-8">
              Discover the tools that turn your designs into fully functional
              code
            </p>
            <SignUpForm />
          </div>

          {/* Right */}
          <div className="w-full hidden md:block md:w-1/2 h-64 md:h-auto">
            <img src={bgAuth} className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
