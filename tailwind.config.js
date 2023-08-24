/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			screens: {
				sm: '640px',
				md: '768px',
				lg: '768px',
				xl: '768px',
				'2xl': '768px'
			}
		},
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
};
