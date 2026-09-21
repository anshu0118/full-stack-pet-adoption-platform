import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import AccordionGallery from "@/components/pets/AccordionGallery";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const response = await fetch(
          `${API_URL}/pets?page=0&pageSize=5`
        );

        if (!response.ok) {
          throw new Error("Failed to load pets");
        }

        const data = await response.json();

        const pets = data.content || [];

        setFeaturedPets(
          pets.map((pet) => ({
            image: pet.imageUrl,
            label: `${pet.name} · ${pet.breed}`,
            link: `/pets/${pet.id}`,
            alt: `${pet.name} the ${pet.breed}`,
          }))
        );
      } catch (error) {
        console.error("Failed to load featured pets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-jp-ivory text-jp-green">
      <div className="relative z-10">
        <Hero />

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-jp-orange">
              Featured pets
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Meet some pets looking for a home.
            </h2>
          </div>

          {loading ? (
            <div className="flex h-[460px] items-center justify-center rounded-2xl bg-white/60 text-sm text-jp-green/60">
              Finding pets...
            </div>
          ) : featuredPets.length > 0 ? (
            <AccordionGallery
              items={featuredPets}
              defaultIndex={2}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#ffffff"
              overlayColor="#24352d"
              textColor="#ffffff"
              grayscale
              showLabels
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={460}
              gap={10}
              radius={16}
              orientation="horizontal"
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-2xl bg-white/60 text-sm text-jp-green/60">
              No pets are available right now.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}