// components/auth/login-form.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "../schema/auth";
import { Mail, Lock, Loader2 } from "lucide-react";
import * as z from "zod";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      // Redirect to home page on successful login
      router.push("/");
    },
    onError: (error) => {
      console.error("Login failed", error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-5">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Password
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}