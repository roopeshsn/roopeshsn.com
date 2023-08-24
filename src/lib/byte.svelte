<script>
	export let path;
	export let title;
	export let summary;
	export let createdAt;
</script>

<header class="text-xl">
	<a href={path}>
		{title}
	</a>
</header>
<p class="text-gray-600">{summary}</p>
<footer class="text-gray-600 text-sm">Published {createdAt}</footer>
