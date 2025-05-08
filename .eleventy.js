import { parse as csvParse } from "csv-parse/sync";

export default function(eleventyConfig) {
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