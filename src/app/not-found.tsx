import { TicketButton } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="grid min-h-svh place-items-center bg-coral px-5 text-center text-cream">
      <div>
        <p className="display text-[30vw] leading-[0.8]">404</p>
        <p className="mt-4 text-2xl font-semibold">This page rolled away. Our shell wouldn&rsquo;t.</p>
        <div className="mt-8">
          <TicketButton href="/" variant="sun" size="lg">
            Back home
          </TicketButton>
        </div>
      </div>
    </section>
  );
}
