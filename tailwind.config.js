import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import flowbitePlugin from 'flowbite/plugin'

export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        forms,
        typography,
        flowbitePlugin,
    ],
};
