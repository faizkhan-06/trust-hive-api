import { Database } from "../libs/Database";

export const getRepo = (name: string) => {
  return Database.getDataSource().getRepository(name);
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    // Replace spaces & underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove all non-word chars except hyphens
    .replace(/[^\w-]+/g, "")
    // Replace multiple hyphens with a single one
    .replace(/--+/g, "-")
    // Trim hyphens from start & end
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(text: string): string {
  const base = slugify(text);
  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
}
