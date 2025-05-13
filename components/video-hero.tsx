// components/video-hero.tsx
"use client"
import React from 'react';

interface VideoHeroProps {
    videoSrc: string;
    title: string;
    subtitle: string;
}

export const VideoHero: React.FC<VideoHeroProps> = ({ videoSrc, title, subtitle }) => {
    // ... component code ...
    return (
        <section className="relative h-[50vh] w-full overflow-hidden">
            {/* ... rest of your VideoHero JSX ... */}
            <video autoPlay loop muted playsInline className="absolute left-0 top-0 h-full w-full object-cover -z-10">
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
                    {title}
                </h1>
                <p className="mt-2 text-xl font-medium sm:text-2xl md:text-3xl text-gray-300">
                    {subtitle}
                </p>
            </div>
        </section>
    );
};

// If you had a default export, remove it or change it to a named export.
// export default VideoHero; // <--- Remove this if you have it and use the const export above