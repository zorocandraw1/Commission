(function() {
    'use strict';

    /* ============================
           PINTEREST CONFIG
        ============================ */
    const PINTEREST_USERNAME = 'zorocandraw1';
    const PINTEREST_BOARD = 'portfolio';
    const IMAGE_QUALITY = '736x';

    // 🔽 MANUAL IMAGES – add any extra image URLs here
    const MANUAL_IMAGES = [
        'https://i.pinimg.com/1200x/b7/a6/b7/b7a6b7e3511c88f0716c16419622ff27.jpg'
    ];

    // 🔽 INSTAGRAM LINK for the "See More" tile
    const INSTAGRAM_URL = 'https://www.instagram.com/zorocandraw1/';
    // ==========================================

    const RSS_URL = `https://www.pinterest.com/${PINTEREST_USERNAME}/${PINTEREST_BOARD}.rss`;
    const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    /* ============================
           DATA (fallback)
        ============================ */
    const commissionData = [{
        id: 'bust',
        type: 'Bust',
        title: 'Character Bust',
        price: '$30',
        desc: 'A detailed bust portrait focusing on the character\'s face and upper chest. Perfect for profile pictures.',
        features: ['High detail rendering', 'Simple background']
    }, {
        id: 'half',
        type: 'Half Body',
        title: 'Half Body Illustration',
        price: '$45',
        desc: 'A half-body illustration of the character from the waist up. Ideal for character sheets and narrative portraits.',
        features: ['Dynamic pose', 'Soft background']
    }, {
        id: 'full',
        type: 'Full Body',
        title: 'Full Body Character Art',
        price: '$60',
        desc: 'A full-body illustration with detailed costume, pose, and environment. Perfect for game assets or key art.',
        features: ['Full character design', 'High detail']
    }, {
        id: 'thumbnail',
        type: 'Thumbnail',
        title: 'Thumbnail Art',
        price: '$100',
        desc: 'A richly rendered thumbnail painting with strong composition and color. Ideal for icons, covers, and social media.',
        features: ['Painterly finish', 'Strong composition']
    }];

    const faqData = [{
        q: 'Can I use the artwork commercially?',
        a: 'Yes, commercial use is available for an additional fee. Please discuss your specific use case when commissioning so we can agree on licensing terms.'
    }, {
        q: 'How many revisions are included?',
        a: 'Each commission includes up to 3 free revisions during the sketch phase. Major changes after the sketch phase may incur an additional fee.'
    }];

    /* ============================
           🆕 UPDATED API CONFIG – your new Apps Script URL (supports both GET and POST)
        ============================ */
    const API_URL = 'https://script.google.com/macros/s/AKfycbyQKubVswdd3AZKeYk082lSvh8KgSiwMnHI--5iQqHDf7XJL4fS4fW9tA6Srh2FED6cTw/exec';

    /* ============================
           STATE
        ============================ */
    let currentIndex = 0;
    let priceMap = {};

    /* ============================
           RENDER: COMMISSION MASONRY
        ============================ */
    function renderMasonry() {
        const container = document.getElementById('commissionMasonry');
        if (!container) return;
        const labels = ['Bust', 'Half', 'Full', 'Thumb', 'Bust', 'Half', 'Full', 'Thumb'];
        const sizes = ['tall', 'small', 'wide', 'medium', 'small', 'tall', 'medium', 'wide'];
        container.innerHTML = labels.map((label, i) =>
            `<div class="masonry-item ${sizes[i]}">${label}</div>`
        ).join('');
    }

    /* ============================
           SEE MORE TILE GENERATOR
        ============================ */
    function getSeeMoreTile() {
        return `
            <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" 
               class="g-item see-more-tile" 
               style="background: linear-gradient(145deg, rgba(20,30,52,0.95), rgba(105,168,255,0.06)); 
                      border-radius: var(--radius-md); 
                      border: 1px solid rgba(105,168,255,0.12); 
                      break-inside: avoid; 
                      margin-bottom: 18px; 
                      display: flex; 
                      flex-direction: column; 
                      align-items: center; 
                      justify-content: center; 
                      min-height: 240px; 
                      padding: 30px 20px;
                      text-align: center;
                      text-decoration: none;
                      cursor: pointer;
                      gap: 6px;
                      transition: all 0.3s ease;
                      position: relative;
                      overflow: hidden;">
                <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(105,168,255,0.08), transparent 70%); pointer-events: none;"></div>
                <span style="font-size: 2.4rem; line-height: 1; position: relative; z-index: 1;">✦</span>
                <span style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); position: relative; z-index: 1; letter-spacing: 0.02em;">See More <br>
                <span style="font-size: 0.75rem; font-weight: 400; color: var(--text-primary); position: relative; z-index: 1; letter-spacing: 0.02em; opacity: 0.3;">on insta</span></span>
                <span style="font-size: 0.8rem; color: var(--accent); margin-top: 8px; position: relative; z-index: 1; font-weight: 500;">click here →</span>
                <span style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.3;"></span>
            </a>
        `;
    }

    /* ============================
           RENDER: GALLERY
        ============================ */
    function renderGallery(images) {
        const container = document.getElementById('galleryMasonry');

        if (!images || images.length === 0) {
            // Fallback placeholders + see more tile
            const variants = [
                { height: 320 }, { height: 200 }, { height: 260 }, { height: 340 },
                { height: 180 }, { height: 300 }, { height: 220 }, { height: 280 },
                { height: 350 }, { height: 190 }, { height: 240 }, { height: 310 },
                { height: 270 }, { height: 210 }, { height: 330 }
            ];
            container.innerHTML = variants.map((v, i) =>
                `<div class="g-item" style="min-height: ${v.height}px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-card); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.75rem;">
                    Artwork ${i + 1}
                </div>`
            ).join('') + getSeeMoreTile();
            return;
        }

        // Render all images
        let html = images.map((img) => {
            return `
                <div class="g-item" style="background: var(--bg-card); overflow: hidden; border-radius: var(--radius-md); border: 1px solid var(--border-card); break-inside: avoid; margin-bottom: 18px;">
                    <img src="${img.url}" alt="" 
                         style="width: 100%; height: auto; display: block;"
                         loading="lazy"
                         onerror="this.parentElement.style.display='none'" />
                </div>
            `;
        }).join('');

        // Add "See More" tile at the end
        html += getSeeMoreTile();
        container.innerHTML = html;
    }

    /* ============================
           FETCH PINTEREST BOARD
        ============================ */
    function fetchPinterestBoard() {
        console.log(`📌 Fetching Pinterest board: ${PINTEREST_USERNAME}/${PINTEREST_BOARD}`);

        fetch(RSS2JSON_URL, { cache: 'no-store' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status !== 'ok') {
                    throw new Error(data.message || 'Failed to fetch feed');
                }

                const items = data.items;
                if (!items || items.length === 0) {
                    throw new Error('No items found in feed');
                }

                const images = [];
                const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff?)(\?.*)?$/i;

                items.forEach(item => {
                    let imageUrl = null;

                    if (item.enclosure && item.enclosure.link) {
                        imageUrl = item.enclosure.link;
                    }
                    if (!imageUrl && item.thumbnail) {
                        imageUrl = item.thumbnail;
                    }
                    if (!imageUrl) {
                        const desc = item.description || '';
                        const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/);
                        if (imgMatch) {
                            imageUrl = imgMatch[1];
                        }
                    }

                    if (imageUrl && imageExtensions.test(imageUrl)) {
                        let highResUrl = imageUrl;
                        if (highResUrl.match(/\/(\d+)x\//)) {
                            highResUrl = highResUrl.replace(/\/\d+x\//, `/${IMAGE_QUALITY}/`);
                        }
                        images.push({ url: highResUrl });
                    }
                });

                // Add manual images
                MANUAL_IMAGES.forEach(url => {
                    const exists = images.some(img => img.url === url);
                    if (!exists) {
                        images.push({ url: url });
                    }
                });

                console.log(`✅ Loaded ${images.length} images (${items.length} from Pinterest + ${MANUAL_IMAGES.length} manual)`);
                if (images.length === 0) {
                    throw new Error('No valid images found');
                }

                renderGallery(images);
            })
            .catch(error => {
                console.warn('⚠️ Failed to fetch Pinterest board:', error.message);
                if (MANUAL_IMAGES.length > 0) {
                    const manualOnly = MANUAL_IMAGES.map(url => ({ url }));
                    renderGallery(manualOnly);
                } else {
                    renderGallery(null);
                }
            });
    }

    /* ============================
           RENDER: FAQ
        ============================ */
    function renderFaq() {
        const container = document.getElementById('faqList');
        container.innerHTML = faqData.map((item, index) =>
            `<div class="faq-item" data-index="${index}">
                    <button class="faq-q" aria-expanded="false">
                        ${item.q}
                        <span class="icon">+</span>
                    </button>
                    <div class="faq-a">${item.a}</div>
                </div>`
        ).join('');

        const items = container.querySelectorAll('.faq-item');
        items.forEach(el => {
            const btn = el.querySelector('.faq-q');
            btn.addEventListener('click', function(e) {
                const isOpen = el.classList.contains('open');
                items.forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) {
                    el.classList.add('open');
                    el.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ============================
           RENDER: PRICING
        ============================ */
    function renderPricing(prices) {
        const container = document.getElementById('pricingList');
        if (!container) return;
        const entries = [
            { key: 'bust', label: 'Bust' },
            { key: 'half', label: 'Half Body' },
            { key: 'full', label: 'Full Body' },
            { key: 'thumbnail', label: 'Thumbnail Art' }
        ];
        container.innerHTML = entries.map(entry => {
            const price = prices[entry.key] !== undefined ? prices[entry.key] : '—';
            return `<span><span>${entry.label}</span> <strong>$${price}</strong></span>`;
        }).join('') +
            `<span class="extra-note">Extra character +50%</span>`;
    }

    /* ============================
           RENDER: COMMISSION CAROUSEL
        ============================ */
    function renderCommission(index) {
        const data = commissionData[index];
        if (!data) return;

        const priceKey = data.id;
        const priceValue = priceMap[priceKey] !== undefined ? priceMap[priceKey] : data.price.replace('$', '');

        document.getElementById('ciType').textContent = data.type;
        document.getElementById('ciTitle').textContent = data.title;
        document.getElementById('ciPrice').textContent = `$${priceValue}`;
        document.getElementById('ciDesc').textContent = data.desc;

        const featContainer = document.getElementById('ciFeatures');
        featContainer.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

        const dots = document.querySelectorAll('#dotsContainer .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function initCarousel() {
        const container = document.getElementById('dotsContainer');
        container.innerHTML = commissionData.map((_, i) =>
            `<button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Commission ${i+1}"></button>`
        ).join('');

        container.addEventListener('click', function(e) {
            const dot = e.target.closest('.dot');
            if (!dot) return;
            const idx = parseInt(dot.dataset.index, 10);
            if (!isNaN(idx) && idx !== currentIndex) {
                currentIndex = idx;
                renderCommission(currentIndex);
            }
        });

        document.getElementById('prevBtn').addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + commissionData.length) % commissionData.length;
            renderCommission(currentIndex);
        });

        document.getElementById('nextBtn').addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % commissionData.length;
            renderCommission(currentIndex);
        });

        let touchStartX = 0;
        let touchEndX = 0;
        const card = document.getElementById('commissionCard');
        card.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        card.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    currentIndex = (currentIndex + 1) % commissionData.length;
                } else {
                    currentIndex = (currentIndex - 1 + commissionData.length) % commissionData.length;
                }
                renderCommission(currentIndex);
            }
        }, { passive: true });

        document.addEventListener('keydown', function(e) {
            const active = document.activeElement;
            if (active && (active.closest('#commissionCard') || active.closest('.commission'))) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + commissionData.length) % commissionData.length;
                    renderCommission(currentIndex);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % commissionData.length;
                    renderCommission(currentIndex);
                }
            }
        });

        renderCommission(0);
    }

    /* ============================
           NAVIGATION
        ============================ */
    function initNav() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('navOverlay');

        window.addEventListener('scroll', function() {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });

        function toggleMenu(open) {
            const isOpen = open !== undefined ? open : overlay.classList.contains('open');
            if (isOpen) {
                overlay.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                overlay.classList.add('open');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        }

        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                toggleMenu(true);
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                toggleMenu(true);
            }
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                toggleMenu(true);
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && overlay.classList.contains('open')) {
                toggleMenu(true);
            }
        });
    }

    /* ============================
           SMOOTH SCROLL (custom animation)
        ============================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = parseInt(getComputedStyle(document.documentElement)
                        .getPropertyValue('--nav-height')) || 72;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset - 12;
                    const startPosition = window.scrollY;
                    const distance = targetPosition - startPosition;
                    const duration = 800; // milliseconds
                    let startTime = null;

                    function easeInOutCubic(t) {
                        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    }

                    function scrollAnimation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        const easedProgress = easeInOutCubic(progress);
                        window.scrollTo(0, startPosition + distance * easedProgress);
                        if (timeElapsed < duration) {
                            requestAnimationFrame(scrollAnimation);
                        }
                    }
                    requestAnimationFrame(scrollAnimation);
                }
            });
        });
    }

    // ============================
// PRIVATE VISIT COUNTER (total + unique)
// ============================
(function() {
    // Your updated Apps Script URL
    const VISIT_URL = 'https://script.google.com/macros/s/AKfycbwNByzK3q-vcurC9i2gaNCSfbKEwoaDDcb0W5rHB1hqCRJGQt4PPT1H_08mJAT2U1NKLg/exec';

    // Always increment total views
    fetch(VISIT_URL + '?action=visit', {
        method: 'POST',
        cache: 'no-store'
    }).catch(() => {});

    // Increment unique views only once per browser
    const UNIQUE_KEY = 'zorocandraw1_unique_visit';
    if (!localStorage.getItem(UNIQUE_KEY)) {
        fetch(VISIT_URL + '?action=visit&unique=1', {
            method: 'POST',
            cache: 'no-store'
        }).catch(() => {});
        localStorage.setItem(UNIQUE_KEY, 'true');
    }
})();

    /* ============================
           API: FETCH STATUS & PRICES (GET request)
        ============================ */
    function fetchCommissionData() {
        const statusEl = document.getElementById('commissionStatus');

        const statusMap = {
            0: { text: '● Commissions Closed', cls: 'closed' },
            1: { text: '● Commissions Open', cls: '' },
            2: { text: '● Commissions Paused', cls: 'paused' }
        };
        const DEFAULT_STATUS = 1;

        function updateStatus(statusCode) {
            let status = statusMap[statusCode];
            if (!status) {
                status = statusMap[DEFAULT_STATUS];
            }
            statusEl.textContent = status.text;
            statusEl.className = 'contact-status' + (status.cls ? ' ' + status.cls : '');
        }

        function updatePrices(prices) {
            if (prices && typeof prices === 'object') {
                priceMap = prices;
                renderPricing(prices);
                renderCommission(currentIndex);
            }
        }

        // Use the new API_URL (which serves both GET and POST)
        fetch(API_URL, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status !== undefined && data.status !== null) {
                    updateStatus(data.status);
                } else {
                    updateStatus(DEFAULT_STATUS);
                }

                if (data.prices && typeof data.prices === 'object') {
                    updatePrices(data.prices);
                }
            })
            .catch(error => {
                console.warn('Failed to fetch commission data, using defaults.', error);
                updateStatus(DEFAULT_STATUS);
                const fallbackPrices = {};
                commissionData.forEach(c => {
                    fallbackPrices[c.id] = parseInt(c.price.replace('$', ''), 10);
                });
                updatePrices(fallbackPrices);
            });
    }

    /* ============================
           INIT
        ============================ */
    document.addEventListener('DOMContentLoaded', function() {
        renderMasonry();
        fetchPinterestBoard();
        renderFaq();
        initCarousel();
        initNav();
        initSmoothScroll();

        const fallbackPrices = {};
        commissionData.forEach(c => {
            fallbackPrices[c.id] = parseInt(c.price.replace('$', ''), 10);
        });
        renderPricing(fallbackPrices);

        fetchCommissionData();
        setInterval(fetchCommissionData, 60000);
    });

})();