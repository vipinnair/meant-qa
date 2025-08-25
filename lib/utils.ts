export function cents(n: number) { return `$${(n/100).toFixed(2)}`; }
export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
