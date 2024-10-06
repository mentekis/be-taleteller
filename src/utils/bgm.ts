const bgms = [
   { tags: "rain", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/rain.mp3" },
   { tags: "wind", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/wind.mp3" },
   { tags: "night", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/night.mp3" },
   { tags: "traffic", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/traffic.mp3" },
   { tags: "underwater", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/underwater.mp3" },
   { tags: "space", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/space.mp3" },
   { tags: "beach", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/beach.mp3" },
   { tags: "city", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/city.mp3" },
   { tags: "desert", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/desert.mp3" },
   { tags: "forest", url: "https://taleteller-media.s3.ap-southeast-2.amazonaws.com/bgm/forest.mp3" },
];

export function getBgmUrl(tag: string): string | undefined {
   const bgm = bgms.find((bgm) => bgm.tags.includes(tag));
   return bgm?.url;
}

export function getBgmTags(): string[] {
   return bgms.flatMap((bgm) => bgm.tags);
}
