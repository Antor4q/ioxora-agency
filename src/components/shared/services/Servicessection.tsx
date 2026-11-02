
'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface Service {
  id: string;
  title: string;
  tags: string;
  image: string;
}

const services: Service[] = [
  {
    id: '3d',
    title: '3D & WebGL Websites',
    tags: 'Three.js · WebGL · GSAP',
    image: 'https://picsum.photos/seed/ioxora3d/1200/800',
  },
  {
    id: 'motion',
    title: 'Interactive & Motion Design',
    tags: 'GSAP · Scroll · Micro-interactions',
    image: 'https://picsum.photos/seed/ioxoramotion/1200/800',
  },
  {
    id: 'ai',
    title: 'AI Agents & Chatbots',
    tags: 'LLMs · RAG · Automation',
    image: 'https://picsum.photos/seed/ioxoraai/1200/800',
  },
  {
    id: 'apps',
    title: 'Web Apps & Dashboards',
    tags: 'Next.js · TypeScript · APIs',
    image: 'https://picsum.photos/seed/ioxoraapps/1200/800',
  },
  {
    id: 'growth',
    title: 'Conversion & Performance',
    tags: 'SEO · Core Web Vitals · A/B',
    image: 'https://picsum.photos/seed/ioxoragrowth/1200/800',
  },
  {
    id: 'brand',
    title: 'Brand-to-Web Design',
    tags: 'Figma · UI/UX · Design Systems',
    image: 'https://picsum.photos/seed/ioxorabrand/1200/800',
  },
];

const ARROW = 48;
const META_COLOR = 'rgba(0,0,0,0.55)';

// Keep JavaScript hover detection consistent with Tailwind's lg breakpoint.
const HOVER_QUERY =
  '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

// Stable external-store functions.
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ServicesSection() {
  const listWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const imageWrapRef = useRef<HTMLDivElement>(null);

  const activeIdRef = useRef<string | null>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Prevent the portal from rendering during SSR.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot
  );

  const previewShown = useRef(false);
  const isHoverCapable = useRef(false);

  // Clip-path animation state.
  const clipState = useRef({
    top: 0,
    bottom: 0,
  });

  const clipTween = useRef<gsap.core.Tween | null>(null);
  const opacityTween = useRef<gsap.core.Tween | null>(null);

  // Image animations.
  const yTween = useRef<gsap.core.Tween | null>(null);
  const previewTween = useRef<gsap.core.Tween | null>(null);

  // Smooth horizontal cursor following.
  const targetX = useRef(0);
  const currentX = useRef(0);

  const isVisible = useRef(false);

  // ----------------------------------------
  // IMAGE POSITIONING
  // ----------------------------------------

  const clampX = (clientX: number) => {
    const wrap = imageWrapRef.current;

    if (!wrap) return clientX;

    const edgeMargin = 24;
    const halfWidth = wrap.offsetWidth / 2;

    const minX = halfWidth + edgeMargin;
    const maxX = Math.max(
      minX,
      window.innerWidth - halfWidth - edgeMargin
    );

    return Math.min(Math.max(clientX, minX), maxX);
  };

  // ----------------------------------------
  // CLIP-PATH
  // ----------------------------------------

  const setClip = () => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    const { top, bottom } = clipState.current;

    overlay.style.clipPath = `inset(${top}px 0px ${bottom}px 0px)`;
  };

  const highlightRow = (row: HTMLDivElement) => {
    const wrap = listWrapRef.current;
    const overlay = overlayRef.current;

    if (!wrap || !overlay) return;

    const wrapRect = wrap.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();

    const top = rowRect.top - wrapRect.top;
    const bottom = wrapRect.height - (rowRect.bottom - wrapRect.top);

    opacityTween.current?.kill();

    if (!isVisible.current) {
      // First hover: position the highlight immediately.
      clipTween.current?.kill();

      clipState.current = {
        top,
        bottom,
      };

      setClip();

      gsap.set(overlay, {
        opacity: 1,
      });

      isVisible.current = true;

      return;
    }

    // Move the highlight between rows.
    clipTween.current?.kill();

    clipTween.current = gsap.to(clipState.current, {
      top,
      bottom,
      duration: 0.85,
      ease: 'elastic.out(1, 0.65)',
      onUpdate: setClip,
    });
  };

  const hideHighlight = () => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    isVisible.current = false;

    clipTween.current?.kill();
    opacityTween.current?.kill();

    opacityTween.current = gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  // ----------------------------------------
  // RESET ROW
  // ----------------------------------------

  const resetRow = (index: number) => {
    const row = rowRefs.current[index];
    const title = titleRefs.current[index];

    if (title) {
      gsap.killTweensOf(title);

      gsap.to(title, {
        x: 0,
        color: '#0a0a0a',
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (!row) return;

    const meta = row.querySelectorAll<HTMLElement>('.svc-meta');

    gsap.killTweensOf(meta);

    gsap.to(meta, {
      color: META_COLOR,
      duration: 0.4,
      ease: 'power3.out',
    });

    const slides = row.querySelectorAll<HTMLElement>('.svc-slide');

    gsap.killTweensOf(slides);

    gsap.to(slides, {
      y: 0,
      duration: 0.6,
      ease: 'power3.inOut',
    });
  };

  // ----------------------------------------
  // ROW HOVER
  // ----------------------------------------

  const handleRowEnter = (
    index: number,
    e: MouseEvent<HTMLDivElement>
  ) => {
    if (!isHoverCapable.current) return;

    const row = rowRefs.current[index];
    const title = titleRefs.current[index];
    const service = services[index];

    if (!row) return;

    highlightRow(row);

    // Animate title.
    if (title) {
      gsap.killTweensOf(title);

      gsap.to(title, {
        x: 14,
        color: '#ffffff',
        duration: 0.45,
        ease: 'power3.out',
      });
    }

    // Animate tags and arrow.
    const meta = row.querySelectorAll<HTMLElement>('.svc-meta');

    gsap.killTweensOf(meta);

    gsap.to(meta, {
      color: '#ffffff',
      duration: 0.45,
      ease: 'power3.out',
    });

    // Rolling arrow animation.
    const slides = row.querySelectorAll<HTMLElement>('.svc-slide');

    gsap.killTweensOf(slides);

    gsap.to(slides, {
      y: -ARROW,
      duration: 0.6,
      ease: 'power3.inOut',
    });

    // Keep preview vertically aligned with the active row.
    const rect = row.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    yTween.current?.kill();

    if (!previewShown.current) {
      previewShown.current = true;

      targetX.current = clampX(e.clientX);
      currentX.current = targetX.current;

      gsap.set(imageWrapRef.current, {
        x: currentX.current,
        y: centerY,
      });
    } else {
      yTween.current = gsap.to(imageWrapRef.current, {
        y: centerY,
        duration: 0.85,
        ease: 'elastic.out(1, 0.65)',
      });
    }

    // Change image only when the active service changes.
    if (activeIdRef.current !== service.id) {
      activeIdRef.current = service.id;
      setActiveImage(service.image);
    }

    // Show image.
    previewTween.current?.kill();

    previewTween.current = gsap.to(imageWrapRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleRowLeave = (index: number) => {
    if (!isHoverCapable.current) return;

    resetRow(index);
  };

  // ----------------------------------------
  // MOUSE MOVEMENT
  // ----------------------------------------

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHoverCapable.current) return;

    targetX.current = clampX(e.clientX);
  };

  // ----------------------------------------
  // SECTION LEAVE
  // ----------------------------------------

  const handleSectionLeave = () => {
    activeIdRef.current = null;
    previewShown.current = false;

    hideHighlight();

    yTween.current?.kill();
    previewTween.current?.kill();

    previewTween.current = gsap.to(imageWrapRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.35,
      ease: 'power3.inOut',
    });

    // Reset all rows to prevent stuck hover states.
    services.forEach((_, index) => {
      resetRow(index);
    });
  };

  // ----------------------------------------
  // GSAP CURSOR FOLLOW
  // ----------------------------------------

  useEffect(() => {
    const wrap = imageWrapRef.current;

    if (!mounted || !wrap) return;

    gsap.set(wrap, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.92,
    });

    const setX = gsap.quickSetter(wrap, 'x', 'px') as (
      value: number
    ) => void;

    // Frame-rate independent smooth movement.
    const tick = (_time: number, deltaMs: number) => {
      if (!previewShown.current) return;

      const k = 1 - Math.exp(-deltaMs / 90);

      currentX.current +=
        (targetX.current - currentX.current) * k;

      setX(currentX.current);
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [mounted]);

  // ----------------------------------------
  // HOVER CAPABILITY DETECTION
  // ----------------------------------------

  useEffect(() => {
    const mq = window.matchMedia(HOVER_QUERY);

    isHoverCapable.current = mq.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      isHoverCapable.current = e.matches;

      if (!e.matches) {
        handleSectionLeave();
      }
    };

    mq.addEventListener('change', handleChange);

    return () => {
      mq.removeEventListener('change', handleChange);
    };

    // Event handler uses stable refs and static service data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------
  // GSAP CLEANUP
  // ----------------------------------------

  useEffect(() => {
    return () => {
      clipTween.current?.kill();
      opacityTween.current?.kill();
      yTween.current?.kill();
      previewTween.current?.kill();

      gsap.killTweensOf(clipState.current);

      if (overlayRef.current) {
        gsap.killTweensOf(overlayRef.current);
      }

      if (imageWrapRef.current) {
        gsap.killTweensOf(imageWrapRef.current);
      }

      rowRefs.current.forEach((row) => {
        if (!row) return;

        gsap.killTweensOf(
          row.querySelectorAll('*')
        );
      });
    };
  }, []);

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <section
      id="services"
      className="relative z-10 bg-white px-6 pb-28 pt-24 text-[#0a0a0a] md:px-8 md:pb-48 md:pt-40"
    >
      {/* LABEL */}

      <div className="flex items-center justify-between text-sm">
        <p>[Services]</p>

       
      </div>

      {/* HEADING */}

      <h2 className="mt-6 text-[clamp(2.2rem,8vw,14rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
        What We Offer
      </h2>

      {/* SERVICES LIST */}

      <div
        className="relative mt-12 w-full md:mt-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleSectionLeave}
      >
        <div
          ref={listWrapRef}
          className="relative border-t border-black/15"
        >
          {/* BLACK HOVER HIGHLIGHT */}

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 z-0 hidden bg-black opacity-0 lg:block"
            style={{
              clipPath: 'inset(0px 0px 100% 0px)',
            }}
          />

          {/* SERVICE ROWS */}

          {services.map((service, i) => (
            <div
              key={service.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              onMouseEnter={(e) => handleRowEnter(i, e)}
              onMouseLeave={() => handleRowLeave(i)}
              className="relative z-10 flex cursor-default flex-col gap-4 border-b border-black/15 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-8 md:py-10"
            >
              {/* LEFT: TITLE */}

              <div className="flex items-baseline">
                <span
                  ref={(el) => {
                    titleRefs.current[i] = el;
                  }}
                  className="block text-[clamp(1.5rem,3.4vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]"
                >
                  {service.title}
                </span>
              </div>

              {/* RIGHT: TAGS + ARROW */}

              <div className="flex items-center justify-between gap-6 sm:justify-end md:gap-8">
                <span
                  className="svc-meta text-[clamp(12px,0.85vw,15px)]"
                  style={{
                    color: META_COLOR,
                  }}
                >
                  {service.tags}
                </span>

                {/* ROLLING ARROW */}

                <span
                  className="svc-meta relative block shrink-0 overflow-hidden"
                  style={{
                    width: ARROW,
                    height: ARROW,
                    color: META_COLOR,
                  }}
                  aria-hidden="true"
                >
                  <span className="svc-slide flex flex-col">
                    <span
                      className="flex items-center justify-center text-2xl"
                      style={{
                        width: ARROW,
                        height: ARROW,
                      }}
                    >
                      ↗
                    </span>

                    <span
                      className="flex items-center justify-center text-2xl"
                      style={{
                        width: ARROW,
                        height: ARROW,
                      }}
                    >
                      ↗
                    </span>
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING IMAGE PREVIEW */}

      {mounted &&
        createPortal(
          <div
            ref={imageWrapRef}
            className="pointer-events-none fixed left-0 top-0 z-[60] hidden w-[26vw] max-w-[440px] opacity-0 lg:block"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden shadow-2xl">
              {activeImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
