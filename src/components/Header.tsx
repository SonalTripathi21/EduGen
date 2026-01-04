"use client";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
    const { user, isSignedIn } = useUser();

    return (
        <div className="flex justify-between items-center px-5 py-3 shadow-sm border-b bg-white">
            <Link href={"/dashboard"} className="flex gap-2 items-center cursor-pointer">
                <Image src={'/logo.png'} alt="logo" width={40} height={40} className="rounded-md" />
                <h2 className="font-bold text-2xl text-primary">EduGen</h2>
            </Link>
            <div className="flex gap-4 items-center">
                <Link href={"/dashboard"}>
                    <button className="text-sm font-medium hover:text-primary transition">Dashboard</button>
                </Link>
                {isSignedIn ? (
                    <UserButton afterSignOutUrl="/sign-in" />
                ) : (
                    <Link href="/sign-in">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}
