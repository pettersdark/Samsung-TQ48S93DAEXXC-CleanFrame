/* Pure, ES5 wallpaper selection. No TV calls, image work or background service. */
(function () {
  'use strict';
  function create(packs) {
    function pack(id) {
      for (var i = 0; i < packs.length; i++) if (packs[i].id === id) return packs[i];
      return null;
    }
    function minute(value, fallback) {
      return typeof value === 'number' && isFinite(value) && value >= 0 && value < 1440 && Math.floor(value) === value ? value : fallback;
    }
    function variant(c, date) {
      if (c.aspect === 'day' || c.aspect === 'night') return c.aspect;
      var now = date.getHours() * 60 + date.getMinutes(), a = c.dayStart, b = c.nightStart;
      return (a < b ? now >= a && now < b : now >= a || now < b) ? 'day' : 'night';
    }
    function locate(id) {
      var found = null;
      packs.some(function (p) { return p.scenes.some(function (s) {
        if (s.day !== id && s.night !== id) return false;
        found = { pack: p, scene: s }; return true;
      }); });
      return found;
    }
    function resolve(c, date, advance) {
      var p = pack(c.pack) || packs[0], current = locate(c.wall), i = 0;
      if (current && current.pack.id === p.id) p.scenes.some(function (s, index) { if (s.id !== current.scene.id) return false; i = index; return true; });
      if (advance) i = (i + 1) % p.scenes.length;
      return p.scenes[i][variant(c, date)];
    }
    function clean(saved, id, date) {
      var old = locate(id), selected = pack(saved.pack), out = {
        pack: selected ? selected.id : old ? old.pack.id : (pack('cine-series-oled') || packs[0]).id,
        aspect: ['auto', 'day', 'night'].indexOf(saved.aspect) >= 0 ? saved.aspect : 'auto',
        dayStart: minute(saved.dayStart, 480), nightStart: minute(saved.nightStart, 1200), wall: id
      };
      if (out.dayStart === out.nightStart) { out.dayStart = 480; out.nightStart = 1200; }
      out.wall = resolve(out, date, false);
      return out;
    }
    return { pack: pack, locate: locate, variant: variant, resolve: resolve, clean: clean };
  }
  window.CleanFrameWallpaperEngine = { create: create };
}());
