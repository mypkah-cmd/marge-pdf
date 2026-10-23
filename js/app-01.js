// Optional storage must never prevent the interface from starting.
const v2Storage = (() => {
  const memory = new Map();
  return {
    getItem(key) {
      try { return window.localStorage.getItem(key) ?? memory.get(key) ?? null; }
      catch (_) { return memory.get(key) ?? null; }
    },
    setItem(key,value) {
      memory.set(key,String(value));
      try { window.localStorage.setItem(key,String(value)); } catch (_) {}
    },
    removeItem(key) {
      memory.delete(key);
      try { window.localStorage.removeItem(key); } catch (_) {}
    }
  };
})();

