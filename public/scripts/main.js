// script.js for Little Angels

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Logic ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.05,
            rootMargin: "0px 0px -20px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Animated Stats Counters ---
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        let statsDone = false;
        const animateCounters = () => {
            const counters = statsSection.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                const duration = 1800; // ms
                const startTime = performance.now();

                const step = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutCubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(ease * target);

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                };
                requestAnimationFrame(step);
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsDone) {
                    statsDone = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // --- Swiper Sliders Initialization ---
    const initSwipers = () => {
        if (typeof Swiper === 'undefined') return;

        // Hero Slider
        const heroEl = document.querySelector('.heroSwiper');
        if (heroEl) {
            new Swiper(heroEl, {
                loop: true,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                speed: 1000,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: heroEl.querySelector('.swiper-pagination') || '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: heroEl.querySelector('.swiper-button-next') || '.swiper-button-next',
                    prevEl: heroEl.querySelector('.swiper-button-prev') || '.swiper-button-prev',
                },
            });
        }

        // Gallery Slider
        const galleryEl = document.querySelector('.gallerySwiper');
        if (galleryEl) {
            new Swiper(galleryEl, {
                loop: true,
                centeredSlides: true,
                slidesPerView: 1.2,
                spaceBetween: 10,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: galleryEl.querySelector('.swiper-pagination') || '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: galleryEl.querySelector('.swiper-button-next') || '.swiper-button-next',
                    prevEl: galleryEl.querySelector('.swiper-button-prev') || '.swiper-button-prev',
                },
                breakpoints: {
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 0 },
                    1400: { slidesPerView: 5, spaceBetween: 0 }
                },
            });
        }

        // Romeo Swiper Slider (Litters page)
        const romeoEl = document.querySelector('.romeoSwiper');
        if (romeoEl) {
            new Swiper(romeoEl, {
                loop: true,
                speed: 500,
                observer: true,
                observeParents: true,
                pagination: {
                    el: romeoEl.querySelector('.swiper-pagination') || '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: romeoEl.querySelector('.swiper-button-next') || '.swiper-button-next',
                    prevEl: romeoEl.querySelector('.swiper-button-prev') || '.swiper-button-prev',
                },
            });
        }
    };

    // If Swiper is already loaded, run immediately, otherwise poll slightly
    if (typeof Swiper !== 'undefined') {
        initSwipers();
    } else {
        const swiperCheck = setInterval(() => {
            if (typeof Swiper !== 'undefined') {
                clearInterval(swiperCheck);
                initSwipers();
            }
        }, 50);
        setTimeout(() => clearInterval(swiperCheck), 3000);
    }

    // --- Modal Logic (Litters page) ---
    const modal = document.getElementById('litter-modal');
    if (modal) {
        const closeModalBtn = modal.querySelector('.close-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalImage = document.getElementById('modal-image');
        const modalPuppiesList = document.getElementById('modal-puppies-list');

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 300);
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Expose openModal globally for litters page cards
        window.openLitterModal = function(litter) {
            if (!litter) return;
            if (modalTitle) modalTitle.textContent = litter.nazwa_miotu;
            if (modalDate) modalDate.textContent = "Data urodzenia: " + (litter.data_urodzenia ? litter.data_urodzenia.split('-').reverse().join('.') : '');
            if (modalImage) {
                modalImage.src = "/assets/images/mioty_images/" + litter.img;
                modalImage.alt = litter.nazwa_miotu;
            }

            if (modalPuppiesList) {
                modalPuppiesList.innerHTML = '';
                if (litter.szczenieta && litter.szczenieta.length > 0) {
                    litter.szczenieta.forEach(puppy => {
                        const li = document.createElement('li');
                        li.classList.add('puppy-item');
                        const genderIcon = (puppy.plec === 'M' || puppy.plec === 'samiec')
                            ? '<i class="fa-solid fa-mars u-male"></i> Pies'
                            : '<i class="fa-solid fa-venus u-female"></i> Suczka';

                        li.innerHTML = '<span class="puppy-name">' + puppy.imie + '</span><span class="puppy-gender">' + genderIcon + '</span>';
                        modalPuppiesList.appendChild(li);
                    });
                } else {
                    modalPuppiesList.innerHTML = '<li class="puppy-item">Brak informacji o szczeniętach</li>';
                }
            }

            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.classList.add('no-scroll');
        };
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('faq-active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('faq-active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('faq-active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    item.classList.remove('faq-active');
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    // --- Adoption Survey Logic ---
    const surveyForm = document.getElementById('adoption-survey');
    if (surveyForm) {
        const choiceGroups = surveyForm.querySelectorAll('.choice-group');

        choiceGroups.forEach(group => {
            const buttons = group.querySelectorAll('.choice-btn');
            const hiddenInput = group.querySelector('input[type="hidden"]');

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (hiddenInput) hiddenInput.value = btn.dataset.value;
                });
            });
        });

        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let allSelected = true;
            choiceGroups.forEach(group => {
                const hiddenInput = group.querySelector('input[type="hidden"]');
                if (hiddenInput && !hiddenInput.value) {
                    allSelected = false;
                    group.classList.add('error-pulse');
                    setTimeout(() => group.classList.remove('error-pulse'), 1000);
                }
            });

            if (!allSelected) {
                alert('Prosimy o wybranie wszystkich opcji w polach wyboru.');
                return;
            }

            const submitBtn = surveyForm.querySelector('.survey-submit-btn');
            const originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.textContent = 'Wysyłanie...';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                alert('Dziękujemy za wypełnienie ankiety! Skontaktujemy się z Tobą wkrótce.');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
                surveyForm.reset();
                surveyForm.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('active'));
            }, 1500);
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Cookie Banner Logic ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');

    if (cookieBanner) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBanner.classList.remove('show');
            });
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                cookieBanner.classList.remove('show');
            });
        }
    }

});
