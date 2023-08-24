<script>
	export let data;
</script>

<article class="prose w-full max-w-full mt-8 prose-headings:font-medium">
	<h1 class="text-xl md:text-2xl lg:text-3xl">{data.title}</h1>
	<p class="text-sm text-gray-500">Published: {data.createdAt}</p>

	<div class="mt-4">
		<svelte:component this={data.content} />
	</div>

	<div>
		{#each data.tags as tag}
			<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
				>{tag}</span
			>
		{/each}
	</div>
</article>
