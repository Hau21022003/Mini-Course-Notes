import { LoginForm } from "@/pages/auth/login/components/login-form";
import bgAuth from "@/assets/bg-auth.jpg";

export default function LoginPage() {
  return (
    <div className="h-dvh overflow-hidden">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch h-full">
            {/* Left: Login Form */}
            <div className="w-full md:w-1/2 px-6 md:px-12 py-8 space-y-2">
              {/* <Image src="/logo.svg" alt="Logo" width={40} height={40} /> */}
              <p className={`font-light tracking-wider text-2xl`}>EduLite</p>
              <h3 className="text-2xl font-bold">Welcome Back</h3>
              <p className="text-gray-600 mb-8">
                Please enter your credentials to continue
              </p>
              <LoginForm />
            </div>
  
            {/* Right: Image */}
            <div className="w-full hidden md:block md:w-1/2 h-64 md:h-auto">
              <img src={bgAuth} className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
