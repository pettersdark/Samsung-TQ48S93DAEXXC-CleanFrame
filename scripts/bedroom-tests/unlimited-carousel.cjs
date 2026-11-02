const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CLEANFRAME_BROWSER_CHANNEL ? { channel: process.env.CLEANFRAME_BROWSER_CHANNEL } : {}) });
  try {
    async function pageWithApps(count, allSaved, failDiscovery) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      await page.addInitScript(({ count, allSaved, failDiscovery }) => {
        const apps = Array.from({ length: count - 2 }, (_, i) => ({ id: 'DemoApp001.App' + String(i).padStart(3, '0'), name: 'App ' + String(i).padStart(3, '0'), show: true }));
        apps.unshift({ id: '34lSUifemi.SmartTVClub', name: 'IPTV Smart TV Club', show: true }, { id: 'OGLLvqej7u.CrunchyrollWebApp', name: 'Crunchyroll', show: true });
        const records = apps.map(a => ({ id: a.id, appId: a.id, name: a.name, brand: a.name === 'Crunchyroll' ? 'crunchyroll' : a.name.includes('Smart TV') ? 'smarttvclub' : '', icon: '' }));
        if (!localStorage.getItem('cleanframe.home.v1')) localStorage.setItem('cleanframe.home.v1', JSON.stringify({ home: records.slice(0, allSaved ? count : 9).map(a => a.id), availableApps: records.map(a => a.id), appRecords: records, bg: 'photo', wall: 'consolas-noche', layout: 'dock', apps: 'both' }));
        window.__apps = apps; window.__fail = failDiscovery;
        window.tizen = {
          application: { getAppsInfo: (ok, fail) => window.__fail ? fail({ message: 'Unavailable' }) : ok(window.__apps), getCurrentApplication: () => ({ appInfo: { id: 'nClrkHome1.FrameHome' } }), launch: (id, ok) => ok() },
          systeminfo: { getPropertyValue: (name, ok) => ok({ connected: [{ type: 'TV', number: 0 }], disconnected: [] }) },
          tvwindow: { getSource: () => ({ type: 'TV', number: 0 }) }
        };
      }, { count, allSaved, failDiscovery });
      await page.goto(process.env.CLEANFRAME_PREVIEW_URL || 'http://127.0.0.1:4795/home/');
      await page.waitForFunction(() => ShoreQA.ready() && !ShoreQA.state().catalog.loading);
      return page;
    }
    const page = await pageWithApps(70, false, false);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    assert.equal((await page.evaluate(() => ShoreQA.state())).home.length, 9);
    await page.evaluate(() => { ShoreQA.scene('editor'); for (let i = 0; i < 40; i++) ShoreQA.nav('right', 'right', 'ok'); });
    let state = await page.evaluate(() => ShoreQA.state());
    assert.equal(state.home.length, 49);
    assert.doesNotMatch(await page.locator('#sheetView').innerText(), /Inicio estÃƒÂ¡ lleno|de 9/);
    async function focusedEditorVisible() {
      await page.waitForTimeout(250);
      const action = (await page.evaluate(() => ShoreQA.where())).focusAction;
      const row = page.locator('.ed-home [data-action="' + action + '"]');
      const rb = await row.boundingBox(), vb = await page.locator('.ed-home').boundingBox();
      assert.ok(rb && rb.y >= vb.y - 1 && rb.y + rb.height <= vb.y + vb.height + 1, action + JSON.stringify({rb,vb}));
    }
    await focusedEditorVisible();
    assert.equal(await page.locator('.editor-home-before.is-on').count(), 1);
    const savedOrder = state.home;
    await page.evaluate(() => ShoreQA.nav('ok', 'up', 'ok'));
    state = await page.evaluate(() => ShoreQA.state());
    assert.equal(state.home[47], savedOrder[48]);
    await page.evaluate(() => { ShoreQA.activate('editor.undo'); });
    assert.deepEqual((await page.evaluate(() => ShoreQA.state())).home, savedOrder);
    await page.evaluate(() => { ShoreQA.scene('home'); ShoreQA.nav(Array(48).fill('right')); });
    const atEnd = (await page.evaluate(() => ShoreQA.where())).focusAction;
    assert.equal(atEnd, 'home.app.' + savedOrder[48]);
    await page.waitForTimeout(300);
    let rb = await page.locator('[data-action="' + atEnd + '"]').boundingBox();
    assert.ok(rb.x > 0 && rb.x + rb.width < 1921);
    await page.reload(); await page.waitForFunction(() => ShoreQA.ready() && !ShoreQA.state().catalog.loading);
    assert.deepEqual((await page.evaluate(() => ShoreQA.state())).home, savedOrder);
    for (const width of [1920, 1280]) for (const wall of ['consolas-noche', 'pc-dia']) {
      await page.setViewportSize({ width, height: width === 1920 ? 1080 : 720 });
      await page.evaluate(wall => { ShoreQA.scene('home'); ShoreQA.look({ wall, layout: 'dock', apps: 'both' }); }, wall);
      await page.waitForFunction(() => ShoreQA.ready());
      for (const id of ['crunchyroll', 'smarttvclub']) {
        assert.equal(await page.locator('#dock [data-mark="' + id + '"]').count(), 1);
        const colour = await page.locator('#dock [data-mark="' + id + '"] .mk').evaluate(el => getComputedStyle(el).backgroundColor);
        assert.notEqual(colour, 'rgba(0, 0, 0, 0)');
      }
      await page.screenshot({ path: '.local/qa/unlimited-brands-' + wall + '-' + width + '.png' });
      await page.evaluate(() => { ShoreQA.scene('editor'); ShoreQA.nav(Array(60).fill('down')); });
      await focusedEditorVisible();
      await page.screenshot({ path: '.local/qa/unlimited-editor-' + wall + '-' + width + '.png' });
    }
    // Previously saved lists longer than 256 retain full names/brands even while discovery fails.
    const large = await pageWithApps(310, true, true);
    assert.equal((await large.evaluate(() => ShoreQA.state())).home.length, 310);
    assert.equal(await large.evaluate(() => JSON.parse(localStorage.getItem('cleanframe.home.v1')).appRecords.length >= 310), true);
    await large.evaluate(() => { ShoreQA.scene('home'); ShoreQA.look({ layout: 'list' }); ShoreQA.nav(Array(309).fill('down')); });
    assert.equal((await large.evaluate(() => ShoreQA.where())).focusAction.startsWith('home.app.'), true);
    await large.reload(); await large.waitForFunction(() => ShoreQA.ready() && !ShoreQA.state().catalog.loading);
    assert.equal((await large.evaluate(() => ShoreQA.state())).home.length, 310);
    assert.deepEqual(errors, []);
    console.log('PASS: add/reorder/undo/reload 49 shortcuts, editor and Dock scrolling at 1080p/720p, both monochrome brands in day/night, 310 saved apps retained without discovery.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
