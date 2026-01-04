"use client";
import React from 'react'
import Link from 'next/link'

function Hero() {
    return (
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl text-primary">
                        AI Course Generator
                        <strong className="font-extrabold text-black sm:block"> Custom Learning Paths. </strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Generate personalized courses in minutes using AI. Master any subject with curated content and video lessons tailored just for you.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="/dashboard"
                        >
                            Get Started
                        </Link>

                        <Link
                            className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-primary/90 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                            href="#"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
