# Tvorteka — Cursor pataisymų vadovas
## Kaip naudoti
Kiekvieną žingsnį vykdyk **atskirai**. Po kiekvieno:
1. Patikrink naršyklėje (`python3 -m http.server 5500`)
2. Įsitikink, kad neatsirado naujų klaidų konsolėje
3. Tik tada eik prie kito žingsnio

**Taisyklės Cursor'iui (kartojasi visuose prompt'uose):**
- Vanilla HTML/CSS/JS — jokių naujų bibliotekų, jokio framework'o
- Nekeisk failų, kurie nėra nurodyti žingsnyje
- Po pakeitimų paleisk `npm run build:css` jei keitei CSS

---

## ŽINGSNIS 1 — package.json typo + spacing token'ai
**Failai:** `package.json`, `css/tokens.css`
**Tikslai:** Sutaisyti build script'ą, pridėti spacing sistemos pagrindą

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS, be framework'o)

Atlik tik šiuos du dalykus:

1. `package.json` — surask `build:js` script'ą ir ištaisyk typo: `tserer` → `terser` (gali būti 2 vietos). Po to terminale paleisk:
   npm run build:css && npm run build:js
   Ir patikrink, kad abu komandos baigiasi be klaidų.

2. `css/tokens.css` — failo VIRŠUJE pridėk šiuos spacing token'us (jei kurių nors jau yra — nekeisk, tik pridėk trūkstamus):
   --space-xs: 0.5rem;
   --space-sm: 1rem;
   --space-md: 1.5rem;
   --space-lg: 2.5rem;
   --space-xl: 4rem;
   --space-2xl: 6rem;
   --section-y: clamp(2.5rem, 6vw, 5rem);
   --section-y-tight: clamp(1.5rem, 4vw, 3rem);

Nieko daugiau nekeisk. Grąžink: kokie failai pakeisti ir ar build'as pavyko.
```

**Patikrinimas:** Terminale turi matytis `✓` arba „done" be raudono teksto.

---

## ŽINGSNIS 2 — Partnerių karuselė (pagrindinis pugas)
**Failai:** `index.html`, `js/main.js`, `css/main.css`
**Tikslai:** Pašalinti Statybeta, perdaryti karuselę kad mobile veiktų stabiliai

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

Sutaisyk partnerių logo karuselę `.partners-track` / `.partners-section`. Du konkretūs darbai:

1. `index.html` — surask ir PAŠALINK Statybeta logo. Jis pasikartoja dviejose `.partners-set` kopijose — ištrink ABU kartus. Paliek tik: Bauen, Diktum, Lemora, Strabas.

2. Karuselė turi 2 identiškas `.partners-set` kopijas (loop'ui). Dabartinė CSS `@keyframes marquee` animacija mobile'e keičia greitį, nes track plotis priklauso nuo ekrano.

   Sprendimas — `js/main.js` surask karuselės init funkciją (gali vadintis `setupPartnersMarquee`, `initCarousel` ar pan.) ir pakeisk animacijos principą:
   
   a) Po DOM load'o išmatuok `.partners-track` plotį: `track.scrollWidth / 2` (pusė, nes yra 2 set'ai)
   b) Apskaičiuok duration: `duration = (trackWidth / 2) / 60` (60px per sekundę = pastovus greitis)
   c) Priskirk CSS kintamąjį: `track.style.setProperty('--marquee-duration', duration + 's')`
   d) `css/main.css` — `.partners-track` animacijoje vietoj hardcoded `30s` naudok `var(--marquee-duration, 30s)`
   e) Pridėk `prefers-reduced-motion` palaikymą:
      @media (prefers-reduced-motion: reduce) {
        .partners-track { animation: none; }
      }

Nekeisk jokių kitų failų. Grąžink: kokie failai pakeisti ir kaip veikia.
```

**Patikrinimas:** Mobile viewport'e (iPhone 12 Pro DevTools) karuselė turi slinkti vienodu greičiu, neperšokti.

---

## ŽINGSNIS 3 — index.html smulkūs UI fix'ai (4 atskiros problemos)
**Failai:** `index.html`, `css/main.css`
**Tikslai:** Navbar logo, procesas rėmas, DUK šriftas, kontaktų forma

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

Atlik šiuos 4 pakeitimus — kiekvieną tiksliai kaip aprašyta:

1. NAVBAR LOGO per mažas (hp1.jpg)
   `css/main.css` — `.navbar-logo` arba `.navbar-logo img` / `.navbar-logo svg` padidink dydį ~25% desktop'e. Mobile (max-width: 767px) palik esamą arba padidink mažiau (10-15%), kad nepersikristų su hamburger menu.

2. PROCESAS TIMELINE — pirmasis žingsnis turi žalią rėmelį (hp3.jpg — matosi „Susibugine" žalias komentaras)
   `css/main.css` — surask taisyklę, kuri uždeda border/outline ant `.process-step:first-child` arba `.process-step.is-active` arba pirmo step'o. Pašalink tą border/outline taisyklę arba override'ink: `border: none; outline: none; box-shadow: none;`
   `index.html` — patikrink ar pirmas `.process-step` turi klasę `is-active` ar `active` — jei taip, pašalink ją iš HTML.

3. DUK KLAUSIMAI — šriftas turi būti Geist, ne Fraunces (hp4.jpg — „Pakeisti sriftą")
   `css/main.css` — surask `.faq` arba `.faq-question` arba `.accordion-trigger` selector'ių ir pakeisk `font-family: var(--font-display)` į `font-family: var(--font-sans)`. Atsakymų šrifto NEKEISK — jis jau teisingas.

4. KONTAKTŲ FORMA (hp5.jpg — raudonas X ant telefono, žalias „vardas@gmail.com")
   `index.html` — surask homepage'o kontaktų formos sekciją (ne /kontaktai/ puslapį):
   a) El. pašto input'o `placeholder` pakeisk iš `vardas@email.lt` į `vardas@gmail.com`
   b) Telefono lauko grupę (`<div>` su label TELEFONAS ir `<input type="tel">`) visą IŠTRINK
   `js/main.js` — surask formos submit handler'į ir pašalink bet kokią telefono validaciją (jei yra `required` check'as `telefonas` laukui).

Po pakeitimų paleisk: npm run build:css
Grąžink: kokie konkretūs CSS selektoriai/HTML elementai pakeisti.
```

**Patikrinimas:** 1) Navbar logo didesnis; 2) Process „01" be rėmo; 3) DUK klausimai Geist šriftu; 4) Forma be telefono lauko.

---

## ŽINGSNIS 4 — Footer pataisymai
**Failai:** `index.html` (footer sekcija)
**Tikslai:** Realus logo, pašalinti Produktai koloną

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`index.html` footer sekcijoje atlik 2 pakeitimus (footer.jpg nuotraukoje matosi komentarai):

1. LOGO — footer'yje yra placeholder „logo" teksto blokas. Pakeisk jį į realų logo — tą patį, kuris naudojamas navbar'e (SVG arba `<img>` iš assets). Jei navbar naudoja SVG inline — kopijuok tą patį SVG į footer. Jei naudoja `<img src="...">` — kopijuok tą pačią `<img>` eilutę.

2. PRODUKTAI KOLONA — footer'yje yra kolona su antrašte „PRODUKTAI" ir link'ais: Žaliuzi tvora, Eglutės tvora, Rombas 60×120, Rombas 40×130, Plank lamelė. IŠTRINK visą šią koloną (ir `<ul>`, ir column wrapper `<div>`). Kitos kolonos (Įmonė, Kontaktai) paliekamos.

Nekeisk jokių kitų failų. Grąžink: kaip atrodė prieš ir po (2-3 eilutės kodo palyginimui).
```

**Patikrinimas:** Footer rodo Tvorteka logo kairėje, kolonos: Įmonė + Kontaktai (be Produktai).

---

## ŽINGSNIS 5 — „Mūsų rezultatai" sekcija (apie puslapis)
**Failai:** `apie/index.html`, `css/main.css`
**Tikslai:** Sumažinti per daug juodo ploto, padidinti skaitmenų bloką (about2.jpg)

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`apie/index.html` puslapyje yra juoda „Mūsų rezultatai" sekcija su 4 skaičiais (5+, 94%, 98%, +10). Problema: per daug tuščio juodo ploto šonuose (about2.jpg — „Padidinti kad nebutu daug juodo ploto").

`css/main.css` — surask šios sekcijos stilius (`.results`, `.results-section`, `.about-results` ar panašus class):

1. Statistikų grid'o konteineriui (`.results-grid` ar `.stats-grid`) pridėk arba padidink:
   - `padding: var(--space-lg) var(--space-xl)` (arba esamą padidink)
   - `max-width: 600px` → pakeisk į `max-width: 80%` arba `max-width: 700px`
   - `width: 100%` jei nenustatytas

2. Sekcijos `padding-block` pakeisk iš dabartinės į `var(--section-y-tight)` (tai sumažins bendrą sekcijos aukštį).

3. Kiekvienas skaičiaus blokas (`.result-item`, `.stat-item` ar pan.) — pridėk `min-height: 80px` jei jo nėra.

Nekeisk HTML — tik CSS. Paleisk npm run build:css.
Grąžink: kokie selektoriai keisti ir kokios buvo/tapo reikšmės.
```

**Patikrinimas:** Juoda sekcija kompaktiškesnė, skaitmenys užima daugiau proporcingo ploto.

---

## ŽINGSNIS 6 — Kontaktai puslapis + Produktai mygtukai
**Failai:** `kontaktai/index.html`, `css/kontaktai.css` arba `css/main.css`, `produktai/index.html`
**Tikslai:** Sumažinti tarpą prieš korteles, paslėpti „greitai" mygtukus

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

Du atskiri pakeitimai:

1. KONTAKTAI PUSLAPIS (kontaktai.jpg — „Sukelti į viršų nereikia tokio didelio tarpo")
   `kontaktai/index.html` arba `css/kontaktai.css` arba `css/main.css`:
   Tarp kontaktų formos `.contact-form` (ar `.form-wrapper`) ir 3 kortelių sekcijos `.contact-cards` (ar `.contact-info-cards`) yra per didelis tarpas.
   Surask tą margin/padding ir pakeisk į `var(--space-lg)` (2.5rem). Jei tai `margin-top` ant kortelių sekcijos — pakeisk jį.

2. PRODUKTAI PUSLAPIS — filter mygtukai (produktai.jpg — „Kolkas paslėpti mygtukus")
   `produktai/index.html`:
   Surask filter mygtukus su tekstu „Vartai", „Metalinės tvoros", „Automatika" (visi turi badge „GREITAI").
   Kiekvienam iš šių 3 mygtukų pridėk atributą: `hidden`
   Skardinės tvoros mygtukas PALIEKAMAS — jo nekeisk.

Nekeisk jokių kitų failų. Paleisk npm run build:css.
```

**Patikrinimas:** 1) Kontaktai — 3 kortelės arčiau formos; 2) Produktai — matomas tik „Skardinės tvoros" mygtukas.

---

## ŽINGSNIS 7 — Mobile spacing: pagrindinis puslapis
**Failai:** `css/main.css`
**Tikslai:** Sumažinti per didelius vertikalius tarpus tarp sekcijų mobile'e (phone 3–8 nuotraukos)

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`css/main.css` — pridėk arba papildyk `@media (max-width: 767px)` bloką su šiais pakeitimais. Kiekvienas punktas atitinka konkrečią problemą iš screenshot'ų:

1. [phone 3] Tarp partnerių sekcijos ir veiklos sekcijos per didelis tarpas:
   .partners { padding-bottom: var(--space-md); }
   .veikla, .veiklos-kryptys { padding-top: var(--space-md); }

2. [phone 4] Tarp paskutinio veiklos item'o ir „Kodėl Tvorteka" juodos sekcijos:
   .veikla, .veiklos-kryptys { padding-bottom: var(--space-md); }
   /* Juodas blokas */
   .why-section, .kodel-tvorteka { padding-top: var(--space-md); }

3. [phone 5] Tarp „Procesas" antraštės ir pirmojo žingsnio:
   .procesas .section-header, .process-header { margin-bottom: var(--space-sm); }

4. [phone 7/8] Tarp FAQ paskutinio item'o ir kontaktų formos sekcijos:
   .faq { padding-bottom: var(--space-md); }
   .contact, .susisiekite { padding-top: var(--space-md); }

Svarbu: šie pakeitimai turi būti TIK viduje `@media (max-width: 767px)`. Desktop'o stiliai nekeičiami.

Jei class'ų pavadinimai nesutampa — surask tikruosius `index.html` ir naudok juos.

Paleisk: npm run build:css
Grąžink: tikslūs selektoriai kurie buvo rasti ir reikšmės prieš/po.
```

**Patikrinimas:** iPhone 12 Pro DevTools — tarpai tarp sekcijų aiškiai sumažėję.

---

## ŽINGSNIS 8 — Mobile spacing: kiti puslapiai + produkto specs
**Failai:** `css/main.css`, `apie/index.html` (tik jei reikia class'o)
**Tikslai:** Produkto specs 2 stulpeliai, apie/kontaktai mobile tarpai (phone 9–17)

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`css/main.css` — du atskiri pakeitimai:

1. PRODUKTO SPECIFIKACIJŲ LENTELĖ 2 stulpeliai (phone 9 — „Padaryti kad eilėje būtu 2")
   Produktų puslapiuose (pvz. /produktai/rombas-60-120/) yra specifikacijų sąrašas. Kiekviena eilutė turi key ir value. Mobile'e jos išdėstytos po vieną — labai išdriekta.
   
   Surask `.product-specs`, `.specs-table`, `.spec-list` ar panašų selektorių ir:
   @media (max-width: 767px) {
     .product-specs {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 0.5rem 1rem;
     }
   }
   @media (max-width: 380px) {
     .product-specs { grid-template-columns: 1fr; }
   }

2. MOBILE SPACING — kiti puslapiai:
   @media (max-width: 767px) {
     /* [phone 9] Po produkto specifikacijomis */
     .product-specs { margin-bottom: var(--space-md); }
     
     /* [phone 10] Apie mus — tarp hero ir pirmos paragrafos */
     .apie-hero, .about-hero { padding-bottom: var(--space-md); }
     
     /* [phone 11] Apie — partnerių sekcija */
     .apie .partners, .about .partners { padding-block: var(--space-md); }
     
     /* [phone 13] Tarp juodos rezultatų sekcijos ir Vertybių */
     .results-section, .musų-rezultatai { margin-bottom: var(--space-md); }
     .vertybės, .values-section { padding-top: var(--space-md); }
     
     /* [phone 14] Tarp „006 Ilgaamžiškumas" ir „Atsidavimas" */
     .value-card, .vertybe-card { margin-bottom: var(--space-sm); }
     
     /* [phone 15] Produkto hero — tarp paveikslo ir pavadinimo */
     .product-hero .product-image, .product-gallery { margin-bottom: var(--space-sm); }
     
     /* [phone 16] „Universalus dizainas" ir „Kiti profiliai" */
     .product-features, .feature-section { padding-bottom: var(--space-md); }
     .other-profiles, .kiti-profiliai { padding-top: var(--space-md); }
     
     /* [phone 17] Kontaktai — tarp formos ir kortelių */
     .contact-cards, .contact-info-cards { margin-top: var(--space-lg); }
   }

Jei class'ų pavadinimai skiriasi — surask tikruosius HTML failuose ir naudok juos.
Paleisk: npm run build:css
```

**Patikrinimas:** Patikrink visus puslapius mobile viewport'e — tarpai proporcingai sumažėję.

---

## ŽINGSNIS 9 — Apie puslapis: galerija
**Failai:** `css/main.css`
**Tikslai:** Padidinti 9 nuotraukų galerijos nuotraukas, sumažinti margin žemiau (phone 13)

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`apie/index.html` puslapyje yra 9 nuotraukų galerija (darbų foto grid'as 3×3). Mobile'e nuotraukos per mažos.

`css/main.css` — surask galerijos grid selektorių (`.gallery`, `.darbu-galerija`, `.process-gallery` ar pan.):

@media (max-width: 767px) {
  /* Padidink individualių nuotraukų min-height */
  .gallery-item, .gallery img {
    min-height: 120px;  /* buvo gali būti 80px ar mažiau */
    object-fit: cover;
  }
  
  /* Sumažink margin žemiau galerijos */
  .gallery, .gallery-grid {
    margin-bottom: var(--space-md);
  }
}

Jei class'ų pavadinimai skiriasi — patikrink `apie/index.html` ir naudok tikruosius.
Paleisk: npm run build:css
```

**Patikrinimas:** Mobile — galerjios nuotraukos matomai didesnės, tarpas žemiau sumažėjęs.

---

## ŽINGSNIS 10 — Skaičiuoklė: visi 6 tvorų tipai + custom matmenys
**Failai:** `js/skaiciuokle.js`, `css/skaiciuokle.css`
**Tikslai:** Pridėti trūkstamus tvorų variantus ir custom matmens įvedimą (skaiciuokle.jpg)

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

`js/skaiciuokle.js` — tvoros tipo pasirinkimo žingsnyje dabar yra tik 3 variantai (Žaliuzi, Rombo, Tvoralentės). Reikia pridėti dar variantų.

1. PRIDĖK VISUS TVORŲ TIPUS
   Surask masyvą arba objektą su tvorų tipais (greičiausiai yra kažkas panašaus į `fenceTypes`, `tvoros`, `models` arba tiesiog HTML su kortelėmis).
   
   Dabartiniai 3: Žaliuzi, Rombo, Tvoralentės
   Pridėk šiuos papildomus variantus (naudok tokią pačią struktūrą kaip esami):
   - Žaliuzi aklinas (jei dabartinis „Žaliuzi" yra vidutinis — pervadink į „Žaliuzi vidutinis" ir pridėk „Žaliuzi aklinas")
   - Eglutė
   - Rombas 60×120
   - Rombas 40×130
   - Plank lamelė
   - Plank plati lamelė
   
   Nuotraukas/ikonas naudok tokias pačias kaip artimiausiems variantams (pvz. Rombas 60×120 — ta pati nuotrauka kaip Rombo).

2. CUSTOM MATMENŲ LAUKAS
   Matmenų pasirinkimo žingsniuose (vartai, varteliai, tvora) — prie standartinių dydžių pasirinkimų pridėk paskutinę opciją „Kitas matmuo".
   
   Kai vartotojas pasirenka „Kitas matmuo", po pasirinkimų atsiranda input laukas:
   <input 
     type="text" 
     id="custom-dimension"
     placeholder="pvz. 3000 x 1800"
     pattern="\d+\s*[x×]\s*\d+"
   >
   
   Validacija (prieš leidžiant eiti į kitą žingsnį): patikrink ar formatas atitinka `ŠxA` (skaičiai × skaičiai). Jei ne — parodyk klaidos pranešimą: „Įveskite formatą: Plotis × Aukštis (pvz. 3000 × 1800)".

`css/skaiciuokle.css` — pridėk stilių custom input laukui:
.custom-dimension-wrap {
  margin-top: 1rem;
  display: none;
}
.custom-dimension-wrap.visible {
  display: block;
}
#custom-dimension {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
.dimension-error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: none;
}

Grąžink: kiek tvorų tipų buvo, kiek tapo, ir kur tiksliai custom input rodomas.
```

**Patikrinimas:** `/skaiciuokle/` — tvoros tipo žingsnyje turi matytis 6+ variantai; matmenų žingsnyje — „Kitas matmuo" pasirinkimas su input lauku.

---

## ŽINGSNIS 11 — Galutinis patikrinimas + commit
**Failai:** visi
**Tikslai:** Verificuoti visus pataisymus, sukurti commit'ą

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1 (vanilla HTML/CSS/JS)

Atlik galutinį patikrinimą:

1. Paleisk: npm run build:css && npm run build:js
   Ar baigiasi be klaidų?

2. Paleisk: npm run check (jei script'as egzistuoja scripts/check-script.mjs)
   Ar nėra broken link'ų ar HTML klaidų?

3. Patikrink šiuos puslapius `python3 -m http.server 5500` su iPhone 12 Pro DevTools:
   [ ] / — navbar logo didesnis, karuselė vienodas greitis, procesas be rėmo, DUK Geist šriftu, forma be telefono
   [ ] /produktai/ — tik „Skardinės tvoros" mygtukas matomas
   [ ] /produktai/rombas-60-120/ — specs lentelė 2 stulpeliai mobile
   [ ] /apie/ — galerija didesnė, juoda sekcija kompaktiškesnė
   [ ] /kontaktai/ — kortelės arčiau formos
   [ ] /skaiciuokle/ — 6+ tvorų tipai, custom matmuo pasirinkimas

4. Jei viskas gerai, sukurk git commit (BEZ push'o):
   git add -A
   git commit -m "fix: spacing rework, partners carousel, calculator full set, misc UI fixes"

Grąžink checklistą: kurie punktai ✓ pavyko, kurie ✗ dar reikia peržiūrėti.
```

---

## Greita nuoroda — failų žemėlapis

| Žingsnis | Failai |
|---|---|
| 1 | `package.json`, `css/tokens.css` |
| 2 | `index.html`, `js/main.js`, `css/main.css` |
| 3 | `index.html`, `css/main.css` |
| 4 | `index.html` (footer) |
| 5 | `apie/index.html`, `css/main.css` |
| 6 | `kontaktai/index.html`, `produktai/index.html`, `css/main.css` |
| 7 | `css/main.css` |
| 8 | `css/main.css` |
| 9 | `css/main.css` |
| 10 | `js/skaiciuokle.js`, `css/skaiciuokle.css` |
| 11 | visi (patikrinimas) |
