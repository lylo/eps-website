const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const collectionsConfig = require('./src/_11ty/collections');

module.exports = function(eleventyConfig) {
  // Add collections
  collectionsConfig(eleventyConfig);

  // Ignore the wp directory to prevent processing binary files
  eleventyConfig.ignores.add("wp/**/*");

  // Add passthrough copy for images and other assets
  eleventyConfig.addPassthroughCopy("./src/css");  // Updated this line to use the correct CSS directory
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./images");
  eleventyConfig.addPassthroughCopy("./admin");

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

  // Extract first image from post content
  eleventyConfig.addFilter("extractFirstImage", (content) => {
    if (!content) return null;
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "src/_includes",
      data: "src/_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};