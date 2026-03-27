# 🚀 Postup nasazení webu PRINT LAB — GitHub + Netlify

> **Co získáte:** Web dostupný na internetu zdarma, s automatickým HTTPS, s admin panelem pro úpravy obsahu.

---

## ✅ Co budete potřebovat

| Co | Kde získat | Cena |
|----|-----------|------|
| GitHub účet | github.com | Zdarma |
| Netlify účet | netlify.com | Zdarma |
| GitHub Desktop (doporučeno) | desktop.github.com | Zdarma |

---

## ČÁST 1 — GITHUB (úložiště souborů)

### Krok 1 — Stáhněte GitHub Desktop

1. Jděte na **desktop.github.com**
2. Klikněte **Download for Windows**
3. Nainstalujte a přihlaste se (nebo si nejprve vytvořte účet na github.com)

---

### Krok 2 — Vytvořte nový repozitář

1. V GitHub Desktop klikněte **File → New repository**
2. Vyplňte:
   - **Name:** `print-lab-web`
   - **Local path:** `D:\CLAUDE\` *(rodičovská složka — GitHub Desktop sám vytvoří podsložku)*
   - **Description:** PRINT LAB — web Ing. Marek Petschenka
   - ✅ zaškrtněte **Initialize this repository with a README**
3. Klikněte **Create repository**

> ⚠️ **Pozor:** GitHub Desktop vytvoří NOVOU složku `D:\CLAUDE\print-lab-web\`.
> Soubory webu z `D:\CLAUDE\WEB_PRINT_LAB\` do ní **zkopírujte ručně** (viz Krok 3).

---

### Krok 3 — Zkopírujte soubory webu

Otevřete Průzkumníka Windows a zkopírujte obsah složky
`D:\CLAUDE\WEB_PRINT_LAB\`
do
`D:\CLAUDE\print-lab-web\`

**Zkopírujte tyto soubory a složky:**

```
✅ index.html
✅ o-mne.html
✅ sluzby.html
✅ fotogalerie.html
✅ cenik.html
✅ poptavka.html
✅ kontakt.html
✅ gdpr.html
✅ robots.txt
✅ sitemap.xml
✅ manifest.json
✅ netlify.toml
✅ _headers
✅ .gitignore
✅ css/         (celá složka)
✅ js/          (celá složka)
✅ img/         (celá složka včetně gallery/)
✅ admin/       (celá složka)
✅ data/        (celá složka)
```

**NEKOPÍRUJTE:**
```
❌ .claude/         (pracovní soubory Claude Code)
❌ server.js        (lokální vývojový skript)
❌ console.log*     (ladící soubory)
❌ NAVOD-*.md       (tento návod — nepatří na web)
```

---

### Krok 4 — Nahrajte na GitHub

1. Přepněte zpět do **GitHub Desktop** — vidíte seznam všech zkopírovaných souborů
2. Vlevo dole vyplňte:
   - **Summary:** `Prvotní nahrání webu Print Lab`
3. Klikněte **Commit to main**
4. Klikněte **Publish repository** (nebo **Push origin**)
5. V dialogu:
   - ✅ ponechte **Keep this code private** (doporučeno)
   - Klikněte **Publish repository**

> 🎉 Soubory jsou nyní na GitHubu na adrese `github.com/VÁŠ-NICK/print-lab-web`

---

## ČÁST 2 — NETLIFY (hosting + HTTPS + formuláře)

### Krok 5 — Vytvořte Netlify účet

1. Jděte na **netlify.com**
2. Klikněte **Sign up**
3. Zvolte **Sign up with GitHub** — propojíte oba účty najednou

---

### Krok 6 — Připojte repozitář

1. V Netlify dashboardu klikněte **Add new site → Import an existing project**
2. Klikněte **GitHub**
3. Povolte přístup k repozitáři `print-lab-web`
4. Nastavení ponechte výchozí:
   - Branch: `main`
   - Build command: *(prázdné)*
   - Publish directory: `.`
5. Klikněte **Deploy site**

> Za ~30 sekund běží web na adrese jako `random-name-123456.netlify.app`

---

### Krok 7 — Přejmenujte adresu webu

1. Netlify → váš web → **Site configuration → Site details → Change site name**
2. Zadejte např. `printlab-petschenka`
3. Web bude dostupný na `printlab-petschenka.netlify.app`

---

### Krok 8 — Aktivujte formuláře (Netlify Forms)

Formuláře na stránkách Poptávka a Kontakt odesílají data přes Netlify Forms.

1. Netlify → váš web → záložka **Forms**
2. Pokud vidíte formuláře `poptavka` a `kontakt` → ✅ vše funguje automaticky
3. Každé odeslání formuláře dostanete e-mailem na:
   - Netlify → **Forms → Form notifications → Add notification → Email notification**
   - Zadejte `cadprintlab.25@gmail.com`

---

### Krok 9 — Aktivujte správu webu (Netlify Identity + CMS)

#### 9a. Zapněte Netlify Identity:
1. Netlify → váš web → **Integrations → Identity → Enable Identity**
2. **Identity → Settings → Registration → přepněte na: Invite only**

#### 9b. Zapněte Git Gateway:
1. Stále v Identity nastavení → scrollujte dolů na **Services**
2. Klikněte **Enable Git Gateway**

#### 9c. Pozvěte sebe jako správce:
1. **Identity → Invite users**
2. Zadejte `cadprintlab.25@gmail.com`
3. Zkontrolujte e-mail → klikněte na odkaz → nastavte heslo

#### 9d. Přihlaste se do admin panelu:
1. Jděte na `printlab-petschenka.netlify.app/admin`
2. Přihlaste se e-mailem a heslem

---

## ČÁST 3 — VLASTNÍ DOMÉNA (volitelné)

Pokud máte nebo si koupíte doménu (např. `printlab.cz`):

### Krok 10 — Přidejte doménu v Netlify

1. Netlify → **Site configuration → Domain management → Add domain**
2. Zadejte `printlab.cz` → klikněte **Verify → Add domain**
3. Netlify vám zobrazí **DNS záznamy** — vypadají takto:

```
Typ: A       Hodnota: 75.2.60.5
Typ: CNAME   Název: www    Hodnota: printlab-petschenka.netlify.app
```

### Krok 11 — Nastavte DNS u registrátora

1. Přihlaste se ke svému registrátorovi domény (např. Wedos, Active24, Forpsi)
2. Najděte **DNS záznamy / DNS Management**
3. Přidejte záznamy přesně podle toho, co zobrazí Netlify
4. Změna DNS se projeví do 24 hodin (obvykle do 1 hodiny)

> ✅ Netlify automaticky vydá SSL certifikát (HTTPS) zdarma po aktivaci domény.

---

## ČÁST 4 — BUDOUCÍ AKTUALIZACE WEBU

Kdykoli budete chtít aktualizovat web (nové fotky, úpravy textu přes HTML soubory):

### Možnost A — přes GitHub Desktop (doporučeno)

1. Upravte soubory v `D:\CLAUDE\print-lab-web\` (nebo sem překopírujte změny)
2. GitHub Desktop automaticky zobrazí změněné soubory
3. Vyplňte popis změny, klikněte **Commit to main**
4. Klikněte **Push origin**
5. Netlify automaticky nasadí novou verzi za ~30 sekund

### Možnost B — přes admin panel (pro obsah)

1. Jděte na `váš-web.netlify.app/admin`
2. Proveďte změny v editoru
3. Klikněte **Publish** → změny se uloží do GitHubu automaticky

---

## ❓ Časté otázky

**Q: Zapomněl jsem heslo do admin panelu?**
A: Na `/admin` klikněte „Forgot password" → přijde reset e-mail.

**Q: Jak přidat nové fotky do galerie?**
A: Nakopírujte fotky do `img/gallery/` a aktualizujte `fotogalerie.html`, pak pushněte přes GitHub Desktop.

**Q: Jak dlouho trvá, než se změny projeví?**
A: GitHub → Netlify: 30–90 sekund. DNS změny: 1–24 hodin.

**Q: Je hosting opravdu zdarma navždy?**
A: Netlify Free tier pokryje běžný web s nízkým provozem bez omezení.
Limit: 100 GB/měsíc přenosu, 300 build minut/měsíc — to vám bohatě stačí.

**Q: Co dělat, když se formulář neodesílá?**
A: Zkontrolujte v Netlify → Forms, zda jsou formuláře `poptavka` a `kontakt` viditelné.
Pokud ne, proveďte nový deploy (Netlify → Deploys → Trigger deploy).

---

## 📋 Kontrolní seznam před spuštěním

- [ ] Web funguje na Netlify URL (otevřete všechny stránky)
- [ ] Formulář Poptávka odešle testovací zprávu
- [ ] Formulář Kontakt odešle testovací zprávu
- [ ] Notifikace dorazí na cadprintlab.25@gmail.com
- [ ] Admin panel dostupný na `/admin`
- [ ] E-mail a heslo do admin panelu funkční
- [ ] Vlastní doména nastavena (pokud chcete)
- [ ] HTTPS certifikát aktivní (zelený zámek v prohlížeči)

---

*Připravil: Claude Code | Print Lab — Ing. Marek Petschenka | 2026*
