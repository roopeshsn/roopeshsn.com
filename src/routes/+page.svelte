<script>
	import Byte from '$lib/byte.svelte';
	const bytes = [
		{
			title: 'What I learned doing GSoC?',
			createdAt: 'Sun Mar 20 2022 14:43:50 GMT+0530 (India Standard Time)',
			summary: 'What I learned doing GSoC',
			author: 'Roopesh Saravanan',
			path: 'bytes/gsoc-learnings'
		},
		{
			title: 'Create a Quotes API',
			createdAt: 'Sun Mar 20 2022 14:43:50 GMT+0530 (India Standard Time)',
			summary: 'A Quotes API which should refresh for every 5 minutes',
			author: 'Roopesh Saravanan',
			path: 'bytes/quotes-app'
		}
	];
	export let data;
	export const recentBytes = data.res.slice(0, 3);
</script>

<svelte:head>
	<title>roopeshsn.com</title>
	<meta name="description" content="Roopesh Saravanan's portfolio and blog" />
	<meta name="keywords" content="roopeshsn, roopesh saravanan, roopesh, portfolio, blog, bytes" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://roopeshsn.com" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="roopeshsn.com" />
	<meta property="og:description" content="Roopesh Saravanan's portfolio and blog" />
	<meta property="og:image" content="" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="roopeshsn.com" />
	<meta property="twitter:url" content="https://roopeshsn.com" />
	<meta name="twitter:title" content="roopeshsn.com" />
	<meta name="twitter:description" content="Roopesh Saravanan's portfolio and blog" />
	<meta name="twitter:image" content="" />
</svelte:head>

<div>
	<div class="mt-8">
		<h1 class="text-xl md:text-2xl">Welcome to one of my leased spaces on the Internet!</h1>
		<div class="mt-4">
			<p>
				Hi! My name is Roopesh Saravanan. I work as a network consulting engineer at Cisco. I am
				passionate about hardware and software engineering, particularly embedded systems,
				networking, cloud-native, and the web. Find me on <a
					href="https://github.com/roopeshsn"
					class="text-blue-900 underline"
					target="_blank"
					rel="noopener noreferrer">GitHub</a
				>,
				<a
					href="https://linkedin.com/in/roopeshsn"
					class="text-blue-900 underline"
					target="_blank"
					rel="noopener noreferrer">LinkedIn</a
				>, and
				<a
					href="https://twitter.com/roopeshsn"
					class="text-blue-900 underline"
					target="_blank"
					rel="noopener noreferrer">Twitter</a
				>.
			</p>
		</div>
	</div>

	<div class="mt-8">
		<h2 class="text-xl md:text-xl">Recent Bytes</h2>
		<p class="text-gray-600">
			Bytes are a shorter form of a blog post that is not boring, clear, and concise.
		</p>
		<ul class="my-4">
			{#each recentBytes as byte}
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
		<div class="flex justify-end items-center">
			<a class="text-gray-600 text-sm hover:underline" href="/bytes">More...</a>
		</div>
	</div>
</div>
