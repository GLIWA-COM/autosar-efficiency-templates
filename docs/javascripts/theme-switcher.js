/* docs/javascripts/theme-switcher.js */
(() => {
  // CONFIGURATION --------------------------------------------
  // Use root-relative paths (start with /) to avoid 404s on sub-pages
  const PATHS = {
    favicon: {
      light: "assets/Logo_GLIWA_NoName_250x180_black.png",
      dark:  "assets/Logo_GLIWA_NoName_250x180.png"
    },
    logo: {
      light: "assets/Logo_GLIWA_NoName_250x180_black.png",
      dark:  "assets/Logo_GLIWA_NoName_250x180.png"
    }
  };
  // ----------------------------------------------------------

  const updateThemeAssets = () => {
    const scheme = document.body.getAttribute("data-md-color-scheme");
    const isDark = scheme === "slate";

    // 1. Update Favicon
    let faviconLink = document.querySelector("link[rel~='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = isDark ? PATHS.favicon.dark : PATHS.favicon.light;

    // 2. Update Logo
    // Target the image inside the logo container
    const logoImg = document.querySelector(".md-header__button.md-logo img");
    if (logoImg) {
      logoImg.src = isDark ? PATHS.logo.dark : PATHS.logo.light;
    }
  };

  // Run immediately on load
  updateThemeAssets();

  // Watch for theme changes
  const observer = new MutationObserver(updateThemeAssets);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"]
  });
})();