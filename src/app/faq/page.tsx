import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { SplitText } from "@/components/motion";
import { Eyebrow, TicketButton } from "@/components/ui";
import { FAQ } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Straight answers: finished early, safety, sizing, Stages and more.",
};

export default function FaqPage() {
  return (
    <>
      <section className="bg-teal px-5 pb-20 pt-40 text-cream md:px-10 md:pb-32 md:pt-52">
        <div className="mx-auto max-w-[1600px]">
          <Eyebrow className="mb-4 text-sun">FAQ</Eyebrow>
          <SplitText as="h1" immediate delay={0.2} className="display text-[18vw] leading-[0.85] md:text-[13vw]" accent="text-sun">
            {"Straight\n*answers.*"}
          </SplitText>
        </div>
      </section>
      <section className="bg-cream px-5 py-20 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="display text-4xl md:text-5xl">Questions we&rsquo;d ask, too.</p>
            <p className="mt-4 max-w-xs opacity-70">Can&rsquo;t find it? The Stage Log and the tier quiz answer the most common one.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TicketButton href="/quiz" variant="ink" size="sm">
                Find your tier
              </TicketButton>
              <TicketButton href="/stage-log" variant="teal" size="sm">
                Stage Log
              </TicketButton>
            </div>
          </div>
          <div className="md:col-span-8">
            <Accordion items={FAQ} defaultOpen={0} />
          </div>
        </div>
      </section>
    </>
  );
}
