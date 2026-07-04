import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-relative links (/page.html, /css/style.css) to include
  // the path prefix when the site lives at username.github.io/repo-name.
  // The prefix is passed in by the GitHub Actions workflow automatically;
  // locally it defaults to "/" so nothing changes.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Copy CSS and JS through to the built site unchanged.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Lets you use Nunjucks ({{ ... }}, {% ... %}) inside .html files.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
