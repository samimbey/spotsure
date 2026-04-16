const STORAGE_KEY = "spotsure_scans";

export function getLocalScans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalScan(scan) {
  const scans = getLocalScans();
  const newScan = { ...scan, id: Date.now().toString(), created_date: new Date().toISOString() };
  scans.unshift(newScan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
  return newScan;
}

export function deleteLocalScan(id) {
  const scans = getLocalScans().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

export function updateLocalScan(id, data) {
  const scans = getLocalScans().map((s) => (s.id === id ? { ...s, ...data } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

export function getLocalScanById(id) {
  return getLocalScans().find((s) => s.id === id) || null;
}