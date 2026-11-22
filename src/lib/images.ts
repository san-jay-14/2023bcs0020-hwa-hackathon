// Placeholder imagery. Swap any of these URLs (or point them at /public files) when real assets arrive.
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  heroDog: u("photo-1587300003388-59208cc962cb", 1800),
  lifestyle1: u("photo-1583511655857-d19b40a7a54e", 1600),
  lifestyle2: u("photo-1548199973-03cce0bbc87b", 1600),
  lifestyle3: u("photo-1552053831-71594a27632d", 1600),
  lifestyle4: u("photo-1534361960057-19889db9621e", 1600),
  lifestyle5: u("photo-1537151625747-768eb6cf92b2", 1600),
  lifestyle6: u("photo-1601758228041-f3b2795255f1", 1600),
  lifestyle7: u("photo-1596492784531-6e6eb5ea9993", 1600),
  lifestyle8: u("photo-1558788353-f76d92427f16", 1600),
  lifestyle9: u("photo-1543466835-00a7907e9de1", 1600),
  lifestyle10: u("photo-1517849845537-4d257902454a", 1600),
  lifestyle11: u("photo-1530281700549-e82e7bf110d6", 1600),
  lifestyle12: u("photo-1450778869180-41d0601e046e", 1600),
};

// Placeholder video. Replace with your own file or a hosted .mp4.
export const VIDEO = {
  reel: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  poster: IMG.lifestyle2,
};
