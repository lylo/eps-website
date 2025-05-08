#!/usr/bin/env node

const fs = require('fs');

const path = require('path');
const contentDir = path.join(__dirname, '../content');

// Get all standalone v2 markdown files 
const standaloneFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('-v2.md'))
  .map(file => path.join(contentDir, file));

console.log(`Found ${standaloneFiles.length} standalone -v2.md files`);

standaloneFiles.forEach(filePath => {
  const fileName = path.basename(filePath, '.md');
  const dirPath = path.join(contentDir, fileName);
  const indexPath = path.join(dirPath, 'index.md');
  
  // Check if there's a corresponding directory with the same name
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`Directory exists for ${fileName}`);
    
    // Check if the directory already has an index.md
    if (fs.existsSync(indexPath)) {
      console.log(`  Index file already exists for ${fileName}, removing standalone file`);
      fs.unlinkSync(filePath);
    } else {
      console.log(`  Creating index.md for ${fileName} from standalone file`);
      
      // Create directory structure if needed
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Move the file to the directory as index.md
      fs.copyFileSync(filePath, indexPath);
      fs.unlinkSync(filePath);
    }
  } else {
    // No existing directory, create one and move the file to it
    console.log(`Creating directory for ${fileName}`);
    fs.mkdirSync(dirPath, { recursive: true });
    
    // Move the file to the directory as index.md
    fs.copyFileSync(filePath, indexPath);
    fs.unlinkSync(filePath);
  }
});

console.log('Cleanup completed successfully!');
