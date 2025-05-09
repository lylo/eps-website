import { parse as csvParse } from "csv-parse/sync";
import registerCollections from "./src/_11ty/collections.js";

export default function(eleventyConfig) {
  // Add passthrough copy for assets
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/styles");

  // Copy admin folder
  eleventyConfig.addPassthroughCopy({ "./admin": "./admin" });

  // Add basic filters
  eleventyConfig.addFilter("dateToISO", function(date) {
    if (!date) return '';
    const dateObj = (date instanceof Date) ? date : new Date(date);
    return dateObj.toISOString().split('.')[0] + 'Z';
  });
  
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    if (!url) return base;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    const urlPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${urlPath}`;
  });
  
  eleventyConfig.addFilter("split", function(string, delimiter) {
    if (!string) return [];
    return string.split(delimiter);
  });
  
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  // Register collections
  registerCollections(eleventyConfig);

  // Watch CSS files for changes
  eleventyConfig.addWatchTarget("./src/assets/styles/");

  // Browser Sync config - add parameters to fix live reload
  eleventyConfig.setBrowserSyncConfig({
    files: [
      './_site/assets/styles/styles.css',
      './src/assets/styles/styles.css'
    ],
    open: true,
    ghostMode: false,
    ui: false,
    notify: true
  });

  // Add CSV support
  eleventyConfig.addDataExtension("csv", contents => {
    return csvParse(contents, {
      columns: true,
      skip_empty_lines: true
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};