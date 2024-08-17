import staticAdapter from '@sveltejs/adapter-static';
import vercel from '@sveltejs/adapter-vercel'

const dev = process.env.NODE_ENV === 'development';
const isGitHubPages = process.env.ADAPTER === 'static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: isGitHubPages ? staticAdapter() : vercel(),
		paths: {
			base: dev ? '/gauge-checker' : '',
		}
	}
};

export default config;