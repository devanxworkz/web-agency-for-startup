/* Houston Heating & Air Conditioning — main.js */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a"));

  /* ---------- Mobile nav toggle ---------- */
  function closeNav() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeNav();
    }
  });

  /* ---------- Scroll: header shadow + active nav ---------- */
  var sections = [];
  document.querySelectorAll("main section[id]").forEach(function (s) {
    sections.push(s);
  });

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }

    if (sections.length) {
      var pos = window.scrollY + 120;
      var current = sections[0].id;
      sections.forEach(function (section) {
        if (section.offsetTop <= pos) {
          current = section.id;
        }
      });

      navLinks.forEach(function (link) {
        var target = link.getAttribute("href").replace("#", "");
        if (target === current) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Free quote form ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    var success = document.getElementById("formSuccess");
    var errorEls = {};
    Array.prototype.forEach.call(form.querySelectorAll("[data-error-for]"), function (el) {
      errorEls[el.getAttribute("data-error-for")] = el;
    });

    function setError(name, message) {
      var field = form.querySelector('[name="' + name + '"]');
      var el = errorEls[name];
      if (field) {
        field.closest(".form-field").classList.toggle("is-invalid", !!message);
      }
      if (el) {
        el.textContent = message || "";
      }
    }

    function validate() {
      var ok = true;

      var name = form.elements.name.value.trim();
      if (name.length < 2) {
        setError("name", "Please enter your name.");
        ok = false;
      } else {
        setError("name", "");
      }

      var phone = form.elements.phone.value.trim();
      var phoneDigits = phone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 10) {
        setError("phone", "Please enter a valid phone number.");
        ok = false;
      } else {
        setError("phone", "");
      }

      var email = form.elements.email.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setError("email", "Please enter a valid email address.");
        ok = false;
      } else {
        setError("email", "");
      }

      var service = form.elements.service.value;
      if (!service) {
        setError("service", "Please select a service.");
        ok = false;
      } else {
        setError("service", "");
      }

      return ok;
    }

    function clearErrors() {
      ["name", "phone", "email", "service", "message"].forEach(function (n) {
        setError(n, "");
      });
    }

    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (input) {
      input.addEventListener("input", function () {
        setError(input.name, "");
      });
      input.addEventListener("change", function () {
        if (input.name && errorEls[input.name] && input.value) {
          setError(input.name, "");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstInvalid = form.querySelector(".is-invalid input, .is-invalid select");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        service: form.elements.service.value,
        message: form.elements.message.value.trim()
      };

      if (window.gtag) {
        window.gtag("event", "generate_lead", { send_to: "G-XXXXXXXXXX" });
      }

      console.log("[Quote request] (demo — nothing is sent anywhere):", data);

      success.hidden = false;
      form.querySelector("#quoteForm .btn--block").disabled = true;
      form.reset();
      clearErrors();
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();