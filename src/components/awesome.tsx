import { HTMLAttributes, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function AwesomeBox(props: { className?: HTMLAttributes<HTMLDivElement>["className"] }) {
    useEffect(() => {
        const loadParticles = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const particlesJS = (window as any).particlesJS;
            particlesJS.load('awesome-box', '/particles/prefab/awesome-box.json', () => {
                console.log('Particles loaded');
            });

            particlesJS.load('awesome-box2', '/particles/prefab/awesome-box2.json', () => {
                console.log('Particles loaded');
            });

            particlesJS.load('awesome-box3', '/particles/prefab/awesome-box3.json', () => {
                console.log('Particles loaded');
            });

        };

        if (typeof window !== 'undefined') {
            loadParticles();
        }
    }, []);

    const className = twMerge("absolute top-0 left-0 w-full h-full", props.className)

    return (
        <>
            <script src="particles/particles.js" defer />
            <div id="awesome-box3" className={className}></div>
            <div id="awesome-box2" className={className}></div>
            <div id="awesome-box" className={className}></div>
            <div className={twMerge(className, "backdrop-blur-xs opacity-50 backdrop-contrast-125")}></div>
        </>
    );
}