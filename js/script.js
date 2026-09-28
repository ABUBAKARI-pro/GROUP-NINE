document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initMenuFilter();
  initFormValidation();
  initSlider();
});

// 1. Hamburger navigation: opens/closes the mobile menu.
function initHamburger() {
  const button = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

// 2. Menu filter: compares each card's data-category with the selected filter.
function initMenuFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".menu-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

// 3. Live form validation: shows feedback beside each offending field.
function initFormValidation() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const fields = {
    name: {
      input: document.querySelector("#name"),
      error: document.querySelector("#name-error"),
      check: value => value.trim().length >= 2 ? "" : "Please enter at least 2 characters."
    },
    email: {
      input: document.querySelector("#email"),
      error: document.querySelector("#email-error"),
      check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address."
    },
    phone: {
      input: document.querySelector("#phone"),
      error: document.querySelector("#phone-error"),
      check: value => /^[+0-9 ()-]{7,}$/.test(value.trim()) ? "" : "Enter a valid phone number."
    },
    guests: {
      input: document.querySelector("#guests"),
      error: document.querySelector("#guests-error"),
      check: value => Number(value) >= 1 && Number(value) <= 30 ? "" : "Guests must be between 1 and 30."
    },
    message: {
      input: document.querySelector("#message"),
      error: document.querySelector("#message-error"),
      check: value => value.trim().length >= 10 ? "" : "Please enter at least 10 characters."
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field.input) return false;
    const message = field.check(field.input.value);
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  Object.keys(fields).forEach(key => {
    fields[key].input.addEventListener("input", () => validateField(key));
    fields[key].input.addEventListener("blur", () => validateField(key));
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    const success = document.querySelector("#form-success");

    if (valid) {
      success.textContent = "Thank you! Your enquiry has been validated successfully.";
      form.reset();
      Object.keys(fields).forEach(key => {
        fields[key].error.textContent = "";
        fields[key].input.setAttribute("aria-invalid", "false");
      });
    } else {
      success.textContent = "";
    }
  });
}

// 4. Image slider: keeps an index and displays only the current slide.
function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const prev = document.querySelector(".slider-btn.prev");
  const next = document.querySelector(".slider-btn.next");
  const dotsContainer = document.querySelector(".slider-dots");
  if (!slides.length || !prev || !next || !dotsContainer) return;

  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Show image ${i + 1}`);
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function showSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  prev.addEventListener("click", () => showSlide(index - 1));
  next.addEventListener("click", () => showSlide(index + 1));
}