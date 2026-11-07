const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const out = process.argv[2], FPS = 30;
  const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',
    '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart', out], { stdio: ['pipe','ignore','inherit'] });
  // Serve this folder over http so an optional logo image doesn't taint the canvas.
  const http = require('http'), fs = require('fs'), path = require('path');
  const types = { '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
  const server = http.createServer((req, res) => {
    const f = path.join(__dirname, path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^([\\/]\.\.)+/, ''));
    fs.readFile(f, (err, data) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(data);
    });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`http://127.0.0.1:${server.address().port}/scene.html?capture`);
  const hasLogo = await p.evaluate(async () => { await document.fonts.ready; return window.logoReady; });
  console.log('logo found:', hasLogo);
  const n = await p.evaluate(() => window.DURATION) * FPS;
  for (let i = 0; i < n; i++) {
    const d = await p.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95); }, i / FPS);
    const buf = Buffer.from(d.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log('frame', i);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  server.close();
})();
