import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { RegisterBodySchema, type RegisterBody } from "@/schemas/auth.schema";
import authApiRequest from "@/api-requests/auth";
import { handleErrorApi } from "@/lib/error";
import { useAppStore } from "@/stores/app-store";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterBody>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterBody) {
    if (loading) return;
    setLoading(true);
    try {
      const rsp = await authApiRequest.register(values);
      const { account } = rsp.payload;
      setUser(account);
      navigate("/admin/courses");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

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
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...field}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="confirm password"
                    {...field}
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          className="w-full py-4 !bg-blue-500 hover:!bg-blue-600 text-white"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Create account
        </Button>
        <div className="mt-2 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline underline-offset-3 text-blue-500 hover:text-blue-600 decoration-blue-300 font-medium"
          >
            Sign in
          </a>
        </div>
      </form>
    </Form>
  );
}
