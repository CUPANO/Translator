/**@type {import('tailwindcss').config} */
export default {
    content: ['./index.html,', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend:{
            fontfamily:{
                righteous: ['Righteous', 'sans-serif'],
                russoOne: ['Russo One', 'sans-serif'],
                notoSansjp: ['Noto Sans JP', 'sans-serif'],
                shojumaru: ['shojumaru', 'system-ui'],
            },
            translate: ['active'],
        },
    },
    plugins: [],
}