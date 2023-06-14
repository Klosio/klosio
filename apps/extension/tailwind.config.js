/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    darkMode: "media",
    content: ['node_modules/preline/dist/*.js', "./**/*.tsx"],
    plugins: [
        require('@tailwindcss/forms'),
        require('preline/plugin')
    ],
    theme: {
        extend: {
            colors: {
                'klosio-blue': '#BDC4FF',
                'klosio-yellow': '#FFD466',
                'klosio-green': '#75D093',
                'klosio-pink': '#FF9A8D'
            },
        }
    }
}