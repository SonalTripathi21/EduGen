import React from 'react'
import { Atom, Layout, Video } from 'lucide-react'

function Features() {
    const featureList = [
        {
            id: 1,
            name: 'AI Course Generation',
            desc: 'Create comprehensive courses on any topic instantly using advanced AI technology.',
            icon: <Atom className='h-8 w-8 text-primary' />
        },
        {
            id: 2,
            name: 'Curated Video Content',
            desc: 'Automatically integrate highly relevant YouTube videos to enhance the learning experience.',
            icon: <Video className='h-8 w-8 text-primary' />
        },
        {
            id: 3,
            name: 'Customizable Curriculum',
            desc: 'Easily edit and refine course structures to perfectly match your learning goals.',
            icon: <Layout className='h-8 w-8 text-primary' />
        }
    ]

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Why Choose EduGen?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 font-medium">
                        Everything you need to master new skills with the power of AI.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {featureList.map((feature) => (
                            <div key={feature.id} className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all hover:shadow-lg hover:scale-105">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg border">
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-bold text-gray-900 tracking-tight">{feature.name}</h3>
                                        <p className="mt-5 text-base text-gray-500 leading-7">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
