// Applies to every page in src/: output "about.html" as "/about.html"
// instead of Eleventy's default "/about/index.html", so the site's URLs
// stay exactly the same as before the conversion.
export default {
  permalink: (data) => `${data.page.filePathStem}.html`,
};
