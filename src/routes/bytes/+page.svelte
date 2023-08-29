<script>
	import Byte from '$lib/byte.svelte';
	export let data;
</script>

<svelte:head>
	<title>Bytes</title>
	<meta
		name="description"
		content="Bytes are a shorter form of a blog post that is not boring, clear, and concise."
	/>
	<meta name="keywords" content="bytes" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://roopeshsn.com/bytes" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Bytes" />
	<meta
		property="og:description"
		content="Bytes are a shorter form of a blog post that is not boring, clear, and concise."
	/>
	<meta property="og:image" content="" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="roopeshsn.com" />
	<meta property="twitter:url" content="https://roopeshsn.com/bytes" />
	<meta name="twitter:title" content="Bytes" />
	<meta
		name="twitter:description"
		content="Bytes are a shorter form of a blog post that is not boring, clear, and concise."
	/>
	<meta name="twitter:image" content="" />
</svelte:head>

<div class="mt-8">
	<h1 class="text-xl md:text-2xl">Bytes</h1>
	<p class="text-gray-600">
		Bytes are a shorter form of a blog post that is not boring, clear, and concise. Also I write on <a
			href="https://roopesh.hashnode.dev/"
			target="_blank"
			rel="noopener noreferrer"
			class="text-blue-900 underline">Hashnode</a
		>.
	</p>
	<ul class="mt-4">
		{#each data.res as byte}
			<li class="px-4 py-4 mb-2 rounded-md border-2 border-gray-200 border-solid hover:shadow">
				<Byte
					path={byte.path}
					title={byte.meta.title}
					summary={byte.meta.summary}
					createdAt={byte.meta.createdAt}
				/>
			</li>
		{/each}
	</ul>
</div>
