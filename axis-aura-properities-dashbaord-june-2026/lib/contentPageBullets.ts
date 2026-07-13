export function bulletsArrayToHtml(bullets: string[]): string {
  if (!bullets.length) return "";

  return `<ul>${bullets
    .map((bullet) => {
      const trimmed = bullet.trim();
      if (!trimmed) return "";

      const content = trimmed.startsWith("<") ? trimmed : `<p>${trimmed}</p>`;
      return `<li>${content}</li>`;
    })
    .join("")}</ul>`;
}

export function htmlToBulletsArray(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>" || trimmed === "<ul></ul>") return [];

  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const listItems = Array.from(doc.querySelectorAll("li"))
    .map((item) => item.innerHTML.trim())
    .filter(Boolean);

  if (listItems.length > 0) return listItems;

  const paragraphs = Array.from(doc.querySelectorAll("p"))
    .map((item) => item.innerHTML.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) return paragraphs;

  const text = doc.body.textContent?.trim();
  return text ? [text] : [];
}
