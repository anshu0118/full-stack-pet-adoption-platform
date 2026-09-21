import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Link to={`/pets/${pet.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-stone-100">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/pets/${pet.id}`}
              className="text-lg font-bold text-jp-green hover:text-jp-orange"
            >
              {pet.name}
            </Link>

            <p className="mt-1 text-sm text-stone-500">
              {pet.breed} · {pet.age} {pet.age === 1 ? "year" : "years"}
            </p>
          </div>

          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-jp-orange">
            {pet.gender}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
          <span className="rounded-full bg-stone-100 px-2.5 py-1">
            {pet.size}
          </span>

          <span className="rounded-full bg-stone-100 px-2.5 py-1">
            {pet.location}
          </span>
        </div>

        <Link
          to={`/pets/${pet.id}`}
          className="mt-4 inline-flex text-sm font-bold text-jp-orange hover:text-orange-700"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}