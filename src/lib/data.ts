export type SizeId = "S" | "M" | "L";
export type ColorId = "teal" | "ink" | "ember";
export type TierId = "light" | "medium" | "heavy";

export const SIZES: {
  id: SizeId;
  label: string;
  diameter: number;
  opening: number;
  dog: string;
  price: number;
}[] = [
  { id: "S", label: "Small", diameter: 8, opening: 4.5, dog: "Under 10 kg", price: 1850 },
  { id: "M", label: "Medium", diameter: 11, opening: 6, dog: "10 to 25 kg", price: 2350 },
  { id: "L", label: "Large", diameter: 14, opening: 7.5, dog: "Over 25 kg", price: 2850 },
];

export const COLORS: { id: ColorId; name: string; hex: string; note: string; bg: string }[] = [
  { id: "teal", name: "Deep Teal", hex: "#0b5f5c", note: "The signature", bg: "#bfeadf" },
  { id: "ink", name: "Night Ink", hex: "#232c3a", note: "Quiet and graphic", bg: "#cdd6e6" },
  { id: "ember", name: "Ember", hex: "#c4421a", note: "Warm and loud", bg: "#ffd6c2" },
];

export const TIERS: {
  id: TierId;
  name: string;
  forWho: string;
  firmness: string;
  blurb: string;
}[] = [
  {
    id: "light",
    name: "Light",
    forWho: "Gentle chewers, small dogs, seniors",
    firmness: "Softest grade of each Stage",
    blurb: "Soft, giving and easy on mouths.",
  },
  {
    id: "medium",
    name: "Medium",
    forWho: "Typical chewers",
    firmness: "Middle grade of each Stage",
    blurb: "The balanced grade for most dogs.",
  },
  {
    id: "heavy",
    name: "Heavy",
    forWho: "Power chewers",
    firmness: "Firmest grade, still dentable",
    blurb: "The firmest we make. Still passes the thumbnail test.",
  },
];

export const STAGES = [
  {
    n: 1,
    name: "Lick",
    look: "Peach, smooth",
    texture: "Soft",
    job: "Engages your dog in the first minutes, with no skill needed.",
    color: "#ffb89a",
  },
  {
    n: 2,
    name: "Chew",
    look: "Caramel, ridged",
    texture: "Chewy",
    job: "Sustained engagement. Ridges and volume set the pace.",
    color: "#e39a3b",
  },
  {
    n: 3,
    name: "Core",
    look: "Dark chestnut",
    texture: "Firm, but dentable",
    job: "The long-lasting finish. Always passes the thumbnail test.",
    color: "#4b2a18",
  },
] as const;

export const STAGE_PACK_PRICE = 1350;
export const BUNDLE_PRICE = 3150;
export const BUNDLE_SIZE: SizeId = "M";

export const FREE_SHIPPING_OVER = 5000;
export const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard", eta: "5 to 7 business days", price: 500 },
  { id: "express", name: "Express", eta: "2 to 3 business days", price: 1150 },
] as const;
export type ShippingId = (typeof SHIPPING_OPTIONS)[number]["id"];

export const FAQ = [
  {
    q: "My dog finished early. Now what?",
    a: "Nothing needs to happen while you are out: the empty shell is the safe end state. When you are home, check how fast the load went. If your dog reached the end in less than about half the time you were away, go up a tier. If the tier feels right but your dog is bored of it, rotate to a different Stage variant. Dogs get used to a fixed solution, so refilling the exact same load is the weakest option. Never refill the same Stage on the spot.",
  },
  {
    q: "Is Longshift safe to leave with my dog?",
    a: "Longshift is designed as one solid piece with nothing to break off and no battery to swallow. But no toy is indestructible, and we never say a toy is safe to leave unsupervised. Inspect the shell after every use, retire it if it is damaged, and follow your vet's guidance.",
  },
  {
    q: "Does it help with separation anxiety?",
    a: "No, and we will not claim it does. Longshift is a toy, not a treatment. If your dog shows distress when alone, or stays on Stage 1 for several days, talk to a vet or a qualified behaviourist.",
  },
  {
    q: "What are the Stages made of?",
    a: "Edible, dog-safe food, formulated with a pet-food specialist. The recipe is still being developed, so the final ingredient list, nutrition and calories are not published yet. One rule is already fixed: xylitol is absent from every ingredient.",
  },
  {
    q: "How long does a load last?",
    a: "We do not promise a duration. The pace comes from volume, stickiness, ridges and the shape of the cavity, and that is being tested. Use the Stage Log to see how your dog actually does, and tier up or rotate from there.",
  },
  {
    q: "How do I choose a size?",
    a: "By dog weight: Small under 10 kg, Medium 10 to 25 kg, Large over 25 kg. These are design assumptions that we are confirming with trainers and vets, so treat them as a guide.",
  },
  {
    q: "How do I clean it?",
    a: "Wash the shell between loads. The straight-sided cone has no bulge or undercut, so there is nowhere for anything to hide.",
  },
  {
    q: "Do the Stages count as food?",
    a: "Yes. A common vet rule keeps treats to about 10% of daily intake, so count each load toward the day's food. Check the right amount for your dog with your vet.",
  },
  {
    q: "Is this real? Can I actually order?",
    a: "Longshift is a concept in development and a prototype is pending. This store runs in test mode: you can place an order and get a confirmation, but nothing is charged or shipped.",
  },
];
