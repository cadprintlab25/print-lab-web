# 🚀 Návod: Nasazení Print Lab webu na internet (zdarma)
## + Správa webu přes GUI admin panel (bez HTML!)

---

## KROK 1 — Vytvoř si GitHub účet (úložiště pro soubory webu)

1. Jdi na **github.com** → klikni **Sign up**
2. Zvol si libovolné uživatelské jméno, e-mail a heslo
3. Potvrdí e-mailem

---

## KROK 2 — Nahraj soubory na GitHub

### Možnost A — přes prohlížeč (nejjednodušší):
1. Na GitHub klikni **+** → **New repository**
2. Název: `print-lab-web` (nebo cokoliv)
3. Nastav: **Public**, zaškrtni "Add README"
4. Klikni **Create repository**
5. V repozitáři klikni **Add file** → **Upload files**
6. Přetáhni **CELOU složku** `D:/CLAUDE/WEB_PRINT_LAB/` (všechny soubory)
7. Klikni **Commit changes**

### Možnost B — přes GitHub Desktop (doporučeno pro příště):
- Stáhni **GitHub Desktop** z desktop.github.com
- Clone/přidej složku `D:/CLAUDE/WEB_PRINT_LAB/`

---

## KROK 3 — Připoj web na Netlify (hosting zdarma)

1. Jdi na **netlify.com** → **Sign up with GitHub**
2. Po přihlášení klikni **Add new site** → **Import an existing project**
3. Vyber **GitHub** → zvol svůj repozitář `print-lab-web`
4. Nastavení ponech výchozí (build command prázdný, publish directory `.`)
5. Klikni **Deploy site**
6. Za ~30 sekund máš web dostupný na adrese jako `silly-name-123.netlify.app`

### Přejmenování adresy:
- V Netlify → **Site settings** → **Domain management** → **Custom domain**
- Vlož `print-lab.netlify.app` nebo vlastní doménu

---

## KROK 4 — Aktivuj správu webu (admin panel)

### 4a. Zapni Netlify Identity:
1. V Netlify → tvůj web → záložka **Integrations**
2. Najdi **Identity** → klikni **Enable Identity**
3. V nastavení Identity → **Registration preferences** → přepni na **Invite only**

### 4b. Zapni Git Gateway:
1. Stále v Identity nastavení → scrolluj dolů na **Services**
2. Klikni **Enable Git Gateway**

### 4c. Pozvi sebe jako uživatele:
1. Identity → **Invite users**
2. Zadej svůj e-mail
3. Zkontroluj e-mail → klikni na pozvánku → nastav heslo

---

## KROK 5 — Používej admin panel

1. Jdi na `tvůj-web.netlify.app/admin`
2. Přihlas se svým e-mailem a heslem
3. Máš přístup k úpravám:

---

## Co lze editovat v admin panelu

| Sekce | Co lze měnit |
|-------|-------------|
| **⚙️ Obecné nastavení** | Logo (nahrát obrázek), název firmy, jméno |
| **📞 Kontakty** | Telefon, e-mail, adresa, IČO, DIČ |
| **🔗 Sociální sítě** | Facebook, Instagram, LinkedIn, YouTube |
| **🎯 Hero sekce** | Nadpis, popis, text tlačítek |
| **🖼️ Galerie** | Přidat/smazat fotky, přiřadit kategorie |
| **💰 Ceník** | Ceny 3D tisku a gravírování |
| **👤 O mně** | Foto, bio text, dovednosti, timeline |

---

## Jak nahrát nové logo

1. V admin panelu → **⚙️ Nastavení webu** → **Obecné & Kontakty**
2. Klikni na pole **Logo (obrázek)**
3. Klikni **Choose an image** → **Upload**
4. Vyber PNG nebo SVG soubor z počítače (doporučená výška 48px)
5. Klikni **Publish** → logo se automaticky zobrazí na všech stránkách

---

## Jak přidat fotku do galerie

1. Admin panel → **🖼️ Galerie prací** → **New Gallery Prací**
2. Vyplň název projektu
3. Klikni na pole **Fotografie** → nahraj foto
4. Vyber kategorii (3D tisk / Gravírování / CAD)
5. Klikni **Publish**
6. Fotka se automaticky zobrazí ve fotogalerii na webu

---

## ❓ Časté otázky

**Q: Jak dlouho trvá, než se změny projeví?**
A: Obvykle 30–60 sekund po kliknutí na Publish.

**Q: Jsou data v bezpečí?**
A: Vše je uloženo v GitHubu — každá změna je zaznamenaná a lze ji vrátit.

**Q: Co dělat, když zapomenu heslo?**
A: Na `/admin` klikni "Forgot password" — přijde e-mail s resetem.

**Q: Jak připojit vlastní doménu (printlab-petschenka.cz)?**
A: Netlify → Site settings → Domain management → Add domain.
   Pak v nastavení domény (u registrátora) přidej DNS záznamy, které Netlify ukáže.

---

*Připravil: Claude Code | Print Lab — Ing. Marek Petschenka*
