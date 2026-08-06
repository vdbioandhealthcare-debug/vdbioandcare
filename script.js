/* ==========================================================================
   VD BIOCHEM & HEALTHCARE - INTERACTIVE LOGIC & FIRESTORE SIMULATOR
   Est. Since 2023 | One Health Approach
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // 2. Product Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. Quick Inquiry Modal & Product Detail Modal
    const modalOverlay = document.getElementById('inquiryModal');
    const modalClose = document.getElementById('modalClose');
    const inquiryBtns = document.querySelectorAll('.inquiry-btn');
    const modalProductName = document.getElementById('modalProductName');

    inquiryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prodName = btn.getAttribute('data-product') || 'Vet Nutraceutical Product';
            if (modalProductName) {
                modalProductName.textContent = prodName;
            }
            if (modalOverlay) {
                modalOverlay.classList.add('active');
            }
        });
    });

    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // 5. Firestore Simulation & Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalForm');

    const handleFormSubmit = (formElement, isModal = false) => {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(formElement);
            const inquiryData = {
                id: 'INQ-' + Date.now(),
                timestamp: new Date().toISOString(),
                name: formData.get('name') || 'Guest User',
                email: formData.get('email') || 'N/A',
                phone: formData.get('phone') || 'N/A',
                subject: formData.get('subject') || (isModal ? 'Product Inquiry' : 'General Inquiry'),
                message: formData.get('message') || ''
            };

            // Save inquiry to Firestore local state array
            const storedInquiries = JSON.parse(localStorage.getItem('vdbiochem_inquiries') || '[]');
            storedInquiries.push(inquiryData);
            localStorage.setItem('vdbiochem_inquiries', JSON.stringify(storedInquiries));

            // Reset form
            formElement.reset();

            // Close modal if open
            if (isModal && modalOverlay) {
                modalOverlay.classList.remove('active');
            }

            // Show Toast Notification
            showToast('Inquiry submitted successfully! Our team will contact you shortly.', 'success');
        });
    };

    if (contactForm) handleFormSubmit(contactForm);
    if (modalForm) handleFormSubmit(modalForm, true);

    // 6. Toast Notification Generator
    window.showToast = function(message, type = 'info') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.2rem;"></i>
            <div>
                <strong style="display:block; font-size: 0.9rem;">VD Biochem & Healthcare</strong>
                <span style="font-size: 0.85rem; opacity: 0.9;">${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // 7. Interactive Map API Canvas Simulation
    const mapCanvas = document.getElementById('mapCanvas');
    if (mapCanvas) {
        const ctx = mapCanvas.getContext('2d');
        const drawMap = () => {
            const w = mapCanvas.width = mapCanvas.parentElement.clientWidth;
            const h = mapCanvas.height = mapCanvas.parentElement.clientHeight;

            // Background grid map simulation
            ctx.fillStyle = '#0e2019';
            ctx.fillRect(0, 0, w, h);

            // Draw grid lines
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Draw roads/routes simulation
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.5);
            ctx.quadraticCurveTo(w * 0.4, h * 0.4, w, h * 0.7);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * 0.5, 0);
            ctx.quadraticCurveTo(w * 0.52, h * 0.6, w * 0.3, h);
            ctx.stroke();

            // Center Pin Marker
            const pinX = w * 0.5;
            const pinY = h * 0.45;

            // Glowing pulse
            ctx.fillStyle = 'rgba(132, 204, 22, 0.3)';
            ctx.beginPath();
            ctx.arc(pinX, pinY, 20, 0, Math.PI * 2);
            ctx.fill();

            // Pin head
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(pinX, pinY, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('VD BIOCHEM HQ', pinX, pinY - 15);
        };

        drawMap();
        window.addEventListener('resize', drawMap);
    }

    // 8. Catalog PDF Download Simulator
    const downloadCatalogBtn = document.getElementById('downloadCatalogBtn');
    if (downloadCatalogBtn) {
        downloadCatalogBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Generate catalog text file representing technical product catalog
            const catalogContent = `=====================================================
VD BIOCHEM & HEALTHCARE - OFFICIAL PRODUCT CATALOG (2026)
One Health Approach: Human, Animal & Plant Health
Established Since 2023
Email: vdbiochemhealthcare@gmail.com
=====================================================

ABOUT US:
VD Biochem & Healthcare specializes in premier Veterinary Nutraceuticals,
livestock nutritional supplements, and advanced bio-chemical solutions.

VET NUTRACEUTICAL PRODUCTS:
1. VitaBoost Vet Liquid Supplement
   - Application: Cattle, Poultry & Pets
   - Key Benefits: High Potency Calcium, Vitamins D3 & B12 for peak milk yield.

2. MineralMax Bolus Formula
   - Application: Dairy Ruminants
   - Key Benefits: Chelated Trace Minerals for fertility and immune health.

3. BioNutri Plant Growth Enhancer
   - Application: Agricultural crops & horticulture
   - Key Benefits: Bio-organic root activator and enzyme builder.

For inquiries and distribution requests:
Contact: vdbiochemhealthcare@gmail.com
=====================================================`;

            const blob = new Blob([catalogContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'VDBiochem_Product_Catalog_2026.txt';
            link.click();
            URL.revokeObjectURL(link.href);

            showToast('Downloading VD Biochem Product Catalog!', 'success');
        });
    }

    // 9. Lightbox Image Gallery Preview
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4')?.textContent || 'Gallery View';
            if (img) {
                const lightboxModal = document.createElement('div');
                lightboxModal.className = 'modal-overlay active';
                lightboxModal.style.zIndex = '3500';
                lightboxModal.innerHTML = `
                    <div class="modal-card" style="max-width: 800px; text-align: center; padding: 1.5rem; background: #07130e;">
                        <button class="modal-close" style="color: #fff; background: rgba(255,255,255,0.2);">&times;</button>
                        <img src="${img.src}" style="max-height: 70vh; width: auto; margin: 0 auto 1rem auto; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3);">
                        <h4 style="color: #fff; font-size: 1.2rem;">${title}</h4>
                    </div>
                `;
                document.body.appendChild(lightboxModal);

                lightboxModal.querySelector('.modal-close').addEventListener('click', () => lightboxModal.remove());
                lightboxModal.addEventListener('click', (e) => {
                    if (e.target === lightboxModal) lightboxModal.remove();
                });
            }
        });
    });
});
