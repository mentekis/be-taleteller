const bgms = [
   { tags: "forest", url: "http://forst.bgm" },
   { tags: "sea", url: "http://sea.bgm" },
   { tags: "city", url: "http://city.bgm" },
   { tags: "grass", url: "http://grass.bgm" },
   { tags: "snow", url: "http://snow.bgm" },
   { tags: "ocean", url: "http://ocean.bgm" },
   { tags: "desert", url: "http://desert.bgm" },
   { tags: "beach", url: "http://beach.bgm" },
   { tags: "mountain", url: "http://mountain.bgm" },
   { tags: "space", url: "http://space.bgm" },
   { tags: "underwater", url: "http://underwater.bgm" },
   { tags: "underground", url: "http://underground.bgm" },
   { tags: "deep", url: "http://deep.bgm" },
   { tags: "war", url: "http://war.bgm" },
   { tags: "battle", url: "http://battle.bgm" },
   { tags: "road", url: "http://road.bgm" },
];

export function getBgmUrl(tag: string): string | undefined {
   const bgm = bgms.find((bgm) => bgm.tags.includes(tag));
   return bgm?.url;
}

export function getBgmTags(): string[] {
   return bgms.flatMap((bgm) => bgm.tags);
}
