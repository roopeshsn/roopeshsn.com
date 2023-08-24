<script>
	import Byte from '$lib/byte.svelte';
	export let data;
</script>

<div class="mt-8">
	<h1 class="text-xl md:text-2xl">Bytes</h1>
	<p class="text-gray-600">
		Bytes are a shorter form of a blog post that is not boring, clear, and concise.
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
