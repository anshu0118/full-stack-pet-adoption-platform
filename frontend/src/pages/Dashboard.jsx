import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function ShelterDashboard({ user }) {
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadPets = async () => {
    const data = await api.shelterPets();
    setPets(data);
  };

  const loadApplications = async () => {
    const data = await api.shelterApplications();
    setApplications(data);
  };

  const loadShelterData = async () => {
    setLoading(true);
    setError("");

    try {
      await loadPets();
      await loadApplications();
    } catch (err) {
      setError(err.message || "Unable to load shelter data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelterData();
  }, []);

  const updateApplication = async (id, status) => {
    setActionId(id);
    setError("");

    try {
      await api.updateShelterApplicationStatus(id, status);
      await loadShelterData();
    } catch (err) {
      setError(err.message || "Unable to update application.");
    } finally {
      setActionId(null);
    }
  };

  const removePet = async (id) => {
    const confirmed = window.confirm(
      "Remove this pet from the adoption listings?"
    );

    if (!confirmed) return;

    setActionId(`pet-${id}`);
    setError("");

    try {
      await api.removePet(id);
      await loadPets();
    } catch (err) {
      setError(err.message || "Unable to remove pet.");
    } finally {
      setActionId(null);
    }
  };

  const adoptedPets = pets.filter(
    (pet) => pet.adoptionStatus === "ADOPTED"
  ).length;

  const pendingApplications = applications.filter(
    (application) =>
      application.status !== "APPROVED" &&
      application.status !== "REJECTED"
  ).length;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">
        Shelter
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-jp-green">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2 text-stone-500">
        Manage your pets and adoption applications.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pets" value={pets.length} />
        <StatCard label="Applications" value={applications.length} />
        <StatCard label="Pending review" value={pendingApplications} />
        <StatCard label="Adopted" value={adoptedPets} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-jp-green">
            Your pets
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Pets managed by your shelter.
          </p>
        </div>

        <Link
          to="/shelter/pets/new"
          className="rounded-lg bg-jp-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          Add a pet
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-stone-500 shadow-sm">
          Loading shelter data...
        </div>
      ) : pets.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div key={pet.id} className="relative">
              <PetCard pet={pet} />

              <div className="mt-2 flex gap-2">
                <Link
                  to={`/pets/${pet.id}`}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => removePet(pet.id)}
                  disabled={actionId === `pet-${pet.id}`}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {actionId === `pet-${pet.id}`
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-jp-green">
            No pets added yet.
          </p>

          <Link
            to="/shelter/pets/new"
            className="mt-4 inline-flex rounded-lg bg-jp-orange px-4 py-2 text-sm font-bold text-white"
          >
            Add a pet
          </Link>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-jp-green">
          Adoption applications
        </h2>

        <p className="mt-1 text-sm text-stone-500">
          Review applications for your pets.
        </p>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-stone-500 shadow-sm">
            Loading applications...
          </div>
        ) : applications.length ? (
          <div className="mt-6 space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                actionId={actionId}
                onUpdate={updateApplication}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-jp-green">
              No applications yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-jp-green">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({ application, actionId, onUpdate }) {
  const isPending =
    application.status !== "APPROVED" &&
    application.status !== "REJECTED";

  const busy = actionId === application.id;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-jp-green">
              {application.applicantName}
            </h3>

            <StatusBadge status={application.status} />
          </div>

          <p className="mt-1 text-sm text-stone-500">
            {application.applicantEmail}
          </p>

          <p className="mt-3 text-sm">
            Applying for{" "}
            <Link
              to={`/pets/${application.petId}`}
              className="font-bold text-jp-orange"
            >
              {application.petName}
            </Link>
          </p>
        </div>

        <p className="text-sm text-stone-500">
          {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-5 grid gap-4 border-t border-stone-200 pt-5 sm:grid-cols-3">
        <Info label="Housing" value={application.housingType} />

        <Info
          label="Has yard"
          value={application.hasYard ? "Yes" : "No"}
        />

        <Info
          label="Other pets"
          value={application.hasOtherPets ? "Yes" : "No"}
        />
      </div>

      {application.experience && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
            Experience
          </p>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {application.experience}
          </p>
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
          Message
        </p>

        <p className="mt-1 text-sm leading-6 text-stone-600">
          {application.message}
        </p>
      </div>

      {isPending && (
        <div className="mt-6 flex gap-3 border-t border-stone-200 pt-5">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onUpdate(application.id, "APPROVED")
            }
            className="rounded-lg bg-jp-green px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Updating..." : "Approve"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onUpdate(application.id, "REJECTED")
            }
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-stone-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function AdopterDashboard({ user }) {
  const [apps, setApps] = useState([]);
  const [fav, setFav] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.applications(), api.favorites()])
      .then(([a, f]) => {
        setApps(a);
        setFav(f);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">
        Your account
      </p>

      <h1 className="mt-2 text-5xl font-black tracking-tight text-jp-green">
        Welcome, {user?.name}
      </h1>

      {error && (
        <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
          {error}
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-jp-green">
              Applications
            </h2>

            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold">
              {apps.length}
            </span>
          </div>

          {apps.length ? (
            apps.map((a) => (
              <div
                className="grid gap-3 border-t border-stone-200 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                key={a.id}
              >
                <div>
                  <strong>{a.petName}</strong>

                  <p className="mt-1 text-sm text-stone-500">
                    Submitted{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <StatusBadge status={a.status} />

                <Link
                  className="font-semibold text-jp-orange"
                  to={`/pets/${a.petId}`}
                >
                  View pet
                </Link>
              </div>
            ))
          ) : (
            <p className="text-stone-500">
              You haven't applied for a pet yet.{" "}
              <Link className="font-bold text-jp-orange" to="/pets">
                Browse pets
              </Link>
              .
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-jp-green">
              Saved pets
            </h2>

            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold">
              {fav.length}
            </span>
          </div>

          {fav.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {fav.map((p) => (
                <PetCard key={p.id} pet={p} />
              ))}
            </div>
          ) : (
            <p className="text-stone-500">
              Save pets while browsing and they will appear here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "SHELTER") {
    return <ShelterDashboard user={user} />;
  }

  return <AdopterDashboard user={user} />;
}