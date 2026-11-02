// Cloudflare Worker: bere ICY naslov skladbe iz radijskega toka (brezplačno, ~1 minuta nastavitve)
// Uporaba: https://TVOJ-WORKER.workers.dev/?url=https://stream.example/radio  ->  {"title":"..."}
export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    };
    const target = new URL(request.url).searchParams.get('url');
    if (!target || !/^https?:\/\//i.test(target)) {
      return new Response(JSON.stringify({ title: '', error: 'url manjka' }), { status: 400, headers: cors });
    }
    try {
      const res = await fetch(target, {
        headers: { 'Icy-MetaData': '1', 'User-Agent': 'Mozilla/5.0 RadioKlic' },
        signal: AbortSignal.timeout(8000),
      });
      const metaint = parseInt(res.headers.get('icy-metaint') || '0', 10);
      if (!metaint || !res.body) {
        res.body && res.body.cancel();
        return new Response(JSON.stringify({ title: '' }), { headers: cors });
      }
      const reader = res.body.getReader();
      let buf = new Uint8Array(0);
      const need = (n) => buf.length >= n;
      const push = (v) => { const nb = new Uint8Array(buf.length + v.length); nb.set(buf); nb.set(v, buf.length); buf = nb; };
      while (!need(metaint + 1)) { const { value, done } = await reader.read(); if (done) break; push(value); }
      const len = buf.length > metaint ? buf[metaint] * 16 : 0;
      while (len && !need(metaint + 1 + len)) { const { value, done } = await reader.read(); if (done) break; push(value); }
      reader.cancel();
      let title = '';
      if (len && need(metaint + 1 + len)) {
        const bytes = buf.slice(metaint + 1, metaint + 1 + len);
        let text;
        try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
        catch { text = new TextDecoder('windows-1250').decode(bytes); }
        const m = text.replace(/\0/g, '').match(/StreamTitle='(.*?)';/s);
        title = m ? m[1].trim() : '';
      }
      return new Response(JSON.stringify({ title }), { headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ title: '', error: String(e) }), { headers: cors });
    }
  },
};
