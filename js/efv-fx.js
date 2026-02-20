/**
 * EFV Visual FX Engine — v3
 * ─────────────────────────────────────────────────────────────
 * Self-contained: injects its own <style> tag + all effects.
 * ONE file to rule them all.
 *
 * Effects (ZERO content/text/layout changes):
 *  • 3D card tilt on mouse move (perspective transform)
 *  • 3D depth parallax on hero section
 *  • Digital noise burst every 5 seconds
 *  • Ambient aurora background
 *  • Glassmorphism hover lift + glow
 *  • Button shine sweep + lift
 *  • Gold shimmer on gradient-text
 *  • Blur-to-focus scroll reveal
 *  • Nav underline slide
 *  • Social icon lift + glow
 *  • Footer gold glow line
 *  • Anti-Gravity Cursor (Inertial fluid follower)
 */

(function () {
    'use strict';

    /* ── Respect reduced motion ── */
    const NO_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ════════════════════════════════════════════════════════
       STEP 1 — INJECT ALL STYLES
    ════════════════════════════════════════════════════════ */
    const css = `
    /* ── Aurora background ── */
    @keyframes efvAurora {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    body::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -2;
        background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(125,95,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(255,211,105,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(26,188,156,0.05) 0%, transparent 60%),
            #000000;
        background-size: 200% 200%;
        animation: efvAurora 25s ease infinite;
        pointer-events: none;
    }

    /* ── Grain texture ── */
    body::after {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 180px 180px;
        pointer-events: none;
    }

    /* ── 3D Card tilt container ── */
    .efv-tilt-wrap {
        transform-style: preserve-3d;
        perspective: 900px;
        will-change: transform;
    }
    .efv-tilt-inner {
        transition: transform 0.12s linear;
        transform-style: preserve-3d;
        will-change: transform;
    }
    .efv-tilt-shine {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);
    }
    .efv-tilt-inner:hover .efv-tilt-shine { opacity: 1; }

    /* ── Glass panel hover ── */
    .glass-panel {
        transition: transform 0.5s cubic-bezier(0.23,1,0.32,1),
                    box-shadow 0.5s cubic-bezier(0.23,1,0.32,1),
                    border-color 0.5s ease !important;
    }
    .glass-panel:hover {
        box-shadow: 0 20px 60px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(255,211,105,0.2),
                    0 0 40px rgba(255,211,105,0.07) !important;
        border-color: rgba(255,211,105,0.22) !important;
    }

    /* ── Gold shimmer on gradient-text ── */
    @keyframes efvShimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
    }
    .gradient-text {
        background: linear-gradient(110deg,#c9a34b 0%,#FFD369 30%,#fff8e1 50%,#FFD369 70%,#c9a34b 100%) !important;
        background-size: 200% auto !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        animation: efvShimmer 5s linear infinite !important;
    }

    /* ── Button shine + lift ── */
    .btn {
        position: relative;
        overflow: hidden;
        transition: transform 0.35s cubic-bezier(0.23,1,0.32,1),
                    box-shadow 0.35s ease !important;
    }
    .btn .efv-btn-shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%);
        transform: translateX(-100%);
        transition: transform 0.55s cubic-bezier(0.23,1,0.32,1);
        pointer-events: none;
        z-index: 2;
    }
    .btn:hover .efv-btn-shine { transform: translateX(100%); }
    .btn:hover {
        transform: translateY(-3px) scale(1.03) !important;
        box-shadow: 0 10px 35px rgba(255,211,105,0.28), 0 0 0 1px rgba(255,211,105,0.3) !important;
    }


    /* ── Social icon lift ── */
    .social-icon-link {
        transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), filter 0.35s ease !important;
        display: inline-flex;
    }
    .social-icon-link:hover {
        transform: translateY(-5px) scale(1.15) !important;
        filter: drop-shadow(0 0 10px rgba(255,211,105,0.6)) brightness(1.15) !important;
    }

    /* ── Footer top glow ── */
    footer { position: relative; }
    footer::before {
        content: '';
        position: absolute;
        top: 0; left: 50%;
        transform: translateX(-50%);
        width: 60%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,211,105,0.28), transparent);
        pointer-events: none;
    }

    /* ── Footer link hover ── */
    footer a { transition: color 0.3s ease, text-shadow 0.3s ease !important; }
    footer a:hover {
        color: var(--gold-energy) !important;
        text-shadow: 0 0 12px rgba(255,211,105,0.45);
    }

    /* ── Input focus glow ── */
    input:focus, textarea:focus, select:focus {
        border-color: rgba(255,211,105,0.5) !important;
        box-shadow: 0 0 0 3px rgba(255,211,105,0.1), 0 0 20px rgba(255,211,105,0.08) !important;
        outline: none !important;
    }

    /* ── Modal cinematic backdrop ── */
    .modal-overlay {
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
        background: rgba(3,5,9,0.84) !important;
    }
    .modal-card {
        box-shadow: 0 40px 100px rgba(0,0,0,0.7),
                    0 0 0 1px rgba(255,211,105,0.12),
                    0 0 80px rgba(255,211,105,0.04) !important;
    }

    /* ── Blur-to-focus reveal ── */
    .reveal {
        filter: blur(5px);
        transition: opacity 1.4s cubic-bezier(0.16,1,0.3,1),
                    transform 1.4s cubic-bezier(0.16,1,0.3,1),
                    filter 1.4s cubic-bezier(0.16,1,0.3,1) !important;
    }
    .reveal.active { filter: blur(0) !important; }

    /* ── Blog card image zoom ── */
    .blog-card .blog-image {
        transition: transform 0.7s cubic-bezier(0.23,1,0.32,1), filter 0.7s ease !important;
    }
    .blog-card:hover .blog-image {
        transform: scale(1.07) !important;
        filter: brightness(1.08) saturate(1.1);
    }

    /* ── Gold accent pulse ── */
    @keyframes efvAccentPulse {
        0%,100% { opacity:0.4; box-shadow:0 0 8px rgba(255,211,105,0.3); }
        50%      { opacity:1;   box-shadow:0 0 22px rgba(255,211,105,0.65); }
    }
    .wave-underline::after { animation: efvAccentPulse 3s ease-in-out infinite !important; }

    /* ── Staggered grid reveals ── */
    .grid-3 .glass-panel:nth-child(1),.grid-4 .glass-panel:nth-child(1){transition-delay:0s}
    .grid-3 .glass-panel:nth-child(2),.grid-4 .glass-panel:nth-child(2){transition-delay:0.1s}
    .grid-3 .glass-panel:nth-child(3),.grid-4 .glass-panel:nth-child(3){transition-delay:0.2s}
    .grid-4 .glass-panel:nth-child(4){transition-delay:0.3s}

    /* ── CRT scanline on glass cards ── */
    .glass-panel { position: relative; }
    .glass-panel::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px);
        pointer-events: none;
        z-index: 1;
        border-radius: inherit;
    }

    /* ── Digital noise burst ── */
    @keyframes efvNoise {
        0%  {opacity:0}
        6%  {opacity:.05}
        12% {opacity:.02}
        18% {opacity:.06}
        24% {opacity:.01}
        30% {opacity:.04}
        36%,100%{opacity:0}
    }
    #efv-noise-overlay {
        position: fixed;
        inset: 0;
        z-index: 9990;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px 200px;
        mix-blend-mode: overlay;
        opacity: 0;
        animation: efvNoise 0.85s steps(4) forwards;
    }

    /* ── 3D hero parallax depth layers ── */
    .efv-parallax-deep   { will-change: transform; }
    .efv-parallax-mid    { will-change: transform; }
    .efv-parallax-shallow{ will-change: transform; }

    /* ── Scrollbar gold ── */
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg,rgba(255,211,105,.5),rgba(201,163,75,.3)) !important;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg,rgba(255,211,105,.8),rgba(201,163,75,.5)) !important;
    }

    /* ── Anti-Gravity Cursor ── */
    html, body { cursor: none !important; }
    #efv-ag-cursor {
        position: fixed;
        width: 12px;
        height: 12px;
        background: var(--gold-energy);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transition: width 0.35s cubic-bezier(0.23, 1, 0.32, 1), 
                    height 0.35s cubic-bezier(0.23, 1, 0.32, 1), 
                    opacity 0.4s ease,
                    background 0.35s ease;
        will-change: transform;
        box-shadow: 0 0 10px rgba(255, 211, 105, 0.3);
    }
    .ag-cursor-hover #efv-ag-cursor {
        width: 45px;
        height: 45px;
        background: rgba(255, 211, 105, 0.25);
        border: 1px solid rgba(255, 211, 105, 0.5);
        box-shadow: 0 0 25px rgba(255, 211, 105, 0.15);
    }

    /* ── Reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
        #efv-noise-overlay, .gradient-text, body::before, #efv-ag-cursor {
            animation: none !important; display: none !important;
        }
        html, body { cursor: auto !important; }
    }
    `;

    const styleTag = document.createElement('style');
    styleTag.id = 'efv-fx-styles';
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    /* ════════════════════════════════════════════════════════
       STEP 2 — BOOT AFTER DOM READY
    ════════════════════════════════════════════════════════ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        addBtnShines();
        apply3DTilt();
        applyHeroParallax();
        initAntiGravityCursor();
        if (!NO_MOTION) {
            startNoiseBursts();
        }
    }

    /* ════════════════════════════════════════════════════════
       STEP 3 — BUTTON SHINE SPANS
    ════════════════════════════════════════════════════════ */
    function addBtnShines() {
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.querySelector('.efv-btn-shine')) {
                const shine = document.createElement('span');
                shine.className = 'efv-btn-shine';
                btn.appendChild(shine);
            }
        });
    }

    /* ════════════════════════════════════════════════════════
       STEP 4 — 3D CARD TILT (mouse move per card)
    ════════════════════════════════════════════════════════ */
    function apply3DTilt() {
        if (NO_MOTION) return;

        // Target both standard glass panels and the new cinematic blog cards
        const tiltElements = document.querySelectorAll('.glass-panel, .blog-card');

        tiltElements.forEach(card => {
            // Skip cards inside carousels or marquee to prevent perspective clipping
            if (card.closest('.books-track') || card.closest('.marquee-inner')) return;

            // Ensure card is relative for shine layer positioning
            card.style.position = 'relative';

            // Inject cinema-grade shine layer if missing
            if (!card.querySelector('.efv-tilt-shine')) {
                const shine = document.createElement('div');
                shine.className = 'efv-tilt-shine';
                card.appendChild(shine);
            }

            // Bind high-performance interaction listeners
            card.removeEventListener('mousemove', onTiltMove); // Prevent double-binding
            card.addEventListener('mousemove', onTiltMove);
            card.addEventListener('mouseleave', onTiltLeave);

            // Responsive touch support
            card.addEventListener('touchstart', onTiltMove, { passive: true });
            card.addEventListener('touchmove', onTiltMove, { passive: true });
            card.addEventListener('touchend', onTiltLeave);
        });
    }

    function onTiltMove(e) {
        if (e.type === 'touchmove' || e.type === 'touchstart') {
            const touch = e.touches[0];
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        }

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        const maxTilt = 12; // degrees
        const rotX = -dy * maxTilt;
        const rotY = dx * maxTilt;

        // Add translateY lift for premium feel
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04) translateY(-10px)`;
        card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';

        card.style.boxShadow = `
            ${-dx * 25}px ${-dy * 25}px 60px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,211,105,0.2),
            ${dx * 10}px ${dy * 10}px 35px rgba(255,211,105,0.1)
        `;

        // Move shine to follow cursor or touch point
        const shine = card.querySelector('.efv-tilt-shine');
        if (shine) {
            const px = ((e.clientX - rect.left) / rect.width) * 100;
            const py = ((e.clientY - rect.top) / rect.height) * 100;
            shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.15) 0%, transparent 75%)`;
            shine.style.opacity = '1';
        }
    }

    function onTiltLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease';
        card.style.boxShadow = '';

        const shine = card.querySelector('.efv-tilt-shine');
        if (shine) shine.style.opacity = '0';
    }

    /* ════════════════════════════════════════════════════════
       STEP 6 — HERO 3D PARALLAX (mouse move on hero)
    ════════════════════════════════════════════════════════ */
    function applyHeroParallax() {
        if (NO_MOTION) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Tag children with depth layers
        const children = Array.from(hero.children);
        children.forEach((child, i) => {
            if (i === 0) child.classList.add('efv-parallax-deep');
            else if (i === 1) child.classList.add('efv-parallax-mid');
            else child.classList.add('efv-parallax-shallow');
        });

        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (e.clientX - rect.left - cx) / cx; // -1 to 1
            const dy = (e.clientY - rect.top - cy) / cy;

            hero.querySelectorAll('.efv-parallax-deep').forEach(el => {
                el.style.transform = `translate3d(${dx * -18}px, ${dy * -12}px, 0)`;
                el.style.transition = 'transform 0.15s linear';
            });
            hero.querySelectorAll('.efv-parallax-mid').forEach(el => {
                el.style.transform = `translate3d(${dx * -10}px, ${dy * -7}px, 0)`;
                el.style.transition = 'transform 0.15s linear';
            });
            hero.querySelectorAll('.efv-parallax-shallow').forEach(el => {
                el.style.transform = `translate3d(${dx * -5}px, ${dy * -3}px, 0)`;
                el.style.transition = 'transform 0.15s linear';
            });
        });

        hero.addEventListener('mouseleave', () => {
            hero.querySelectorAll('.efv-parallax-deep,.efv-parallax-mid,.efv-parallax-shallow').forEach(el => {
                el.style.transform = 'translate3d(0,0,0)';
                el.style.transition = 'transform 0.8s cubic-bezier(0.23,1,0.32,1)';
            });
        });
    }

    /* ════════════════════════════════════════════════════════
       STEP 7 — DIGITAL NOISE BURST every 5 seconds
    ════════════════════════════════════════════════════════ */
    function triggerNoise() {
        const old = document.getElementById('efv-noise-overlay');
        if (old) old.remove();
        const el = document.createElement('div');
        el.id = 'efv-noise-overlay';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 920);
    }

    function startNoiseBursts() {
        setTimeout(() => {
            triggerNoise();
            setInterval(triggerNoise, 5000);
        }, 5000);
    }

    /* ════════════════════════════════════════════════════════
       STEP 8 — ANTI-GRAVITY CURSOR
    ════════════════════════════════════════════════════════ */
    function initAntiGravityCursor() {
        if (NO_MOTION) return;

        const cursor = document.createElement('div');
        cursor.id = 'efv-ag-cursor';
        document.body.appendChild(cursor);

        let mouseX = -100, mouseY = -100;
        let cursorX = -100, cursorY = -100;
        let isFirstMove = true;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (isFirstMove) {
                cursorX = mouseX;
                cursorY = mouseY;
                cursor.style.opacity = '1';
                isFirstMove = false;
            }
        });

        function animate() {
            // Higher value (0.4) = Faster response, less lag
            const inertia = 0.4;

            cursorX += (mouseX - cursorX) * inertia;
            cursorY += (mouseY - cursorY) * inertia;

            // Centers the cursor regardless of current size via CSS centering logic
            // or we can offset by half its base size (12px base -> 6px offset)
            cursor.style.transform = `translate3d(${cursorX - 6}px, ${cursorY - 6}px, 0) translate(-50%, -50%)`;
            // Using dual translate to ensure scaling from center works with fixed dimensions
            cursor.style.left = '6px';
            cursor.style.top = '6px';

            requestAnimationFrame(animate);
        }
        animate();

        // Magnetic Expansion Effect
        const selectors = 'a[href*="#"], button, .btn, .glass-panel, .social-icon-link';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(selectors)) {
                document.body.classList.add('ag-cursor-hover');
            }
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(selectors)) {
                document.body.classList.remove('ag-cursor-hover');
            }
        });

        // Hide/Show on window focus
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }

})();
