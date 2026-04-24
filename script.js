document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Customizer Logic ---

    const themeCustomizer = document.getElementById('themeCustomizer');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Inputs
    const bgColorInput = document.getElementById('bgColor');
    const primaryColorInput = document.getElementById('primaryColor');
    const accentColorInput = document.getElementById('accentColor');
    const resetThemeBtn = document.getElementById('resetThemeBtn');

    // Default values (same as CSS root)
    const defaults = {
        bg: '#ffebf0',
        primary: '#ff4d85',
        accent: '#8c52ff'
    };

    // Toggle panel visibility
    themeToggleBtn.addEventListener('click', () => {
        themeCustomizer.classList.toggle('open');
    });

    // Function to apply colors to CSS variables
    const applyColors = (bg, primary, accent) => {
        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--accent-color', accent);
        
        // Update input values to reflect current colors
        bgColorInput.value = bg;
        primaryColorInput.value = primary;
        accentColorInput.value = accent;
    };

    // Load saved colors from localStorage
    const savedBg = localStorage.getItem('esmanur_bg');
    const savedPrimary = localStorage.getItem('esmanur_primary');
    const savedAccent = localStorage.getItem('esmanur_accent');

    if (savedBg && savedPrimary && savedAccent) {
        applyColors(savedBg, savedPrimary, savedAccent);
    }

    // Real-time update and save functions
    const updateAndSave = () => {
        const bg = bgColorInput.value;
        const primary = primaryColorInput.value;
        const accent = accentColorInput.value;

        applyColors(bg, primary, accent);

        localStorage.setItem('esmanur_bg', bg);
        localStorage.setItem('esmanur_primary', primary);
        localStorage.setItem('esmanur_accent', accent);
    };

    // Event listeners for color changes
    bgColorInput.addEventListener('input', updateAndSave);
    primaryColorInput.addEventListener('input', updateAndSave);
    accentColorInput.addEventListener('input', updateAndSave);

    // Reset button
    resetThemeBtn.addEventListener('click', () => {
        applyColors(defaults.bg, defaults.primary, defaults.accent);
        localStorage.removeItem('esmanur_bg');
        localStorage.removeItem('esmanur_primary');
        localStorage.removeItem('esmanur_accent');
    });


    // --- 2. Mood Widget Logic ---
    
    const moods = [
        "✨ Feeling Creative! 🎨",
        "☕ Need more coffee...",
        "🌞 Enjoying the sun!",
        "📚 Learning something new",
        "🎧 Vibing to music",
        "🚀 Ready to conquer the day!",
        "😴 Just woke up...",
        "🧩 In deep thought Mode"
    ];

    const moodDisplay = document.getElementById('moodDisplay');
    const moodModal = document.getElementById('moodModal');
    const defaultMoodsList = document.getElementById('defaultMoodsList');
    const closeMoodModalBtn = document.getElementById('closeMoodModal');
    const saveCustomMoodBtn = document.getElementById('saveCustomMoodBtn');
    const customEmoji = document.getElementById('customEmoji');
    const customMoodText = document.getElementById('customMoodText');

    // Load saved mood if exists
    const savedMood = localStorage.getItem('esmanur_mood');
    if (savedMood) {
        moodDisplay.innerText = savedMood;
    }

    // Populate default moods list in modal
    moods.forEach(mood => {
        const li = document.createElement('li');
        li.innerText = mood;
        li.addEventListener('click', () => {
            setMood(mood);
            closeModal();
        });
        defaultMoodsList.appendChild(li);
    });

    const setMood = (moodText) => {
        moodDisplay.style.opacity = 0;
        setTimeout(() => {
            moodDisplay.innerText = moodText;
            moodDisplay.style.opacity = 1;
            localStorage.setItem('esmanur_mood', moodText);
        }, 200);
    };

    window.openMoodModal = function() {
        moodModal.classList.add('active');
    };

    const closeModal = () => {
        moodModal.classList.remove('active');
    };

    closeMoodModalBtn.addEventListener('click', closeModal);

    // Close on overlay click
    moodModal.addEventListener('click', (e) => {
        if (e.target === moodModal) {
            closeModal();
        }
    });

    // Custom mood submit
    saveCustomMoodBtn.addEventListener('click', () => {
        const emoji = customEmoji.value.trim() || '✨';
        const text = customMoodText.value.trim();
        
        if (text) {
            setMood(`${emoji} ${text}`);
            customEmoji.value = '';
            customMoodText.value = '';
            closeModal();
        }
    });

    // --- 3. Secret Admin & Hobbies Logic ---
    const adminUnlocker = document.getElementById('adminUnlocker');
    const addHobbyBtn = document.getElementById('addHobbyBtn');
    const hobbiesContainer = document.getElementById('hobbiesContainer');

    adminUnlocker.addEventListener('dblclick', () => {
        const pwd = prompt("Enter secret password to unlock Edit Mode:");
        if (pwd === "esma") {
            document.body.classList.add('admin-mode');
            alert("✨ Edit mode unlocked! You can now add custom hobbies.");
        } else if (pwd !== null) {
            alert("Incorrect password. This site belongs to Esmanur!");
        }
    });

    // Load custom hobbies
    const defaultHobbies = ["📸 Photography", "🎨 Design", "🌍 Traveling", "☕ Coffee Tasting", "📚 Fun Facts"];
    let savedHobbies = JSON.parse(localStorage.getItem('esmanur_hobbies'));
    
    // Fallback exactly to default if never saved
    if (!savedHobbies) {
        savedHobbies = defaultHobbies;
        localStorage.setItem('esmanur_hobbies', JSON.stringify(savedHobbies));
    }

    const renderHobbies = () => {
        hobbiesContainer.innerHTML = '';
        savedHobbies.forEach((hobbyText, index) => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.innerText = hobbyText;
            
            // Editable only in admin mode
            span.addEventListener('click', () => {
                if (document.body.classList.contains('admin-mode')) {
                    const action = prompt(`Edit hobby (or type "DELETE" to remove):\n\nCurrent: ${hobbyText}`, hobbyText);
                    if (action === null) return; // cancelled prompt
                    
                    if (action.trim().toUpperCase() === 'DELETE') {
                        savedHobbies.splice(index, 1);
                    } else if (action.trim() !== '') {
                        savedHobbies[index] = action.trim();
                    }
                    localStorage.setItem('esmanur_hobbies', JSON.stringify(savedHobbies));
                    renderHobbies();
                }
            });
            
            hobbiesContainer.appendChild(span);
        });
    };

    renderHobbies();

    addHobbyBtn.addEventListener('click', () => {
        const newHobby = prompt("Enter your new hobby (e.g. 🎵 Playing Guitar):");
        if (newHobby && newHobby.trim() !== "") {
            savedHobbies.push(newHobby.trim());
            localStorage.setItem('esmanur_hobbies', JSON.stringify(savedHobbies));
            renderHobbies();
        }
    });

});
