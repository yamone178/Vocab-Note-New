// components/auth/signup-form.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/app/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { signupSchema } from "../schema/auth";
import { User, Mail, Lock, Loader2, GraduationCap } from "lucide-react";
import * as z from "zod";

export function SignupForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "", 
      proficiency: "Beginner" 
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signUpAction,
    onSuccess: () => {
      // Redirect to login page after successful signup
      router.push("/auth/login?message=Account created successfully");
    },
    onError: (error) => {
      console.error("Signup failed", error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-5">
        {/* Full Name */}
        <FormField 
          control={form.control} 
          name="name" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Full Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} 
        />
        
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
        
        {/* Confirm Password */}
        <FormField 
          control={form.control} 
          name="confirmPassword" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Confirm Password
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

        {/* Proficiency Level */}
        <FormField 
          control={form.control} 
          name="proficiency" 
          render={({ field }) => (
            <FormItem className="border-2 border-emerald-100 p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white">
              <FormLabel className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-3">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Select Your English Proficiency Level
              </FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value} 
                  className="grid grid-cols-3 gap-3"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <FormItem key={level} className="flex-1">
                      <FormControl>
                        <RadioGroupItem value={level} className="sr-only" />
                      </FormControl>
                      <FormLabel 
                        className={`flex justify-center items-center border-2 p-3 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 h-full
                          ${field.value === level
                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-md shadow-emerald-200 scale-105'
                            : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 hover:scale-102'}`}
                      >
                        {level}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs mt-2" />
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}