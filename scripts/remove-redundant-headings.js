const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to walk through directories recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Main function to process all markdown files
function processMarkdownFiles() {
  const srcDir = path.join(__dirname, '..', 'src');
  let filesProcessed = 0;
  let filesModified = 0;

  // Walk through all directories in src
  walkDir(srcDir, (filePath) => {
    // Skip files in the root src directory
    if (path.dirname(filePath) === srcDir) {
      return;
    }

    // Only process markdown files
    if (path.extname(filePath) === '.md') {
      filesProcessed++;
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Skip if there's no title in frontmatter
        if (!data.title) return;

        // Check if content starts with an h2 heading
        const contentLines = content.trim().split('\n');
        if (contentLines.length > 0) {
          const firstLine = contentLines[0].trim();

          // Check if first line is an H2 heading
          if (firstLine.startsWith('## ')) {
            const headingText = firstLine.replace('## ', '').trim();

            // If heading text matches title in frontmatter, remove it
            if (headingText === data.title) {
              console.log(`Removing heading from ${filePath}`);

              // Remove the heading line and any blank lines that follow
              let i = 1;
              while (i < contentLines.length && contentLines[i].trim() === '') {
                i++;
              }

              const newContent = contentLines.slice(i).join('\n');

              // Recompose the file with frontmatter and modified content
              const newFileContent = matter.stringify(newContent, data);

              // Write the modified content back to the file
              fs.writeFileSync(filePath, newFileContent);
              filesModified++;
            }
          }
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  });

  console.log(`Processed ${filesProcessed} markdown files`);
  console.log(`Modified ${filesModified} files by removing redundant headings`);
}

// Execute the main function
processMarkdownFiles();