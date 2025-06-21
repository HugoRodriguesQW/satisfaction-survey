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

        };

        if (typeof window !== 'undefined') {
            loadParticles();
        }
    }, []);

    return (
        <>
            <script src="particles/particles.js" defer />
            <div id="awesome-box" className={twMerge("absolute top-0 left-0 w-full h-full", props.className)}></div>
            <div id="awesome-box2" className={twMerge("absolute top-0 left-0 w-full h-full", props.className)}></div>
        </>
    );
}