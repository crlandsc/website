# Christopher Landschoot - Personal Website

This repository contains the code for Christopher Landschoot's personal website. It is a single-page static site that showcases Christopher's profile, work, projects, research, skills, interests, and contact information.

## Features

- Fully responsive design for all device sizes
- Static site friendly (no backend required)
- Uses vanilla HTML, CSS, and JavaScript (no frameworks)
- Easy to maintain with all content in one JSON file
- GitHub integration for project stats
- Smooth animations and transitions
- Accessibility-friendly

## Local Development

To run the site locally, you can use any local server. One easy option is to use `npx serve`:

1. Make sure you have Node.js installed
2. Clone this repository
3. Run the following command in the root directory:

```bash
npx serve
```

This will start a local server, typically at `http://localhost:3000`.

## Directory Structure

```
/
├─ index.html             # Main HTML file
├─ css/style.css          # All styles
├─ js/main.js             # JavaScript functionality
├─ assets/                # Images and media
│   ├─ hero.jpg
│   ├─ profile.jpg
│   └─ interests/         # Carousel images
├─ content.json           # All website content
├─ .github/workflows/     # GitHub Actions
│   └─ build-and-deploy.yml
└─ README.md
```

## Maintenance

To update the website:

1. Edit `content.json` to update text content
2. Replace images in the `assets` directory as needed
3. Commit and push changes to the `main` branch
4. GitHub Actions will automatically deploy to GitHub Pages

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch. The deployment workflow is defined in `.github/workflows/build-and-deploy.yml`.

To set up custom domain:

1. Add a CNAME record at your domain registrar pointing to `username.github.io`
2. Add a file named `CNAME` in the root with your domain name

## Browser Support

The website is tested and works in the latest versions of:
- Chrome
- Firefox
- Safari
- Edge

## Performance

The website is optimized for performance:
- Minimal JavaScript
- Optimized images
- No external dependencies
- Lazy loading for non-critical content

## License

All rights reserved. 