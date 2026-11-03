import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const scope = { window: {} };
vm.runInNewContext(readFileSync(new URL('../app/assets/wallpapers/catalog.js', import.meta.url), 'utf8'), scope);
vm.runInNewContext(readFileSync(new URL('../app/wallpaper-engine.js', import.meta.url), 'utf8'), scope);
const packs = scope.window.CleanFrameWallpaperPacks;
const engine = scope.window.CleanFrameWallpaperEngine.create(packs);
const at = (h, m = 0) => new Date(2026, 10, 3, h, m);
test('52 images form complete unique pairs in seven selected packages', () => {
  const ids = packs.flatMap(p => p.scenes.flatMap(s => [s.day, s.night]));
  assert.equal(packs.length, 7); assert.equal(ids.length, 52); assert.equal(new Set(ids).size, 52);
});
test('legacy removed photo migrates to automatic cinema OLED preserving engine independence', () => {
  const c = engine.clean({}, 'cine-casa-noche', at(12));
  assert.equal(c.pack, 'cine-series-oled'); assert.equal(c.wall, 'cine-series-oled-cine-dia');
  assert.equal(engine.resolve(c, at(20)), 'cine-series-oled-cine-noche');
});
test('minute boundaries, forced modes and overnight daytime interval', () => {
  const c = engine.clean({}, '', at(12));
  for (const [h, m, expected] of [[7, 59, 'night'], [8, 0, 'day'], [19, 59, 'day'], [20, 0, 'night']]) assert.equal(engine.variant(c, at(h, m)), expected);
  assert.equal(engine.variant({ ...c, aspect: 'day' }, at(23)), 'day');
  assert.equal(engine.variant({ ...c, aspect: 'night' }, at(12)), 'night');
  assert.equal(engine.variant({ ...c, dayStart: 1200, nightStart: 480 }, at(23)), 'day');
  assert.equal(engine.variant({ ...c, dayStart: 1200, nightStart: 480 }, at(12)), 'night');
});
test('rotation stays within pack and time switch preserves scene', () => {
  for (const p of packs) {
    let c = { ...engine.clean({}, '', at(12)), pack: p.id, wall: p.scenes[0].day };
    for (let i = 0; i < p.scenes.length; i++) {
      assert.equal(engine.resolve(c, at(23)), p.scenes[i].night);
      c.wall = engine.resolve(c, at(12), true);
      assert.equal(engine.locate(c.wall).pack.id, p.id);
    }
    assert.equal(c.wall, p.scenes[0].day);
  }
});
test('invalid saved values and removed packages recover deterministically', () => {
  const c = engine.clean({ pack: 'removed', dayStart: -5, nightStart: 'bad', aspect: 'bad' }, '', at(12));
  assert.equal(c.dayStart, 480); assert.equal(c.nightStart, 1200); assert.equal(c.aspect, 'auto');
  const same = engine.clean({ dayStart: 300, nightStart: 300 }, '', at(12));
  assert.equal(same.dayStart, 480); assert.equal(same.nightStart, 1200);
});
