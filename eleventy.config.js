export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Keep single line breaks as line breaks, like the editor preview.
  eleventyConfig.amendLibrary("md", (md) => md.set({ breaks: true, html: true, linkify: true }));

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("niceDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readMins", (s) =>
    Math.max(1, Math.round(String(s || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length / 230))
  );
  eleventyConfig.addFilter("excerpt", (html) => {
    const m = String(html || "").match(/<p>([\s\S]*?)<\/p>/);
    const text = (m ? m[1] : "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return text.length > 200 ? text.slice(0, 197).replace(/\s+\S*$/, "").replace(/[,;:\s]+$/, "") + "…" : text;
  });
  eleventyConfig.addFilter("cleanTags", (tags) =>
    (Array.isArray(tags) ? tags : tags ? [tags] : [])
      .map((t) => String(t).replace(/^#/, "").trim().toLowerCase())
      .filter(Boolean)
  );
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return { dir: { input: "src", output: "_site", includes: "_includes" }, markdownTemplateEngine: false };
}
