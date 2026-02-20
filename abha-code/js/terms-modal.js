(function () {
    /* ─────────────────────────────────────────────
       STYLES
    ───────────────────────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
        /* Overlay */
        #tc-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(5, 8, 20, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.35s ease, visibility 0.35s ease;
        }
        #tc-modal-overlay.tc-active {
            opacity: 1;
            visibility: visible;
        }

        /* Card */
        #tc-modal-card {
            position: relative;
            background: linear-gradient(145deg, rgba(15, 20, 45, 0.97), rgba(8, 12, 30, 0.99));
            border: 1px solid rgba(255, 211, 105, 0.18);
            border-radius: 24px;
            width: 100%;
            max-width: 780px;
            max-height: 88vh;
            overflow-y: auto;
            padding: 52px 52px 44px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,211,105,0.06) inset;
            transform: translateY(32px) scale(0.97);
            transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1);
            scrollbar-width: thin;
            scrollbar-color: rgba(255,211,105,0.3) transparent;
        }
        #tc-modal-overlay.tc-active #tc-modal-card {
            transform: translateY(0) scale(1);
        }
        #tc-modal-card::-webkit-scrollbar { width: 5px; }
        #tc-modal-card::-webkit-scrollbar-track { background: transparent; }
        #tc-modal-card::-webkit-scrollbar-thumb { background: rgba(255,211,105,0.3); border-radius: 4px; }

        /* Close button */
        #tc-modal-close {
            position: absolute;
            top: 20px;
            right: 24px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255,211,105,0.1);
            border: 1px solid rgba(255,211,105,0.25);
            color: rgba(255,211,105,0.9);
            font-size: 1.3rem;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, transform 0.2s;
        }
        #tc-modal-close:hover {
            background: rgba(255,211,105,0.22);
            transform: rotate(90deg);
        }

        /* Header */
        .tc-modal-header {
            text-align: center;
            margin-bottom: 36px;
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(255,211,105,0.12);
        }
        .tc-modal-header h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.6rem, 4vw, 2.2rem);
            font-weight: 700;
            letter-spacing: 0.1em;
            background: linear-gradient(135deg, #FFD369, #f0a500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        .tc-modal-header .tc-updated {
            font-size: 0.88rem;
            opacity: 0.55;
            font-style: italic;
            letter-spacing: 0.04em;
            color: #fff;
        }
        .tc-modal-header::after {
            content: '';
            display: block;
            width: 80px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #FFD369, transparent);
            margin: 18px auto 0;
            border-radius: 2px;
        }

        /* Intro */
        .tc-modal-intro {
            font-size: 1rem;
            color: rgba(255,255,255,0.78);
            line-height: 1.85;
            margin-bottom: 32px;
        }

        /* Section */
        .tc-modal-section {
            padding: 24px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tc-modal-section:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .tc-modal-section-head {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 14px;
        }
        .tc-modal-num {
            width: 32px;
            height: 32px;
            min-width: 32px;
            border-radius: 50%;
            background: rgba(255,211,105,0.1);
            border: 1px solid rgba(255,211,105,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 0.8rem;
            font-weight: 700;
            color: #FFD369;
        }
        .tc-modal-section-head h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.05rem;
            font-weight: 700;
            color: #FFD369;
            letter-spacing: 0.04em;
            margin: 0;
        }
        .tc-modal-section p,
        .tc-modal-section ul {
            color: rgba(255,255,255,0.78);
            font-size: 0.97rem;
            line-height: 1.85;
            margin: 0;
            padding-left: 46px;
        }
        .tc-modal-section ul {
            list-style: none;
            padding-left: 46px;
        }
        .tc-modal-section ul li {
            position: relative;
            padding-left: 18px;
            margin-bottom: 8px;
        }
        .tc-modal-section ul li::before {
            content: "•";
            color: #FFD369;
            position: absolute;
            left: 0;
            font-size: 1rem;
            line-height: 1.6rem;
        }

        /* Contact box */
        .tc-modal-contact {
            margin-left: 46px;
            margin-top: 4px;
            background: rgba(255,211,105,0.04);
            border: 1px solid rgba(255,211,105,0.15);
            border-radius: 12px;
            padding: 18px 22px;
        }
        .tc-modal-contact p {
            padding-left: 0;
            margin-bottom: 10px;
            font-style: italic;
            opacity: 0.65;
            font-size: 0.9rem;
        }
        .tc-modal-contact ul {
            padding-left: 0;
            margin: 0;
        }
        .tc-modal-contact ul li {
            padding-left: 0;
            margin-bottom: 6px;
        }
        .tc-modal-contact ul li::before { display: none; }
        .tc-modal-contact ul li strong {
            color: #FFD369;
            margin-right: 6px;
        }

        /* Mobile */
        @media (max-width: 640px) {
            #tc-modal-card {
                padding: 36px 22px 32px;
                border-radius: 18px;
            }
            .tc-modal-section p,
            .tc-modal-section ul {
                padding-left: 0;
            }
            .tc-modal-contact {
                margin-left: 0;
            }
        }
    `;
    document.head.appendChild(style);

    /* ─────────────────────────────────────────────
       HTML
    ───────────────────────────────────────────── */
    const html = `
    <div id="tc-modal-overlay" role="dialog" aria-modal="true" aria-label="Terms and Conditions">
        <div id="tc-modal-card">
            <button id="tc-modal-close" aria-label="Close">&times;</button>

            <div class="tc-modal-header">
                <h2>TERMS &amp; CONDITIONS</h2>
                <p class="tc-updated">Last Updated: 13/02/2026</p>
            </div>

            <p class="tc-modal-intro">
                Welcome to EFV. By purchasing <strong style="color:#FFD369;">"EFV"</strong>
                (Energy–Frequency–Vibration) book from our website, you agree to the following terms:
            </p>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">1</div>
                    <h3>Product Information</h3>
                </div>
                <p>We sell physical copies (Hardcover / Paperback) and digital formats (E-book / Audiobook) of EFV.</p>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">2</div>
                    <h3>Pricing &amp; Payments</h3>
                </div>
                <ul>
                    <li>All prices are listed in INR.</li>
                    <li>Payments are processed securely via Razorpay.</li>
                    <li>We reserve the right to change prices.</li>
                </ul>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">3</div>
                    <h3>Order Confirmation</h3>
                </div>
                <ul>
                    <li>You will receive an email confirmation after successful payment.</li>
                    <li>Orders are processed within 2–3 working days.</li>
                </ul>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">4</div>
                    <h3>Shipping &amp; Delivery <span style="font-size:0.85rem;opacity:0.65;">(For Physical Books)</span></h3>
                </div>
                <ul>
                    <li>Delivery timelines depend on location.</li>
                    <li>Delays due to courier or external factors may occur.</li>
                    <li>Incorrect shipping details provided by the customer are the customer's responsibility.</li>
                </ul>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">5</div>
                    <h3>Refund &amp; Cancellation</h3>
                </div>
                <ul>
                    <li>Physical books: Refunds allowed only if the product is damaged on delivery (opening video required within 48 hours).</li>
                    <li>Digital products (E-book / Audiobook): Non-refundable once delivered.</li>
                    <li>Refund processing time: 5–7 business days.</li>
                </ul>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">6</div>
                    <h3>Intellectual Property</h3>
                </div>
                <p>All EFV content is protected by copyright. Unauthorized reproduction, distribution, or sharing (especially digital formats) is strictly prohibited.</p>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">7</div>
                    <h3>Governing Law</h3>
                </div>
                <p>These terms are governed by the laws of India.</p>
            </div>

            <div class="tc-modal-section">
                <div class="tc-modal-section-head">
                    <div class="tc-modal-num">8</div>
                    <h3>Contact Information</h3>
                </div>
                <div class="tc-modal-contact">
                    <p>For support or queries:</p>
                    <ul>
                        <li><strong>Email:</strong> admin@uwo24.com</li>
                        <li><strong>Company Name:</strong> Unified Web Options and Services Private Limited</li>
                        <li><strong>Project:</strong> EFV – Energy Frequency Vibration</li>
                    </ul>
                </div>
            </div>

        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    /* ─────────────────────────────────────────────
       LOGIC
    ───────────────────────────────────────────── */
    const overlay = document.getElementById('tc-modal-overlay');
    const card = document.getElementById('tc-modal-card');
    const closeBtn = document.getElementById('tc-modal-close');

    function openTC(e) {
        if (e) e.preventDefault();
        overlay.classList.add('tc-active');
        document.body.style.overflow = 'hidden';
        card.scrollTop = 0;
    }

    function closeTC() {
        overlay.classList.remove('tc-active');
        document.body.style.overflow = '';
    }

    // Close on X button
    closeBtn.addEventListener('click', closeTC);

    // Close on backdrop click (outside card)
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeTC();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeTC();
    });

    // Wire up ALL footer links that say "Terms & Conditions"
    function wireLinks() {
        document.querySelectorAll('a[href="terms.html"]').forEach(function (link) {
            link.setAttribute('href', 'javascript:void(0)');
            link.setAttribute('id', 'tc-footer-link');
            link.addEventListener('click', openTC);
        });
        // Also catch any already-set javascript:void(0) links with id tc-footer-link
        document.querySelectorAll('#tc-footer-link').forEach(function (link) {
            link.addEventListener('click', openTC);
        });
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireLinks);
    } else {
        wireLinks();
    }

    // Expose globally so other scripts can open it too
    window.openTermsModal = openTC;
    window.closeTermsModal = closeTC;
})();
