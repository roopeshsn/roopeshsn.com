<script>
	import '../app.css';
	import Header from '$lib/header.svelte';
	import Footer from '$lib/footer.svelte';
</script>

<div class="container mx-auto px-4 sm:px-0">
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>
