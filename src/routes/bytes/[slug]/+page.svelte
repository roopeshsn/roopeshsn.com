<script>
	import { page } from '$app/stores';
	let base = 'https://roopeshsn.com/bytes';
	export let data;
	export let url = `${base}/${$page.params.slug}`;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.summary} />
	<meta name="keywords" content={data.tags} />
	<meta name="author" content={data.author} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.summary} />
	<meta property="og:image" content="" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="roopeshsn.com" />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.summary} />
	<meta name="twitter:image" content="" />
</svelte:head>

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
