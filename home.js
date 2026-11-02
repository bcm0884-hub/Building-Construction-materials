// Homepage interactions. Shared header, footer, product and contact modals live in site.js.

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Page modals opened by [data-open-modal="dialogId"]
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-modal]");
  if (!trigger) return;
  const modal = document.getElementById(trigger.dataset.openModal);
  if (!modal) return;
  const activeModal = trigger.closest("dialog");
  if (activeModal && activeModal.open) activeModal.close();
  modal.showModal();
  const focusTarget = modal.querySelector("input, .modal-close");
  if (focusTarget) focusTarget.focus();
});

document.querySelectorAll("dialog.site-modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
});

// Scroll reveal
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Count-up stats
function countUp(element) {
  const target = Number(element.dataset.count);
  const start = "plain" in element.dataset ? target - 40 : 0;
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((counter) => counterObserver.observe(counter));
}

// Tabs
document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const tabButtons = [...tabs.querySelectorAll('[role="tab"]')];

  const selectTab = (selected) => {
    tabButtons.forEach((tab) => {
      const isSelected = tab === selected;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
    });
  };

  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      tabButtons[nextIndex].focus();
      selectTab(tabButtons[nextIndex]);
    });
  });
});

// Cement bag calculator
// Bags = wet volume × dry-volume factor × cement share of mix × 1440 kg/m³ ÷ 50 kg.
const calculatorTypes = {
  slab: {
    label: "Concrete slab",
    fields: [
      { name: "length", label: "Length (m)", value: 4 },
      { name: "width", label: "Width (m)", value: 3 },
      { name: "thickness", label: "Thickness (mm)", value: 150 },
    ],
    mixes: [
      { label: "1 : 2 : 4 (general concrete)", parts: 7 },
      { label: "1 : 1.5 : 3 (stronger concrete)", parts: 5.5 },
      { label: "1 : 3 : 6 (blinding / mass fill)", parts: 10 },
    ],
    dryFactor: 1.54,
    volume: ({ length, width, thickness }) => length * width * (thickness / 1000),
  },
  plaster: {
    label: "Plaster",
    fields: [
      { name: "length", label: "Wall length (m)", value: 10 },
      { name: "height", label: "Wall height (m)", value: 2.7 },
      { name: "thickness", label: "Thickness (mm)", value: 15 },
    ],
    mixes: [
      { label: "1 : 4 (external plaster)", parts: 5 },
      { label: "1 : 6 (internal plaster)", parts: 7 },
    ],
    dryFactor: 1.27,
    volume: ({ length, height, thickness }) => length * height * (thickness / 1000),
  },
  blockwork: {
    label: "Blockwork",
    fields: [
      { name: "length", label: "Wall length (m)", value: 10 },
      { name: "height", label: "Wall height (m)", value: 2.7 },
      { name: "joint", label: "Mortar per m² (m³)", value: 0.022 },
    ],
    mixes: [
      { label: "1 : 4 (structural walls)", parts: 5 },
      { label: "1 : 6 (partition walls)", parts: 7 },
    ],
    dryFactor: 1.33,
    volume: ({ length, height, joint }) => length * height * joint,
  },
};

let calculatorCount = 0;

function renderCalculator(container) {
  const id = `calc${++calculatorCount}`;
  container.innerHTML = `
    <form class="calc-form" novalidate>
      <fieldset class="calc-type">
        <legend>What are you building?</legend>
        ${Object.entries(calculatorTypes)
          .map(
            ([key, type], index) => `
          <label><input type="radio" name="${id}-type" value="${key}"${index === 0 ? " checked" : ""} /><span>${type.label}</span></label>`,
          )
          .join("")}
      </fieldset>
      <div class="calc-fields"></div>
      <label class="calc-mix" for="${id}-mix">Mix ratio (cement : sand : ballast)
        <select id="${id}-mix"></select>
      </label>
      <div class="calc-result" aria-live="polite">
        <strong data-bags>0</strong>
        <p data-summary></p>
      </div>
      <p class="form-note">Rough estimate only, including 5% for waste. Confirm with your contractor or engineer.</p>
    </form>`;

  const form = container.querySelector("form");
  const fieldsWrap = form.querySelector(".calc-fields");
  const mixSelect = form.querySelector("select");
  const bagsOutput = form.querySelector("[data-bags]");
  const summaryOutput = form.querySelector("[data-summary]");

  const currentType = () => calculatorTypes[form.querySelector(`input[name="${id}-type"]:checked`).value];

  const calculate = () => {
    const type = currentType();
    const values = {};
    type.fields.forEach((field) => {
      values[field.name] = Math.max(0, parseFloat(form.querySelector(`[name="${field.name}"]`).value) || 0);
    });
    const wetVolume = type.volume(values);
    const parts = Number(mixSelect.value);
    const cementKg = ((wetVolume * type.dryFactor) / parts) * 1440 * 1.05;
    const bags = Math.ceil(cementKg / 50);
    bagsOutput.textContent = bags;
    summaryOutput.innerHTML = `<b>${bags === 1 ? "bag" : "bags"} of 50 kg Simba Cement</b><br />for about ${wetVolume.toFixed(2)} m³ of ${type.label.toLowerCase()} ${type === calculatorTypes.slab ? "concrete" : "mortar"}.`;
  };

  const buildFields = () => {
    const type = currentType();
    fieldsWrap.innerHTML = type.fields
      .map(
        (field) => `
      <label for="${id}-${field.name}">${field.label}
        <input id="${id}-${field.name}" name="${field.name}" type="number" min="0" step="any" inputmode="decimal" value="${field.value}" />
      </label>`,
      )
      .join("");
    mixSelect.innerHTML = type.mixes.map((mix) => `<option value="${mix.parts}">${mix.label}</option>`).join("");
    calculate();
  };

  form.addEventListener("change", (event) => {
    if (event.target.type === "radio") buildFields();
    else calculate();
  });
  form.addEventListener("input", calculate);
  form.addEventListener("submit", (event) => event.preventDefault());
  buildFields();
}

document.querySelectorAll("[data-calculator]").forEach(renderCalculator);

// Builder tips slider
const sliderTrack = document.querySelector("[data-slider]");

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!sliderTrack) return;
    const card = sliderTrack.querySelector(".tip-card");
    const step = card ? card.offsetWidth + 20 : 300;
    const atEnd = sliderTrack.scrollLeft + sliderTrack.clientWidth >= sliderTrack.scrollWidth - 5;
    const atStart = sliderTrack.scrollLeft <= 5;

    if (button.dataset.slide === "next") {
      sliderTrack.scrollTo({ left: atEnd ? 0 : sliderTrack.scrollLeft + step });
    } else {
      sliderTrack.scrollTo({ left: atStart ? sliderTrack.scrollWidth : sliderTrack.scrollLeft - step });
    }
  });
});

// Office search
const officeSearch = document.querySelector("[data-office-search]");

if (officeSearch) {
  const officeCards = document.querySelectorAll("[data-office-list] .office-card");
  const emptyMessage = document.querySelector("[data-office-empty]");

  officeSearch.addEventListener("input", () => {
    const query = officeSearch.value.trim().toLowerCase();
    let visibleCount = 0;
    officeCards.forEach((card) => {
      const matches = !query || card.dataset.town.includes(query) || card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visibleCount++;
    });
    emptyMessage.hidden = visibleCount > 0;
  });
}

// Back to top
const backToTop = document.querySelector("[data-back-to-top]");

if (backToTop) {
  window.addEventListener(
    "scroll",
    () => backToTop.classList.toggle("is-visible", window.scrollY > 700),
    { passive: true },
  );
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
}
