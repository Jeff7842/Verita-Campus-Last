document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');

    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    const heroHeight = heroSection.offsetHeight;

    window.addEventListener('scroll', function() {
        if (window.scrollY > heroHeight * 0.8) {
            navbar.classList.add('solid');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.add('transparent');
            navbar.classList.remove('solid');
        }
    });

    // Vertical scrolling gallery animation
    function animateVerticalGallery() {
        const galleryTracks = document.querySelectorAll('.gallery-track');

        galleryTracks.forEach(track => {
            const speed = track.classList.contains('gallery-track-1') ? 30 :
                track.classList.contains('gallery-track-2') ? 40 : 50;

            const items = track.querySelectorAll('.gallery-item');
            const itemHeight = items[0].offsetHeight + 20; // height + gap

            // Clone items to create seamless loop
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });

            // Animate with CSS transitions
            let position = 0;

            function scroll() {
                position -= 1; // adjust for smoother/faster scrolling
                track.style.transform = `translateY(${position}px)`;

                // Reset when enough items have scrolled out of view
                if (Math.abs(position) >= itemHeight * items.length) {
                    position = 0;
                }

                requestAnimationFrame(scroll);
            }

            scroll();
        });
    }

    // Run on DOM load
    document.addEventListener('DOMContentLoaded', animateVerticalGallery);


    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate__animated');

    function animateOnScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('animate__fadeInUp');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Ripple effect for buttons
    const buttons = document.querySelectorAll('.ripple');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';

            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });

    // Scrolling gallery animation
    const galleryTracks = document.querySelectorAll('.gallery-track');

    function animateGallery() {
        galleryTracks.forEach(track => {
            const speed = track.classList.contains('gallery-track-1') ? 30 :
                track.classList.contains('gallery-track-2') ? 40 : 50;

            const items = track.querySelectorAll('.gallery-item');
            const itemWidth = items[0].offsetWidth + 20; // Including gap

            // Clone items for seamless looping
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });

            // Reset position when animation completes
            track.addEventListener('animationiteration', () => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                setTimeout(() => {
                    track.style.transition = 'transform ' + speed + 's linear';
                }, 10);
            });
        });
    }

    animateGallery();
});

// Search Toggle Functionality
const searchToggle = document.getElementById('searchToggle');
const searchBox = document.querySelector('.search-box');

searchToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
        searchBox.querySelector('input').focus();
    }
});

// Close search when clicking outside
document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target) && e.target !== searchToggle) {
        searchBox.classList.remove('active');
    }
});

// Search functionality
const searchForm = document.querySelector('.search-box');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = this.querySelector('input').value.trim();
    if (searchTerm) {
        // Add your search functionality here
        alert('Searching for: ' + searchTerm);
        // Example: window.location.href = 'search.html?q=' + encodeURIComponent(searchTerm);
    }
});

// Course Slider Navigation
const courseTrack = document.querySelector('.course-track');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const courseCards = document.querySelectorAll('.course-card');
const cardWidth = courseCards[0].offsetWidth + 30; // width + gap

let currentPosition = 0;
const maxPosition = (courseCards.length - 3) * cardWidth; // Show 3 cards at a time

function updateButtons() {
    scrollLeftBtn.disabled = currentPosition === 0;
    scrollRightBtn.disabled = currentPosition >= maxPosition;
}

scrollLeftBtn.addEventListener('click', () => {
    currentPosition = Math.max(0, currentPosition - cardWidth);
    courseTrack.style.transform = `translateX(-${currentPosition}px)`;
    updateButtons();
});

scrollRightBtn.addEventListener('click', () => {
    currentPosition = Math.min(maxPosition, currentPosition + cardWidth);
    courseTrack.style.transform = `translateX(-${currentPosition}px)`;
    updateButtons();
});

// Initialize button states
updateButtons();

// Handle window resize
window.addEventListener('resize', () => {
    const newCardWidth = courseCards[0].offsetWidth + 30;
    if (newCardWidth !== cardWidth) {
        currentPosition = Math.min(currentPosition, (courseCards.length - 3) * newCardWidth);
        courseTrack.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const searchInputs = document.querySelectorAll('.course-search input, .search-box input');
    const courseCards = document.querySelectorAll('.package-card');
    const applyFilterBtn = document.querySelector('.filter-apply');
    const priceRange = document.querySelector('.price-range');
    const priceDisplay = document.querySelector('.price-values span:last-child');
    const sortToggle = document.querySelector('.sort-toggle');
    const sortDropdown = document.querySelector('.sort-dropdown');

    const getFilters = () => {
        const selected = {
            categories: [],
            durations: [],
            levels: [],
                price: parseInt(priceRange?.value || 15000, 10),
            keyword: searchInputs[0].value.trim().toLowerCase(),
                sortBy: sortToggle?.textContent.trim().split(":")[1]?.trim() || "Recommended"
        };

        document.querySelectorAll('.filter-section:nth-of-type(1) input:checked').forEach(input => {
            selected.categories.push(input.parentElement.textContent.trim());
        });

        document.querySelectorAll('.filter-section:nth-of-type(2) input:checked').forEach(input => {
            selected.durations.push(input.parentElement.textContent.trim());
        });

        document.querySelectorAll('.filter-section:nth-of-type(4) input:checked').forEach(input => {
            selected.levels.push(input.parentElement.textContent.trim());
        });

        return selected;
    };

    const filterAndSortCourses = () => {
        const { categories, durations, levels, price, keyword, sortBy } = getFilters();
        const cardsArray = Array.from(courseCards);

        const filtered = cardsArray.filter(card => {
            const title = card.querySelector('.package-title')?.textContent.toLowerCase() || "";
            const description = card.querySelector('.package-description')?.textContent.toLowerCase() || "";
            const durationText = card.querySelector('.course-meta span:nth-child(2)')?.textContent.toLowerCase() || "";
            const priceValue = parseFloat(card.querySelector('.package-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;

            let show = true;

            if (keyword && !(title.includes(keyword) || description.includes(keyword))) {
                show = false;
            }

            if (!categories.includes("All Categories")) {
                show = categories.some(cat => title.includes(cat.toLowerCase())) ? show : false;
            }

            if (!durations.includes("Any Duration")) {
                show = durations.some(dur => durationText.includes(dur.split(' ')[0])) ? show : false;
            }

            if (priceValue > price) show = false;

            return show;
        });

        // Sorting
        const sorted = filtered.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.package-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(b.querySelector('.package-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;

            const durationA = parseInt(a.querySelector('.course-meta span:nth-child(2)')?.textContent) || 0;
            const durationB = parseInt(b.querySelector('.course-meta span:nth-child(2)')?.textContent) || 0;

            switch (sortBy) {
                case 'Price: Low to High':
                    return priceA - priceB;
                case 'Price: High to Low':
                    return priceB - priceA;
                case 'Duration: Short to Long':
                    return durationA - durationB;
                case 'Newest':
                    return 0; // Placeholder for date logic
                default:
                    return 0;
            }
        });

        // Hide all, then show filtered and sorted
        courseCards.forEach(card => card.style.display = "none");
        sorted.forEach(card => card.style.display = "block");
    };

    // Event Listeners
    searchInputs.forEach(input => input.addEventListener('input', filterAndSortCourses));
    applyFilterBtn?.addEventListener('click', filterAndSortCourses);
    priceRange?.addEventListener('input', () => {
        priceDisplay.textContent = `Kshs ${priceRange.value}`;
        filterAndSortCourses();
    });

    // Sort Dropdown Toggle
    sortToggle?.addEventListener('click', () => {
        sortDropdown.classList.toggle('active');
    });

    // Sort Selection
    sortDropdown?.querySelectorAll('a').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            sortToggle.innerHTML = `Sort by: ${option.textContent} <i class="fas fa-chevron-down"></i>`;
            sortDropdown.classList.remove('active');
            filterAndSortCourses();
        });
    });

    // Initial filter
    filterAndSortCourses();
});

document.addEventListener("DOMContentLoaded", function() {
    const searchInputs = document.querySelectorAll('.course-search input, .search-box input');
    const courseCards = document.querySelectorAll('.package-card');
    const applyFilterBtn = document.querySelector('.filter-apply');
    const priceRange = document.querySelector('.price-range');
    const priceDisplay = document.querySelector('.price-values span:last-child');
    const sortToggle = document.querySelector('.sort-toggle');
    const sortDropdown = document.querySelector('.sort-dropdown');

    const getFilters = () => {
        const selected = {
            categories: [],
            durations: [],
            levels: [],
            price: parseInt(priceRange?.value || 15000, 10),
            keyword: searchInputs[0].value.trim().toLowerCase(),
            sortBy: sortToggle?.textContent.trim().split(":")[1]?.trim() || "Recommended"
        };

        document.querySelectorAll('.filter-section:nth-of-type(1) input:checked').forEach(input => {
            selected.categories.push(input.parentElement.textContent.trim());
        });

        document.querySelectorAll('.filter-section:nth-of-type(2) input:checked').forEach(input => {
            selected.durations.push(input.parentElement.textContent.trim());
        });

        document.querySelectorAll('.filter-section:nth-of-type(4) input:checked').forEach(input => {
            selected.levels.push(input.parentElement.textContent.trim());
        });

        return selected;
    };

});

// ========== COURSE FILTER & SEARCH FUNCTIONALITY ==========

document.addEventListener("DOMContentLoaded", function() {
    const searchInputs = document.querySelectorAll('.course-search input, .search-box input');
    const courseCards = document.querySelectorAll('.package-card');
    const applyFilterBtn = document.querySelector('.filter-apply');

    const getSelectedFilters = () => {
        const selected = {
            categories: [],
            durations: [],
            levels: [],
            price: parseInt(document.querySelector('.price-range').value, 10)
        };

        // Categories
        document.querySelectorAll('.filter-section:nth-of-type(1) input:checked').forEach(input => {
            selected.categories.push(input.parentElement.textContent.trim());
        });

        // Duration
        document.querySelectorAll('.filter-section:nth-of-type(2) input:checked').forEach(input => {
            selected.durations.push(input.parentElement.textContent.trim());
        });

        // Skill Level
        document.querySelectorAll('.filter-section:nth-of-type(4) input:checked').forEach(input => {
            selected.levels.push(input.parentElement.textContent.trim());
        });

        return selected;
    };

    const filterCourses = () => {
        const { categories, durations, levels, price } = getSelectedFilters();
        const keyword = searchInputs[0].value.trim().toLowerCase();

        courseCards.forEach(card => {
            const title = card.querySelector('.package-title')?.textContent.toLowerCase() || "";
            const description = card.querySelector('.package-description')?.textContent.toLowerCase() || "";
            const durationText = card.querySelector('.course-meta span:nth-child(2)')?.textContent.toLowerCase() || "";
            const priceValue = parseFloat(card.querySelector('.package-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;

            let visible = true;

            // Keyword search
            if (keyword && !(title.includes(keyword) || description.includes(keyword))) {
                visible = false;
            }

            // Category match
            if (!categories.includes("All Categories")) {
                visible = categories.some(cat => title.includes(cat.toLowerCase())) ? visible : false;
            }

            // Duration match
            if (!durations.includes("Any Duration")) {
                visible = durations.some(dur => durationText.includes(dur.split(' ')[0])) ? visible : false;
            }

            // Skill level match (optional — not present in DOM yet unless you add it)
            // if (!levels.includes("All Levels")) {
            //     visible = levels.some(level => card.textContent.toLowerCase().includes(level.toLowerCase())) ? visible : false;
            // }

            // Price range
            if (priceValue > price) visible = false;

            card.style.display = visible ? 'block' : 'none';
        });
    };

    // Apply filters on button click
    applyFilterBtn?.addEventListener('click', filterCourses);

    // Live search on typing
    searchInputs.forEach(input => {
        input.addEventListener('input', filterCourses);
    });
});