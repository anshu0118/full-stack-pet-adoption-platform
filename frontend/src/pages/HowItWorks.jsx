import { Link } from "react-router-dom";
import FlowingSteps from "@/components/how-it-works/FlowingSteps";

const steps = [
  {
    id: 1,
    text: "Find",
    description:
      "Search available pets by species, size, gender, breed or location. Save profiles you want to revisit.",
  },
  {
    id: 2,
    text: "Understand",
    description:
      "Open a pet's profile and check their age, energy, compatibility and care needs before applying.",
  },
  {
    id: 3,
    text: "Apply",
    description:
      "Submit your home details and reason for adopting. Track your application from your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-jp-ivory text-jp-green">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-jp-orange">
            How it works
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Three steps from browsing
            <br />
            to a real application.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-jp-green/65">
            Browse available pets, understand what they need, and submit an
            application when you find one that fits.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 pb-24 lg:px-8">
        <div className="mx-auto h-[270px] max-w-[1400px] overflow-hidden rounded-[24px] border border-jp-green/10 shadow-sm">
          <FlowingSteps items={steps} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[28px] bg-jp-green px-8 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-jp-yellow">
              Ready to look?
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Start browsing available pets.
            </h2>
          </div>

          <Link
            to="/pets"
            className="w-fit rounded-xl bg-jp-orange px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Browse pets →
          </Link>
        </div>
      </section>
    </main>
  );
}