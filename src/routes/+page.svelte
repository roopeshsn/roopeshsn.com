<script>
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

<div>
	<div class="mt-8">
		<h1 class="text-xl md:text-2xl">Welcome to one of my leased spaces on the Internet!</h1>
		<div class="mt-4">
			<h2 class="text-md md:text-xl">Hi! My name is Roopesh Saravanan.</h2>
			<ul>
				<li>I am a recent graduate in electrical and electronics engineering.</li>
				<li>
					I am passionate about both Hardware and Software engineering, particularly in Embedded
					Systems, Computer Networking, Cloud, and the Web.
				</li>
			</ul>
		</div>
	</div>

	<div class="mt-8">
		<h2 class="text-md md:text-lg">Recent Bytes</h2>
		<ul class="mt-4">
			{#each recentBytes as byte}
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
	</div>
</div>
