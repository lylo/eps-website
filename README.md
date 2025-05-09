[![Netlify Status](https://api.netlify.com/api/v1/badges/1bee523f-f5bd-4bb4-9bc7-e69011e5f75b/deploy-status)](https://app.netlify.com/sites/eps-website/deploys)

# Edinburgh Photographic Society Website

This is a test website for Edinburgh Photographic Society built with [11ty](https://www.11ty.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Decap CMS](https://decapcms.org/).

You can view it at [https://eps-website.netlify.app](https://eps-website.netlify.app).

## Project Structure

```
/
├── _site/                  # Generated site output
├── admin/                  # Decap CMS admin interface
├── src/                    # Source files (page and post content)
│   ├── _data/              # Global data files
│   ├── _includes/          # Templates and components
│   │   ├── layouts/        # Page layouts
│   │   ├── partials/       # Reusable components
│   ├── assets/             # CSS, images, other assets
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

This will run the site at http://localhost:8080 with live reloading.

## Building for Production

To build the site for production:

```bash
npm run build
```

This generates the static site in the `_site` directory.

## Deploying to Netlify

This site is configured to be deployed to Netlify. The `netlify.toml` file contains the configuration for the build process.

### Decap CMS

The CMS is available at `/admin/`. It requires a Github account for authentication.

## License

Copyright © Edinburgh Photographic Society
