// audit.js — run axe-core accessibility audit when ?audit=1 is present
(function () {
  "use strict";
  if (!location.search.includes("audit=1")) return;
  console.log("Accessibility audit enabled (audit=1) — loading axe-core...");
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.6.3/axe.min.js";
  script.crossOrigin = "anonymous";
  script.onload = async () => {
    try {
      const results = await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      });
      console.group("Axe Accessibility Audit");
      console.log("Violations:", results.violations.length);
      if (results.violations.length) {
        results.violations.forEach((v) => {
          console.groupCollapsed(v.id + " — " + v.nodes.length + " nodes");
          console.log("Description:", v.description);
          console.log("Help:", v.help);
          console.log("Impact:", v.impact);
          v.nodes.forEach((n) => console.log(n.target, n.failureSummary));
          console.groupEnd();
        });
      } else {
        console.log("No accessibility violations for WCAG2A/AA checks.");
      }
      console.groupEnd();
      alert("Accessibility audit completed. See console for details.");
    } catch (err) {
      console.error("Axe run error:", err);
      alert("Accessibility audit failed. Check console for details.");
    }
  };
  script.onerror = () => {
    console.error("Failed to load axe-core from CDN.");
    alert("Failed to load axe-core. Ensure network access to CDN.");
  };
  document.head.appendChild(script);
})();
