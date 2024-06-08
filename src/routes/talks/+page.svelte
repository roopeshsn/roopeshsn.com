<script>
	import Talk from '$lib/talk.svelte';
	export let data;
</script>

<svelte:head>
	<title>Talks</title>
	<meta name="description" content="Talks by Roopesh Saravanan" />
	<meta name="keywords" content="talks" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://roopeshsn.com/talks" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Talks" />
	<meta property="og:description" content="Talks by Roopesh Saravanan" />
	<meta property="og:image" content="" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="roopeshsn.com" />
	<meta property="twitter:url" content="https://roopeshsn.com/talks" />
	<meta name="twitter:title" content="Talks" />
	<meta name="twitter:description" content="Talks by Roopesh Saravanan" />
	<meta name="twitter:image" content="" />
</svelte:head>

<div class="mt-8">
	<h1 class="text-xl md:text-2xl">Talks</h1>
	<p class="text-gray-600">Talks I gave.</p>
	<ul class="mt-4">
		{#each data.res as talk}
			<li class="px-4 py-4 mb-2 rounded-md border-2 border-gray-200 border-solid hover:shadow">
				<Talk
					path={talk.path}
					title={talk.meta.title}
					summary={talk.meta.summary}
					createdAt={talk.meta.createdAt}
				/>
			</li>
		{/each}
	</ul>
</div>
