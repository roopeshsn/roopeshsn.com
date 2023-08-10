<script>
	export let data;
</script>

<article class="mt-8">
	<h1 class="text-xl md:text-2xl">{data.title}</h1>
	<p class="text-sm text-gray-500">Published: {data.createdAt}</p>
	<div class="mt-4">
		<svelte:component this={data.content} />
	</div>
</article>
