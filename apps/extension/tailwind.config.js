/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    darkMode: "media",
    content: ['node_modules/preline/dist/*.js', "./**/*.tsx"],
    plugins: [
        require('preline/plugin'),
    ]
}