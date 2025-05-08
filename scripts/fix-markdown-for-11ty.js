// This script processes all markdown files in the src directory to convert them to proper 11ty format
// It removes WordPress navigation, cookie notices, and adds proper front matter

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Helper function to extract title from content
function extractTitle(content) {
  // Try to find a heading (h1, h2, h3) in the content
  const headingMatch = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i) ||
                      content.match(/^##?\s+(.+)$/m);

  if (headingMatch && headingMatch[1]) {
    // Remove any HTML tags from the title
    return headingMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // If no heading found, try to use the first significant text
  const paragraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
  if (paragraphMatch && paragraphMatch[1]) {
    // Take the first few words as the title
    const words = paragraphMatch[1].replace(/<[^>]+>/g, '').trim().split(' ');
    return words.slice(0, Math.min(words.length, 5)).join(' ') + '...';
  }

  // Fallback to using folder name as title
  return path.basename(path.dirname(filepath)).replace(/-v2$/, '').replace(/-/g, ' ');
}

// Process a single markdown file
function processMarkdownFile(filepath) {
  console.log(`Processing ${filepath}`);

  let content = fs.readFileSync(filepath, 'utf8');

  // Skip files that already have 11ty front matter
  if (content.startsWith('---\nlayout:')) {
    console.log(`  Already has front matter, skipping: ${filepath}`);
    return;
  }

  // Extract the main content section - everything between the navigation and footer/cookie sections
  let mainContent = '';

  // Find the main content by looking for the first heading or significant content
  const contentMatch = content.match(/##\s+([^\n]+)([\s\S]*?)(?:©|Cookie policy|<\/article>|<footer>|Manage consent)/i);

  if (contentMatch) {
    // Extract the title and content
    const sectionTitle = contentMatch[1].trim();
    const sectionContent = contentMatch[2].trim();

    mainContent = `<div class="container mx-auto px-4 py-8">
  <div class="prose max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">${sectionTitle}</h1>

    ${sectionContent}

    <p class="text-sm mt-12">©Edinburgh Photographic Society and individual photographers 2025</p>
  </div>
</div>`;
  } else {
    // If we can't find clear markers, just keep the middle part of the file and hope for the best
    const lines = content.split('\n');
    // Skip the first 50 lines (typically navigation) and the last 50 lines (typically footer/cookie consent)
    const relevantLines = lines.slice(50, lines.length - 50);
    mainContent = relevantLines.join('\n');
  }

  // Fix image paths from /images/ to /assets/images/
  mainContent = mainContent.replace(/src="\/?images\//g, 'src="/assets/images/');

  // Extract title for front matter
  const title = extractTitle(mainContent);

  // Create the front matter
  const pagePath = filepath.replace('/Users/olly/dev/eps-static/src/', '').replace('/index.md', '');
  const frontMatter = `---
layout: base.njk
title: ${title}
description: Edinburgh Photographic Society - ${title}
---\n\n`;

  // Write the processed file
  fs.writeFileSync(filepath, frontMatter + mainContent);
  console.log(`  Updated: ${filepath}`);
}

// Find all markdown files in the src directory
async function processAllFiles() {
  try {
    const files = await glob('src/**/*.md', { cwd: '/Users/olly/dev/eps-static/' });

    console.log(`Found ${files.length} markdown files to process`);

    // Process each file
    files.forEach(file => {
      try {
        processMarkdownFile(path.join('/Users/olly/dev/eps-static/', file));
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    });

    console.log('Processing complete!');
  } catch (err) {
    console.error('Error finding files:', err);
  }
}

// Run the script
processAllFiles();