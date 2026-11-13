(function () {
  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var langButtons = document.querySelectorAll("[data-set-lang]");
  var form = document.getElementById("contact-form");
  var error = document.getElementById("form-error");
  var desktop = window.matchMedia("(min-width: 800px)");

  var copy = {
    es: {
      title: "Fernando Mendívil — DevOps y Cloud Engineer",
      description:
        "DevOps y Cloud Engineer. Automatización de infraestructura en AWS y Azure con Terraform, CI/CD, contenedores y monitoreo.",
      subject: "Contacto desde el portafolio",
      menuOpen: "Cerrar menú",
      menuClosed: "Abrir menú",
      nav: "Principal",
      language: "Idioma"
    },
    en: {
      title: "Fernando Mendívil — DevOps and Cloud Engineer",
      description:
        "DevOps and Cloud Engineer. Infrastructure automation on AWS and Azure with Terraform, CI/CD, containers, and monitoring.",
      subject: "Contact from the portfolio",
      menuOpen: "Close menu",
      menuClosed: "Open menu",
      nav: "Primary",
      language: "Language"
    }
  };

  function currentLang() {
    return root.lang === "es" ? "es" : "en";
  }

  function setMenuState(open) {
    if (!header || !toggle || !nav) return;
    var isDesktop = desktop.matches;
    header.classList.toggle("is-open", open && !isDesktop);
    toggle.setAttribute("aria-expanded", String(open && !isDesktop));
    nav.toggleAttribute("hidden", !isDesktop && !open);
    var label = copy[currentLang()][open && !isDesktop ? "menuOpen" : "menuClosed"];
    toggle.setAttribute("aria-label", label);
  }

  function applyLang(lang) {
    if (lang !== "es" && lang !== "en") lang = "en";
    root.lang = lang;
    document.title = copy[lang].title;
    if (nav) nav.setAttribute("aria-label", copy[lang].nav);
    var langSwitch = document.querySelector(".lang-switch");
    if (langSwitch) langSwitch.setAttribute("aria-label", copy[lang].language);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", copy[lang].description);
    langButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-set-lang") === lang));
    });
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
    setMenuState(header && header.classList.contains("is-open"));
  }

  langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyLang(button.getAttribute("data-set-lang"));
    });
  });

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenuState(!header.classList.contains("is-open"));
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenuState(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenuState(false);
  });

  desktop.addEventListener("change", function () {
    setMenuState(false);
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !message) {
        error.hidden = false;
        if (!name) form.name.focus();
        else if (!emailOk) form.email.focus();
        else form.message.focus();
        return;
      }
      error.hidden = true;
      var lang = currentLang();
      var body = name + "\n" + email + "\n\n" + message;
      window.location.href =
        "mailto:fermendivilt@gmail.com?subject=" +
        encodeURIComponent(copy[lang].subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  applyLang(currentLang());
})();
