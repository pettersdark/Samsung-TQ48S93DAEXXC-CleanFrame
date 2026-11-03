import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { openPreview, root } from './browser.mjs';

const preview = await openPreview({ publicFonts: true });
const errors = [], missing = [];
mkdirSync(root + '.local/qa/packs', { recursive: true });
try {
  const p = await preview.browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.addInitScript(() => {
    window.__wallNow = new Date(2026, 10, 3, 12).getTime();
    window.ShoreQA = { minuteMs: 100, now: () => window.__wallNow };
    localStorage.setItem('cleanframe.home.v1', JSON.stringify({ availableApps: ['netflix', 'youtube'], appRecords: [{ id: 'netflix', appId: 'org.tizen.netflix-app', name: 'Netflix', brand: 'netflix' }, { id: 'youtube', appId: '9Ur5IzDKqV.TizenYouTube', name: 'YouTube', brand: 'youtube' }], home: ['netflix', 'youtube'], wallpaper: 'cine-casa-noche', lastApp: 'youtube', look: { bg: 'photo', wall: 'cine-casa-noche', font: 'manrope', layout: 'dock' } }));
  });
  p.on('pageerror', e => errors.push(e.message));
  p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto(preview.baseURL + '/home/');
  const ready = () => p.waitForFunction(() => ShoreQA.ready());
  const state = () => p.evaluate(() => ShoreQA.state());
  const action = a => p.evaluate(a => ShoreQA.activate(a), a);
  await ready();
  let s = await state();
  assert.equal(s.pack, 'cine-series-oled'); assert.equal(s.wall, 'cine-series-oled-cine-dia');
  assert.equal(s.lastApp, 'youtube'); assert.deepEqual(s.home.slice(0, 2), ['netflix', 'youtube']);
  await p.evaluate(() => ShoreQA.scene('appearance'));
  await p.screenshot({ path: root + '.local/qa/packs/background.png' });
  await action('background.packs');
  assert.equal(await p.locator('.detail-packs .setting-choice[role=radio]').count(), 7);
  // Remote scrolling to last package; focus must stay inside bounded list.
  await p.evaluate(() => ShoreQA.nav(['down', 'down', 'down', 'down', 'down', 'down']));
  let rects = await p.locator('.detail-packs .is-focus').evaluate(el => ({ b: el.getBoundingClientRect().bottom, parent: el.closest('.appearance-rows').getBoundingClientRect().bottom }));
  assert.ok(rects.b <= rects.parent + 1, JSON.stringify(rects));
  await p.screenshot({ path: root + '.local/qa/packs/packages.png' });
  const packs = await p.evaluate(() => CleanFrameWallpaperPacks.map(p => ({ id: p.id, scenes: p.scenes.length })));
  for (const pack of packs) {
    assert.ok(await action('choice.pack.' + pack.id)); await ready();
    assert.equal((await state()).pack, pack.id);
    await action('panel.back'); await action('background.wallpaper');
    assert.equal(await p.locator('.wallpaper-choice').count(), pack.scenes);
    await p.evaluate(count => ShoreQA.nav(Array(count - 1).fill('down')), pack.scenes);
    await p.evaluate(() => ShoreQA.nav('ok')); await ready();
    assert.ok((await state()).wall.startsWith(pack.id + '-'));
    await action('panel.back'); await action('background.packs');
  }
  await action('choice.pack.juegos-oled'); await ready();
  await action('panel.back'); await action('background.wallpaper');
  await p.evaluate(() => ShoreQA.nav(['down', 'down', 'down', 'ok'])); await ready();
  assert.equal((await state()).wall, 'juegos-oled-sony-dia');
  // Preview cancels without persisting, including a late asynchronous load.
  await p.evaluate(() => ShoreQA.nav('down')); await action('panel.back'); await ready();
  assert.equal((await state()).wall, 'juegos-oled-sony-dia');
  await action('panel.home');
  await p.evaluate(() => { window.__wallNow = new Date(2026, 10, 3, 20).getTime(); ShoreQA.wallpaperTick(); }); await ready();
  assert.equal((await state()).wall, 'juegos-oled-sony-noche');
  await p.screenshot({ path: root + '.local/qa/packs/home-night.png' });
  await p.evaluate(() => ShoreQA.scene('appearance')); await action('background.aspect');
  await action('choice.aspect.day'); await ready();
  assert.equal((await state()).wall, 'juegos-oled-sony-dia');
  await action('choice.aspect.auto'); await ready();
  await action('panel.back'); await action('background.schedule');
  await action('schedule.dayStart.plus'); await ready(); assert.equal((await state()).dayStart, 510);
  await p.screenshot({ path: root + '.local/qa/packs/schedule.png' });
  // Storage failure must keep previous committed value; retry succeeds.
  await p.evaluate(() => { window.__save = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw Error('full'); }; });
  await action('schedule.dayStart.plus');
  await p.waitForFunction(() => !ShoreQA.state().pending);
  assert.equal((await state()).dayStart, 510); assert.equal((await state()).storageOk, false);
  await p.evaluate(() => { Storage.prototype.setItem = window.__save; });
  await action('settings.retry'); await ready(); assert.equal((await state()).dayStart, 540);
  await action('panel.back'); await action('background.rotation'); await action('rotation.5');
  await action('panel.home');
  await p.waitForFunction(() => ShoreQA.state().wall === 'juegos-oled-nintendo-noche');
  await p.evaluate(() => ShoreQA.scene('appearance')); await action('background.rotation'); await action('rotation.fixed');
  await action('panel.home'); await ready();
  // Reload with init seed disabled to check actual persisted package and timing.
  const saved = await p.evaluate(() => localStorage.getItem('cleanframe.home.v1'));
  const q = await preview.browser.newPage({ viewport: { width: 1280, height: 720 } });
  q.on('pageerror', e => errors.push(e.message));
  await q.addInitScript(saved => { window.ShoreQA = { now: () => new Date(2026, 10, 3, 20).getTime() }; localStorage.setItem('cleanframe.home.v1', saved); }, saved);
  await q.goto(preview.baseURL + '/home/'); await q.waitForFunction(() => ShoreQA.ready());
  assert.equal(await q.evaluate(() => ShoreQA.state().pack), 'juegos-oled');
  assert.equal(await q.evaluate(() => ShoreQA.state().dayStart), 540);
  await q.evaluate(() => ShoreQA.scene('appearance')); await q.evaluate(() => ShoreQA.activate('background.packs'));
  await q.evaluate(() => ShoreQA.nav(Array(6).fill('down')));
  await q.screenshot({ path: root + '.local/qa/packs/packages-720.png' });
  // Review every paired image through the actual bundle loader, including all
  // three materials and both layouts. Explicit aspect makes this time-independent.
  await p.evaluate(() => ShoreQA.scene('home'));
  const walls = await p.evaluate(() => CleanFrameWallpapers.map(w => ({ id: w.id, variant: w.variant })));
  for (const w of walls) {
    for (const material of ['soft', 'frost', 'tint']) {
      await p.evaluate(({ w, material }) => ShoreQA.look({ wall: w.id, aspect: w.variant, material, layout: 'dock' }), { w, material });
      await ready(); assert.equal((await state()).wall, w.id);
    }
    await p.evaluate(() => ShoreQA.look({ layout: 'list' })); await ready();
    const clock = await p.evaluate(() => {
      const time = document.querySelector('.clock').getBoundingClientRect();
      const day = document.querySelector('.clock-day').getBoundingClientRect();
      const line = document.querySelector('.clock-line').getBoundingClientRect();
      return { separate: time.right < day.left, inside: time.left >= line.left && day.right <= line.right + 1, height: line.height, combined: time.height + day.height };
    });
    assert.ok(clock.separate && clock.inside && clock.height < clock.combined, JSON.stringify(clock));
    await p.screenshot({ path: root + '.local/qa/packs/' + w.id + '.jpg', type: 'jpeg', quality: 65 });
  }
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  console.log('PASS: migration/order, seven packs, scene picker, cancel, day/night pairing, forced day, schedule, failed-save recovery, within-pack rotation, persistence, 1080p/720p; no missing assets or JS errors.');
} finally { await preview.close(); }

