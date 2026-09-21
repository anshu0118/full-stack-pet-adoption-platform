import { Link } from "react-router-dom";
import TextType from "@/components/about/TextType";

const features = [
  {
    number: "01",
    title: "Browse",
    text: "Search available pets and narrow the list using useful details like species, breed, age and location.",
  },
  {
    number: "02",
    title: "Profiles",
    text: "View the details of a pet before deciding whether you want to apply.",
  },
  {
    number: "03",
    title: "Applications",
    text: "Submit an adoption application and provide the information needed for the next step.",
  },
  {
    number: "04",
    title: "Tracking",
    text: "Keep track of your applications and see how they progress through the process.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-jp-ivory text-jp-green">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-jp-orange">
            About Jack & Paws
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            A pet adoption platform built around the process.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-jp-green/65 sm:text-lg">
            Finding a pet is only the beginning. Jack & Paws brings browsing,
            pet profiles, applications and application tracking into one place.
          </p>

          <div className="mt-8">
            <TextType
              text={["Browse.", "Understand.", "Apply.", "Track."]}
              typingSpeed={80}
              deletingSpeed={45}
              pauseDuration={1100}
              showCursor
              cursorCharacter="_"
              startOnVisible
              className="text-xl font-bold tracking-tight sm:text-2xl"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-jp-green/10 bg-white/40">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-jp-orange">
                Why it exists
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                More than a listing page.
              </h2>
            </div>

            <div className="space-y-4 text-base leading-7 text-jp-green/65">
              <p>
                Jack & Paws is designed around what happens after someone finds
                a pet they are interested in.
              </p>

              <p>
                Users can explore available pets, check their profiles, save
                favourites and submit adoption applications without having to
                jump between different parts of the system.
              </p>

              <p>
                The project also includes the workflow behind those
                applications, making it more than a simple pet catalogue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-18">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-jp-orange">
            What it handles
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            The main parts of the platform.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-jp-green/10 bg-white/60 p-6"
            >
              <span className="text-xs font-bold tracking-[0.16em] text-jp-orange">
                {feature.number}
              </span>

              <h3 className="mt-5 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-jp-green/60">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col gap-5 rounded-2xl border border-jp-green/10 bg-jp-green/[0.04] p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Want to see the process?</p>
            <p className="mt-1 text-sm text-jp-green/60">
              See how a pet goes from discovery to an adoption application.
            </p>
          </div>

          <Link
            to="/how-it-works"
            className="w-fit rounded-lg bg-jp-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            How it works →
          </Link>
        </div>
      </section>
    </main>
  );
}