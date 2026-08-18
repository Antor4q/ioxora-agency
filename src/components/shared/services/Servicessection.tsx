'use client';

import { useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import HoverButton from '../HoverButton';


interface Service {
  id: string;
  title: string;
  image: string;
}

// Replace `image` with your real project screenshots.
const services: Service[] = [
  { id: 'wesley', title: 'Wesley College Website', image: 'https://picsum.photos/seed/wesley/1200/800' },
  { id: 'korowa', title: 'Korowa Website', image: 'https://picsum.photos/seed/korowa/1200/800' },
  { id: 'amplify', title: 'AMPLIFY Website', image: 'https://picsum.photos/seed/amplify/1200/800' },
  { id: 'mgg', title: 'Melbourne Girls Grammar Website', image: 'https://picsum.photos/seed/mgg/1200/800' },
  { id: 'chargefox', title: 'Chargefox Website', image: 'https://picsum.photos/seed/chargefox/1200/800' },
];

export default function ServicesSection() {
  const listWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const activeIdRef = useRef<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const clipState = useRef({ top: 0, bottom: 0 });
  const clipTween = useRef<gsap.core.Tween | null>(null);
  const opacityTween = useRef<gsap.core.Tween | null>(null);
  const yTween = useRef<gsap.core.Tween | null>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const isVisible = useRef(false);

  const ensureXTo = () => {
    if (!xTo.current && imageWrapRef.current) {
      xTo.current = gsap.quickTo(imageWrapRef.current, 'x', {
        duration: 0.5,
        ease: 'power3',
      });
    }
  };

  const setClip = () => {
    if (!overlayRef.current) return;
    const { top, bottom } = clipState.current;
    overlayRef.current.style.clipPath = `inset(${top}px 0px ${bottom}px 0px)`;
  };

  // ---- elastic clip-path "black bar" reveal, same mechanic as the original HTML ----
  const highlightRow = (row: HTMLDivElement) => {
    const wrap = listWrapRef.current;
    const overlay = overlayRef.current;
    if (!wrap || !overlay) return;

    const wrapRect = wrap.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const top = r.top - wrapRect.top;
    const bottom = wrapRect.height - (r.bottom - wrapRect.top);

    opacityTween.current?.kill();

    if (!isVisible.current) {
      // first hover after being hidden: snap straight to this row, no travel from the top
      clipTween.current?.kill();
      clipState.current = { top, bottom };
      setClip();
      gsap.set(overlay, { opacity: 1 });
      isVisible.current = true;
      return;
    }

    // already visible: slide smoothly from the current row to the new one
    clipTween.current?.kill();
    clipTween.current = gsap.to(clipState.current, {
      top,
      bottom,
      duration: 0.85,
      ease: 'elastic.out(1, 0.65)',
      onUpdate: setClip,
    });
  };

  // fades out exactly where it currently sits — never jumps back to the top
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

  const handleRowEnter = (index: number) => {
    const row = rowRefs.current[index];
    const title = titleRefs.current[index];
    const service = services[index];
    if (!row) return;

    highlightRow(row);
    ensureXTo();

    if (title) {
      // kill any stale/queued tween on this title before starting a new one —
      // prevents a delayed "revert to black" tween from firing after this
      gsap.killTweensOf(title);
      gsap.to(title, { x: 14, color: '#ffffff', duration: 0.45, ease: 'power3.out' });
    }

    // explicitly drive the button's own slide animation — doesn't rely on CSS group-hover
    const slides = row.querySelectorAll<HTMLElement>('.hoverbtn-slide');
    gsap.killTweensOf(slides);
    gsap.to(slides, { y: -50, duration: 0.6, ease: 'power3.inOut' });

    // image locks to the vertical center of the hovered row
    const r = row.getBoundingClientRect();
    const centerY = r.top + r.height / 2;
    yTween.current?.kill();
    yTween.current = gsap.to(imageWrapRef.current, {
      y: centerY,
      duration: 0.85,
      ease: 'elastic.out(1, 0.65)',
    });

    if (activeIdRef.current !== service.id) {
      activeIdRef.current = service.id;
      setActiveImage(service.image);
    }

    gsap.to(imageWrapRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleRowLeave = (index: number) => {
    const row = rowRefs.current[index];
    const title = titleRefs.current[index];
    if (title) {
      gsap.killTweensOf(title);
      gsap.to(title, { x: 0, color: '#000000', duration: 0.4, ease: 'power3.out' });
    }
    if (row) {
      const slides = row.querySelectorAll<HTMLElement>('.hoverbtn-slide');
      gsap.killTweensOf(slides);
      gsap.to(slides, { y: 0, duration: 0.6, ease: 'power3.inOut' });
    }
  };

  // image follows the cursor horizontally only — vertical stays pinned to the row
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    ensureXTo();
    if (!imageWrapRef.current) {
      xTo.current?.(e.clientX);
      return;
    }

    // clamp so the (centered) image preview never goes off-screen at either edge
    const edgeMargin = 24; // px breathing room from the viewport edge
    const halfWidth = imageWrapRef.current.offsetWidth / 2;
    const minX = halfWidth + edgeMargin;
    const maxX = window.innerWidth - halfWidth - edgeMargin;
    const clampedX = Math.min(Math.max(e.clientX, minX), maxX);

    xTo.current?.(clampedX);
  };

  const handleSectionLeave = () => {
    activeIdRef.current = null;
    hideHighlight();

    gsap.to(imageWrapRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.35,
      ease: 'power3.inOut',
    });

    // fast cursor movement (row -> straight out of the section, or skipping rows)
    // can cause an individual row's onMouseLeave to never fire, leaving its title
    // stuck white. Force every row/title back to its default state here as a safety net.
    titleRefs.current.forEach((title) => {
      if (!title) return;
      gsap.killTweensOf(title);
      gsap.to(title, { x: 0, color: '#000000', duration: 0.4, ease: 'power3.out' });
    });

    rowRefs.current.forEach((row) => {
      if (!row) return;
      const slides = row.querySelectorAll<HTMLElement>('.hoverbtn-slide');
      gsap.killTweensOf(slides);
      gsap.to(slides, { y: 0, duration: 0.6, ease: 'power3.inOut' });
    });
  };

  return (
   <div className='py-24'>
    <h4
            className="
              mb-4
              text-xl
              font-bold
              text-[#797B7C]
              md:text-2xl
            "
          >
            {"Services"}
          </h4>

          <h1
            data-cursor-text=" "
            className="
            mb-20
              whitespace-nowrap
              text-[15vw]
              font-bold
              leading-[0.88]
              tracking-[-0.06em]
              text-[#222628]

              md:text-[160px]
            "
          >
            What We Offer
          </h1>
     <div
      className="relative w-full "
      onMouseMove={handleMouseMove}
      onMouseLeave={handleSectionLeave}
    >
       
      <div ref={listWrapRef} className="relative border-t border-black/10">
        {/* plain black bar — fades in place, never resets to the top */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-0 bg-black opacity-0"
          style={{ clipPath: 'inset(0px 0px 100% 0px)' }}
        />

        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            onMouseEnter={() => handleRowEnter(i)}
            onMouseLeave={() => handleRowLeave(i)}
            className="group relative z-10 flex items-center justify-between gap-6 border-b border-black/10 py-8 md:py-10 cursor-pointer"
          >
            <span
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              className="block text-[7vw] md:text-[4.4vw] lg:text-[3.6vw] font-semibold leading-[0.95] tracking-tight text-black"
            >
              {service.title}
            </span>

            <HoverButton />
          </div>
        ))}
      </div>

      {/* image preview: vertically centered on the hovered row, follows the cursor on X */}
      <div
        ref={imageWrapRef}
        className="pointer-events-none fixed left-0 top-0 z-50 w-[32vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-[0.92]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
          {activeImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeImage} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      </div>
    </div>
   </div>
  );
}