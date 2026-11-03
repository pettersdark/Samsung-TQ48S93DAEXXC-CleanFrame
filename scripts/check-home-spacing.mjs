import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { openPreview, root } from './browser.mjs';
const preview = await openPreview({ publicFonts: true });
const out = root + '.local/qa/spacing/'; mkdirSync(out, { recursive: true });
const results = [], errors = [];
try {
  const p = await preview.browser.newPage();
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(() => {
    const Original = Date;
    window.Date = class extends Original { constructor(...args) { super(...(args.length ? args : [2026, 10, 4, 14, 48])); } };
  });
  for (const width of [1920, 1280]) for (const count of [0, 1, 2, 5, 9, 30]) {
    await p.setViewportSize({ width, height: width * 9 / 16 });
    await p.goto(preview.baseURL + '/home/');
    await p.evaluate(count => {
      const brands = ['spotify', 'skyshowtime', 'crunchyroll', 'twitch', 'hbomax', '3cat', 'atresplayer', 'smarttvclub', ''];
      const records = Array.from({ length: count }, (_, i) => ({ id: 'sample.app' + i, appId: 'sample.app' + i, name: 'Application ' + i, brand: brands[i % brands.length] }));
      localStorage.setItem('cleanframe.home.v1', JSON.stringify({ wallpaperPacksVersion: 1, bedroomDefaultsVersion: 3, home: records.map(r => r.id), availableApps: records.map(r => r.id), appRecords: records, lastApp: records[0]?.id, pack: 'juegos-oled', aspect: 'day', bg: 'photo', layout: 'dock', wall: 'juegos-oled-consolas-dia', mode: 'fixed' }));
    }, count);
    await p.reload(); await p.waitForFunction(() => ShoreQA.ready());
    assert.equal(await p.evaluate(() => ShoreQA.state().home.length), count);
    for (const apps of ['both', 'text', 'icons']) for (const controls of ['both', 'text', 'icons']) {
      await p.evaluate(({ apps, controls }) => { ShoreQA.look({ apps, controls }); ShoreQA.scene('home'); }, { apps, controls });
      await p.waitForFunction(() => ShoreQA.ready());
      const g = await p.evaluate(() => {
        const scene = document.getElementById('scene').getBoundingClientRect(), scale = scene.width / 1920;
        const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: (r.left - scene.left) / scale, y: (r.top - scene.top) / scale, right: (r.right - scene.left) / scale, bottom: (r.bottom - scene.top) / scale }; };
        const name = document.querySelector('.app-focus-name.is-on');
        return { clock: box('.clock-line'), day: box('.clock-day'), menu: box('.quiet-utils'), dock: box('#dock'), name: name ? box('.app-focus-name.is-on') : null };
      });
      const close = (a, b) => Math.abs(a - b) < 1;
      assert.ok(close(g.clock.y, 48) && close(g.menu.y, 48), JSON.stringify(g));
      assert.ok(close(g.clock.x, g.dock.x), JSON.stringify(g));
      assert.ok(g.clock.right + 25 < g.menu.x, JSON.stringify(g));
      assert.ok(g.day.right <= g.clock.right + 1 && g.day.y >= g.clock.y, JSON.stringify(g));
      assert.ok(close(1080 - (g.name ? g.name.bottom : g.dock.bottom), 48), JSON.stringify(g));
      assert.ok(g.menu.right <= 1825 && g.dock.x >= 47, JSON.stringify(g));
      // Moving focus to the header must keep its focused button and helper label on screen.
      await p.evaluate(() => ShoreQA.nav('up'));
      const focus = await p.evaluate(() => {
        const el = document.querySelector('.quiet-utils .is-focus'); const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: innerWidth, height: innerHeight };
      });
      assert.ok(focus.left >= 0 && focus.right <= focus.width + 1 && focus.top >= 0 && focus.bottom <= focus.height);
      results.push({ width, count, apps, controls, geometry: g });
      if (width === 1920 && count === 9 && apps === 'both' && controls === 'both') {
        await p.evaluate(() => ShoreQA.scene('home'));
        await p.screenshot({ path: out + 'home-day.png' });
        await p.evaluate(() => ShoreQA.look({ aspect: 'night' })); await p.waitForFunction(() => ShoreQA.ready());
        await p.screenshot({ path: out + 'home-night.png' });
        await p.evaluate(() => ShoreQA.look({ aspect: 'day' })); await p.waitForFunction(() => ShoreQA.ready());
      }
    }
    // Switching layout must clear Dock's inline header offsets.
    await p.evaluate(() => ShoreQA.look({ layout: 'list' })); await p.waitForFunction(() => ShoreQA.ready());
    assert.equal(await p.locator('#caption').evaluate(el => el.style.left), '');
  }
  assert.deepEqual(errors, []);
  writeFileSync(out + 'results.json', JSON.stringify({ cases: results.length, errors, results }, null, 2));
  console.log('PASS: symmetric 48px frame, clock/carousel alignment, long Wednesday, no header collisions; 108 cases across counts, modes and 1080p/720p.');
} finally { await preview.close(); }
