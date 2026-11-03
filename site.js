const headerContainer = document.querySelector("#siteHeader");
const footerContainer = document.querySelector("#siteFooter");

if (headerContainer) {
  headerContainer.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="Simba Cement home">
          <span class="brand-mark" aria-hidden="true">SC</span>
          <span class="brand-text"><strong>Simba Cement</strong><small>Dispatch &amp; supply</small></span>
        </a>
        <button
          class="menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-controls="primaryNav"
          aria-expanded="false"
        >
          <span></span>
        </button>
        <nav class="primary-nav" id="primaryNav" aria-label="Main navigation">
          <a href="index.html" data-nav="index.html">Home</a>
          <a href="products.html" data-nav="products.html">Products</a>
          <a href="about.html" data-nav="about.html">About Us</a>
          <a href="news.html" data-nav="news.html">News Room</a>
          <a href="downloads.html" data-nav="downloads.html">Downloads</a>
          <a class="nav-phone" href="tel:+254726866998"><span aria-hidden="true">☎</span> 0726 866 998</a>
          <a class="button button-gold" href="contact.html" data-nav="contact.html">Contact Us</a>
        </nav>
      </div>
    </header>
  `;
}

if (footerContainer) {
  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand-block">
            <a class="brand" href="index.html" aria-label="Simba Cement home">
          <span class="brand-mark" aria-hidden="true">SC</span>
          <span class="brand-text"><strong>Simba Cement</strong><small>Dispatch &amp; supply</small></span>
        </a>
            <p class="footer-about">Simba Cement 32.5R and Simba Power 42.5N for builders, contractors and hardware stores. Call or WhatsApp Micheal on 0726 866 998 for prices and dispatch.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <nav class="footer-links" aria-label="Footer explore">
              <a href="products.html">Products</a>
              <a href="about.html">About Us</a>
              <a href="news.html">News Room</a>
              <a href="downloads.html">Downloads</a>
            </nav>
          </div>
          <div>
            <h2>Get in touch</h2>
            <div class="footer-links">
              <a href="tel:+254726866998">Call Micheal: 0726 866 998</a>
              <a href="https://wa.me/254726866998" target="_blank" rel="noopener">WhatsApp Micheal</a>
              <a href="contact.html">Full contact details</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© <span data-current-year></span> Simba Cement dispatch. Built by Jayden. Independent supplier, not the official National Cement website.</p>
          <p>Product specifications and availability: confirm with National Cement Company Limited.</p>
        </div>
      </div>
    </footer>
  `;
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const activeNavigationPage = currentPage.startsWith("simba-")
  ? "products.html"
  : currentPage === "build-planning-guide.html"
    ? "downloads.html"
    : currentPage;
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === activeNavigationPage) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primaryNav");

function closeMenu() {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  primaryNav.classList.remove("is-open");
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) closeMenu();
  });
}

const projectSelector = document.querySelector("#projectType");
const projectResult = document.querySelector("#projectResult");

if (projectSelector && projectResult) {
  const projectGuidance = {
    general: "Simba Cement 32.5R is for general-purpose applications. Check that the selected cement meets your project specification.",
    specialist: "Simba Power 42.5N is for specialized construction, including bridges, towers, pavements, highways and high-rise structures. Consult your engineer and project specification.",
    unsure: "Call Micheal on 0726 866 998 for product guidance and confirm the grade with your project engineer before purchase or use.",
  };

  const showProjectGuidance = () => {
    projectResult.textContent = projectGuidance[projectSelector.value];
  };

  projectSelector.addEventListener("change", showProjectGuidance);
  showProjectGuidance();
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openWhatsAppDraft(contactForm);
  });
}

const productModalContent = {
  cement32: {
    title: "Simba Cement 32.5R",
    image: "assets/simba-cement-32-5r.png",
    alt: "Simba Cement 32.5R bag",
    summary: "General-purpose cement with faster drying and settling, high fineness and improved coverage.",
    applications: "Suitable for a wide range of everyday building work.",
    page: "simba-cement-32-5r.html",
    product: "Simba Cement 32.5R",
  },
  power42: {
    title: "Simba Power 42.5N",
    image: "assets/simba-power-42-5n.png",
    alt: "Simba Power 42.5N bag",
    summary: "Cement for specialized construction work requiring high supportive strength.",
    applications: "For bridges, towers, pavements, highways and high-rise structures.",
    page: "simba-power-42-5n.html",
    product: "Simba Power 42.5N",
  },
};

function openWhatsAppDraft(form) {
  const formData = new FormData(form);
  const message = [
    `Hi Micheal, Simba Cement enquiry: ${formData.get("topic")}`,
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    "",
    formData.get("message"),
  ].join("\n");
  window.open(`https://wa.me/254726866998?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function ensureModal() {
  let modal = document.querySelector("#siteModal");
  if (modal) return modal;

  modal = document.createElement("dialog");
  modal.id = "siteModal";
  modal.className = "site-modal";
  modal.setAttribute("aria-labelledby", "siteModalTitle");
  document.body.append(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  modal.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-modal-contact-form]");
    if (!form) return;
    event.preventDefault();
    openWhatsAppDraft(form);
  });

  return modal;
}

function openContactModal(trigger) {
  const modal = ensureModal();
  const product = trigger.dataset.contactProduct || "";
  modal.innerHTML = `
    <div class="modal-panel">
      <button class="modal-close" type="button" aria-label="Close enquiry form" data-modal-close>×</button>
      <span class="eyebrow">Talk to our team</span>
      <h2 id="siteModalTitle">Send an enquiry</h2>
      <p class="modal-intro">Complete the form to open a WhatsApp message to Micheal on the Simba Cement dispatch line, 0726 866 998. Prefer to talk? <a class="text-link" href="tel:+254726866998" style="display:inline-flex">Call now</a></p>
      <form class="contact-form modal-contact-form" data-modal-contact-form>
        <label for="modalContactName">Your name
          <input id="modalContactName" name="name" autocomplete="name" required />
        </label>
        <label for="modalContactPhone">Phone number
          <input id="modalContactPhone" name="phone" type="tel" autocomplete="tel" required />
        </label>
        <label for="modalContactTopic">Enquiry topic
          <select id="modalContactTopic" name="topic" required>
            <option value="Product information"${product ? " selected" : ""}>Product information</option>
            <option value="Sales and availability">Sales and availability</option>
            <option value="Technical support">Technical support</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label for="modalContactMessage">Your message
          <textarea id="modalContactMessage" name="message" required>${product ? `I would like to know more about ${product}.` : ""}</textarea>
        </label>
        <button class="button button-gold" type="submit">Continue on WhatsApp <span class="button-arrow" aria-hidden="true">→</span></button>
        <p class="form-note">Nothing is sent until you press send in WhatsApp.</p>
      </form>
    </div>`;
  modal.showModal();
  modal.querySelector("#modalContactName").focus();
}

function openProductModal(productKey) {
  const product = productModalContent[productKey];
  if (!product) return;

  const modal = ensureModal();
  modal.innerHTML = `
    <div class="modal-panel modal-product">
      <button class="modal-close" type="button" aria-label="Close product details" data-modal-close>×</button>
      <img class="modal-product-image" src="${product.image}" alt="${product.alt}" />
      <div>
        <span class="eyebrow">Simba Cement</span>
        <h2 id="siteModalTitle">${product.title}</h2>
        <p>${product.summary}</p>
        <p><strong>Applications:</strong> ${product.applications}</p>
        <div class="hero-actions">
          <a class="button button-dark" href="${product.page}">Full product details <span class="button-arrow" aria-hidden="true">→</span></a>
          <button class="button button-gold" type="button" data-contact-modal data-contact-product="${product.product}">Ask about this product <span class="button-arrow" aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>`;
  modal.showModal();
  modal.querySelector(".modal-close").focus();
}

document.addEventListener("click", (event) => {
  const closeButton = event.target.closest("[data-modal-close]");
  if (closeButton) {
    closeButton.closest("dialog").close();
    return;
  }

  const contactTrigger = event.target.closest("[data-contact-modal]");
  if (contactTrigger) {
    const activeModal = contactTrigger.closest("dialog");
    if (activeModal && activeModal.open) activeModal.close();
    openContactModal(contactTrigger);
    return;
  }

  const productTrigger = event.target.closest("[data-product-modal]");
  if (productTrigger) openProductModal(productTrigger.dataset.productModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const modal = document.querySelector("#siteModal");
  if (modal && modal.open) modal.close();
});
