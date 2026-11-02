# RadioKlic Web

Spletni internetni radio, ki dela kar v brskalniku (brez namestitve, brez .exe).

Funkcije: shranjevanje postaj (v brskalniku + izvoz/uvoz .json), samodejni dvig glasnosti ob govoru
(po ključnih besedah v naslovu skladbe), iskanje postaj (Radio Browser), timer.

## Objava na GitHub Pages (brezplačno, 2 minuti)
1. Naloži `index.html` v nov repo (npr. `radioklic-web`).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
3. Čez minuto je stran na `https://alividmar.github.io/radioklic-web/`. Odpri jo v brskalniku, po želji dodaj med zaznamke.

## Naslov skladbe in dvig glasnosti (pomembno)
Brskalnik lahko prebere naslov skladbe samo pri postajah, ki dovolijo CORS. Pri ostalih (npr. nekatere RTV) naslova ni,
zato dvig ob govoru ne deluje. Rešitev je majhen brezplačen proxy:

1. Odpri https://dash.cloudflare.com → **Workers & Pages → Create → Create Worker** → ime npr. `moj-radio` → **Deploy**.
2. **Edit code** → izbriši vse in prilepi vsebino datoteke `worker.js` → **Deploy**.
3. Kopiraj naslov Workerja (`https://moj-radio.xxx.workers.dev`).
4. V spletnem radiu: **⚙ Nastavitve → Proxy** → prilepi naslov → **Shrani**.

## Opombe
- Postaje in nastavitve so shranjene v brskalniku (localStorage). Za varnostno kopijo uporabi **⚙ → Izvozi postaje**.
- `http://` tokovi se na `https://` strani blokirajo (mešana vsebina). Uporabi `https://` tokove.
- Zvok med predvajanjem v ozadju zavihka v računalniškem brskalniku normalno dela.
