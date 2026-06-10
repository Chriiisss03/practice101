# Interactive Courting Confession Website

A playful, interactive one-page confession website that tells a multi-step admiration story and ends with a heartfelt question:

Can I court you?

## Features

- Multi-step admiration story flow with progress tracking
- Personalized names for both people
- Final decision section with two response paths
- Extra interactive "spark admiration" prompt generator
- Local persistence using browser localStorage
- Mobile-responsive layout and reduced-motion support
- Static, hosted-ready setup (works great with GitHub Pages)

## Run Locally

1. Open `index.html` in your browser.

No build tools or package installs required.

## Customize

1. Open `app.js`.
2. Edit default names in `state`:
	- `yourName`
	- `herName`
3. Edit story text in the `steps` array.
4. Edit random admiration lines in the `sparks` array.

## Deploy To GitHub Pages

1. Push this repository to GitHub.
2. Go to repository Settings > Pages.
3. Under Build and deployment:
	- Source: Deploy from a branch
	- Branch: `main` (or your active branch) and `/ (root)`
4. Save and wait for deployment.
5. Open the generated Pages URL.

## Files

- `index.html` - Page structure and interactive sections
- `styles.css` - Visual design, responsiveness, and animations
- `app.js` - Story state, transitions, and interaction logic

## Background Music

To enable music playback, place your local MP3 copy of Boo'd Up in the project root (same folder as `index.html`) using this filename:

- `Boo'd Up - Ella Mai.mp3`

Fallback filename also supported:

- `music.mp3`

When the greeting screen is clicked, the page tries to start the music. You can also use the Play/Pause button in the hero section.