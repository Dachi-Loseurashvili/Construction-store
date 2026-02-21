/**
 * Unicode-safe slug generation (supports Georgian, Cyrillic, etc.)
 */

function generateSlug(name) {
  return (name || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(baseName, Model, excludeId = null) {
  let base = generateSlug(baseName);

  // Fallback if base is empty (e.g., name is only symbols/emoji)
  if (!base) {
    base = `item-${Date.now().toString(36)}`;
  }

  let slug = base;
  let suffix = 2;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.findOne(query);
    if (!exists) return slug;
    slug = `${base}-${suffix++}`;
  }
}

export { generateSlug, uniqueSlug };
