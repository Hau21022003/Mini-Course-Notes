import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginBodySchema, type LoginBody } from "@/schemas/auth.schema";
import authApiRequest from "@/api-requests/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleErrorApi } from "@/lib/error";
import { useAppStore } from "@/stores/app-store";
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
import googleIcon from "@/assets/google-icon.png";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginBody) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.sLogin(values);
      setUser(result.payload.account);
      navigate("/admin/courses");
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  }

  const forgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Error", { description: "Please enter your email" });
      return;
    }
    try {
      await authApiRequest.forgotPassword(email);
      toast.success("Email sent", {
        description: "Please check your email to reset your password",
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <p
                  onClick={() => {
                    forgotPassword();
                  }}
                  className="text-blue-500 cursor-pointer ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </p>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...field}
                  />
                  <div
                    // type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 px-1 py-1 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <button
          disabled={loading}
          className="w-full h-10 rounded-md bg-blue-500 flex items-center justify-center gap-2 hover:!bg-blue-600 text-white"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          <p className="leading-none"> Sign in</p>
        </button>
        <div className="my-2 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            OR
          </span>
        </div>
        <button
          type="button"
          className="h-10 rounded-md border w-full flex items-center justify-center gap-2 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
          onClick={() => {
            window.location.href = `${apiEndpoint}/auth/google?prompt=select_account`;
          }}
        >
          <img src={googleIcon} alt="Google icon" width={20} height={20} />
          <p className="leading-none">Sign in with Google</p>
        </button>
        <div className="mt-2 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="underline underline-offset-3 text-blue-500 hover:text-blue-600 decoration-blue-300 font-medium"
          >
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
