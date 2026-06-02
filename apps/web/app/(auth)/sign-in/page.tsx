"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import React from "react";
import { useAuth } from "~/hooks/auth-hooks";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "~/store/user-store";

export default function SignInPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { loginUserWithEmailAndPassword } = useAuth();
    const router = useRouter();
    const {setUser} = useUserStore();

    const handleSubmit = async () => {
        const id = await loginUserWithEmailAndPassword(email, password);
        setUser({id, email: null, name: null});
        router.push("/new");
    }

    return (
        <main className="min-h-screen min-w-screen flex justify-center items-center bg-black">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
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
                            Sign In
                        </Button>
                    </CardFooter>
                    <CardFooter className="text-sm">
                        Don't have an account? <Link href="/sign-up" style={{color: "#0065F4", marginLeft: "0.5rem"}} className=" text-lg hover:underline">Sign up</Link>
                    </CardFooter>
                </Card>
        </main>
    );
}
