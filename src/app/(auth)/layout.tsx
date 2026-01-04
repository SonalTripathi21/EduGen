import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full min-h-screen">
                <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12 text-white relative overflow-hidden">
                    <div className="z-10 max-w-md text-center">
                        <div className="flex justify-center mb-8">
                            <div className="bg-white p-4 rounded-full shadow-2xl">
                                <img src="/logo.png" alt="EduGen Logo" className="w-24 h-24 object-contain" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-6">Welcome to EduGen</h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Unlock the power of AI to generate comprehensive courses in seconds. Join our community of learners and creators.
                        </p>
                    </div>
                    {/* Abstract shapes for background */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
                </div>
                <div className="flex items-center justify-center p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
