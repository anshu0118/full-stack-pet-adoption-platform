import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    housingType: "",
    hasYard: false,
    hasOtherPets: false,
    experience: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPet = async () => {
      try {
        const data = await api.pet(id);

        if (!cancelled) {
          setPet(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load this pet.");
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

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await api.apply({
        petId: Number(id),
        ...form,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "We couldn't submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center p-10 text-sm text-stone-500">
        Loading application...
      </div>
    );
  }

  if (!pet) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-800">
          {error || "This pet could not be found."}
        </div>

        <Link
          to="/pets"
          className="mt-5 inline-block text-sm font-semibold text-jp-orange hover:text-jp-green"
        >
          ← Back to pets
        </Link>
      </section>
    );
  }

  const field =
    "rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none transition focus:border-jp-orange focus:ring-2 focus:ring-jp-orange/20";

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <Link
        className="text-sm font-semibold text-jp-orange hover:text-jp-green"
        to={`/pets/${id}`}
      >
        ← Back to {pet.name}
      </Link>

      <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">
        Adoption application
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-jp-green sm:text-4xl">
        Tell us about your home.
      </h1>

      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        You're applying to adopt {pet.name}. This information helps the
        adoption team understand whether the match is right for both of you.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          {error}
        </div>
      )}

      <form
        className="mt-8 space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        onSubmit={submit}
      >
        <label className="grid gap-2 text-sm font-semibold text-jp-green">
          Housing type

          <select
            className={field}
            required
            value={form.housingType}
            onChange={(event) =>
              updateField("housingType", event.target.value)
            }
          >
            <option value="">Choose...</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Shared accommodation">
              Shared accommodation
            </option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-stone-700">
            <input
              className="size-4 accent-orange-600"
              type="checkbox"
              checked={form.hasYard}
              onChange={(event) =>
                updateField("hasYard", event.target.checked)
              }
            />
            I have access to a yard or outdoor space.
          </label>

          <label className="flex items-center gap-3 text-sm text-stone-700">
            <input
              className="size-4 accent-orange-600"
              type="checkbox"
              checked={form.hasOtherPets}
              onChange={(event) =>
                updateField("hasOtherPets", event.target.checked)
              }
            />
            I currently have other pets.
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-jp-green">
          Previous pet experience

          <textarea
            className={field}
            value={form.experience}
            onChange={(event) =>
              updateField("experience", event.target.value)
            }
            rows="4"
            placeholder="Tell us about any pets you've cared for before."
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-jp-green">
          Why would you like to adopt {pet.name}?

          <textarea
            className={field}
            required
            minLength="20"
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            rows="6"
            placeholder={`Tell us why ${pet.name} would be a good fit for you.`}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-jp-orange px-6 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting application..." : "Submit application"}
        </button>
      </form>
    </section>
  );
}