const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Configuration - use absolute paths
const wpDir = path.join(__dirname, '..', 'wp');
const outputDir = path.join(__dirname, '..', 'content');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Patterns to remove
const navigationRegex = /(?:<nav[\s\S]*?<\/nav>)|(?:<div class="(?:menu|navigation)[\s\S]*?<\/div>)/gi;
const cookieRegex = /(?:<div[^>]*cookie[^>]*>[\s\S]*?<\/div>)|(?:<div class="cookie[\s\S]*?<\/div>)/gi;
const headerFooterRegex = /(?:<header[\s\S]*?<\/header>)|(?:<footer[\s\S]*?<\/footer>)/gi;

// Check if a file is likely binary
function isBinaryFile(buffer) {
  // Check for common PDF signature
  if (buffer.indexOf('%PDF-') === 0) {
    return true;
  }

  // Check for null bytes which typically indicate binary content
  return buffer.includes('\0');
}

// Process a file
async function processFile(filePath, outputPath) {
  try {
    // Read the original file
    const buffer = await readFile(filePath);

    // Skip binary files
    const content = buffer.toString('utf8');
    if (isBinaryFile(content)) {
      console.log(`Skipping binary file: ${filePath}`);
      return;
    }

    // Check if the file has frontmatter
    let cleanedContent = content;
    let frontmatter = '';

    // Extract existing frontmatter if available
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (frontmatterMatch) {
      frontmatter = frontmatterMatch[0];
      cleanedContent = content.replace(frontmatterMatch[0], '');
    } else {
      // Add default frontmatter
      const fileName = path.basename(filePath, path.extname(filePath));
      const title = fileName.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      frontmatter = `---
layout: page.njk
title: ${title}
---
`;
    }

    // Clean up the content
    cleanedContent = cleanedContent
      .replace(navigationRegex, '')
      .replace(cookieRegex, '')
      .replace(headerFooterRegex, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .trim();

    // Write the cleaned file
    const finalContent = `${frontmatter}${cleanedContent}`;
    await writeFile(outputPath, finalContent, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
  }
}

// Process a directory recursively
async function processDirectory(dirPath, outputBase) {
  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await stat(filePath);

      // Create relative path for output
      const relativePath = path.relative(wpDir, dirPath);
      const outputDirFull = path.join(outputDir, relativePath);

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDirFull)) {
        fs.mkdirSync(outputDirFull, { recursive: true });
      }

      if (stats.isDirectory()) {
        // Process subdirectory
        await processDirectory(filePath, outputBase);
      } else if (stats.isFile() && (file.endsWith('.md') || file.endsWith('.markdown'))) {
        // Skip files that appear to be PDF files renamed with .md extension
        if (file.endsWith('.pdf.md')) {
          console.log(`Skipping likely PDF file: ${filePath}`);
          continue;
        }

        // Process markdown file
        const outputPath = path.join(outputDirFull, file);
        await processFile(filePath, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
  }
}

// Start processing
async function startProcessing() {
  console.log('Starting to process WordPress markdown files...');
  console.log(`Source directory: ${wpDir}`);
  console.log(`Output directory: ${outputDir}`);

  if (!fs.existsSync(wpDir)) {
    console.error(`Error: WordPress directory not found at ${wpDir}`);
    return;
  }

  await processDirectory(wpDir, wpDir);
  console.log('Finished processing all files!');
}

startProcessing();