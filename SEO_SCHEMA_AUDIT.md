# Tvorteka — SEO / Schema auditas + GBP duplikatas

## DALIS A — Google Business Profile duplikatas (daroma rankomis, ne Cursor)

### Ką radome

| | Profilis #1 (tavo) | Profilis #2 (duplikatas) |
|---|---|---|
| Kategorija | Tvorų montavimo darbų rangovas | **Fechtavimosi reikmenų parduotuvė** |
| Atsiliepimai | 5,0 ★ (3) | Nėra |
| Telefonas | (0-662) 56657 | (0-662) 56657 — **tas pats** |
| Svetainė | tvorteka.lt | tvorteka.lt — **ta pati** |
| Valdymas | „Tvarkykite įmonės profilį" | „Pasiūlyti redagavimą" (nevaldai) |

**Kategorija atskleidžia kilmę.** „Fechtavimosi reikmenų parduotuvė" = Google automatiškai išvertė anglišką „Fence supply store". Tai reiškia, kad profilis buvo sugeneruotas automatiškai iš kažkokio duomenų šaltinio (verslo katalogo, žemėlapių duomenų tiekėjo), o ne sukurtas žmogaus. Klasikinis auto-duplikatas.

### Ką daryti — eilės tvarka

**1 variantas — pasisavink jį (geriausias)**

Google Maps → atidaryk duplikatą → apačioje ieškok „Tvarkykite šį verslą" / „Claim this business". Jei toks mygtukas yra:
- Pasisavink jį **ta pačia Google paskyra**, kuria valdai pagrindinį
- Kai abu bus po ta pačia paskyra, GBP dashboard'as pats aptiks duplikatą ir pasiūlys **„Merge"**
- Merge sujungia signalus į vieną profilį — nieko neprarandi

**2 variantas — pasiūlyk pašalinti**

Jei „Claim" mygtuko nėra: duplikate → **„Pasiūlyti redagavimą"** → „Uždaryti arba pašalinti" → pasirink **„Tai dublikatas"** (ne „Uždaryta visam laikui").

⚠️ **Nežymėk „Uždaryta visam laikui"** — kadangi abu profiliai turi tą patį telefoną ir svetainę, „closed" žyma gali persimesti ant tavo pagrindinio profilio.

**3 variantas — GBP Support (greičiausias)**

support.google.com/business → Contact us. Pateik:
- Abiejų profilių Google Maps nuorodas
- Nurodyk kurį palikti (tą su 3 atsiliepimais)
- Paminėk, kad antras turi neteisingą kategoriją ir sutampantį NAP

Peržiūra paprastai 2–5 d.d.

### Būtinai sutvarkyk ir tai

**Darbo laikas — galutinis (patvirtinta):**

```
I–V   8:00–18:00
VI    8:00–15:00
VII   nedirbame
```

Turi sutapti trijose vietose:
1. **GBP** — ⚠️ šiuo metu nustatyta 8:00–19:00, **pakeisk į 18:00**
2. **Svetainės** kontaktų puslapis + homepage kontaktų sekcija
3. **Schema** `openingHoursSpecification` (žr. DALIS B, problema 2c)

NAP neatitikimai yra vienas iš signalų, dėl kurių Google generuoja atskirus įrašus.

**Adresas.** Jei GBP nėra tikslaus adreso (tik „Kaunas"), pridėk arba nustatyk service-area business su aiškiu aptarnavimo regionu.

---

## DALIS B — Cursor prompt'as: pilnas schema + sitemap auditas

Šis prompt'as skirtas vienam paleidimui. Jis apima viską, ką radome svetainėje.

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1
Statinis vanilla HTML/CSS/JS tinklapis, deploy į Cloudflare Pages. 17 puslapių.

Užduotis: SEO struktūrizuotų duomenų (JSON-LD) ir sitemap auditas + pataisymas.
NEKEISK dizaino, CSS ar JS logikos. Tik <head> metaduomenys, JSON-LD ir sitemap.xml.

=== KONTEKSTAS: kas jau patikrinta ===
- Visi 17 puslapių yra sitemap.xml — URL sąrašas TEISINGAS, netrūksta nė vieno
- Visi puslapiai turi rel=canonical ir Open Graph — OK
- robots.txt teisingas, nurodo į sitemap
- Kiekvienas puslapis turi BreadcrumbList schema — OK

=== PROBLEMA 1: neegzistuojantis schema.org tipas ===
Failai: index.html (~193 eil.), kontaktai/index.html (~46 eil.)

Abiejuose yra: "@type": "FenceContractor"
Tokio schema.org tipo NĖRA. Google jį ignoruoja — visas LocalBusiness markup'as
šiuo metu neveikia.

Pakeisk į galiojantį tipą:
  "@type": ["HomeAndConstructionBusiness", "GeneralContractor"]

=== PROBLEMA 2: LocalBusiness markup'as nepilnas ===
Tuose pačiuose dviejuose blokuose:

a) "sameAs": [] yra TUŠČIAS. Užpildyk (URL'us paimk iš footer social nuorodų
   index.html faile — ten yra Facebook ir Instagram):
   "sameAs": [
     "https://www.facebook.com/<...>",
     "https://www.instagram.com/<...>"
   ]
   Jei footer'yje nuorodos yra placeholder'iai (# arba tuščios) — palik komentarą
   HTML'e: <!-- TODO: pridėti realius social + GBP URL -->

b) PostalAddress neturi "streetAddress". Pridėk lauką su placeholder'iu:
   "streetAddress": "TODO"
   (jei tikslaus adreso nėra — praleisk šitą punktą ir pranešk man)

c) Pridėk darbo laiką. TIKSLIOS reikšmės (nekeisk, neišgalvok):
   I–V 8:00–18:00, VI 8:00–15:00, VII nedirbame

   "openingHoursSpecification": [
     {
       "@type": "OpeningHoursSpecification",
       "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
       "opens": "08:00", "closes": "18:00"
     },
     {
       "@type": "OpeningHoursSpecification",
       "dayOfWeek": "Saturday",
       "opens": "08:00", "closes": "15:00"
     }
   ]
   (Sekmadienio neįrašinėk — jo nebuvimas sąraše reiškia „uždaryta")

   TAIP PAT: patikrink HTML turinį kontaktai/index.html ir index.html
   kontaktų sekcijose. Jei ten nurodytas kitoks laikas — pataisyk į
   I–V 8:00–18:00, VI 8:00–15:00. Visos trys vietos turi sutapti.

d) Pridėk logotipą (kelias — tas pats, kurį naudoja navbar):
   "logo": "https://tvorteka.lt/<kelias-iki-logo>"
   "image": "https://tvorteka.lt/<kelias-iki-og-image>"

e) Pridėk "@id": "https://tvorteka.lt/#organization" — kad abu puslapiai
   nurodytų į TĄ PATĮ entity, o ne kurtų du atskirus.

SVARBU: index.html ir kontaktai/index.html LocalBusiness blokai turi būti
100% identiški (tas pats @id, tie patys laukai). Dabar jie dubliuojasi
su skirtingu turiniu — tai kenkia.

=== PROBLEMA 3: produktų puslapiuose NĖRA Product schema ===
13 produktų puslapių (produktai/*/index.html) turi TIK BreadcrumbList.
Trūksta Product markup'o — dėl to Google nerodo rich result'ų.

Kiekvienam produkto puslapiui pridėk atskirą JSON-LD bloką. Duomenis imk
IŠ TO PATIES PUSLAPIO HTML (specifikacijų lentelė, pavadinimas, aprašymas,
nuotraukos) — NIEKO NEIŠGALVOK:

{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "<h1 tekstas>",
  "description": "<meta description turinys>",
  "image": "<og:image URL>",
  "brand": {"@type": "Brand", "name": "Tvorteka"},
  "manufacturer": {"@id": "https://tvorteka.lt/#organization"},
  "category": "Skardinės tvoros",
  "additionalProperty": [
    {"@type": "PropertyValue", "name": "Profilio tipas", "value": "<iš specs>"},
    {"@type": "PropertyValue", "name": "Skardos storis", "value": "<iš specs>"},
    {"@type": "PropertyValue", "name": "Lankstinio plotis", "value": "<iš specs>"},
    {"@type": "PropertyValue", "name": "Lankstinio aukštis", "value": "<iš specs>"}
  ]
}

NEPRIDĖK "offers" bloko su kaina — kainų svetainėje nėra, o išgalvota
kaina Search Console'e virs klaida.

=== PROBLEMA 4: DUK sekcija be FAQPage schema ===
index.html turi DUK accordion su 5 klausimais. Pridėk FAQPage JSON-LD,
tekstus paimdamas TIKSLIAI iš HTML (klausimas + atsakymas):

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<klausimo tekstas>",
      "acceptedAnswer": {"@type": "Answer", "text": "<atsakymo tekstas>"}
    }
    // ... visi 5
  ]
}

=== PROBLEMA 5: sitemap lastmod pasenęs ===
sitemap.xml visų URL lastmod = 2026-06-18, bet dalis failų keista vėliau.

Atnaujink lastmod kiekvienam URL pagal REALŲ atitinkamo index.html failo
git commit datą. Naudok:
  git log -1 --format=%cd --date=short -- <failo kelias>

Jei failas neturi commit'o — naudok šiandienos datą.
URL sąrašo NEKEISK — jis pilnas ir teisingas.

=== VERIFIKACIJA ===
Po visų pakeitimų:
1. Paleisk: npm run check
2. Patikrink kiekvieną JSON-LD bloką ar tai galiojantis JSON
   (node -e "JSON.parse(...)" arba python3 -m json.tool)
3. Įsitikink, kad nė viename faile nebeliko "FenceContractor"

=== ATASKAITA ===
Grąžink lentelę:
| Failas | Kas pakeista | Prieš | Po |

Ir atskirai išvardink:
- Kur palikai TODO placeholder'ius (ir kodėl)
- Ar radai neatitikimų tarp HTML turinio ir schema duomenų
```

---

## DALIS C — po Cursor darbo (rankiniai žingsniai)

1. **Google Rich Results Test** — https://search.google.com/test/rich-results
   Patikrink: `/`, `/produktai/rombas-60-120/`, `/kontaktai/`

2. **Schema Markup Validator** — https://validator.schema.org
   Sugaudo klaidas, kurių Google testas nerodo

3. **Search Console** → Sitemaps → pateik `sitemap.xml` iš naujo

4. **Search Console** → URL Inspection → „Request indexing" pagrindiniam puslapiui

5. Kai GBP duplikatas bus pašalintas — grįžk prie `sameAs` ir pridėk **GBP profilio URL**. Tai stipriausias signalas siejant svetainę su verslo profiliu.

---

## DALIS D — social URL užpildymas (follow-up prompt)

Patvirtinti URL:

```
Facebook:  https://www.facebook.com/profile.php?id=61589661284002
Instagram: https://www.instagram.com/tvorteka/
GBP:       laukiama, kol bus pašalintas duplikatas
```

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1

Turiu realius social URL. Užpildyk juos dviejose vietose.

=== 1. sameAs schema laukas ===
Failai: index.html, kontaktai/index.html

Abiejuose LocalBusiness JSON-LD blokuose pakeisk tuščią sameAs į:

  "sameAs": [
    "https://www.facebook.com/profile.php?id=61589661284002",
    "https://www.instagram.com/tvorteka/"
  ]

Pašalink TODO komentarą apie social URL (streetAddress TODO — PALIK,
gatvės adreso vis dar nėra).

Blokai turi likti 100% identiški tarpusavyje.

=== 2. Footer social nuorodos ===
Failas: index.html (footer sekcija)

Footer'yje yra Facebook ir Instagram ikonos su href="#".
Pakeisk į realius URL (tie patys kaip aukščiau) ir kiekvienam pridėk:
  target="_blank" rel="noopener noreferrer"
  aria-label="Tvorteka Facebook" / aria-label="Tvorteka Instagram"

Patikrink, ar tokių href="#" social nuorodų nėra ir kituose puslapiuose
(apie, veikla, kontaktai, produktai, skaiciuokle) — jei footer kartojasi,
pataisyk visur.

=== VERIFIKACIJA ===
1. grep -rn 'href="#"' --include=index.html . | grep -v node_modules
   → neturi likti nė vienos social nuorodos su #
2. Patikrink JSON validumą: python3 -m json.tool
3. Paleisk: npm run check

Grąžink: kiek failų pakeista ir ar liko href="#" kur nors kitur.
```

**Pastaba dėl Facebook URL:** `profile.php?id=...` veikia, bet Google labiau pasitiki vanity URL (pvz. `facebook.com/tvorteka`). Kai Facebook puslapis surinks 25 sekėjus, galėsi susikurti trumpą vardą — tada verta atnaujinti `sameAs`.

---

## DALIS E — Naujausi radiniai (2026-08-03)

### ⚠️ KRITINĖ PROBLEMA: visa svetainė dabar sako „Vilnius", ne „Kaunas"

Tikrinant favicon problemą aptikta: commit'as „changed address, layout, optimized seo, geo" pakeitė **VISUS** miesto paminėjimus svetainėje iš Kaunas → Vilnius. Tai apima:

- `<title>` ir meta description **visuose** 17 puslapių
- Schema.org `addressLocality` abiejuose LocalBusiness blokuose (index.html, kontaktai/index.html)
- Footer adresas: „A. Vivulskio g. 41-38, Vilnius" — **visuose** puslapiuose
- Tikrasis adresas (gatvė + pašto kodas LT-03114) dabar pridėtas — tai gerai — bet miestas neteisingas

**Prieštaravimas su likusiu turiniu:** index.html DUK sakinys sako „Kauno regione matavimai nemokami. Toliau (Vilnius...)" — tai reiškia, kad tekstas rašytas turint galvoje **Kauną** kaip bazę, o Vilnių kaip „toliau esantį" miestą. Dabar schema ir footer sako priešingai.

**Tai tiesiogiai paaiškina** ketvirtame screenshot'e matomą Google rezultatą: „Tvorteka — tvorų ir vartų gamyba bei montavimas | **Vilnius**" ir „gamina ir montuoja skardinės tvoras **Vilniuje**". Google tiesiog atkartoja tavo paties schema duomenis.

**GBP (Google Business Profile) rodo Kauną.** Taigi dabar turi DAR VIENĄ NAP neatitikimą tarp svetainės ir GBP — tiksliai tą patį tipo bug'ą, kuris jau kūrė dublikatą.

**Prieš taisant — reikia atsakymo:** ar A. Vivulskio g. 41-38 yra tikras adresas Vilniuje (t.y. įmonė persikėlė / turi biurą Vilniuje), ar tai klaida ir turėtų būti Kaunas? Kol neaišku — nieko nekeičiu automatiškai.

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1

KONTEKSTAS: Visa svetainė šiuo metu nurodo miestą „Vilnius", bet Google Business
Profile ir dalis turinio (FAQ atsakymas apie matavimus) nurodo „Kaunas". Tai NAP
(Name-Address-Phone) neatitikimas, kuris tiesiogiai kenkia Google paieškai.

TEISINGAS MIESTAS: <ĮRAŠYK ČIA — Kaunas AR Vilnius>
TEISINGA GATVĖ: <patvirtink ar A. Vivulskio g. 41-38, LT-03114 lieka>

Pakeisk VISUS "Vilnius" paminėjimus į teisingą miestą šiuose failuose ir vietose:
1. <title> ir <meta property="og:title">, <meta name="description">,
   <meta property="og:description"> — visuose 17 index.html failuose
2. Schema.org "addressLocality" — index.html ir kontaktai/index.html
3. Footer adreso eilutė "A. Vivulskio g. 41-38, Vilnius" — visuose failuose,
   kur kartojasi footer
4. kontaktai/index.html "footer-desc" tekstas ("...montavimas Vilniuje...")
5. Bet kur kitur, kur grep randa "Vilni" (paleisk prieš ir po:
   grep -rn "Vilni" --include="*.html" . | grep -v node_modules)

NEKEISK FAQ atsakymo apie "Kauno regione matavimai nemokami" TURINIO — tik
patikrink, ar jis vis dar logiškai teisingas su nauju miestu (jei bazė lieka
Kaunas, sakinys jau teisingas ir jo NELIESK; jei bazė tampa Vilnius, pakeisk
"Kauno regione" į "Vilniaus regione" ir atitinkamai kitus miestus sąraše).

Po pakeitimų:
grep -rn "Vilni" --include="*.html" . | grep -v node_modules
turi likti TIK teisingi paminėjimai (pvz. jei liks Kaunas kaip bazė, Vilnius
gali likti tik "aptarnaujame ir Vilnių" kontekste).

Grąžink: kiek failų pakeista, kiek "Vilnius" paminėjimų liko ir kur.
```

---

### Search Console: „Reikia nurodyti offers, review, arba aggregateRating"

**Kas tai.** Google patikrino 11 produktų puslapių pridėtą `Product` schema (iš DALIS B, problema 3) ir sako: kad puslapis būtų tinkamas rodyti kaip prekės rezultatas (rich snippet — kaina, reitingas ir pan. paieškoje), reikia bent vieno iš trijų laukų: `offers` (kaina), `review` arba `aggregateRating`.

**Tai NE klaida, kuri žalotų indeksavimą.** Google pati rašo: „Netinkami elementai negalimi išsamiuose Google paieškos rezultatuose" — puslapis vis tiek indeksuojamas ir rodomas normaliai, tiesiog negauna papildomo rich snippet vaizdo (žvaigždučių, kainos paieškoje).

**Kodėl nepridėsime offers/rating.** Anksčiau sąmoningai neįtraukėme kainos (jos nėra svetainėje — kainos individualios) ir reitingo (jį deklaruoti savarankiškai draudžia Google — už tai gaunama rankinė sankcija).

**Teisingas sprendimas — pakeisti schema tipą.** `Product` tinka daiktams su fiksuota kaina parduotuvėje. Tvorteka parduoda **paslaugą** (individualiai pagaminta ir sumontuota tvora), ne prekę su kaina lentynoje. Schema.org tam turi tinkamesnį tipą — `Service` — kuriam offers/review/aggregateRating NEREIKALINGI, ir Search Console įspėjimas išnyks visam laikui, nes reikalavimas paprasčiausiai nebetaikomas.

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1

11 produktų puslapių (produktai/*/index.html, išskyrus katalogo produktai/index.html)
turi "@type": "Product" JSON-LD. Google Search Console rodo įspėjimą, kad trūksta
offers/review/aggregateRating — bet šie laukai netinka, nes Tvorteka neturi fiksuotų
kainų (individualus įkainojimas).

Pakeisk kiekviename produkto puslapyje:
  "@type": "Product"
į
  "@type": "Service"

Ir pritaikyk laukus Service tipui (pašalink Product-specifinius, pridėk trūkstamus):
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "<h1 tekstas>",
  "description": "<meta description turinys>",
  "image": "<og:image URL>",
  "provider": {"@id": "https://tvorteka.lt/#organization"},
  "areaServed": {"@type": "Country", "name": "Lietuva"},
  "serviceType": "Skardinės tvoros gamyba ir montavimas",
  "additionalProperty": [
    // palik esamus specs laukus (Profilio tipas, Skardos storis, ir t.t.) —
    // Service tipas juos priima taip pat kaip Product
  ]
}

Pašalink "brand" ir "manufacturer" laukus (jie Product-specifiniai; provider juos
pakeičia). "category" lauką gali palikti arba pašalinti — Service jo nereikalauja.

Po pakeitimų:
1. python3 -m json.tool patikrinimui kiekvienam JSON-LD blokui
2. npm run check

Grąžink: kiek failų pakeista, sąrašą kurie.
```

---

### Favicon rodo baltas raides (nematomas)

**Šaknies priežastis rasta.** `scripts/generate-favicons.sh` generuoja visus favicon failus iš `assets/tvortekLogonoBg.png` — o tas failas yra **baltas** ženklas skaidriame fone (patikrinta programiškai: vidutinė spalva RGB 251,251,251). Naršyklės skirtukas dažniausiai šviesus/baltas — todėl ženklas tampa nematomas.

Tuo tarpu navbar'e naudojamas `assets/tvortekaLogo.png` yra **juodas** (RGB 4,5,5) — tas pats vartų+T ženklas, tik teisinga spalva. Deja, jis nekvadratinis (280×152) ir apkarpytas per arti krašto — netinka tiesiogiai favicon generavimui be perdarymo.

```
Projektas: /Users/aksendo/IT-Projektai/tvortekav1

Favicon failai (favicon.ico, favicon-16x16.png, favicon-32x32.png,
apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png)
šiuo metu generuojami iš assets/tvortekLogonoBg.png, kuris yra BALTAS ženklas —
todėl favicon nematomas šviesiuose naršyklės skirtukuose.

Naudok ImageMagick (jau reikalingas scripts/generate-favicons.sh).

1. Sukurk naują tamsų kvadratinį šaltinį iš esamo balto:
   assets/tvortekLogonoBg.png turi tą patį ženklą kaip assets/tvortekaLogo.png,
   tik baltas ir kvadratinėje 500×500 nuotraukoje su patogiu paddingu.

   Perspalvink jį į juodą (arba --color-ink token'ą iš css/tokens.css, jei
   apibrėžtas; fallback #0E0E0C), IŠLAIKANT alpha kanalą (permatomą foną):

   magick assets/tvortekLogonoBg.png -fuzz 20% -fill "#0E0E0C" \
     -opaque white assets/tvortekaIcon-dark.png

   (Jei -opaque white neveikia dėl anti-aliasing pilkų pikselių, naudok
   alternatyvą: paimk alpha kanalą kaip masę ir užpildyk juodai:
   magick assets/tvortekLogonoBg.png -alpha extract -threshold 50% \
     -negate -fill "#0E0E0C" -opaque black -alpha off \
     assets/tvortekLogonoBg.png -compose CopyOpacity -composite \
     assets/tvortekaIcon-dark.png)

   Patikrink rezultatą — atidaryk assets/tvortekaIcon-dark.png ir įsitikink,
   kad ženklas TAMSUS, fonas SKAIDRUS.

2. scripts/generate-favicons.sh — pakeisk:
   SRC="$ROOT/assets/tvortekLogonoBg.png"
   į
   SRC="$ROOT/assets/tvortekaIcon-dark.png"

3. Paleisk: ./scripts/generate-favicons.sh
   (jei magick nėra: brew install imagemagick)

4. Patikrink sugeneruotus failus programiškai — vidutinė opaque pikselių
   spalva turi būti TAMSI (RGB reikšmės žemos, arti 0), NE šviesi:

   python3 -c "
   from PIL import Image
   for f in ['favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png']:
       im = Image.open(f).convert('RGBA')
       px = im.load()
       w,h = im.size
       samples = [px[x,y][:3] for x in range(0,w,max(1,w//10))
                  for y in range(0,h,max(1,h//10)) if px[x,y][3] > 50]
       avg = tuple(sum(c[i] for c in samples)//len(samples) for i in range(3)) if samples else None
       print(f, avg)
   "
   Kiekvienam faile avg reikšmės turi būti žemos (pvz. ~(14,14,12)), NE aukštos
   (~(235,235,235) reikštų, kad fix'as nepavyko).

5. Naršyklėje (Cmd+Shift+R hard refresh arba naujas incognito langas)
   patikrink skirtuko ikoną — turi matytis tamsus vartų+T ženklas.

Grąžink: patvirtinimą, kad avg RGB tamsus, ir naujo assets/tvortekaIcon-dark.png
kelią.
```

**Pastaba:** kai bus sugeneruota, `git add -A && git status` parodys pakeistus binary failus — jie nebus žmogui skaitomi diff'e, tai normalu.

---

## Ko NEDARYTI

- Nepridėk `AggregateRating` schema su GBP atsiliepimais — Google draudžia savarankiškai deklaruoti reitingus, tai gauna rankinę sankciją
- Nepridėk `Offer` su kainomis, kurių nėra svetainėje
- Nekurk antro sitemap failo — vienas užtenka 17 puslapių
