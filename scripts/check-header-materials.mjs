import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { openPreview, root } from './browser.mjs';
const preview = await openPreview({ publicFonts: true });
const out = root + '.local/qa/header-materials/'; mkdirSync(out, { recursive: true });
const errors = [];
try {
  const p = await preview.browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.addInitScript(() => {
    const appRecords = Array.from({ length: 9 }, (_, i) => ({ id: 'sample.app' + i, appId: 'sample.app' + i, name: 'Application ' + i, brand: 'spotify' }));
    localStorage.setItem('cleanframe.home.v1', JSON.stringify({ wallpaperPacksVersion: 1, bedroomDefaultsVersion: 3, home: appRecords.map(r => r.id), availableApps: appRecords.map(r => r.id), appRecords, pack: 'juegos-oled', aspect: 'day', bg: 'photo', layout: 'dock', apps: 'both', controls: 'both', wall: 'juegos-oled-consolas-dia', mode: 'fixed' }));
  });
  p.on('pageerror', e => errors.push(e.message));
  p.on('response', r => { if (r.status() >= 400) errors.push(r.url()); });
  await p.goto(preview.baseURL + '/home/'); await p.waitForFunction(() => ShoreQA.ready());
  for (const aspect of ['day', 'night']) for (const material of ['soft', 'frost', 'tint']) {
    await p.evaluate(({ aspect, material }) => ShoreQA.look({ aspect, material }), { aspect, material });
    await p.waitForFunction(() => ShoreQA.ready());
    const state = await p.evaluate(() => {
      const sr = document.getElementById('scene').getBoundingClientRect();
      const surface = (id, image, target) => {
        const el = document.getElementById(id), im = document.getElementById(image), r = el.getBoundingClientRect(), a = document.querySelector(target).getBoundingClientRect(), ir = im.getBoundingClientRect();
        return { visible: !el.hidden, source: im.src, opacity: getComputedStyle(im).opacity, veil: getComputedStyle(el.querySelector('.header-material-veil')).backgroundColor,
          aligned: Math.abs(r.left - a.left) < 1 && Math.abs(r.top - a.top) < 1 && Math.abs(r.width - a.width) < 1 && Math.abs(r.height - a.height) < 1,
          registered: Math.abs(ir.left - sr.left) < 1 && Math.abs(ir.top - sr.top) < 1 };
      };
      return { clock: surface('headerClockSurface', 'headerClockImg', '.clock-line'), menu: surface('headerMenuSurface', 'headerMenuImg', '.quiet-utils'), dockAlpha: getComputedStyle(document.querySelector('.dock .mat')).backgroundColor, dockImageOpacity: getComputedStyle(document.querySelector('#matImg')).opacity };
    });
    for (const block of [state.clock, state.menu]) {
      assert.ok(block.visible && block.aligned && block.registered, JSON.stringify(block));
      assert.ok(block.source.endsWith(material === 'soft' ? '-field-blur.jpg' : material === 'frost' ? '-field-frost.jpg' : '-field-clear.jpg'));
      if (material === 'tint') assert.ok(Number(block.opacity) < .3);
    }
    if (material === 'tint') {
      assert.ok(state.dockAlpha.endsWith(aspect === 'day' ? '0.38)' : '0.1)'), state.dockAlpha);
      assert.ok(Number(state.dockImageOpacity) < .3);
    }
    await p.screenshot({ path: out + aspect + '-' + material + '.png' });
  }
  // Header materials also work with List/type; flat backgrounds hide them.
  await p.evaluate(() => ShoreQA.look({ layout: 'list', focus: 'type', material: 'frost' })); await p.waitForFunction(() => ShoreQA.ready());
  assert.ok(await p.locator('#stage').evaluate(el => el.classList.contains('m-frost')));
  await p.evaluate(() => ShoreQA.look({ bg: 'dark' })); await p.waitForFunction(() => ShoreQA.ready());
  assert.equal(await p.locator('#headerClockSurface').evaluate(el => el.hidden), true);
  assert.equal(await p.locator('#headerMenuSurface').evaluate(el => el.hidden), true);
  assert.deepEqual(errors, []);
  console.log('PASS: three cached materials on clock and menu, exact crop registration, clearer day/night translucency, List/type support, flat background cleanup; no resource or JS errors.');
} finally { await preview.close(); }
