<script>
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";
	import { onMount } from "svelte";

    onMount(() => {
        if (localStorage.getItem('nekobox:setup')) {
            goto('/editor')
        } else {
            goto('/setup')
        }
    })
</script>

<section class="welcome">
    <h1 class="big">Nekobox2</h1>
    <p>loading...</p>
</section>