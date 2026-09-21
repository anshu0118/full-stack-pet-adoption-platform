import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/services/api";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const optimizeImageUrl = (url) => {
  if (!url) return "";

  if (!url.includes("images.unsplash.com")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}auto=format&fit=crop&w=600&q=70`;
};

/*
 * Keep the pet request outside the component.
 * React Strict Mode and remounts won't create another request.
 */
let petsPromise = null;
let cachedPets = null;

const getWallPets = () => {
  if (cachedPets) {
    return Promise.resolve(cachedPets);
  }

  if (!petsPromise) {
    petsPromise = api
      .pets({
        page: 0,
        pageSize: 7,
      })
      .then((data) => {
        const pets = (data?.content || [])
          .filter((pet) => pet.imageUrl)
          .slice(0, 7)
          .map((pet) => ({
            id: pet.id,
            image: optimizeImageUrl(pet.imageUrl),
            title: `${pet.name} · ${pet.breed}`,
            href: `/pets/${pet.id}`,
          }));

        cachedPets = pets;
        return pets;
      })
      .catch((error) => {
        petsPromise = null;
        throw error;
      });
  }

  return petsPromise;
};

const DriftWall = ({
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  className = "",
  style,
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);

  const [reduced, setReduced] = useState(false);
  const [wallItems, setWallItems] = useState(
    cachedPets || []
  );

  useEffect(() => {
    let cancelled = false;

    getWallPets()
      .then((pets) => {
        if (!cancelled) {
          setWallItems(pets);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(
            "Failed to load DriftWall pets:",
            error
          );
          setWallItems([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());

    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const onChange = (event) => {
      setReduced(event.matches);
    };

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const columnItems = useMemo(() => {
    if (!wallItems.length) return [];

    const cols = Array.from(
      { length: columns },
      () => []
    );

    wallItems.forEach((item, index) => {
      cols[index % columns].push(item);
    });

    return cols.map((col) =>
      col.length ? col : wallItems.slice(0, 1)
    );
  }, [wallItems, columns]);

  /*
   * This is intentionally the original dynamic copy
   * calculation. It keeps the wall density unchanged.
   */
  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;

    return columnItems.map((col) => {
      const copyHeight = Math.max(
        unit,
        col.length * unit
      );

      const copies = Math.max(
        2,
        Math.ceil(
          (containerHeight * 1.6) / copyHeight
        ) + 1
      );

      return {
        copyHeight,
        copies,
      };
    });
  }, [
    columnItems,
    tileHeight,
    gap,
    containerHeight,
  ]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(
        entry.contentRect.height || 600
      );
    });

    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === "up" ? 1 : -1;

    return columnItems.map((_, columnIndex) => {
      const alternateSign =
        columnIndex % 2 === 0 ? 1 : -1;

      return (
        speed *
        columnFactor(columnIndex, variance) *
        dirSign *
        alternateSign
      );
    });
  }, [
    columnItems,
    speed,
    direction,
    variance,
  ]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, columnIndex) =>
        meta.copyHeight *
        ((columnIndex * 0.37) % 1)
    );

    velocitiesRef.current = columnItems.map(
      () => 0
    );
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;

      if (!plane) return;

      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) ` +
        `rotateY(${turn + px}deg) ` +
        `rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (timestamp) => {
      if (lastTsRef.current === null) {
        lastTsRef.current = timestamp;
      }

      const dt = Math.min(
        0.05,
        Math.max(
          0,
          timestamp - lastTsRef.current
        ) / 1000
      );

      lastTsRef.current = timestamp;

      const maxTilt = parallax * 8;

      const targetX =
        pointerRef.current.x * maxTilt;

      const targetY =
        -pointerRef.current.y * maxTilt;

      const damp =
        1 - Math.exp(-dt / 0.12);

      pointerDampedRef.current.x +=
        (targetX -
          pointerDampedRef.current.x) *
        damp;

      pointerDampedRef.current.y +=
        (targetY -
          pointerDampedRef.current.y) *
        damp;

      applyPlaneTransform(
        pointerDampedRef.current.x,
        pointerDampedRef.current.y
      );

      if (!reduced) {
        for (
          let columnIndex = 0;
          columnIndex <
          trackRefs.current.length;
          columnIndex++
        ) {
          const meta =
            columnMeta[columnIndex];

          if (!meta) continue;

          const paused =
            wallHoveredRef.current &&
            pauseOnHover;

          const factor =
            paused ||
            hoveredColRef.current ===
              columnIndex
              ? 0
              : 1;

          const target =
            baseVelocities[columnIndex] *
            factor;

          const ease =
            1 -
            Math.exp(
              -dt /
                (target === 0
                  ? 0.16
                  : 0.28)
            );

          velocitiesRef.current[
            columnIndex
          ] +=
            (target -
              velocitiesRef.current[
                columnIndex
              ]) *
            ease;

          let next =
            (offsetsRef.current[
              columnIndex
            ] ?? 0) +
            velocitiesRef.current[
              columnIndex
            ] *
              dt;

          next =
            ((next % meta.copyHeight) +
              meta.copyHeight) %
            meta.copyHeight;

          offsetsRef.current[
            columnIndex
          ] = next;

          const element =
            trackRefs.current[
              columnIndex
            ];

          if (element) {
            element.style.transform =
              `translate3d(0, ${-next}px, 0)`;
          }
        }
      } else {
        for (
          let columnIndex = 0;
          columnIndex <
          trackRefs.current.length;
          columnIndex++
        ) {
          const element =
            trackRefs.current[columnIndex];

          const meta =
            columnMeta[columnIndex];

          if (element && meta) {
            element.style.transform =
              `translate3d(0, ${
                -(
                  offsetsRef.current[
                    columnIndex
                  ] ?? 0
                )
              }px, 0)`;
          }
        }
      }

      rafRef.current =
        requestAnimationFrame(animate);
    };

    rafRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnMeta,
    pauseOnHover,
    parallax,
    reduced,
    applyPlaneTransform,
  ]);

  const activate = useCallback(
    (id, columnIndex) => {
      activeIdRef.current = id;
      hoveredColRef.current =
        columnIndex;
      setActiveId(id);
    },
    []
  );

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove =
    useCallback(
      (event) => {
        const rect =
          containerRef.current?.getBoundingClientRect();

        if (!rect) return;

        if (parallax > 0 && !reduced) {
          pointerRef.current = {
            x:
              (event.clientX -
                rect.left) /
                rect.width -
              0.5,
            y:
              (event.clientY -
                rect.top) /
                rect.height -
              0.5,
          };
        }

        const hit =
          document.elementFromPoint(
            event.clientX,
            event.clientY
          );

        const tile =
          hit?.closest?.(
            "[data-tile-id]"
          );

        if (!tile) return;

        const id =
          tile.dataset.tileId;

        if (
          id === activeIdRef.current
        ) {
          return;
        }

        activeIdRef.current = id;
        hoveredColRef.current =
          Number(tile.dataset.col);

        setActiveId(id);
      },
      [parallax, reduced]
    );

  const handlePointerLeaveWall =
    useCallback(() => {
      wallHoveredRef.current = false;
      pointerRef.current = {
        x: 0,
        y: 0,
      };
      release();
    }, [release]);

  const maskStyle =
    "radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), " +
    "linear-gradient(to top, #000 var(--dw-edge), transparent 100%)";

  const cssVars = useMemo(
    () => ({
      "--dw-tile-w": `${tileWidth}px`,
      "--dw-tile-h": `${tileHeight}px`,
      "--dw-gap": `${gap}px`,
      "--dw-radius": `${radius}px`,
      "--dw-lift": `${lift}px`,
      "--dw-dim": dim,
      "--dw-gray": grayscale ? 1 : 0,
      "--dw-overlay": overlayColor,
      "--dw-edge": `${Math.max(
        0,
        (1 - fade) * 100
      )}%`,
      perspective: `${perspective}px`,
      perspectiveOrigin: "50% 50%",
      WebkitMaskImage: maskStyle,
      maskImage: maskStyle,
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
      ...style,
    }),
    [
      tileWidth,
      tileHeight,
      gap,
      radius,
      lift,
      dim,
      grayscale,
      overlayColor,
      fade,
      perspective,
      maskStyle,
      style,
    ]
  );

  const tileClass = cx(
    "group/tile relative block flex-none cursor-pointer outline-none",
    "w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))]",
    "[transform-style:preserve-3d]"
  );

  const innerClass = cx(
    "pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12]",
    "rounded-[var(--dw-radius)] opacity-[var(--dw-dim)]",
    "[transform:translateZ(0)]",
    "transition-[transform,opacity,box-shadow] duration-[420ms]",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-100",
    "group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]",
    "group-[.is-active]/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]",
    "group-focus-visible/tile:opacity-100",
    "group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]",
    "group-focus-visible/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_2px_rgba(255,255,255,0.9)]"
  );

  const imgClass = cx(
    "block h-full w-full select-none object-cover",
    "[filter:grayscale(var(--dw-gray))_saturate(0.92)]",
    "transition-[filter,opacity] duration-[420ms]",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.05)]",
    "group-focus-visible/tile:[filter:grayscale(0)_saturate(1.05)]"
  );

  const overlayClass = cx(
    "pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.42]",
    "transition-opacity duration-[420ms]",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-0",
    "group-focus-visible/tile:opacity-0"
  );

  const renderTile = (
    item,
    id,
    columnIndex
  ) => {
    const inner = (
      <span className={innerClass}>
        <img
          src={item.image}
          alt={item.title ?? ""}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
        />

        <span
          className={overlayClass}
          aria-hidden="true"
        />
      </span>
    );

    const commonProps = {
      className: cx(
        tileClass,
        activeId === id &&
          "is-active"
      ),
      "data-tile-id": id,
      "data-col": columnIndex,
      onFocus: () =>
        activate(
          id,
          columnIndex
        ),
      onBlur: release,
    };

    if (item.href) {
      return (
        <a
          key={id}
          href={item.href}
          {...commonProps}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={
          item.title ?? "pet"
        }
        {...commonProps}
      >
        {inner}
      </div>
    );
  };

  if (!wallItems.length) {
    return (
      <div
        ref={containerRef}
        className={cx(
          "relative h-full w-full overflow-hidden",
          className
        )}
        style={cssVars}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cx(
        "relative h-full w-full overflow-hidden",
        className
      )}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={
        handlePointerLeaveWall
      }
      role="group"
      aria-label="Drifting wall of pets"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map(
          (column, columnIndex) => {
            const meta =
              columnMeta[
                columnIndex
              ];

            return (
              <div
                key={`column-${columnIndex}`}
                className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              >
                <div
                  ref={(element) => {
                    trackRefs.current[
                      columnIndex
                    ] = element;
                  }}
                  className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                >
                  {Array.from({
                    length: meta.copies,
                  }).map(
                    (_, copyIndex) =>
                      column.map(
                        (
                          item,
                          itemIndex
                        ) =>
                          renderTile(
                            item,
                            `${columnIndex}-${copyIndex}-${item.id ?? itemIndex}`,
                            columnIndex
                          )
                      )
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default DriftWall;