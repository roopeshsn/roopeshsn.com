<script>
	export let data;
</script>

<h1>Bytes</h1>
<ul class="mt-4">
	{#each data.res as byte}
		<li class="px-4 py-4 mb-2 rounded-md border-2 border-gray-200 border-solid hover:shadow">
			<header class="text-xl">
				<a href={byte.path}>
					{byte.meta.title}
				</a>
			</header>
			<p>{byte.meta.summary}</p>
			<footer>Published {byte.meta.createdAt}</footer>
		</li>
	{/each}
</ul>
