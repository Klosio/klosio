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
                // default 200
                'klosio-blue': {
                    '50': '#eef0ff',
                    '100': '#dfe4ff',
                    '200': '#bdc4ff',
                    '300': '#a3aafe',
                    '400': '#807ffa',
                    '500': '#6a60f4',
                    '600': '#5c43e8',
                    '700': '#4f35cd',
                    '800': '#402ea5',
                    '900': '#382c83',
                    '950': '#221a4c',
                },
                // default 300                
                'klosio-yellow': {
                    '50': '#fffaeb',
                    '100': '#fff1c6',
                    '200': '#ffe188',
                    '300': '#ffd466',
                    '400': '#ffb720',
                    '500': '#f99407',
                    '600': '#dd6d02',
                    '700': '#b74b06',
                    '800': '#94390c',
                    '900': '#7a300d',
                    '950': '#461702',
                },
                // default 300
                'klosio-green': {
                    '50': '#effaf2',
                    '100': '#d7f4dd',
                    '200': '#b3e7c1',
                    '300': '#75d093',
                    '400': '#4dba74',
                    '500': '#2a9f58',
                    '600': '#1c7f45',
                    '700': '#166639',
                    '800': '#14512f',
                    '900': '#114328',
                    '950': '#092517',
                },
                // default 300
                'klosio-pink': {
                    '50': '#fef3f2',
                    '100': '#ffe4e1',
                    '200': '#ffcec8',
                    '300': '#ff9a8d',
                    '400': '#fd7d6c',
                    '500': '#f5533e',
                    '600': '#e23620',
                    '700': '#be2a17',
                    '800': '#9d2617',
                    '900': '#82261a',
                    '950': '#470f08',
                },
            },
        }
    }
}