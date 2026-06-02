"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import React from "react";
import { useAuth } from "~/hooks/auth-hooks";
import Link from "next/link";

export default function SignUpPage() {
    
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { createUserWithEmailAndPassword } = useAuth();

    const handleSubmit = async () => {
        await createUserWithEmailAndPassword(name, email, password);
    }

    return (
        <main className="min-h-screen min-w-screen flex justify-center items-center bg-black">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl">Sign Up</CardTitle>
                        <CardDescription className="text-md">Create an account to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-md">Name</Label>
                            <Input id="name" placeholder="John Doe"
                            className="text-xs" 
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-md">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-md">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" 
                            onClick={handleSubmit}
                        >
                            Create Account
                        </Button>
                    </CardFooter>
                    <CardFooter className="text-sm">
                        Already have an account? <Link href="/sign-in" style={{color: "#0065F4", marginLeft: "0.5rem"}} className=" text-lg hover:underline">Sign in</Link>
                    </CardFooter>
                </Card>
        </main>
    );
}
