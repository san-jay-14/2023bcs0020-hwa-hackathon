import { Hero } from "@/components/home/Hero";
import { StageStory } from "@/components/home/StageStory";
import { Bento, FaqTeaser, FinalCTA, Loop, MarqueeBand, Reel, Statement, Stats, TierTeaser } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBand />
      <Statement />
      <StageStory />
      <Stats />
      <Bento />
      <Reel />
      <TierTeaser />
      <Loop />
      <FaqTeaser />
      <FinalCTA />
    </>
  );
}
