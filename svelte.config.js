import adapter from 'svelte-adapter-nekoweb';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { env } from 'node:process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			apiKey: env.NEKOWEB_APIKEY,
			cookie: env.NEKOWEB_COOKIE,
			folder: 'nekobox2-main'
		}),
	}
};

export default config;
