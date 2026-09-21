import { Link } from "react-router-dom";
import DriftWall from "@/components/Backgrounds/DriftWall";

export default function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute left-[6%] top-[-110px] h-[900px] w-[108%]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 13%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 13%, black 100%)",
          }}
        >
          <DriftWall
            columns={7}
            tileWidth={250}
            tileHeight={165}
            gap={14}
            tilt={12}
            turn={-10}
            perspective={1400}
            depth={120}
            speed={38}
            direction="up"
            variance={0.35}
            parallax={0.45}
            lift={70}
            fade={0.15}
            dim={0.72}
            overlayColor="#060010"
            radius={16}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[46%] bg-gradient-to-r from-[#fff9f1] via-[#fff9f1]/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-jp-orange">
            Pet adoption, without the guesswork.
          </p>

          <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.045em] text-jp-green sm:text-6xl lg:text-7xl">
            Find a pet that
            <br />
            fits your life.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-jp-green/70">
            Browse available pets, learn about them, and apply when you find
            one you want to meet.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pets"
              className="rounded-xl bg-jp-orange px-6 py-3.5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Browse pets →
            </Link>

            <Link
              to="/how-it-works"
              className="rounded-xl border border-jp-green/25 bg-white/70 px-6 py-3.5 font-bold text-jp-green backdrop-blur-sm transition hover:bg-white"
            >
              How adoption works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}