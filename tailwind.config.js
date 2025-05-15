/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'comic-blue': '#007BFF',
                'comic-yellow': '#FFC107',
                'comic-gray': '#F8F9FA',
            },
            fontFamily: {
                comic: ['Comic Sans MS', 'cursive'], // Use a similar font or import a custom one
            },
        },
    },
    plugins: [],
};