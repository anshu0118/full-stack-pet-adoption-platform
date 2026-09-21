import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Aurora from "@/components/Backgrounds/Aurora";
import PixelSwap from "@/components/auth/PixelSwap";

function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("adopter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      onSuccess(result.user);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-black/8 bg-white/92 p-6 shadow-xl shadow-black/8 backdrop-blur-md sm:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#24352d]">
          Welcome back
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-[#66716b]">
          Log in to continue with Jack & Paws.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#f4f1ea] p-1">
        <button
          type="button"
          onClick={() => setMode("adopter")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "adopter"
              ? "bg-white text-[#24352d] shadow-sm"
              : "text-[#737a75] hover:text-[#24352d]"
          }`}
        >
          Adopt a pet
        </button>

        <button
          type="button"
          onClick={() => setMode("shelter")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "shelter"
              ? "bg-white text-[#24352d] shadow-sm"
              : "text-[#737a75] hover:text-[#24352d]"
          }`}
        >
          Shelter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#354139]"
          >
            Email
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929993]"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-[#ddd9d1] bg-[#fffdf9] pl-10 pr-3 text-sm text-[#24352d] outline-none transition placeholder:text-[#a5aaa6] focus:border-[#f26b38] focus:ring-2 focus:ring-[#f26b38]/15"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[#354139]"
          >
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929993]"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-11 w-full rounded-xl border border-[#ddd9d1] bg-[#fffdf9] pl-10 pr-11 text-sm text-[#24352d] outline-none transition placeholder:text-[#a5aaa6] focus:border-[#f26b38] focus:ring-2 focus:ring-[#f26b38]/15"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858d87] transition hover:text-[#24352d]"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-[#f26b38] text-sm font-semibold text-white transition hover:bg-[#df5c2c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-[#858d87]">
        New to Jack & Paws?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-medium text-[#f26b38] transition hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

function LoginSuccess() {
  return (
    <div className="flex min-h-[520px] h-full flex-col items-center justify-center rounded-2xl bg-[#24352d] px-8 text-center text-white">
      <h2 className="text-2xl font-semibold">
        Welcome back
      </h2>

      <p className="mt-2 text-sm text-white/65">
        You're logged in.
      </p>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSuccess = () => {
    setLoginSuccess(true);
  };

  const handleAnimationComplete = () => {
    setTimeout(() => {
      navigate("/");
    }, 1800);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff9f1]">
      <div className="pointer-events-none absolute inset-0">
        <Aurora
          colorStops={["#f4c95d", "#f26b38", "#b98cff"]}
          amplitude={0.8}
          blend={0.5}
          speed={0.35}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[#fff9f1]/60" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <PixelSwap
          firstContent={
            <LoginForm onSuccess={handleSuccess} />
          }
          secondContent={<LoginSuccess />}
          active={loginSuccess}
          onActiveChange={setLoginSuccess}
          onComplete={handleAnimationComplete}
          pixelSize={48}
          gap={0}
          pixelRadius={8}
          pixelSpin={0}
          pixelScale={0.35}
          fade
          duration={1400}
          pixelDuration={650}
          pattern="random"
          randomness={0.15}
          easing="cubic-bezier(0.22, 1, 0.36, 1)"
          trigger="programmatic"
          aspectRatio="520 / 560"
          className="w-full max-w-[520px]"
        />
      </div>
    </main>
  );
}