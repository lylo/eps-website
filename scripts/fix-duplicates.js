const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

// Directory containing processed content
const contentDir = path.join(__dirname, '..', 'content');

// Function to find duplicate content files that would result in the same permalink
async function findDuplicatePermalinks() {
  console.log('Checking for duplicate permalinks...');

  // Track files that would generate the same URL
  const urlMap = new Map();
  const duplicates = [];

  // Helper function to generate the expected URL for a file
  function getExpectedUrl(filePath) {
    // Handle index.md files
    if (path.basename(filePath) === 'index.md') {
      const dirName = path.dirname(filePath);
      return path.relative(contentDir, dirName);
    }

    // Handle regular .md files
    const parsedPath = path.parse(filePath);
    const relativePath = path.relative(contentDir, parsedPath.dir);
    return path.join(relativePath, parsedPath.name);
  }

  // Recursively scan all .md files in content directory
  async function scanDirectory(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const expectedUrl = getExpectedUrl(fullPath);

        if (urlMap.has(expectedUrl)) {
          duplicates.push({
            url: expectedUrl,
            files: [urlMap.get(expectedUrl), fullPath]
          });
        } else {
          urlMap.set(expectedUrl, fullPath);
        }
      }
    }
  }

  await scanDirectory(contentDir);
  return duplicates;
}

// Function to resolve duplicate permalinks
async function resolveDuplicatePermalinks(duplicates) {
  console.log(`Found ${duplicates.length} duplicate permalinks to resolve.`);

  for (const dup of duplicates) {
    console.log(`\nResolving conflict for URL: ${dup.url}`);
    console.log(`Files involved: \n  1. ${dup.files[0]}\n  2. ${dup.files[1]}`);

    // Strategy: For now, we'll keep the index.md file and add custom permalink to the other
    // or if both are non-index files, we'll keep the first and remove the second

    // Check if one of the files is an index.md
    const file1IsIndex = path.basename(dup.files[0]) === 'index.md';
    const file2IsIndex = path.basename(dup.files[1]) === 'index.md';

    if (file1IsIndex && !file2IsIndex) {
      // Keep file1 (index.md), remove file2
      console.log(`Keeping index file (${dup.files[0]}) and removing ${dup.files[1]}`);
      await unlink(dup.files[1]);
    } else if (!file1IsIndex && file2IsIndex) {
      // Keep file2 (index.md), remove file1
      console.log(`Keeping index file (${dup.files[1]}) and removing ${dup.files[0]}`);
      await unlink(dup.files[0]);
    } else {
      // Either both are index files or neither is an index file
      // In this case, keep the first one and remove the second
      console.log(`Keeping ${dup.files[0]} and removing ${dup.files[1]}`);
      await unlink(dup.files[1]);
    }
  }
}

// Main function
async function main() {
  try {
    const duplicates = await findDuplicatePermalinks();
    if (duplicates.length > 0) {
      await resolveDuplicatePermalinks(duplicates);
      console.log('\nDuplicate permalinks resolved successfully!');
    } else {
      console.log('No duplicate permalinks found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();