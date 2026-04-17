/**
 * PORTFOLIO INTERACTIONS & LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
    
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


    // --- 5. EASTER EGG ---
    const eggTrigger = document.getElementById("easter-egg-trigger");
    const secretModal = document.getElementById("secret-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const starHint = document.getElementById("star-hint");

    const openModal = () => {
        secretModal.classList.remove("active");
        modalBackdrop.classList.remove("active");
        void secretModal.offsetWidth; // force reflow to restart animations
        secretModal.classList.add("active");
        modalBackdrop.classList.add("active");
        // Hide the hint arrow once they've discovered it
        starHint.classList.add("hidden");
    };

    const closeModal = () => {
        secretModal.classList.remove("active");
        modalBackdrop.classList.remove("active");
        // Bring the hint arrow back so they can find it again
        starHint.classList.remove("hidden");
    };

    eggTrigger.addEventListener("click", openModal);
    modalCloseBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });


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

    // --- 9. EASTER EYES (cursor‑following) ---
    const eyes = document.querySelector('.easter-eyes');
    if (eyes) {
        const pupils = eyes.querySelectorAll('.pupil');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function updateEyes() {
            pupils.forEach(pupil => {
                const eye = pupil.parentElement;
                const rect = eye.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mouseX - cx;
                const dy = mouseY - cy;
                const angle = Math.atan2(dy, dx);
                const radius = 6; // max travel
                const targetX = Math.cos(angle) * radius;
                const targetY = Math.sin(angle) * radius;
                const style = getComputedStyle(pupil);
                const matrix = new DOMMatrixReadOnly(style.transform);
                const curX = matrix.m41;
                const curY = matrix.m42;
                const lerp = (a, b, t) => a + (b - a) * t;
                const newX = lerp(curX, targetX, 0.07);
                const newY = lerp(curY, targetY, 0.07);
                pupil.style.transform = `translate(${newX}px, ${newY}px)`;
            });
            requestAnimationFrame(updateEyes);
        }
        requestAnimationFrame(updateEyes);
        // Random blinking
        function scheduleBlink() {
            const interval = 3000 + Math.random() * 3000; // 3‑6 s
            setTimeout(() => {
                eyes.querySelectorAll('.eye').forEach(e => e.classList.add('blink'));
                setTimeout(() => {
                    eyes.querySelectorAll('.eye').forEach(e => e.classList.remove('blink'));
                }, 200);
                scheduleBlink();
            }, interval);
        }
        scheduleBlink();
    }


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

    // Back to top
    document.getElementById("scroll-top").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
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
