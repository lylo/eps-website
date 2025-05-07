# Edinburgh Photographic Society Website

This is the website for Edinburgh Photographic Society built with [11ty](https://www.11ty.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Decap CMS](https://decapcms.org/) (previously known as Netlify CMS).

## Project Structure

```
/
├── _site/                  # Generated site output
├── admin/                  # Decap CMS admin interface
├── content/                # Processed markdown content from WP export
├── images/                 # Static images
├── scripts/                # Utility scripts
├── src/                    # Source files
│   ├── _data/              # Global data files
│   ├── _includes/          # Templates and components
│   │   ├── layouts/        # Page layouts
│   │   ├── partials/       # Reusable components
│   ├── assets/             # CSS and other assets
├── wp/                     # Original WordPress markdown exports
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

### Processing Markdown Content

To process the WordPress markdown files and clean them up:

```bash
npm run process-md
```

This script:
- Removes navigation elements
- Removes cookie notices
- Adds proper frontmatter
- Outputs to the `/content` directory

## Building for Production

To build the site for production:

```bash
npm run build
```

This generates the static site in the `_site` directory.

## Deploying to Netlify

This site is configured to be deployed to Netlify. The `netlify.toml` file contains the configuration for the build process.

### Setting up Netlify CMS

1. Deploy the site to Netlify
2. Enable Netlify Identity
3. Enable Git Gateway
4. Invite users to the CMS

The CMS will be available at `/admin/`.

## Features

- **Responsive design** using Tailwind CSS
- **Content management** with Decap CMS
- **Fast build times** with 11ty
- **Optimized images** for better performance
- **Clean, organized templates** for maintainability

## License

Copyright © Edinburgh Photographic Society