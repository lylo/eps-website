module.exports = function(eleventyConfig) {
  // Get all posts for announcements
  eleventyConfig.addCollection("announcements", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/announcement/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Get latest 5 announcements for homepage and sidebar
  eleventyConfig.addCollection("latestAnnouncements", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/announcement/**/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  });

  // Group pages
  eleventyConfig.addCollection("groups", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/groups-v2/**/*.md");
  });

  // Exhibition pages
  eleventyConfig.addCollection("exhibitions", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/exhibitions-v2/**/*.md");
  });

  // Competition pages
  eleventyConfig.addCollection("competitions", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "content/competitions-v2/**/*.md",
      "content/competitions-v2-2/**/*.md",
      "content/competition-results/**/*.md"
    ]);
  });

  // About pages
  eleventyConfig.addCollection("about", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "content/about/**/*.md",
      "content/about-eps-v2/**/*.md"
    ]);
  });

  // Membership pages
  eleventyConfig.addCollection("membership", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/membership-v2/**/*.md");
  });
};