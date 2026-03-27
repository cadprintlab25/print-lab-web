# PRINT LAB — Web

Firemní webová prezentace pro **PRINT LAB | Ing. Marek Petschenka**
Zakázkový 3D tisk, laserové gravírování a CAD konstrukce.

🌐 **[print-lab.netlify.app](https://print-lab.netlify.app)**

---

## Technologie

| Vrstva | Technologie |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS |
| Hosting | Netlify |
| Formuláře | Netlify Forms + honeypot ochrana |
| CMS | Decap CMS + Netlify Identity |
| Verzování | Git + GitHub |

---

## Struktura projektu

```
WEB_PRINT_LAB/
├── index.html          # Úvodní stránka
├── o-mne.html          # O mně
├── sluzby.html         # Nabídka služeb
├── fotogalerie.html    # Fotogalerie realizací
├── cenik.html          # Ceník služeb
├── poptavka.html       # Poptávkový formulář
├── kontakt.html        # Kontakt
├── gdpr.html           # Zpracování osobních údajů
│
├── css/
│   └── style.css       # Hlavní stylesheet
│
├── js/
│   ├── main.js         # Hlavní JS (animace, formuláře, obfuskace e-mailu)
│   └── cms-loader.js   # Načítání dat z JSON pro CMS
│
├── img/                # Obrázky služeb a tiskáren
│   └── gallery/        # Fotogalerie realizací (13 fotek)
│
├── data/               # JSON data pro CMS
│   ├── hero.json
│   ├── o-mne.json
│   ├── cenik-3d.json
│   ├── cenik-gravir.json
│   └── gallery-manifest.json
│
├── admin/              # Decap CMS admin panel (/admin/)
│   ├── index.html
│   └── config.yml
│
├── _headers            # HTTP bezpečnostní hlavičky (Netlify)
├── netlify.toml        # Konfigurace Netlify
├── robots.txt          # Pravidla pro vyhledávače
├── sitemap.xml         # Mapa webu
└── manifest.json       # PWA manifest
```

---

## Stránky

| Stránka | URL | Popis |
|---|---|---|
| Úvod | `/` | Hero sekce, statistiky, přehled služeb |
| O mně | `/o-mne.html` | Představení, zkušenosti, tiskárny |
| Služby | `/sluzby.html` | 3D tisk, laserové gravírování, CAD, sušení filamentů |
| Fotogalerie | `/fotogalerie.html` | Realizované zakázky s filtry |
| Ceník | `/cenik.html` | Orientační ceník s tabulkami |
| Poptávka | `/poptavka.html` | Formulář pro nezávaznou poptávku |
| Kontakt | `/kontakt.html` | Kontaktní formulář, mapa, fakturační údaje |
| GDPR | `/gdpr.html` | Zpracování osobních údajů (noindex) |
| Admin | `/admin/` | CMS panel (noindex, přístup jen přes Netlify Identity) |

---

## Bezpečnost

- **HTTP hlavičky** — X-Frame-Options, CSP, HSTS, X-Content-Type-Options
- **E-mail obfuskace** — e-mailová adresa sestavena JavaScriptem, není v HTML
- **Honeypot ochrana** — Netlify Forms spam protection
- **robots.txt** — blokuje `/admin/`, `/data/`, `/.claude/`
- **SRI** — Decap CMS načítán s pinovanou verzí + `crossorigin`
- **Sandbox iframe** — Google Maps s `sandbox` atributem

---

## Aktualizace obsahu

### Přes CMS (doporučeno)
1. Jděte na `https://print-lab.netlify.app/admin/`
2. Přihlaste se přes Netlify Identity
3. Upravte texty, ceny nebo galerii

### Přes GitHub (kód a obrázky)
1. Upravte soubory lokálně v `D:\CLAUDE\WEB_PRINT_LAB\`
2. Otevřete PowerShell:
```powershell
cd D:\CLAUDE\WEB_PRINT_LAB
git add .
git commit -m "Popis změny"
git push origin main
```
3. Netlify automaticky nasadí změny (~30 sekund)

---

## Kontakt

**Ing. Marek Petschenka**
IČO: 08839204
Věžnice 25, 588 27 Jamné u Jihlavy
+420 603 319 742
