/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                comic: ['var(--font-permanent-marker)'],
                sans: ['var(--font-geist)'],
            },
            backgroundImage: {
                "comic-pattern": "url('/images/comic_pattern.png')",
            },
            animation: {
                "comic-fade": "fade 0.5s ease-in-out",
                "spin-slow": "spin 30s linear infinite",
                "spin-slow-reverse": "spin 35s linear infinite reverse",
                "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "pulse-medium": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "pulse-fast": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fade: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                pulse: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
            },
        },
    },
    plugins: [],
};

export default config;