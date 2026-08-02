import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";

// Used by the "mdInline" filter below so front-matter fields can contain
// Markdown. `html: true` keeps any existing raw HTML in those fields working.
const md = markdownIt({ html: true });

export default function (eleventyConfig) {
  // Lets front-matter fields like `lead` and `cta` use Markdown (**bold**,
  // *italics*, links). Front matter never passes through the Markdown parser
  // on its own, so without this, "**bold**" shows up as literal asterisks.
  // renderInline skips the wrapping <p> tag, since page.njk already adds one.
  eleventyConfig.addFilter("mdInline", (value) =>
    value ? md.renderInline(value) : ""
  );

  // Rewrites root-relative links (/page.html, /css/style.css) to include
  // the path prefix when the site lives at username.github.io/repo-name.
  // The prefix is passed in by the GitHub Actions workflow automatically;
  // locally it defaults to "/" so nothing changes.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Copy CSS and JS through to the built site unchanged.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Copy the Decap CMS admin panel (src/admin/index.html + config.yml)
  // straight through to /admin/ on the built site.
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // The admin folder is copied verbatim above, so stop Eleventy from also
  // treating admin/index.html as a Nunjucks template and writing the same
  // file a second time.
  eleventyConfig.ignores.add("src/admin/**");

  // Copy all images through: facility photos you add to src/images/, plus
  // anything staff upload via the CMS media library into src/images/uploads/.
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

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
