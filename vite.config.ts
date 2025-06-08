import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	optimizeDeps: {
        exclude: [
            "svelte-codemirror-editor", 
            "codemirror", 
            "@codemirror/lang-javascript",
            "@codemirror/lang-css",
            "eslint-linter-browserify"
        ],
    },

    build: {
      cssMinify: 'lightningcss'
    },

    css: {
        transformer: 'lightningcss',
    }
});
