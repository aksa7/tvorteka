# Tvorteka — Premium tvorų ir vartų svetainė (v3)

Vanilla HTML/CSS/JS — be build step'o, be framework'ų. Pakelk failus į bet kurį statinį hosting'ą (Netlify, Cloudflare Pages, GitHub Pages) ir veiks.

---

## 📁 Failų struktūra

```
tvorteka/
├── index.html                              # Pagrindinis puslapis
├── css/
│   ├── tokens.css                          # Spalvos, šriftai, design tokens
│   └── main.css                            # Visa stilizacija (15 sekcijų)
├── js/
│   └── main.js                             # Visa logika
├── produktai/
│   ├── index.html                          # Produktų katalogas su kategorijomis
│   ├── rombas-60-120/
│   │   └── index.html                      # → /produktai/rombas-60-120/
│   ├── rombas-40-130/
│   │   └── index.html                      # → /produktai/rombas-40-130/
│   ├── zaliuze/
│   │   └── index.html
│   ├── eglute/
│   │   └── index.html
│   ├── plank-lamele/
│   │   └── index.html
│   └── plank-plati-lamele/
│       └── index.html
├── assets/
│   ├── *.webp                              # Hero ir bendros nuotraukos
│   ├── fonts/                              # Self-hosted Fraunces, Geist, GeistMono
│   ├── products/                           # Bendros produktų nuotraukos (kortelėms)
│   └── insideproducts/                     # Hero karusele produkto puslapyje (3 nuotr.)
└── generate-products.py                    # Skriptas regeneruoti produktų puslapius
```

---

## 🌐 Švarūs URL'ai (folder structure)

Vietoje `/produktai/eglute.html` dabar adresai:
- `/produktai/eglute/`
- `/produktai/rombas-60-120/`
- `/produktai/zaliuze/`
- ir t.t.

Tai veikia bet kuriame static hosting'e — `index.html` faile aplanke automatiškai serviruojamas root path'u.

---

## 🆕 Kas atnaujinta v3 versijoje

### 1. Burger menu — 3 spans → 1 X
- 3 horizontalios linijos atviram meniu
- Paspaudus → vienas švarus X (be atskiro close mygtuko)
- Animacija sklandi, su delay'um, kad nematytų "two X's"

### 2. Tvorų karuselė — fix
- **Desktop**: lygiai 3 kortelės, jokios 4-tos peek'as
- **Tablet (768px+)**: 2 kortelės
- **Mobile**: 1 kortelė per ekrano centrą
- Šoninės rodyklės (kairė + dešinė), vertikaliai centruotos ant kortelės nuotraukos
- Kairė rodyklė pasirodo TIK po scroll'o į dešinę
- Dešinė rodyklė dingsta scroll'o pabaigoje

### 3. Produktų katalogas /produktai/
- Naujas puslapis su kategorijų pill'ais:
  - **Skardinės tvoros** (aktyvi, 6 produktai)
  - Vartai (greitai)
  - Metalinės tvoros (greitai)
  - Automatika (greitai)
- Pagal mygtuką keičiasi turinys (JS toggle)

### 4. Produkto puslapio hero karuselė
- Auto-swiping (4.5s intervalas)
- 3 nuotraukos ant kiekvieno produkto (Plank — 2)
- Dot indicators (klikinami)
- Pause on hover + pause kai už ekrano ribų
- Tag "Sandėlyje" su žaliu tašku viršuje
- Eglutė ir Plank Plati neturi karuselės nuotraukų — fallback į vieną nuotrauką

### 5. Atnaujinti aprašymai ir specifikacijos
- Žaliuzi: 55mm × 86mm, 11 lankstinių/m² (aklinas), 10/m² (vidutinis)
- Eglutė: 55mm × 110mm, 8 lankstiniai/m²
- Rombas 40×130: 40mm × 130mm, 8 (aklinas), 7 (vidutinis)
- Rombas 60×120: **60mm × 120mm** (anksčiau buvo 55mm), 9 (aklinas), 8 (vidutinis)
- Visi: 0,5mm storis, max segmentas 3000mm

---

## 📸 Nuotraukos `/assets/insideproducts/`

Šios nuotraukos naudojamos produkto detalaus puslapio hero karuselėje:

| Produktas | Nuotraukos |
|-----------|-----------|
| Rombas 60×120 | rombasOne.webp, rombasTwo.webp, rombasThree.webp |
| Rombas 40×130 | rombasOne40x130.webp, rombasTwo40x130.webp, rombasThree40x130.webp |
| Žaliuzi | zaliuzi.webp, zaliuziTwo.webp, zaliuziThree.webp |
| Plank lamelė | plankOne.webp, plankTwo.webp |
| Eglutė | (dar neikelta — naudoja vieną pagrindinę) |
| Plank plati | (dar neikelta — naudoja vieną pagrindinę) |

Kai įkelsi eglutės ir plačios plank lamelės karuselės nuotraukas, atidaryk `generate-products.py`, atnaujink atitinkamą `carousel_images` sąrašą ir paleisk:

```bash
python3 generate-products.py
```

---

## 🚀 Lokali peržiūra

VS Code Live Server arba bet kuris static server:

```bash
# Python
python3 -m http.server 5500

# Node
npx serve
```

Atidaryk: `http://localhost:5500/`

⚠️ **Svarbu**: produktų puslapiai naudoja absoliučius kelius (`/produktai/...`) — VS Code Live Server tai supranta. Jeigu naudoji `python3 -m http.server`, jis taip pat tinkamai pateikia `/produktai/eglute/` kaip `/produktai/eglute/index.html`.

---

## 🎨 Design tokens (`css/tokens.css`)

- **Spalvos**: monochrome warm (paper #F7F6F2, ink #0E0E0C)
- **Šriftai** (self-hosted variable):
  - Fraunces — display serif (su latin + latin-ext subset failais)
  - Geist — sans
  - Geist Mono — monospace
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- **Spacing**: `--pad-x` 1.25rem mobile / 1.5rem tablet / 2rem desktop

---

## 📞 Kontaktai (techniniai pagrindai)

- Telefonas: +370 662 56657
- El. paštas: info@tvorteka.lt
- Kaunas, Lietuva
