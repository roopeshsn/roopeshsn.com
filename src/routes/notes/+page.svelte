<script>
	import Note from '$lib/note.svelte';
	export let data;
</script>

<svelte:head>
	<title>Notes</title>
	<meta
		name="description"
		content="Notes are rough and short"
	/>
	<meta name="keywords" content="notes" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://roopeshsn.com/notes" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Notes" />
	<meta
		property="og:description"
		content="Notes are rough and short"
	/>
	<meta property="og:image" content="" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="roopeshsn.com" />
	<meta property="twitter:url" content="https://roopeshsn.com/notes" />
	<meta name="twitter:title" content="Notes" />
	<meta
		name="twitter:description"
		content="Notes are rough and short"
	/>
	<meta name="twitter:image" content="" />
</svelte:head>

<div class="mt-8">
	<h1 class="text-xl md:text-2xl">Notes</h1>
	<p class="text-gray-600">
		Notes are rough and short
	</p>
	<ul class="mt-4">
		{#each data.res as note}
			<li class="px-4 py-4 mb-2 rounded-md border-2 border-gray-200 border-solid hover:shadow">
				<Note
					path={note.path}
					title={note.meta.title}
					summary={note.meta.summary}
					createdAt={note.meta.createdAt}
				/>
			</li>
		{/each}
	</ul>
</div>
