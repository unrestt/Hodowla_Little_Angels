// script.js for Little Angels

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Logic ---
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });

        // Close menu when clicking a link
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

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Swiper Hero Slider ---
    if (document.querySelector('.heroSwiper')) {
        const swiper = new Swiper(".heroSwiper", {
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
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    // --- Gallery Slider ---
    if (document.querySelector('.gallerySwiper')) {
        const gallerySwiper = new Swiper(".gallerySwiper", {
            loop: true,
            centeredSlides: true,
            slidesPerView: 1.2, /* Peek next slides on mobile */
            spaceBetween: 10,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 0, /* seamless aesthetic or small gap */
                },
                1400: {
                    slidesPerView: 5,
                    spaceBetween: 0,
                }
            },
        });
    }

    // --- Dynamic Litters & Modal Logic ---
    const littersContainer = document.getElementById('litters-container');
    const modal = document.getElementById('litter-modal');

    // Only run if we are on the litters page
    if (littersContainer && modal) {
        const closeModalBtn = modal.querySelector('.close-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalImage = document.getElementById('modal-image');
        const modalPuppiesList = document.getElementById('modal-puppies-list');

        // Path to images
        const imageBasePath = 'assets/images/mioty_images/';

        // Fetch Data
        fetch('assets/data/mioty.json')
            .then(response => response.json())
            .then(data => {
                const current = data.find(l => l.current === true);
                const history = data.filter(l => l.current !== true);

                renderCurrentLitter(current);
                renderHistoryLitters(history);
            })
            .catch(error => console.error('Error loading litters data:', error));

        function renderCurrentLitter(litter) {
            const container = document.getElementById('current-litter-container');
            if (!container) return;

            if (!litter) {
                container.innerHTML = `
                    <p class="no-puppies-msg">Obecnie nie posiadamy dostępnych szczeniąt.
                    Zapraszamy do śledzenia naszej strony i mediów społecznościowych.</p>`;
                return;
            }

            // Create puppies list string
            let puppiesHtml = '';
            if (litter.szczenieta && litter.szczenieta.length > 0) {
                puppiesHtml = `<div class="current-puppies-list">`;
                litter.szczenieta.forEach(puppy => {
                    const genderIcon = puppy.plec === 'M'
                        ? '<i class="fa-solid fa-mars u-male"></i>'
                        : '<i class="fa-solid fa-venus u-female"></i>';

                    const reservationStatus = puppy.reserved
                        ? '<i class="fa-solid fa-ban status-icon reserved" title="Zarezerwowany"></i>'
                        : '<i class="fa-regular fa-circle-check status-icon available" title="Dostępny"></i>';

                    puppiesHtml += `
                        <div class="current-puppy-tag ${puppy.reserved ? 'is-reserved' : 'is-available'}">
                            ${genderIcon} ${puppy.imie} ${reservationStatus}
                        </div>
                    `;
                });
                puppiesHtml += `</div>`;
            }

            container.innerHTML = `
                <div class="current-litter-display">
                    <div class="current-litter-image">
                        <img src="${imageBasePath}${litter.img}" alt="${litter.nazwa_miotu}">
                    </div>
                    <div class="current-litter-info">
                        <h3>${litter.nazwa_miotu}</h3>
                        <p class="current-litter-date"><i class="fa-regular fa-calendar"></i> Urodzone: ${formatDate(litter.data_urodzenia)}</p>
                        
                        <div class="current-litter-status">
                            <span class="status-badge available">Dostępne Szczenięta</span>
                        </div>

                        <div class="current-puppies-section">
                            <h4>Szczenięta w tym miocie:</h4>
                            ${puppiesHtml}
                        </div>

                        <a href="index.html#contact" class="contact-btn-litter">Zapytaj o szczeniaka</a>
                    </div>
                </div>
            `;
        }

        function renderHistoryLitters(litters) {
            littersContainer.innerHTML = '';
            litters.forEach(litter => {
                const card = document.createElement('article');
                card.classList.add('litter-card');

                // Generate HTML
                card.innerHTML = `
                    <div class="litter-image">
                        <img src="${imageBasePath}${litter.img}" alt="${litter.nazwa_miotu}" loading="lazy">
                    </div>
                    <div class="litter-details">
                        <div>
                            <h3 class="litter-title">${litter.nazwa_miotu}</h3>
                            <span class="litter-date">Data urodzenia: ${formatDate(litter.data_urodzenia)}</span>
                        </div>
                        <button class="litter-btn">Zobacz więcej</button>
                    </div>
                `;

                // Add Event Listener to Button
                const btn = card.querySelector('.litter-btn');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(litter);
                });

                littersContainer.appendChild(card);
            });
        }

        function openModal(litter) {
            modalTitle.textContent = litter.nazwa_miotu;
            modalDate.textContent = `Data urodzenia: ${formatDate(litter.data_urodzenia)}`;
            modalImage.src = `${imageBasePath}${litter.img}`;
            modalImage.alt = litter.nazwa_miotu;

            // Clear previous puppies
            modalPuppiesList.innerHTML = '';

            // Add new puppies
            if (litter.szczenieta && litter.szczenieta.length > 0) {
                litter.szczenieta.forEach(puppy => {
                    const li = document.createElement('li');
                    li.classList.add('puppy-item');

                    const genderIcon = puppy.plec === 'M'
                        ? '<i class="fa-solid fa-mars u-male"></i> Pies'
                        : '<i class="fa-solid fa-venus u-female"></i> Suczka';

                    li.innerHTML = `
                        <span class="puppy-name">${puppy.imie}</span>
                        <span class="puppy-gender">${genderIcon}</span>
                    `;
                    modalPuppiesList.appendChild(li);
                });
            } else {
                modalPuppiesList.innerHTML = '<li class="puppy-item">Brak informacji o szczeniętach</li>';
            }

            modal.style.display = 'block';
            // Small delay to allow display:block to apply before adding opacity for transition
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.classList.add('no-scroll');
        }

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 300); // Match transition duration
        }

        // Close events
        closeModalBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Helper to format date (e.g. 2024-11-14 -> 14.11.2024)
        function formatDate(dateString) {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            return `${day}.${month}.${year}`;
        }
    }

});
