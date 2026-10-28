"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { trpc } from "~/trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const createAccount = trpc.auth.CreateUserWithEmailAndPassword.useMutation({
    onSuccess: () => {
      toast.success("Account created");
      router.push("/new");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    createAccount.mutate({ fullName: name, email, password });
  };

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center bg-black">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl">Sign Up</CardTitle>
            <CardDescription className="text-md">
              Create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-md">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="text-xs"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-md">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-md">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                minLength={8}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={createAccount.isPending}>
              {createAccount.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
        <CardFooter className="text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            style={{ color: "#0065F4", marginLeft: "0.5rem" }}
            className="text-lg hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
