// components/video-hero.tsx
"use client"
import React from 'react';

interface VideoHeroProps {
    videoSrc: string;
    title: string;
    subtitle: string;
}

export const VideoHero: React.FC<VideoHeroProps> = ({ videoSrc, title, subtitle }) => {
    return (
        <section className="relative h-[60vh] w-full overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute left-0 top-0 h-full w-full object-cover">
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 max-w-[100vw]">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl break-words">
                    {title}
                </h1>
                <p className="mt-2 text-xl font-medium sm:text-2xl md:text-3xl text-gray-300">
                    {subtitle}
                </p>
            </div>
        </section>
    );
};