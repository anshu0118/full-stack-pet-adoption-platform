import { useRef } from "react";
import { gsap } from "gsap";

function FlowingSteps({
  items = [],
  textColor = "#24352d",
  bgColor = "#fff9f1",
  activeBgColor = "#f97316",
  activeTextColor = "#fff",
  borderColor = "rgba(36, 53, 45, 0.14)",
}) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <nav className="flex h-full flex-col">
        {items.map((item, index) => (
          <MenuItem
            key={item.id ?? index}
            {...item}
            textColor={textColor}
            activeBgColor={activeBgColor}
            activeTextColor={activeTextColor}
            borderColor={borderColor}
            index={index}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  text,
  description,
  textColor,
  activeBgColor,
  activeTextColor,
  borderColor,
  index,
}) {
  const itemRef = useRef(null);
  const activeRef = useRef(null);

  const rowGrid =
    "grid h-full grid-cols-[52px_340px_32px_minmax(0,1fr)] items-center px-7 lg:px-10";

  const animateIn = (event) => {
    if (!itemRef.current || !activeRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const fromTop = event.clientY - rect.top < rect.height / 2;

    gsap.killTweensOf(activeRef.current);

    gsap.fromTo(
      activeRef.current,
      {
        y: fromTop ? "-100%" : "100%",
      },
      {
        y: "0%",
        duration: 0.5,
        ease: "expo.out",
        overwrite: true,
      }
    );
  };

  const animateOut = (event) => {
    if (!itemRef.current || !activeRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const toTop = event.clientY - rect.top < rect.height / 2;

    gsap.killTweensOf(activeRef.current);

    gsap.to(activeRef.current, {
      y: toTop ? "-100%" : "100%",
      duration: 0.4,
      ease: "expo.inOut",
      overwrite: true,
    });
  };

  return (
    <div
      ref={itemRef}
      className="relative flex-1 overflow-hidden"
      style={{
        borderBottom:
          index === 2 ? "none" : `1px solid ${borderColor}`,
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div
        className={rowGrid}
        style={{ color: textColor }}
      >
        <span className="text-sm font-bold tracking-[0.18em] text-jp-orange">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="whitespace-nowrap text-[clamp(1.7rem,3.2vw,3.2rem)] font-black uppercase tracking-[-0.04em]">
          {text}
        </span>
      </div>

      <div
        ref={activeRef}
        className="pointer-events-none absolute inset-0 z-20 translate-y-[100%]"
        style={{ backgroundColor: activeBgColor }}
      >
        <div
          className={rowGrid}
          style={{ color: activeTextColor }}
        >
          <span className="text-sm font-bold tracking-[0.18em] opacity-70">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="whitespace-nowrap text-[clamp(1.7rem,3.2vw,3.2rem)] font-black uppercase tracking-[-0.04em]">
            {text}
          </span>

          <span className="text-center text-xl opacity-60">
            •
          </span>

          <span className="max-w-2xl text-sm font-medium leading-6 opacity-90 lg:text-base">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FlowingSteps;