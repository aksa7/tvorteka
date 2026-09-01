/* kontaktai.js - form validation & /api/send AJAX submission */

(function () {
  'use strict';

  var REQUIRED = ['vardas', 'email', 'miestas', 'uzklausa'];

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

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
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
