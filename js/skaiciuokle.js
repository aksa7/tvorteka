/* ============================================================
   TVORTEKA — Skaičiuoklės logika
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Konfigūracija ---------- */
  // ĮRAŠYKITE SAVO FORMSPREE ID ČIA (pvz.: 'xnqkvpzy')
  // Kol paliksite 'YOUR_FORMSPREE_ID' — forma naudos mailto: fallback
  const FORMSPREE_ID = 'xzdowagr';
  const RECIPIENT_EMAIL = 'info@tvorteka.lt';

  /* ---------- Duomenys ---------- */

  const COLORS = [
    { id: '6020', name: 'Žalia', img: '../assets/ral/ral-6020.png' },
    { id: '7016', name: 'Pilka', img: '../assets/ral/ral-7016.png' },
    { id: '8017', name: 'Ruda',  img: '../assets/ral/ral-8017.png' },
    { id: '9005', name: 'Juoda', img: '../assets/ral/ral-9005.png' }
  ];

  const PRODUCTS = [
    { id: 'rombas-60-120-aklinas',   name: 'Rombas 60×120 aklina',    img: '../assets/products/rombas_6x12_aklinas.webp' },
    { id: 'rombas-60-120-vidutinis', name: 'Rombas 60×120 vidutinis', img: '../assets/products/rombas_6x12_vidutinis.webp' },
    { id: 'rombas-40-130-aklinas',   name: 'Rombas 40×130 aklina',    img: '../assets/products/rombas_4x13_aklinas.webp' },
    { id: 'rombas-40-130-vidutinis', name: 'Rombas 40×130 vidutinis', img: '../assets/products/rombas_4x13_vidutinis.webp' },
    { id: 'zaliuze-aklina',          name: 'Žaliuzi aklina',          img: '../assets/products/zaliuze_aklina.webp' },
    { id: 'zaliuze-vidutine',        name: 'Žaliuzi vidutinė',        img: '../assets/products/zaliuze_viduine.webp' },
    { id: 'eglute-aklina',           name: 'Eglutė aklina',           img: '../assets/products/eglute_aklina.webp' },
    { id: 'eglute-vidutine',         name: 'Eglutė vidutinė',         img: '../assets/products/eglute_viduine.webp' },
    { id: 'plank-lamele-aklina',     name: 'Plank lamelė aklina',     img: '../assets/products/plank_aklina.webp' },
    { id: 'plank-lamele-vidutinis',  name: 'Plank lamelė vidutinis',  img: '../assets/products/plank_vidutine.webp' },
    { id: 'plank-plati-lamele',      name: 'Plank plati lamelė',      img: '../assets/products/plank_plati_27cm.webp' }
  ];

  const VARTAI_UZPILDAS = [
    { id: 'be-uzpildo',          name: 'Be užpildo',           img: '../assets/skaiciuokle/vartaiBeUzpildo.webp' },
    { id: 'zaliuzi-aklina',      name: 'Žaliuzi aklina',       img: '../assets/skaiciuokle/vartaiZaliuziAklina.webp' },
    { id: 'zaliuzi-vidutinis',   name: 'Žaliuzi vidutinis',    img: '../assets/skaiciuokle/vartaiZaliuziVidutinis.webp' },
    { id: 'rombas-aklinas',      name: 'Rombas aklina',        img: '../assets/skaiciuokle/vartaiRombasAklinas.webp' },
    { id: 'rombas-vidutinis',    name: 'Rombas vidutinis',     img: '../assets/skaiciuokle/vartaiRombasVidutinis.webp' },
    { id: 'eglute-aklina',       name: 'Eglutė aklina',        img: '../assets/skaiciuokle/vartaEgluteAklina.webp' },
    { id: 'eglute-vidutine',     name: 'Eglutė vidutinė',      img: '../assets/skaiciuokle/vartaiEgluteVidutinis.webp' },
    { id: 'plank-11cm-aklina',   name: 'Plank 11 cm aklina',   img: '../assets/skaiciuokle/vartaiPlank11cmaklina.webp' },
    { id: 'plank-11cm-vidutine', name: 'Plank 11 cm vidutinė', img: '../assets/skaiciuokle/vartaiPlank11cmvidutine.webp' },
    { id: 'plank-plati',         name: 'Plank plati lamelė',   img: '../assets/skaiciuokle/vartaiPlankPlati.webp' }
  ];

  const VARTELIAI_UZPILDAS = [
    { id: 'be-uzpildo',          name: 'Be užpildo',           img: '../assets/skaiciuokle/varteliaiBeUzpildo.webp' },
    { id: 'zaliuzi-aklina',      name: 'Žaliuzi aklina',       img: '../assets/skaiciuokle/varteliaiZaliuziAklina.webp' },
    { id: 'zaliuzi-vidutine',    name: 'Žaliuzi vidutinė',     img: '../assets/skaiciuokle/varteliaiZaliuziVidutine.webp' },
    { id: 'rombas-aklinas',      name: 'Rombas aklina',        img: '../assets/skaiciuokle/varteliaiRombasAklinas.webp' },
    { id: 'rombas-vidutinis',    name: 'Rombas vidutinis',     img: '../assets/skaiciuokle/varteliaiRombasVidutinis.webp' },
    { id: 'eglute-aklina',       name: 'Eglutė aklina',        img: '../assets/skaiciuokle/varteliaiEgluteAklina.webp' },
    { id: 'eglute-vidutine',     name: 'Eglutė vidutinė',      img: '../assets/skaiciuokle/varteliaiEglutevidutine.webp' },
    { id: 'plank-11cm-aklina',   name: 'Plank 11 cm aklina',   img: '../assets/skaiciuokle/varteliaiPlank11cmaklina.webp' },
    { id: 'plank-11cm-vidutine', name: 'Plank 11 cm vidutinė', img: '../assets/skaiciuokle/varteliaiPlank11cmvidutine.webp' },
    { id: 'plank-plati',         name: 'Plank plati lamelė',   img: '../assets/skaiciuokle/varteliaiPlankPlati.webp' }
  ];

  const VARTAI_PLOCIAI = [3000, 3500, 4000, 4500, 5000, 5500, 6000];
  const VARTAI_AUKSCIAI = [1200, 1400, 1500, 1600, 1700, 1800, 2000];
  const VARTELIAI_PLOCIAI = [1000, 1100, 1200, 1300, 1400, 1500];
  const VARTELIAI_AUKSCIAI = [1500, 1600, 1700, 1800, 2000];

  /* ---------- Būsena ---------- */

  const state = {
    spalva: null,
    montavimas: null,
    vartaiTipas: null,
    vartaiPlotis: null,
    vartaiAukstis: null,
    vartaiPlotisCustom: null,
    vartaiAukstisCustom: null,
    vartaiUzpildas: null,
    varteliai: null,
    varteliaiPlotis: null,
    varteliaiAukstis: null,
    varteliaiPlotisCustom: null,
    varteliaiAukstisCustom: null,
    varteliaiUzpildas: null,
    tvora: null,
    tvoraAukstis: null,
    tvoraIlgis: null,
    tvoraKategorija: null,
    tvoraModelis: null,
    pamatelis: null,
    stulpas: null,
    vardas: null,
    pavarde: null,
    email: null,
    telefonas: null,
    zinute: null
  };

  let currentStepIdx = 0;

  /* ---------- Žingsniai ---------- */

  const STEPS = [
    { id: 'spalva',             group: 'vartai' },
    { id: 'montavimas',         group: 'vartai' },
    { id: 'vartai-tipas',       group: 'vartai' },
    { id: 'vartai-matmenys',    group: 'vartai',    condition: () => state.vartaiTipas && state.vartaiTipas !== 'nereikia' },
    { id: 'vartai-uzpildas',    group: 'vartai',    condition: () => state.vartaiTipas && state.vartaiTipas !== 'nereikia' },
    { id: 'varteliai-tipas',    group: 'varteliai' },
    { id: 'varteliai-matmenys', group: 'varteliai', condition: () => state.varteliai === 'reikia' },
    { id: 'varteliai-uzpildas', group: 'varteliai', condition: () => state.varteliai === 'reikia' },
    { id: 'tvora-tipas',        group: 'tvora' },
    { id: 'tvora-matmenys',     group: 'tvora',     condition: () => state.tvora === 'reikia' },
    { id: 'tvora-kategorija',   group: 'tvora',     condition: () => state.tvora === 'reikia' },
    { id: 'tvora-modelis',      group: 'tvora',     condition: () => state.tvora === 'reikia' && state.tvoraKategorija === 'skardines' },
    { id: 'tvora-pamatelis',    group: 'tvora',     condition: () => state.tvora === 'reikia' },
    { id: 'tvora-stulpas',      group: 'tvora',     condition: () => state.tvora === 'reikia' },
    { id: 'kontaktai',          group: 'pasiulymas' }
  ];

  function getActiveSteps() {
    return STEPS.filter(s => !s.condition || s.condition());
  }

  function currentStep() {
    return getActiveSteps()[currentStepIdx];
  }

  function effectiveDimension(preset, custom) {
    const customVal = custom != null && String(custom).trim() !== '' ? Number(custom) : null;
    if (customVal != null && !Number.isNaN(customVal) && customVal > 0) return String(customVal);
    if (preset != null && String(preset).trim() !== '') return String(preset);
    return null;
  }

  function renderDimensionField(config) {
    const {
      id,
      label,
      presetField,
      customField,
      options,
      presetValue,
      customValue,
      unit = 'mm'
    } = config;
    const hasCustom = customValue != null && String(customValue).trim() !== '';
    return `
      <div class="calc-field">
        <label for="${id}">${label}</label>
        <select id="${id}" data-field="${presetField}"${hasCustom ? ' disabled' : ''}>
          <option value="">— Pasirinkite —</option>
          ${options.map(v => `<option value="${v}"${String(presetValue) === String(v) && !hasCustom ? ' selected' : ''}>${v} ${unit}</option>`).join('')}
        </select>
        <div class="calc-field-custom">
          <label for="${id}-custom">Kitas matmuo (${unit})</label>
          <input type="number" id="${id}-custom" data-field="${customField}" min="1" step="1" placeholder="Įveskite reikiamą matmenį" value="${esc(customValue || '')}" />
          <span class="calc-field-hint">Naudokite, jei sąraše nėra Jums reikiamo matmens</span>
        </div>
      </div>`;
  }

  /* ---------- Validacija ---------- */

  function canProceed() {
    const step = currentStep();
    if (!step) return false;
    switch (step.id) {
      case 'spalva':              return !!state.spalva;
      case 'montavimas':          return !!state.montavimas;
      case 'vartai-tipas':        return !!state.vartaiTipas;
      case 'vartai-matmenys':     return !!effectiveDimension(state.vartaiPlotis, state.vartaiPlotisCustom) && !!effectiveDimension(state.vartaiAukstis, state.vartaiAukstisCustom);
      case 'vartai-uzpildas':     return !!state.vartaiUzpildas;
      case 'varteliai-tipas':     return !!state.varteliai;
      case 'varteliai-matmenys':  return !!effectiveDimension(state.varteliaiPlotis, state.varteliaiPlotisCustom) && !!effectiveDimension(state.varteliaiAukstis, state.varteliaiAukstisCustom);
      case 'varteliai-uzpildas':  return !!state.varteliaiUzpildas;
      case 'tvora-tipas':         return !!state.tvora;
      case 'tvora-matmenys':      return !!state.tvoraAukstis && !!state.tvoraIlgis;
      case 'tvora-kategorija':    return !!state.tvoraKategorija;
      case 'tvora-modelis':       return !!state.tvoraModelis;
      case 'tvora-pamatelis':     return !!state.pamatelis;
      case 'tvora-stulpas':       return !!state.stulpas;
      case 'kontaktai':           return !!state.vardas && !!state.email && !!state.telefonas && /\S+@\S+\.\S+/.test(state.email);
      default:                    return true;
    }
  }

  /* ---------- HTML helpers ---------- */

  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderCard(opt, isSelected, isImage) {
    const visual = isImage
      ? `<div class="calc-option-image${opt.isColor ? ' is-color' : ''}"><img src="${esc(opt.img)}" alt="${esc(opt.name)}" loading="lazy" /></div>`
      : `<div class="calc-option-icon">${opt.icon || ''}</div>`;
    return `
      <button type="button" class="calc-option${isSelected ? ' is-selected' : ''}" data-action="select" data-value="${esc(opt.id)}">
        ${visual}
        <span class="calc-option-name">${esc(opt.name)}</span>
        ${opt.desc ? `<span class="calc-option-desc">${esc(opt.desc)}</span>` : ''}
      </button>
    `;
  }

  /* ---------- SVG ikonos ---------- */

  const ICONS = {
    box:         '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4 9-4M12 11v10"/></svg>',
    tools:       '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    gateSliding: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 36V18l24-6v24M4 36h28M8 36V22M14 36V20M20 36V18M26 36V16M44 36L28 36"/></svg>',
    gateSwing:   '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 36V14h16v22M26 36V14h16v22M10 16v18M14 16v18M18 16v18M30 16v18M34 16v18M38 16v18"/></svg>',
    wicket:      '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 40V12h20v28M14 40h20M18 14v24M22 14v24M26 14v24M30 14v24"/></svg>',
    fence:       '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 38V18l4-4 4 4v20M16 38V18l4-4 4 4v20M24 38V18l4-4 4 4v20M32 38V18l4-4 4 4v20M4 26h40M4 34h40"/></svg>',
    sheet:       '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8v32M16 8v32M22 8v32M28 8v32M34 8v32M40 8v32"/></svg>',
    metal:       '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h36M6 20h36M6 28h36M6 36h36M14 8v32M24 8v32M34 8v32"/></svg>',
    base:        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="28" width="40" height="10" rx="1"/><path d="M8 32h32M8 36h32M12 14v14M36 14v14"/></svg>',
    post:        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="6" width="8" height="38" rx="1"/><path d="M16 12h16M16 18h16M16 24h16M16 30h16M16 36h16"/></svg>',
    no:          '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M11 11l26 26"/></svg>'
  };

  /* ---------- Žingsnių turinys ---------- */

  function renderStep() {
    const step = currentStep();
    if (!step) return '';
    const tpl = TEMPLATES[step.id];
    return tpl ? tpl() : `<p>Nežinomas žingsnis: ${esc(step.id)}</p>`;
  }

  const TEMPLATES = {
    'spalva': () => `
      <p class="calc-step-eyebrow">1 / 14</p>
      <h2 class="calc-step-title">Pasirinkite spalvą</h2>
      <p class="calc-step-sub">Visi mūsų gaminiai padengti aukštos kokybės polimerine danga, atsparia korozijai, UV ir mechaniniam poveikiui.</p>
      <div class="calc-options calc-options-4" data-field="spalva">
        ${COLORS.map(c => renderCard({ ...c, isColor: true }, state.spalva === c.id, true)).join('')}
      </div>`,

    'montavimas': () => `
      <p class="calc-step-eyebrow">2 / 14</p>
      <h2 class="calc-step-title">Ar reikalinga montavimo paslauga?</h2>
      <p class="calc-step-sub">Galite užsisakyti tik gaminį arba gaminį kartu su profesionaliu montavimu.</p>
      <div class="calc-options calc-options-2" data-field="montavimas">
        ${renderCard({ id: 'tik-gaminys', name: 'Tik gaminys', icon: ICONS.box }, state.montavimas === 'tik-gaminys', false)}
        ${renderCard({ id: 'gaminys-ir-montavimas', name: 'Gaminys ir montavimas', icon: ICONS.tools }, state.montavimas === 'gaminys-ir-montavimas', false)}
      </div>`,

    'vartai-tipas': () => `
      <p class="calc-step-eyebrow">3 / 14</p>
      <h2 class="calc-step-title">Ar Jums reikalingi vartai?</h2>
      <p class="calc-step-sub">Pasirinkite vartų tipą arba praleiskite šį žingsnį.</p>
      <div class="calc-options calc-options-3" data-field="vartaiTipas">
        ${renderCard({ id: 'stumdomi', name: 'Stumdomi vartai', icon: ICONS.gateSliding }, state.vartaiTipas === 'stumdomi', false)}
        ${renderCard({ id: 'varstomi',  name: 'Varstomi vartai',  icon: ICONS.gateSwing },   state.vartaiTipas === 'varstomi', false)}
        ${renderCard({ id: 'nereikia',  name: 'Vartų nereikia',   icon: ICONS.no },          state.vartaiTipas === 'nereikia', false)}
      </div>`,

    'vartai-matmenys': () => `
      <p class="calc-step-eyebrow">4 / 14</p>
      <h2 class="calc-step-title">Pasirinkite vartų matmenis</h2>
      <p class="calc-step-sub">Apytikslis vartų pravažiavimo plotis ir rėmo aukštis. Jei nerandate tinkamo matmens sąraše — įveskite savo reikšmę.</p>
      <div class="calc-fields calc-fields-2">
        ${renderDimensionField({
          id: 'vartai-plotis',
          label: 'Pravažiavimo plotis (mm)',
          presetField: 'vartaiPlotis',
          customField: 'vartaiPlotisCustom',
          options: VARTAI_PLOCIAI,
          presetValue: state.vartaiPlotis,
          customValue: state.vartaiPlotisCustom
        })}
        ${renderDimensionField({
          id: 'vartai-aukstis',
          label: 'Rėmo aukštis (mm)',
          presetField: 'vartaiAukstis',
          customField: 'vartaiAukstisCustom',
          options: VARTAI_AUKSCIAI,
          presetValue: state.vartaiAukstis,
          customValue: state.vartaiAukstisCustom
        })}
      </div>`,

    'vartai-uzpildas': () => `
      <p class="calc-step-eyebrow">5 / 14</p>
      <h2 class="calc-step-title">Pasirinkite vartų užpildą</h2>
      <p class="calc-step-sub">Profilio tipas, kurį norėtumėte matyti savo vartuose.</p>
      <div class="calc-options calc-options-products" data-field="vartaiUzpildas">
        ${VARTAI_UZPILDAS.map(p => renderCard(p, state.vartaiUzpildas === p.id, true)).join('')}
      </div>`,

    'varteliai-tipas': () => `
      <p class="calc-step-eyebrow">6 / 14</p>
      <h2 class="calc-step-title">Ar Jums reikalingi varteliai?</h2>
      <p class="calc-step-sub">Vienviečiai durų varteliai įprastai komplektuojami kartu su vartais.</p>
      <div class="calc-options calc-options-2" data-field="varteliai">
        ${renderCard({ id: 'reikia',   name: 'Mane domina varteliai', icon: ICONS.wicket }, state.varteliai === 'reikia', false)}
        ${renderCard({ id: 'nereikia', name: 'Vartelių nereikia',     icon: ICONS.no },     state.varteliai === 'nereikia', false)}
      </div>`,

    'varteliai-matmenys': () => `
      <p class="calc-step-eyebrow">7 / 14</p>
      <h2 class="calc-step-title">Pasirinkite vartelių matmenis</h2>
      <p class="calc-step-sub">Apytikslis rėmo plotis ir aukštis. Jei nerandate tinkamo matmens sąraše — įveskite savo reikšmę.</p>
      <div class="calc-fields calc-fields-2">
        ${renderDimensionField({
          id: 'varteliai-plotis',
          label: 'Rėmo plotis (mm)',
          presetField: 'varteliaiPlotis',
          customField: 'varteliaiPlotisCustom',
          options: VARTELIAI_PLOCIAI,
          presetValue: state.varteliaiPlotis,
          customValue: state.varteliaiPlotisCustom
        })}
        ${renderDimensionField({
          id: 'varteliai-aukstis',
          label: 'Rėmo aukštis (mm)',
          presetField: 'varteliaiAukstis',
          customField: 'varteliaiAukstisCustom',
          options: VARTELIAI_AUKSCIAI,
          presetValue: state.varteliaiAukstis,
          customValue: state.varteliaiAukstisCustom
        })}
      </div>`,

    'varteliai-uzpildas': () => `
      <p class="calc-step-eyebrow">8 / 14</p>
      <h2 class="calc-step-title">Pasirinkite vartelių užpildą</h2>
      <p class="calc-step-sub">Profilio tipas, kurį norėtumėte matyti savo varteliuose.</p>
      <div class="calc-options calc-options-products" data-field="varteliaiUzpildas">
        ${VARTELIAI_UZPILDAS.map(p => renderCard(p, state.varteliaiUzpildas === p.id, true)).join('')}
      </div>`,

    'tvora-tipas': () => `
      <p class="calc-step-eyebrow">9 / 14</p>
      <h2 class="calc-step-title">Ar Jums reikalinga fasadinė tvora?</h2>
      <p class="calc-step-sub">Tvora aplink sklypą — užbaigia bendrą kompoziciją.</p>
      <div class="calc-options calc-options-2" data-field="tvora">
        ${renderCard({ id: 'reikia',   name: 'Mane domina fasadinė tvora', icon: ICONS.fence }, state.tvora === 'reikia', false)}
        ${renderCard({ id: 'nereikia', name: 'Fasadinės tvoros nereikia',  icon: ICONS.no },    state.tvora === 'nereikia', false)}
      </div>`,

    'tvora-matmenys': () => `
      <p class="calc-step-eyebrow">10 / 14</p>
      <h2 class="calc-step-title">Pasirinkite tvoros matmenis</h2>
      <p class="calc-step-sub">Tvoros aukštis ir bendras planuojamas ilgis.</p>
      <div class="calc-fields calc-fields-2">
        <div class="calc-field">
          <label for="tvora-aukstis">Tvoros aukštis (m)</label>
          <select id="tvora-aukstis" data-field="tvoraAukstis">
            <option value="">— Pasirinkite —</option>
            <option value="1.2"${state.tvoraAukstis === '1.2' ? ' selected' : ''}>1,2 m</option>
            <option value="1.5"${state.tvoraAukstis === '1.5' ? ' selected' : ''}>1,5 m</option>
            <option value="1.8"${state.tvoraAukstis === '1.8' ? ' selected' : ''}>1,8 m</option>
            <option value="2.0"${state.tvoraAukstis === '2.0' ? ' selected' : ''}>2,0 m</option>
          </select>
        </div>
        <div class="calc-field">
          <label for="tvora-ilgis">Planuojamas ilgis (m)</label>
          <input type="number" id="tvora-ilgis" data-field="tvoraIlgis" min="10" max="300" placeholder="100" value="${esc(state.tvoraIlgis)}" />
          <span class="calc-field-hint">Ilgis gali būti 10 – 300 m</span>
        </div>
      </div>`,

    'tvora-kategorija': () => `
      <p class="calc-step-eyebrow">11 / 14</p>
      <h2 class="calc-step-title">Pasirinkite tvoros kategoriją</h2>
      <p class="calc-step-sub">Mūsų pagrindinė specializacija — skardinės tvoros.</p>
      <div class="calc-options calc-options-2" data-field="tvoraKategorija">
        ${renderCard({ id: 'skardines', name: 'Skardinės tvoros', icon: ICONS.sheet }, state.tvoraKategorija === 'skardines', false)}
        ${renderCard({ id: 'metalines', name: 'Metalinės tvoros', desc: 'Greitai', icon: ICONS.metal }, state.tvoraKategorija === 'metalines', false)}
      </div>`,

    'tvora-modelis': () => `
      <p class="calc-step-eyebrow">12 / 14</p>
      <h2 class="calc-step-title">Pasirinkite tvoros modelį</h2>
      <p class="calc-step-sub">Profilio tipas, kurį naudosime tvoros segmentuose.</p>
      <div class="calc-options calc-options-products" data-field="tvoraModelis">
        ${PRODUCTS.map(m => renderCard(m, state.tvoraModelis === m.id, true)).join('')}
      </div>`,

    'tvora-pamatelis': () => `
      <p class="calc-step-eyebrow">13 / 14</p>
      <h2 class="calc-step-title">Pasirinkite pamatėlį</h2>
      <p class="calc-step-sub">Pamatėlis — apatinė atrama, kuri tvirtinama prie žemės ir suteikia tvarkingą kraštinę liniją.</p>
      <div class="calc-options calc-options-2" data-field="pamatelis">
        ${renderCard({ id: 'nereikalingas', name: 'Nereikalingas', icon: ICONS.no },   state.pamatelis === 'nereikalingas', false)}
        ${renderCard({ id: 'reikalingas',   name: 'Reikalingas',   icon: ICONS.base }, state.pamatelis === 'reikalingas', false)}
      </div>`,

    'tvora-stulpas': () => `
      <p class="calc-step-eyebrow">14 / 14</p>
      <h2 class="calc-step-title">Pasirinkite stulpą</h2>
      <p class="calc-step-sub">Atraminis stulpas, prie kurio tvirtinami tvoros segmentai.</p>
      <div class="calc-options calc-options-2" data-field="stulpas">
        ${renderCard({ id: 'nereikalingas', name: 'Nereikalingas', icon: ICONS.no },   state.stulpas === 'nereikalingas', false)}
        ${renderCard({ id: 'reikalingas',   name: 'Reikalingas',   icon: ICONS.post }, state.stulpas === 'reikalingas', false)}
      </div>`,

    'kontaktai': () => `
      <p class="calc-step-eyebrow">PASKUTINIS ŽINGSNIS</p>
      <h2 class="calc-step-title">Susisiekite</h2>
      <p class="calc-step-sub">Užpildykite kontaktus — patyręs specialistas susisieks su Jumis su paskaičiuota kaina per 24 valandas.</p>
      <div class="calc-fields calc-fields-contact">
        <div class="calc-field">
          <label for="vardas">Vardas *</label>
          <input type="text" id="vardas" data-field="vardas" placeholder="Vardas" value="${esc(state.vardas)}" required />
        </div>
        <div class="calc-field">
          <label for="pavarde">Pavardė</label>
          <input type="text" id="pavarde" data-field="pavarde" placeholder="Pavardė" value="${esc(state.pavarde)}" />
        </div>
        <div class="calc-field">
          <label for="email">El. paštas *</label>
          <input type="email" id="email" data-field="email" placeholder="vardas@email.lt" value="${esc(state.email)}" required />
        </div>
        <div class="calc-field">
          <label for="telefonas">Telefono numeris *</label>
          <input type="tel" id="telefonas" data-field="telefonas" placeholder="+370 000 00000" value="${esc(state.telefonas)}" required />
        </div>
        <div class="calc-field calc-field-full">
          <label for="zinute">Žinutė (neprivaloma)</label>
          <textarea id="zinute" data-field="zinute" rows="3" placeholder="Papildoma informacija apie projektą...">${esc(state.zinute)}</textarea>
        </div>
      </div>`
  };

  /* ---------- Suvestinė ---------- */

  function getSummary() {
    const items = [];
    if (state.spalva) {
      const c = COLORS.find(x => x.id === state.spalva);
      if (c) items.push({ label: 'Spalva', value: c.name });
    }
    if (state.montavimas) items.push({ label: 'Montavimas', value: state.montavimas === 'tik-gaminys' ? 'Tik gaminys' : 'Gaminys ir montavimas' });
    if (state.vartaiTipas) items.push({ label: 'Vartai', value: state.vartaiTipas === 'stumdomi' ? 'Stumdomi vartai' : state.vartaiTipas === 'varstomi' ? 'Varstomi vartai' : 'Vartų nereikia' });
    const vartaiPlotis = effectiveDimension(state.vartaiPlotis, state.vartaiPlotisCustom);
    const vartaiAukstis = effectiveDimension(state.vartaiAukstis, state.vartaiAukstisCustom);
    if (vartaiPlotis && vartaiAukstis) items.push({ label: 'Vartų matmenys', value: `${vartaiPlotis} × ${vartaiAukstis} mm` });
    if (state.vartaiUzpildas) { const p = VARTAI_UZPILDAS.find(x => x.id === state.vartaiUzpildas); if (p) items.push({ label: 'Vartų užpildas', value: p.name }); }
    if (state.varteliai) items.push({ label: 'Varteliai', value: state.varteliai === 'reikia' ? 'Reikia' : 'Nereikia' });
    const varteliaiPlotis = effectiveDimension(state.varteliaiPlotis, state.varteliaiPlotisCustom);
    const varteliaiAukstis = effectiveDimension(state.varteliaiAukstis, state.varteliaiAukstisCustom);
    if (varteliaiPlotis && varteliaiAukstis) items.push({ label: 'Vartelių matmenys', value: `${varteliaiPlotis} × ${varteliaiAukstis} mm` });
    if (state.varteliaiUzpildas) { const p = VARTELIAI_UZPILDAS.find(x => x.id === state.varteliaiUzpildas); if (p) items.push({ label: 'Vartelių užpildas', value: p.name }); }
    if (state.tvora) items.push({ label: 'Fasadinė tvora', value: state.tvora === 'reikia' ? 'Reikia' : 'Nereikia' });
    if (state.tvoraAukstis && state.tvoraIlgis) items.push({ label: 'Tvoros matmenys', value: `${state.tvoraAukstis} m × ${state.tvoraIlgis} m` });
    if (state.tvoraKategorija) items.push({ label: 'Tvoros kategorija', value: state.tvoraKategorija === 'skardines' ? 'Skardinės tvoros' : 'Metalinės tvoros (greitai)' });
    if (state.tvoraModelis) { const m = PRODUCTS.find(x => x.id === state.tvoraModelis); if (m) items.push({ label: 'Tvoros modelis', value: m.name }); }
    if (state.pamatelis) items.push({ label: 'Pamatėlis', value: state.pamatelis === 'reikalingas' ? 'Reikalingas' : 'Nereikalingas' });
    if (state.stulpas) items.push({ label: 'Stulpas', value: state.stulpas === 'reikalingas' ? 'Reikalingas' : 'Nereikalingas' });
    return items;
  }

  function renderSummary() {
    const el = document.getElementById('calc-summary');
    if (!el) return;
    const items = getSummary();
    if (items.length === 0) {
      el.innerHTML = '<p class="calc-summary-empty">Jūsų pasirinkimai bus rodomi čia.</p>';
      return;
    }
    el.innerHTML = items.map(it => `
      <div class="calc-summary-item">
        <span class="calc-summary-label">${esc(it.label)}</span>
        <span class="calc-summary-value">${esc(it.value)}</span>
      </div>`).join('');
  }

  /* ---------- Progress ---------- */

  function renderProgress() {
    const groups = ['vartai', 'varteliai', 'tvora', 'pasiulymas'];
    const labels = ['Vartai', 'Varteliai', 'Tvora', 'Pasiūlymas'];
    const cur = currentStep()?.group;
    const idx = groups.indexOf(cur);

    const bar = document.querySelector('.calc-progress-bar');
    const lab = document.querySelector('.calc-progress-labels');
    if (!bar || !lab) return;

    bar.innerHTML = groups.map((_, i) => {
      let cls = 'calc-progress-dot';
      if (i < idx) cls += ' is-done';
      else if (i === idx) cls += ' is-active';
      return `<div class="${cls}"></div>`;
    }).join('');

    const progress = idx <= 0 ? 0 : (idx / (groups.length - 1)) * 100;
    bar.style.setProperty('--progress', `${progress}%`);

    lab.innerHTML = labels.map((label, i) => {
      let cls = 'calc-progress-label';
      if (i < idx) cls += ' is-done';
      else if (i === idx) cls += ' is-active';
      return `<div class="${cls}">${label}</div>`;
    }).join('');
  }

  /* ---------- Navigacija ---------- */

  function updateNav() {
    const backBtn = document.getElementById('calc-back');
    const nextBtn = document.getElementById('calc-next');
    if (!backBtn || !nextBtn) return;

    backBtn.disabled = currentStepIdx === 0;

    const active = getActiveSteps();
    const isLast = currentStepIdx === active.length - 1;
    nextBtn.disabled = !canProceed();

    nextBtn.innerHTML = isLast
      ? '<span>Gauti kainą</span><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7 3m4 4L7 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<span>Kitas žingsnis</span><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7 3m4 4L7 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function render() {
    const stepEl = document.getElementById('calc-step');
    if (!stepEl) return;
    stepEl.innerHTML = renderStep();
    renderProgress();
    renderSummary();
    updateNav();
  }

  function goNext() {
    if (!canProceed()) return;
    const active = getActiveSteps();
    if (currentStepIdx === active.length - 1) {
      submit();
      return;
    }
    currentStepIdx++;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (currentStepIdx === 0) return;
    currentStepIdx--;
    render();
  }

  /* ---------- Submit ---------- */

  function buildEmailBody() {
    const lines = [];
    lines.push('Užklausa iš tvorteka.lt skaičiuoklės');
    lines.push('═══════════════════════════════════════');
    lines.push('');
    getSummary().forEach(it => lines.push(`${it.label}: ${it.value}`));
    lines.push('');
    lines.push('───────────────────────────────────────');
    lines.push('Kontaktiniai duomenys:');
    lines.push('───────────────────────────────────────');
    if (state.vardas) lines.push(`Vardas: ${state.vardas}${state.pavarde ? ' ' + state.pavarde : ''}`);
    if (state.email) lines.push(`El. paštas: ${state.email}`);
    if (state.telefonas) lines.push(`Telefonas: ${state.telefonas}`);
    if (state.zinute) {
      lines.push('');
      lines.push('Žinutė:');
      lines.push(state.zinute);
    }
    return lines.join('\n');
  }

  function submit() {
    if (!canProceed()) return;

    const subject = `Skaičiuoklės užklausa — ${state.vardas || ''}`.trim();
    const body = buildEmailBody();

    // Jei Formspree ID dar nepakeistas — naudojame mailto: fallback
    if (!FORMSPREE_ID || FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
      window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showSuccess();
      return;
    }

    // Formspree siuntimas
    const formData = {
      email: state.email,
      _subject: subject,
      message: body,
      _replyto: state.email,
      _gotcha: '',
      vardas: state.vardas || '',
      pavarde: state.pavarde || '',
      telefonas: state.telefonas || '',
      zinute: state.zinute || ''
    };

    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        showSuccess();
      } else {
        showError();
      }
    })
    .catch(() => {
      showError();
    });
  }

  function showSuccess() {
    const stepEl = document.getElementById('calc-step');
    const navEl = document.querySelector('.calc-nav');
    if (!stepEl) return;
    stepEl.innerHTML = `
      <div class="calc-success">
        <div class="calc-success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2>Ačiū už Jūsų <em>laiką!</em></h2>
        <p>Jūsų užklausa sėkmingai išsiųsta. Patyręs specialistas susisieks su Jumis su paskaičiuota kaina per 24 valandas.</p>
        <a href="/" class="calc-btn calc-btn-primary"><span>Į pradžią</span></a>
      </div>`;
    if (navEl) navEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showError() {
    const stepEl = document.getElementById('calc-step');
    const navEl = document.querySelector('.calc-nav');
    if (!stepEl) return;
    stepEl.innerHTML = `
      <div class="calc-success">
        <div class="calc-success-icon" style="background-color: #c0392b;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <h2>Įvyko <em>klaida</em></h2>
        <p>Nepavyko išsiųsti užklausos. Bandykite dar kartą arba susisiekite tiesiogiai telefonu <a href="tel:+37066256657" style="color: var(--color-ink); text-decoration: underline;">+370 662 56657</a> arba el. paštu <a href="mailto:info@tvorteka.lt" style="color: var(--color-ink); text-decoration: underline;">info@tvorteka.lt</a>.</p>
        <button type="button" class="calc-btn calc-btn-primary" onclick="location.reload()"><span>Bandykite dar kartą</span></button>
      </div>`;
    if (navEl) navEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Init: event delegation ---------- */

  function init() {
    const panel = document.querySelector('.calc-panel');
    if (!panel) return;

    panel.addEventListener('click', e => {
      const target = e.target;
      const optBtn = target.closest('[data-action="select"]');
      if (optBtn && panel.contains(optBtn)) {
        const fieldEl = optBtn.closest('[data-field]');
        if (fieldEl) {
          state[fieldEl.dataset.field] = optBtn.dataset.value;
          render();
        }
        return;
      }
      if (target.closest('#calc-next')) {
        if (target.closest('#calc-next').disabled) return;
        goNext();
        return;
      }
      if (target.closest('#calc-back')) {
        if (target.closest('#calc-back').disabled) return;
        goBack();
        return;
      }
    });

    const DIMENSION_PAIRS = [
      ['vartaiPlotis', 'vartaiPlotisCustom'],
      ['vartaiAukstis', 'vartaiAukstisCustom'],
      ['varteliaiPlotis', 'varteliaiPlotisCustom'],
      ['varteliaiAukstis', 'varteliaiAukstisCustom']
    ];

    const updateFromInput = (el) => {
      if (!el || !el.dataset || !el.dataset.field) return;
      const field = el.dataset.field;
      let val = el.value;
      if (el.type === 'number' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        state[field] = (val === '' || val == null) ? null : val;

        DIMENSION_PAIRS.forEach(([presetField, customField]) => {
          if (field === presetField && val) {
            state[customField] = null;
            const customEl = panel.querySelector(`[data-field="${customField}"]`);
            if (customEl) customEl.value = '';
          }
          if (field === customField && val) state[presetField] = null;
        });

        updateNav();
        renderSummary();

        if (DIMENSION_PAIRS.some(([presetField, customField]) => field === presetField || field === customField)) {
          syncDimensionFields();
        }
      }
    };

    function syncDimensionFields() {
      DIMENSION_PAIRS.forEach(([presetField, customField]) => {
        const presetEl = panel.querySelector(`[data-field="${presetField}"]`);
        const customEl = panel.querySelector(`[data-field="${customField}"]`);
        if (!presetEl || !customEl) return;

        const hasCustom = state[customField] != null && String(state[customField]).trim() !== '';
        presetEl.disabled = hasCustom;
        if (hasCustom) {
          presetEl.value = '';
        } else if (state[presetField]) {
          presetEl.value = String(state[presetField]);
        }
      });
    }
    panel.addEventListener('input', e => updateFromInput(e.target));
    panel.addEventListener('change', e => updateFromInput(e.target));

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();