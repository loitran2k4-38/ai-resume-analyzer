const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

export function formatSize(bytes: number): string {
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(1)} GB`;
  }
  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)} MB`;
  }
  return `${(bytes / KB).toFixed(1)} KB`;
}
