/* kontaktai.js — form validation & Formspree AJAX submission */

(function () {
  'use strict';

  var REQUIRED = ['vardas', 'email', 'uzklausa'];

  var form        = document.getElementById('contactForm');
  var submitBtn   = document.getElementById('submitBtn');
  var formFields  = document.getElementById('formFields');
  var formSuccess = document.getElementById('formSuccess');
  var formNote    = form ? form.querySelector('.contact-form-note') : null;

  if (!form || !submitBtn) return;

  function markError(el) {
    el.style.borderBottomColor = 'var(--color-ink)';
    el.addEventListener('input', function () {
      el.style.borderBottomColor = '';
    }, { once: true });
  }

  function validate() {
    var valid = true;
    REQUIRED.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.value.trim()) { markError(el); valid = false; }
    });
    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Siunčiama…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        if (formFields)  formFields.style.display  = 'none';
        if (formNote)    formNote.style.display     = 'none';
        submitBtn.style.display = 'none';
        if (formSuccess) formSuccess.style.display  = 'block';
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Siųsti užklausą';
      }
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Siųsti užklausą';
    });
  });

}());
