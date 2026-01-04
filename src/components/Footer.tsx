import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center gap-2">
                        <Image src={'/logo.png'} alt="logo" width={32} height={32} />
                        <span className="text-xl font-bold text-primary">EduGen</span>
                    </div>

                    <p className="text-center text-sm text-gray-500 sm:text-right">
                        Copyright &copy; 2025. All rights reserved.
                    </p>

                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <Link href="#" className="text-gray-400 hover:text-primary">
                            About
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-primary">
                            Privacy Policy
                        </Link>
                        <Link href="/dashboard" className="text-gray-400 hover:text-primary">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
