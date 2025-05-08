const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const csvParse = require("csv-parse/sync").parse;
const fs = require("fs");

module.exports = function(eleventyConfig) {
  // Add passthrough copy for assets
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/styles");

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

  // Date formatting filter
  eleventyConfig.addFilter("formatDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLLL yyyy");
  });

  // Configure Markdown
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor);
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Extract first image from post content (if needed)
  eleventyConfig.addFilter("extractFirstImage", (content) => {
    if (!content) return null;
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
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