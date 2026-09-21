import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "We couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">
          Start your adoption journey
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-jp-green sm:text-4xl">
          Create account
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          Create an account to save pets and keep track of your adoption
          applications.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
            {error}
          </div>
        )}

        <form
          className="mt-7 space-y-5"
          onSubmit={submit}
        >
          <label className="grid gap-2 text-sm font-semibold text-jp-green">
            Name

            <input
              className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none transition focus:border-jp-orange focus:ring-2 focus:ring-jp-orange/20"
              required
              maxLength={80}
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              autoComplete="name"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-jp-green">
            Email

            <input
              className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none transition focus:border-jp-orange focus:ring-2 focus:ring-jp-orange/20"
              type="email"
              required
              maxLength={160}
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              autoComplete="email"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-jp-green">
            Password

            <div className="relative">
              <input
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 pr-11 outline-none transition focus:border-jp-orange focus:ring-2 focus:ring-jp-orange/20"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                maxLength={72}
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-jp-green"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <span className="text-xs font-normal text-stone-500">
              At least 8 characters.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-jp-orange px-5 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            className="font-bold text-jp-orange hover:text-jp-green"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}