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

    // 2. Product Slider Showcase (One Product at a time) & Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allCards = Array.from(document.querySelectorAll('.product-card'));
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    const sliderDots = document.getElementById('sliderDots');
    const sliderCounter = document.getElementById('sliderCounter');
    const sliderAutoplayBtn = document.getElementById('sliderAutoplayBtn');
    const sliderWrapper = document.querySelector('.product-slider-wrapper');

    let visibleCards = [...allCards];
    let currentIndex = 0;
    let autoplayInterval = null;
    let isAutoplayActive = true;

    const updateSlider = (index, animate = true) => {
        if (visibleCards.length === 0) return;
        if (index < 0) index = visibleCards.length - 1;
        if (index >= visibleCards.length) index = 0;
        currentIndex = index;

        if (sliderTrack) {
            sliderTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Update Counter
        if (sliderCounter) {
            sliderCounter.textContent = `Product ${currentIndex + 1} of ${visibleCards.length}`;
        }

        // Update Dots
        if (sliderDots) {
            const dots = sliderDots.querySelectorAll('.slider-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    };

    const renderDots = () => {
        if (!sliderDots) return;
        sliderDots.innerHTML = '';
        visibleCards.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${idx === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to product ${idx + 1}`);
            dot.addEventListener('click', () => {
                updateSlider(idx);
                resetAutoplayTimer();
            });
            sliderDots.appendChild(dot);
        });
    };

    const filterProducts = (filterValue) => {
        allCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (filterValue === 'all' || cat === filterValue) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });

        visibleCards = allCards.filter(card => card.style.display !== 'none');
        currentIndex = 0;
        renderDots();
        updateSlider(0, false);
    };

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                filterProducts(filterValue);
            });
        });
    }

    if (sliderPrev) {
        sliderPrev.addEventListener('click', () => {
            updateSlider(currentIndex - 1);
            resetAutoplayTimer();
        });
    }

    if (sliderNext) {
        sliderNext.addEventListener('click', () => {
            updateSlider(currentIndex + 1);
            resetAutoplayTimer();
        });
    }

    // Auto Play Logic
    const startAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (isAutoplayActive && visibleCards.length > 1) {
                updateSlider(currentIndex + 1);
            }
        }, 4500);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
    };

    const resetAutoplayTimer = () => {
        if (isAutoplayActive) {
            startAutoplay();
        }
    };

    if (sliderAutoplayBtn) {
        sliderAutoplayBtn.addEventListener('click', () => {
            isAutoplayActive = !isAutoplayActive;
            const icon = sliderAutoplayBtn.querySelector('i');
            const label = sliderAutoplayBtn.querySelector('span');
            if (isAutoplayActive) {
                if (icon) icon.className = 'fa-solid fa-pause';
                if (label) label.textContent = 'Auto Slide';
                startAutoplay();
            } else {
                if (icon) icon.className = 'fa-solid fa-play';
                if (label) label.textContent = 'Paused';
                stopAutoplay();
            }
        });
    }

    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => {
            if (isAutoplayActive) stopAutoplay();
        });
        sliderWrapper.addEventListener('mouseleave', () => {
            if (isAutoplayActive) startAutoplay();
        });

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;
        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                updateSlider(currentIndex + 1);
                resetAutoplayTimer();
            } else if (touchEndX - touchStartX > 50) {
                updateSlider(currentIndex - 1);
                resetAutoplayTimer();
            }
        }, { passive: true });
    }

    // Initial Setup
    renderDots();
    updateSlider(0, false);
    startAutoplay();

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

    // 7. Interactive Leaflet OpenStreetMap API & HQ Route Finder
    const leafletMapDiv = document.getElementById('leafletMap');
    if (leafletMapDiv && typeof L !== 'undefined') {
        const hqCoords = [26.7880, 82.1980]; // Ayodhya, UP

        // Initialize Map
        const map = L.map('leafletMap', {
            center: hqCoords,
            zoom: 12,
            scrollWheelZoom: false
        });

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors | VD Biochem HQ'
        }).addTo(map);

        // Custom Icon for HQ Marker
        const hqIcon = L.divIcon({
            className: 'hq-map-marker',
            html: `<div style="background: #0f4c3a; color: #10b981; border: 2px solid #10b981; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4); font-size: 18px;"><i class="fa-solid fa-building"></i></div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
        });

        // Add Marker
        const hqMarker = L.marker(hqCoords, { icon: hqIcon }).addTo(map);
        hqMarker.bindPopup(`
            <div class="hq-popup-card">
                <h5>VD Biochem & Healthcare</h5>
                <p><strong>HQ:</strong> Dutta Ka Purva, Kaushalpuri, Ayodhya, U.P. - 224001</p>
                <p><i class="fa-solid fa-phone"></i> +91 9554717147</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=26.7880,82.1980" target="_blank" class="popup-btn">
                    <i class="fa-solid fa-diamond-turn-right"></i> Navigate Here
                </a>
            </div>
        `).openPopup();

        // Preset Locations Coordinates & Distances
        const cityPresets = {
            lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow', dist: '135 km', duration: '2 hrs 45 mins' },
            gorakhpur: { lat: 26.7606, lng: 83.3732, name: 'Gorakhpur', dist: '130 km', duration: '2 hrs 30 mins' },
            varanasi: { lat: 25.3176, lng: 82.9739, name: 'Varanasi', dist: '200 km', duration: '4 hrs 15 mins' },
            kanpur: { lat: 26.4499, lng: 80.3319, name: 'Kanpur', dist: '230 km', duration: '4 hrs 30 mins' },
            delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi', dist: '680 km', duration: '9 hrs 30 mins' }
        };

        let activeRouteLayer = null;
        let activeStartMarker = null;

        const drawRoute = (startLat, startLng, startName, distanceText, durationText) => {
            if (activeRouteLayer) map.removeLayer(activeRouteLayer);
            if (activeStartMarker) map.removeLayer(activeStartMarker);

            // Draw Start Marker
            const startIcon = L.divIcon({
                className: 'start-map-marker',
                html: `<div style="background: #10b981; color: #ffffff; border: 2px solid #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;"><i class="fa-solid fa-location-dot"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            activeStartMarker = L.marker([startLat, startLng], { icon: startIcon }).addTo(map);
            activeStartMarker.bindPopup(`<b>Starting Point:</b> ${startName}`);

            // Draw Route Polyline
            const latlngs = [[startLat, startLng], hqCoords];
            activeRouteLayer = L.polyline(latlngs, {
                color: '#10b981',
                weight: 5,
                opacity: 0.85,
                dashArray: '8, 8'
            }).addTo(map);

            // Fit Map Bounds
            const bounds = L.latLngBounds([[startLat, startLng], hqCoords]);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Update UI Text
            const distanceElem = document.getElementById('routeDistance');
            const durationElem = document.getElementById('routeDuration');
            const gmapsLink = document.getElementById('gmapsDirectLink');

            if (distanceElem) distanceElem.textContent = distanceText;
            if (durationElem) durationElem.textContent = durationText;
            if (gmapsLink) {
                gmapsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=26.7880,82.1980`;
            }
        };

        const getDirectionsBtn = document.getElementById('getDirectionsBtn');
        const startLocationSelect = document.getElementById('startLocationSelect');

        const calculateAndShowDirections = () => {
            const selectedVal = startLocationSelect ? startLocationSelect.value : 'lucknow';

            if (selectedVal === 'user_gps') {
                if (navigator.geolocation) {
                    showToast('Fetching your GPS coordinates...', 'info');
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLng = position.coords.longitude;
                            drawRoute(userLat, userLng, 'Your Current Location', 'Direct GPS Route', 'Calculating...');
                            showToast('Route to HQ displayed on map!', 'success');
                        },
                        (error) => {
                            showToast('GPS access denied. Showing Lucknow route instead.', 'info');
                            const city = cityPresets.lucknow;
                            drawRoute(city.lat, city.lng, city.name, city.dist, city.duration);
                        }
                    );
                } else {
                    showToast('Geolocation not supported by your browser.', 'info');
                }
            } else if (cityPresets[selectedVal]) {
                const city = cityPresets[selectedVal];
                drawRoute(city.lat, city.lng, city.name, city.dist, city.duration);
                showToast(`Showing route from ${city.name} to HQ!`, 'success');
            }
        };

        if (getDirectionsBtn) {
            getDirectionsBtn.addEventListener('click', calculateAndShowDirections);
        }

        // Draw Default Route (Lucknow) on load
        drawRoute(cityPresets.lucknow.lat, cityPresets.lucknow.lng, cityPresets.lucknow.name, cityPresets.lucknow.dist, cityPresets.lucknow.duration);
    }

    // 8. Catalog PDF Download Handler
    const downloadCatalogBtn = document.getElementById('downloadCatalogBtn');
    if (downloadCatalogBtn) {
        downloadCatalogBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const pdfUrl = 'assets/images/pdf.pdf';
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'VD_Biochem_Product_Catalog.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Downloading official VD Biochem Product Catalog (PDF)...', 'success');
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

    // 10. Floating WhatsApp Quick Contact Controller
    const whatsappToggleBtn = document.getElementById('whatsappToggleBtn');
    const whatsappPopup = document.getElementById('whatsappPopup');
    const whatsappCloseBtn = document.getElementById('whatsappCloseBtn');
    const whatsappCustomMsg = document.getElementById('whatsappCustomMsg');
    const whatsappSendBtn = document.getElementById('whatsappSendBtn');
    const quickTopicBtns = document.querySelectorAll('.quick-topic-btn');
    const whatsappBadge = document.querySelector('.whatsapp-badge');

    const whatsappPhone = '919554717147'; // Official VD Biochem Customer Care WhatsApp

    const updateWhatsappLink = (msgText) => {
        if (!whatsappSendBtn) return;
        const encodedMsg = encodeURIComponent(msgText || 'Hello VD Biochem! I want to inquire about your products.');
        whatsappSendBtn.href = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;
    };

    if (whatsappToggleBtn && whatsappPopup) {
        whatsappToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = whatsappPopup.classList.toggle('active');
            if (isActive && whatsappBadge) {
                whatsappBadge.style.display = 'none';
            }
        });
    }

    if (whatsappCloseBtn && whatsappPopup) {
        whatsappCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            whatsappPopup.classList.remove('active');
        });
    }

    // Close popup on outside click
    document.addEventListener('click', (e) => {
        if (whatsappPopup && whatsappPopup.classList.contains('active')) {
            if (!whatsappPopup.contains(e.target) && !whatsappToggleBtn.contains(e.target)) {
                whatsappPopup.classList.remove('active');
            }
        }
    });

    if (whatsappCustomMsg) {
        whatsappCustomMsg.addEventListener('input', (e) => {
            updateWhatsappLink(e.target.value);
        });
    }

    if (quickTopicBtns.length > 0) {
        quickTopicBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const topicMsg = btn.getAttribute('data-msg');
                if (whatsappCustomMsg) {
                    whatsappCustomMsg.value = topicMsg;
                }
                updateWhatsappLink(topicMsg);
                // Trigger send redirect directly
                if (whatsappSendBtn) {
                    whatsappSendBtn.click();
                }
            });
        });
    }

    // Initial WhatsApp link setup
    if (whatsappCustomMsg) {
        updateWhatsappLink(whatsappCustomMsg.value);
    }
});
