<script>
	if (navigator.storage && navigator.storage.persist) {
		navigator.storage.persist().then((persistent) => {
			if (persistent) {
				console.log('Storage will not be cleared except by explicit user action');
			} else {
				console.log('Storage may be cleared by the UA under storage pressure.');
			}
		});
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
