import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const initialForm = {
  name: "",
  species: "DOG",
  breed: "",
  age: "",
  gender: "MALE",
  size: "MEDIUM",
  location: "",
  description: "",
  energyLevel: "MEDIUM",
  vaccinated: false,
  neutered: false,
  goodWithChildren: true,
  goodWithDogs: true,
  goodWithCats: false,
  imageUrl: "",
};

export default function AddPet() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user?.role !== "SHELTER") {
    navigate("/dashboard");
    return null;
  }

  const change = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const pet = await api.createPet({
        ...form,
        age: Number(form.age),
      });

      navigate(`/pets/${pet.id}`);
    } catch (err) {
      setError(err.message || "Unable to add pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">
          Shelter
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-jp-green">
          Add a pet
        </h1>

        <p className="mt-2 text-stone-500">
          Add a pet to the adoption directory.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              className="input"
              placeholder="Milo"
            />
          </Field>

          <Field label="Breed">
            <input
              required
              value={form.breed}
              onChange={(e) => change("breed", e.target.value)}
              className="input"
              placeholder="Indie"
            />
          </Field>

          <Field label="Species">
            <select
              value={form.species}
              onChange={(e) => change("species", e.target.value)}
              className="input"
            >
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
            </select>
          </Field>

          <Field label="Age">
            <input
              required
              min="0"
              type="number"
              value={form.age}
              onChange={(e) => change("age", e.target.value)}
              className="input"
              placeholder="2"
            />
          </Field>

          <Field label="Gender">
            <select
              value={form.gender}
              onChange={(e) => change("gender", e.target.value)}
              className="input"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </Field>

          <Field label="Size">
            <select
              value={form.size}
              onChange={(e) => change("size", e.target.value)}
              className="input"
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </Field>

          <Field label="Energy level">
            <select
              value={form.energyLevel}
              onChange={(e) => change("energyLevel", e.target.value)}
              className="input"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </Field>

          <Field label="Location">
            <input
              required
              value={form.location}
              onChange={(e) => change("location", e.target.value)}
              className="input"
              placeholder="Bhubaneswar"
            />
          </Field>

          <Field label="Image URL" className="sm:col-span-2">
            <input
              value={form.imageUrl}
              onChange={(e) => change("imageUrl", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>

          <Field label="Description" className="sm:col-span-2">
            <textarea
              required
              rows="5"
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
              className="input resize-none"
              placeholder="Tell potential adopters about this pet..."
            />
          </Field>
        </div>

        <div className="mt-7">
          <p className="mb-3 text-sm font-semibold text-jp-green">
            Pet information
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Check
              label="Vaccinated"
              checked={form.vaccinated}
              onChange={(v) => change("vaccinated", v)}
            />

            <Check
              label="Neutered"
              checked={form.neutered}
              onChange={(v) => change("neutered", v)}
            />

            <Check
              label="Good with children"
              checked={form.goodWithChildren}
              onChange={(v) => change("goodWithChildren", v)}
            />

            <Check
              label="Good with dogs"
              checked={form.goodWithDogs}
              onChange={(v) => change("goodWithDogs", v)}
            />

            <Check
              label="Good with cats"
              checked={form.goodWithCats}
              onChange={(v) => change("goodWithCats", v)}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3 border-t border-stone-200 pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="rounded-xl bg-jp-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add pet"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold text-jp-green">
        {label}
      </span>
      {children}
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#f26b38]"
      />
      {label}
    </label>
  );
}