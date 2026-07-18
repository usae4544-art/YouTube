export function formatViews(viewsStr?: string | number): string {
  if (viewsStr === undefined || viewsStr === null) return "120K";
  const num = typeof viewsStr === "string" ? parseInt(viewsStr, 10) : viewsStr;
  if (isNaN(num)) return viewsStr.toString();
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return "recently";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days === 0) return "today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return "1 month ago";
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    if (years === 1) return "1 year ago";
    return `${years} years ago`;
  } catch (e) {
    return "recently";
  }
}
