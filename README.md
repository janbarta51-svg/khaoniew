# Khaoniew Thai Bistro

Kompletní zdrojový kód moderního webu restaurace Khaoniew Thai Bistro v Brně.

## Spuštění na Windows

1. Stáhni repozitář jako ZIP a rozbal ho.
2. Spusť soubor `spustit-web.bat`.
3. Počkej na instalaci a otevření stránky v prohlížeči.

Počítač musí mít nainstalovaný Node.js 22 nebo novější.

## Ruční spuštění

```bash
npm install
npm run dev
```

## Týdenní menu přes Pages CMS

1. Otevři [Pages CMS](https://app.pagescms.org/).
2. Vyber repozitář `janbarta51-svg/khaoniew` a větev `main`.
3. Otevři **Týdenní menu – rychlé vložení**.
4. Nastav datum pondělí a vlož celý text menu z Wordu.
5. Klikni na **Save**.

Web načítá `weekly-menu.json` automaticky. Konfigurace formuláře je v `.pages.yml`.

## Hlavní soubory

- `app/page.tsx` – obsah webu
- `app/globals.css` – vzhled a responzivní zobrazení
- `app/menu-parser.ts` – automatické rozpoznání textu menu z Wordu
- `public/images/` – fotografie a logo
- `PAGES-CMS-NAVOD.md` – podrobný český návod

Živý web: https://pho-eden-brno.jan-barta51.chatgpt.site
