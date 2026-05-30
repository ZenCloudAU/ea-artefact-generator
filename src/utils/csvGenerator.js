export function toCSV(objects, toolKey, repoTools) {
  const cfg = repoTools[toolKey];
  const rows = [cfg.columns, ...objects.map(o => cfg.map(o, cfg))];
  return rows.map(r =>
    r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
  ).join("\n");
}

export function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
