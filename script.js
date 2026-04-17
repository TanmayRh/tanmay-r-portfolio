/**
 * PORTFOLIO INTERACTIONS & LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
    // Flag for CSS reveal logic
    document.documentElement.classList.add('js-enabled');

    
    // --- 1. CUSTOM CURSOR & EFFECTS ---
    const cursor = document.getElementById("cursor");
    const cursorGlow = document.getElementById("cursor-glow");
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let glowX = mouseX, glowY = mouseY;
    
    // Smooth lerp for glow trailing
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate cursor follow
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    const animateGlow = () => {
        glowX = lerp(glowX, mouseX, 0.15);
        glowY = lerp(glowY, mouseY, 0.15);
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        requestAnimationFrame(animateGlow);
    };
    animateGlow();

    // Add hover states for interactive elements
    const interactables = document.querySelectorAll("a, button, .contact-link, .flip-card, .hidden-star");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });


    // --- 2. SINGLE THEME SWITCHER ---
    const themeBtn = document.getElementById("theme-switcher");
    const htmlEl = document.documentElement;

    const themes = ["green", "white", "dark", "red", "blue", "orange", "purple"];
    const labels = ["Green", "Light", "Dark", "Red", "Blue", "Orange", "Purple"];
    
    // Check saved theme or use default
    let currentThemeStr = localStorage.getItem("portfolio-theme") || "green";
    if (!themes.includes(currentThemeStr)) currentThemeStr = "green";
    
    htmlEl.setAttribute("data-theme", currentThemeStr);
    
    // Set aria-label to current theme name
    let currentIndex = themes.indexOf(currentThemeStr);
    themeBtn.setAttribute("aria-label", labels[currentIndex] + " Theme");

    themeBtn.addEventListener("click", () => {
        // Find next theme
        currentIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[currentIndex];

        // Apply theme smoothly (CSS transition handles this)
        htmlEl.setAttribute("data-theme", nextTheme);
        themeBtn.setAttribute("aria-label", labels[currentIndex] + " Theme");
        
        // Save to storage
        localStorage.setItem("portfolio-theme", nextTheme);
    });


    // --- 3. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
    const sections = document.querySelectorAll(".section");
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));


    // --- 4. STATIC TEXT (Hero Section) ---
    // The phrase "Just build different." is now static in the HTML.
    // Typing effect code removed.


    // --- 5. THE SECRET ZONE SECTION ---
    // The secret area is now a permanent section, no logic needed for modal opening.


    // --- 6. SUGGESTION BOX (Live Feed) ---
    const submitBtn = document.getElementById("suggestion-submit");
    const suggestionInput = document.getElementById("suggestion-input");
    const suggestionList = document.getElementById("suggestion-list");

    // Load saved suggestions from localStorage
    const savedSuggestions = JSON.parse(localStorage.getItem("portfolio-suggestions") || "[]");
    savedSuggestions.slice().reverse().forEach(text => {
        const el = document.createElement("div");
        el.className = "feed-item";
        el.textContent = text;
        suggestionList.insertBefore(el, suggestionList.firstChild);
    });

    const addSuggestion = () => {
        const text = suggestionInput.value.trim();
        if (text.length > 0) {
            const el = document.createElement("div");
            el.className = "feed-item";
            el.textContent = text;
            suggestionList.insertBefore(el, suggestionList.firstChild);
            savedSuggestions.unshift(text);
            localStorage.setItem("portfolio-suggestions", JSON.stringify(savedSuggestions));
            suggestionInput.value = "";
        }
    };

    submitBtn.addEventListener("click", addSuggestion);
    suggestionInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSuggestion();
        }
    });




    // --- 7. COPY TO CLIPBOARD (Contact) ---
    const contactLinks = document.querySelectorAll(".contact-link");
    contactLinks.forEach(link => {
        link.addEventListener("click", () => {
            const dataToCopy = link.getAttribute("data-copy");
            navigator.clipboard.writeText(dataToCopy).then(() => {
                const badge = link.querySelector(".copy-badge");
                const oldText = badge.textContent;
                badge.textContent = "Copied!";
                badge.classList.add("copied");
                setTimeout(() => {
                    badge.textContent = oldText;
                    badge.classList.remove("copied");
                }, 2000);
            });
        });
    });

    // --- 8. MAGNETIC CURSOR EFFECT ---
    const magneticElements = document.querySelectorAll(".magnetic-wrap");
    magneticElements.forEach(wrap => {
        wrap.addEventListener("mousemove", (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly toward the mouse
            wrap.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            // Move the cursor glow toward the button
            glowX = lerp(glowX, rect.left + rect.width / 2, 0.2);
            glowY = lerp(glowY, rect.top + rect.height / 2, 0.2);
        });
        
        wrap.addEventListener("mouseleave", () => {
            wrap.style.transform = `translate(0px, 0px)`;
        });
    });

    // --- 9. 3D TILT EFFECT ---
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    // --- 10. AMBIENT DUST GENERATION ---
    const dustContainer = document.getElementById("ambient-dust");
    const createDust = () => {
        for (let i = 0; i < 40; i++) {
            const dust = document.createElement("div");
            dust.className = "dust-particle";
            const size = Math.random() * 4 + 1;
            dust.style.width = `${size}px`;
            dust.style.height = `${size}px`;
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            dustContainer.appendChild(dust);
            
            // Subtle random movement
            animateDustRandomly(dust);
        }
    };

    function animateDustRandomly(el) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        el.style.transform = `translate(${x}px, ${y}px)`;
        setTimeout(() => animateDustRandomly(el), 3000 + Math.random() * 5000);
    }

    if (dustContainer) createDust();

    // Move dust based on mouse
    window.addEventListener("mousemove", (e) => {
        const particles = document.querySelectorAll(".dust-particle");
        particles.forEach(p => {
            const speed = parseFloat(p.style.width) * 2;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            p.style.marginLeft = `${x}px`;
            p.style.marginTop = `${y}px`;
        });
    });

    // --- 11. SCROLL REVEAL (Performance Optimized) ---
    const revealItems = document.querySelectorAll(".reveal-item");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => revealObserver.observe(item));

    // Back to top
    const scrollTopBtn = document.getElementById("scroll-top");
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            const intro = document.getElementById("intro");
            if (intro) {
                intro.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }
});


// --- 8. AUDIO PLAYER (YOUTUBE IFRAME API) ---
// Using "Sweater Weather" (videoId: GCdwKhTtNNw) and an Arctic monkeys track
const playlist = ["GCdwKhTtNNw", "bpOSxM0rNPM"]; 
let currentTrackIdx = 0;
let player;
let isPlaying = false;
let isPowerOn = true;

// This function is automatically called by the YT script once loaded
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: playlist[currentTrackIdx],
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    // Setup Audio Buttons
    const btnPlayPause = document.getElementById("play-pause-btn");
    const btnNext = document.getElementById("next-btn");
    const btnPrev = document.getElementById("prev-btn");
    const btnPower = document.getElementById("toggle-power-btn");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");
    const trackName = document.querySelector(".track-name");

    const updateControls = () => {
        if (isPlaying && isPowerOn) {
            iconPlay.classList.remove("active");
            iconPause.classList.add("active");
        } else {
            iconPlay.classList.add("active");
            iconPause.classList.remove("active");
        }
    };

    const loadTrack = (idx) => {
        if (idx < 0) idx = playlist.length - 1;
        if (idx >= playlist.length) idx = 0;
        currentTrackIdx = idx;
        
        // Update Title
        trackName.textContent = currentTrackIdx === 0 ? "Sweater Weather" : "Do I Wanna Know?";

        player.loadVideoById(playlist[currentTrackIdx]);
        if (isPlaying && isPowerOn) {
            player.playVideo();
        }
    };

    btnPlayPause.addEventListener("click", () => {
        if (!isPowerOn) return; // Prevent action if off
        if (isPlaying) {
            player.pauseVideo();
            isPlaying = false;
        } else {
            player.playVideo();
            isPlaying = true;
        }
        updateControls();
    });

    btnNext.addEventListener("click", () => {
        if (!isPowerOn) return;
        loadTrack(currentTrackIdx + 1);
    });

    btnPrev.addEventListener("click", () => {
        if (!isPowerOn) return;
        loadTrack(currentTrackIdx - 1);
    });

    btnPower.addEventListener("click", () => {
        isPowerOn = !isPowerOn;
        if (isPowerOn) {
            btnPower.classList.remove("power-off");
            // restore state
        } else {
            btnPower.classList.add("power-off");
            player.pauseVideo();
            isPlaying = false;
            updateControls();
        }
    });
}

function onPlayerStateChange(event) {
    const playPauseBtn = document.getElementById("play-pause-btn");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");

    // Replace update logic to match UI sync
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        iconPlay.classList.remove("active");
        iconPause.classList.add("active");
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        iconPlay.classList.add("active");
        iconPause.classList.remove("active");
    }
}
