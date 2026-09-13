const ORIGIN = "https://www.comforthome.kyiv.ua";

export function pageHead(title: string, description: string, path: string, image: string) {
  const url = `${ORIGIN}${path === "/" ? "" : path}`;
  const imageUrl = `${ORIGIN}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
