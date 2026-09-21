import { useEffect, useState } from "react";
import { ArrowLeft, Check, Heart, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

const statusLabels = {
  AVAILABLE: "Available",
  APPLICATION_PENDING: "Application pending",
  ADOPTED: "Adopted",
};

const formatValue = (value) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f7f5ef] px-4 py-3">
      <p className="text-xs font-medium text-[#7b827d]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#24352d]">
        {value}
      </p>
    </div>
  );
}

function BooleanDetail({ label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#4e5851]">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          value
            ? "bg-[#eef5ef] text-[#4f8b5d]"
            : "bg-[#f1efeb] text-[#969b96]"
        }`}
      >
        {value ? <Check size={14} /> : "−"}
      </span>

      <span>{label}</span>
    </div>
  );
}

export default function PetDetails() {
  const { id } = useParams();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPet = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await api.pet(id);

        if (!cancelled) {
          setPet(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load this pet."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPet();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid min-h-[500px] place-items-center rounded-2xl bg-white text-sm text-[#737a75]">
          Finding this pet...
        </div>
      </section>
    );
  }

  if (error || !pet) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-[#ead8cf] bg-white p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f26b38]">
            Pet not found
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#24352d]">
            We couldn't find that profile.
          </h1>

          <p className="mt-2 text-sm text-[#737a75]">
            {error || "This pet may no longer be available."}
          </p>

          <Link
            to="/pets"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#24352d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18251f]"
          >
            <ArrowLeft size={16} />
            Back to pets
          </Link>
        </div>
      </section>
    );
  }

  const isAvailable =
    pet.adoptionStatus === "AVAILABLE";

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
      <Link
        to="/pets"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#59625c] transition hover:text-[#24352d]"
      >
        <ArrowLeft size={16} />
        Back to pets
      </Link>

      <div className="grid overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[420px] bg-[#eeeae2] lg:min-h-[620px]">
          <img
            src={pet.imageUrl}
            alt={`${pet.name}, ${pet.breed}`}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute left-5 top-5">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                isAvailable
                  ? "bg-white/95 text-[#24352d]"
                  : "bg-[#24352d]/90 text-white"
              }`}
            >
              {statusLabels[pet.adoptionStatus] ||
                formatValue(pet.adoptionStatus)}
            </span>
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f26b38]">
              Meet {pet.name}
            </p>

            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#24352d]">
                  {pet.name}
                </h1>

                <p className="mt-1 text-base text-[#737a75]">
                  {pet.breed}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Favourite ${pet.name}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e5e2dc] text-[#24352d] transition hover:bg-[#f7f5ef]"
              >
                <Heart size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#737a75]">
              <MapPin size={16} />
              <span>{pet.location}</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <Detail
              label="Age"
              value={`${pet.age} ${
                pet.age === 1 ? "year" : "years"
              }`}
            />

            <Detail
              label="Gender"
              value={formatValue(pet.gender)}
            />

            <Detail
              label="Size"
              value={formatValue(pet.size)}
            />

            <Detail
              label="Energy"
              value={formatValue(pet.energyLevel)}
            />
          </div>

          <div className="mt-7">
            <h2 className="text-sm font-bold text-[#24352d]">
              About {pet.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#69716b]">
              {pet.description}
            </p>
          </div>

          <div className="mt-7 border-t border-[#ebe8e2] pt-6">
            <h2 className="text-sm font-bold text-[#24352d]">
              Good to know
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <BooleanDetail
                label="Good with dogs"
                value={pet.goodWithDogs}
              />

              <BooleanDetail
                label="Good with cats"
                value={pet.goodWithCats}
              />

              <BooleanDetail
                label="Good with children"
                value={pet.goodWithChildren}
              />

              <BooleanDetail
                label="Vaccinated"
                value={pet.vaccinated}
              />

              <BooleanDetail
                label="Neutered"
                value={pet.neutered}
              />
            </div>
          </div>

          <div className="mt-auto pt-8">
            {isAvailable ? (
              <Link
                to={`/pets/${pet.id}/apply`}
                className="flex h-12 items-center justify-center rounded-xl bg-[#f26b38] px-5 text-sm font-bold text-white transition hover:bg-[#df5929]"
              >
                Apply to adopt {pet.name}
              </Link>
            ) : (
              <div className="rounded-xl bg-[#f7f5ef] px-4 py-3 text-center text-sm font-semibold text-[#737a75]">
                This pet is not currently available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}