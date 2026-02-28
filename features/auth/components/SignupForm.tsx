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
      <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-4">
        {/* Full Name */}
        <FormField 
          control={form.control} 
          name="name" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        {/* Email */}
        <FormField 
          control={form.control} 
          name="email" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        {/* Password */}
        <FormField 
          control={form.control} 
          name="password" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        {/* Confirm Password */}
        <FormField 
          control={form.control} 
          name="confirmPassword" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        {/* Proficiency Level (Matches your segmented-style UI) */}
        <FormField control={form.control} name="proficiency" render={({ field }) => (
          <FormItem className="border border-emerald-100 p-4 rounded-xl bg-emerald-50/30">
            <FormLabel className="text-emerald-700 font-medium">Select Proficiency Level:</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2 mt-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <FormItem key={level} className="flex-1">
                    <FormControl>
                      <RadioGroupItem value={level} className="sr-only" />
                    </FormControl>
                    <FormLabel className={`flex justify-center border p-3 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 
                      ${field.value === level
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50'}`}>
                      {level}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )} />

        <Button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
          {isPending ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}