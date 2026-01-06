/* ==================== CONFIGURATION ==================== */

const ASSETS = {
    landing: 'assets/hciimg1.jpg',
    stalls: 'assets/hciimg2.jpg',
    friends: 'assets/hciimg3.jpg',
    friendAmogh: 'assets/hciimg4.jpg',
    friendAnu: 'assets/hciimg5.jpg'
};

const STALLS = {
    left: {
        name: "VEGAN CREPES",
        dist: "45m",
        eta: "2 min",
        wait: "3",
        path: "path-left",
        id: "cont-l",
        color: "wait-short"
    },
    middle: {
        name: "STARLIGHT GALETTES",
        dist: "15m",
        eta: "1 min",
        wait: "12",
        path: "path-straight",
        id: "cont-m",
        color: "wait-long"
    },
    right: {
        name: "WINTER GRILL",
        dist: "60m",
        eta: "3 min",
        wait: "8",
        path: "path-right",
        id: "cont-r",
        color: "wait-mid"
    }
};

const FRIENDS = {
    amogh: {
        name: "Amogh",
        emoji: "👨‍💻",
        distance: "120m",
        eta: "5 min",
        color: "friend-amogh",
        position: "friend-pos-left",
        image: ASSETS.friendAmogh
    },
    anu: {
        name: "Anu",
        emoji: "👩‍🔬",
        distance: "85m",
        eta: "3 min",
        color: "friend-anu",
        position: "friend-pos-right",
        image: ASSETS.friendAnu
    }
};

// Data for Task 3: Dynamic Route
let currentItinerary = [
    { id: 1, name: "Craft Stall", type: "standard", icon: "🧣", eta: "3 min", active: true },
    { id: 2, name: "Candle Shop", type: "standard", icon: "🕯️", eta: "8 min", active: false },
    { id: 3, name: "Main Stage", type: "standard", icon: "🎵", eta: "15 min", active: false }
];

/* ==================== DOM ELEMENTS ==================== */

const reality = document.getElementById('reality-bg');
const arView = document.getElementById('ar-view');
const hudLayer = document.getElementById('hud-layer');
const ring = document.getElementById('gaze-ring');
const arrowLayer = document.getElementById('arrow-layer');
const itinerarySidebar = document.getElementById('itinerary-sidebar');
const quickAddMenu = document.getElementById('quick-add-menu');

let gazeTimer;
let gazeAction = null;
let currentTask = null;

/* ==================== RETICLE SYSTEM ==================== */

document.addEventListener('mousemove', e => {
    const reticle = document.getElementById('reticle');
    reticle.style.left = e.clientX + 'px';
    reticle.style.top = e.clientY + 'px';
});

/* ==================== GAZE INTERACTION SYSTEM ==================== */

function startGaze(action) {
    gazeAction = action;
    ring.style.transition = 'stroke-dashoffset 1.5s linear';
    ring.style.strokeDashoffset = '0';
    
    gazeTimer = setTimeout(() => {
        handleTrigger(gazeAction);
        cancelGaze();
    }, 1500);
}

function cancelGaze() {
    clearTimeout(gazeTimer);
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = '164';
    gazeAction = null;
}

function handleTrigger(action) {
    // Check if action is a function closure (common in dynamic generation)
    if (typeof action === "function") {
        action();
        return;
    }
    
    switch(action) {
        case 'home':
            location.reload();
            break;
        case 'help':
            showHelp();
            break;
        case 'task1':
            showDietaryButtons();
            break;
        case 'task2':
            showFriendsScreen();
            break;
        case 'task3': // Updated handler for Task 3
            startRouteAdjustment();
            break;
        case 'show_stalls':
            renderStallRings();
            break;
        case 'open_quick_add':
            toggleQuickAddMenu();
            break;
    }
}

/* ==================== HELP MODAL ==================== */

function showHelp() {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('hidden');
}

function closeHelp() {
    const modal = document.getElementById('help-modal');
    modal.classList.add('hidden');
}

/* ==================== TASK 1: DIETARY RESTRICTIONS ==================== */

function showDietaryButtons() {
    currentTask = 'task1';
    resetViews();
    reality.style.backgroundImage = `url("${ASSETS.stalls}")`;
    reality.style.filter = "brightness(1)";
    
    arView.innerHTML = `
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8 pointer-events-auto fade-in">
            <button 
                onmouseenter="startGaze('show_stalls')" 
                onmouseleave="cancelGaze()" 
                class="dietary-btn dietary-vegan">
                <span class="text-3xl">🌿</span>
                <span>VEGAN</span>
            </button>
            <button 
                onmouseenter="startGaze('show_stalls')" 
                onmouseleave="cancelGaze()" 
                class="dietary-btn dietary-gluten">
                <span class="text-3xl">🌾</span>
                <span>GLUTEN-FREE</span>
            </button>
        </div>
    `;
}

function renderStallRings() {
    arView.innerHTML = `
        <div id="cont-l" 
             class="stall-container pos-l ${STALLS.left.color}" 
             onmouseenter="startGaze(() => startNav('left'))" 
             onmouseleave="cancelGaze()">
            <div class="stall-ring"></div>
            <div class="wait-tag">WAIT: ${STALLS.left.wait} MIN</div>
        </div>
        <div id="cont-m" 
             class="stall-container pos-m ${STALLS.middle.color}" 
             onmouseenter="startGaze(() => startNav('middle'))" 
             onmouseleave="cancelGaze()">
            <div class="stall-ring"></div>
            <div class="wait-tag">WAIT: ${STALLS.middle.wait} MIN</div>
        </div>
        <div id="cont-r" 
             class="stall-container pos-r ${STALLS.right.color}" 
             onmouseenter="startGaze(() => startNav('right'))" 
             onmouseleave="cancelGaze()">
            <div class="stall-ring"></div>
            <div class="wait-tag">WAIT: ${STALLS.right.wait} MIN</div>
        </div>
    `;
}

function startNav(key) {
    const data = STALLS[key];
    
    document.querySelectorAll('.stall-container').forEach(c => {
        if (c.id !== data.id) {
            c.style.opacity = "0";
        }
    });
    
    const target = document.getElementById(data.id);
    target.style.opacity = "1";
    target.classList.add('selected');
    
    hudLayer.innerHTML = `
        <div class="nav-info-card glass-strong">
            <div class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-2">Target Locked</div>
            <div class="text-2xl font-bold mb-4">${data.name}</div>
            <div class="flex justify-between border-t border-white/20 pt-4 mt-4">
                <div>
                    <div class="text-[10px] text-white/50 uppercase mb-1">Distance</div>
                    <div class="text-3xl font-bold">${data.dist}</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-white/50 uppercase mb-1">ETA</div>
                    <div class="text-3xl font-bold text-cyan-400">${data.eta}</div>
                </div>
            </div>
        </div>
    `;
    
    arrowLayer.classList.remove('hidden', 'path-left', 'path-right', 'path-straight', 'path-amogh', 'path-drink');
    arrowLayer.classList.add(data.path);
    
    reality.style.filter = "brightness(0.5) saturate(1.3)";
}

/* ==================== TASK 2: FIND FRIENDS ==================== */

function showFriendsScreen() {
    currentTask = 'task2';
    resetViews();
    reality.style.backgroundImage = `url("${ASSETS.friends}")`;
    reality.style.filter = "brightness(1)";
    
    // Create persistent popup notification
    const popup = document.createElement('div');
    popup.id = 'friends-found-popup';
    popup.className = 'popup-notification persistent pointer-events-auto';
    popup.innerHTML = `
        <div class="text-xl font-bold text-cyan-400">👥 Friends Found</div>
        <div class="text-sm text-white/80">Select a friend below to start navigation</div>
    `;
    document.body.appendChild(popup);
    
    renderFriendBalloons();
}

function renderFriendBalloons() {
    arView.innerHTML = `
        <div class="friend-balloon ${FRIENDS.amogh.color} ${FRIENDS.amogh.position} pointer-events-auto">
            <div class="balloon-content">
                <div class="balloon-avatar">
                    ${FRIENDS.amogh.emoji}
                </div>
                <div class="friend-info-badge">
                    <div class="friend-name">${FRIENDS.amogh.name}</div>
                    <div class="friend-distance">${FRIENDS.amogh.distance}</div>
                </div>
                <button 
                    onmouseenter="startGaze(() => selectFriend('amogh'))"
                    onmouseleave="cancelGaze()"
                    class="friend-select-btn">
                    Navigate to ${FRIENDS.amogh.name}
                </button>
            </div>
        </div>
        
        <div class="friend-balloon ${FRIENDS.anu.color} ${FRIENDS.anu.position} pointer-events-auto">
            <div class="balloon-content">
                <div class="balloon-avatar">
                    ${FRIENDS.anu.emoji}
                </div>
                <div class="friend-info-badge">
                    <div class="friend-name">${FRIENDS.anu.name}</div>
                    <div class="friend-distance">${FRIENDS.anu.distance}</div>
                </div>
                <button 
                    onmouseenter="startGaze(() => selectFriend('anu'))"
                    onmouseleave="cancelGaze()"
                    class="friend-select-btn">
                    Navigate to ${FRIENDS.anu.name}
                </button>
            </div>
        </div>
    `;
}

function selectFriend(friendKey) {
    const friend = FRIENDS[friendKey];
    
    // Remove the persistent popup upon selection
    const popup = document.getElementById('friends-found-popup');
    if (popup) popup.remove();

    reality.style.backgroundImage = `url("${friend.image}")`;
    arView.innerHTML = '';
    
    hudLayer.innerHTML = `
        <div class="friend-info-card glass-strong card-${friendKey}">
            <div class="flex items-center gap-3 mb-4">
                <div class="text-4xl">${friend.emoji}</div>
                <div>
                    <div class="text-[10px] text-white/50 uppercase mb-1">Navigating to</div>
                    <div class="text-2xl font-bold">${friend.name}</div>
                </div>
            </div>
            <div class="flex justify-between border-t border-white/20 pt-4">
                <div>
                    <div class="text-[10px] text-white/50 uppercase mb-1">Distance</div>
                    <div class="text-3xl font-bold">${friend.distance}</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-white/50 uppercase mb-1">ETA</div>
                    <div class="text-3xl font-bold" style="color: ${friendKey === 'amogh' ? '#ff6b9d' : '#4dabf7'}">${friend.eta}</div>
                </div>
            </div>
            <div class="mt-4 text-xs text-white/70 text-center">
                ${friend.name} will be notified you're on your way
            </div>
        </div>
    `;
    
    // Set directions: Amogh (more to the right), Anu (standard right)
    const arrowDirection = friendKey === 'amogh' ? 'path-amogh' : 'path-right';
    arrowLayer.classList.remove('hidden', 'path-left', 'path-right', 'path-straight', 'path-amogh', 'path-drink');
    arrowLayer.classList.add(arrowDirection);
    
    reality.style.filter = "brightness(0.5) saturate(1.3)";
}

/* ==================== TASK 3: DYNAMIC ROUTE ADJUSTMENT ==================== */

function startRouteAdjustment() {
    currentTask = 'task3';
    resetViews();
    reality.style.backgroundImage = `url("assets/hciimg1.jpg")`; // Background simulating being on a path
    reality.style.filter = "brightness(0.7)";
    
    itinerarySidebar.classList.remove('hidden');
    
    // Initial Render of Badge List
    renderBadgeList();
    
    // Initial Arrows (Straight)
    arrowLayer.classList.remove('hidden', 'path-left', 'path-right', 'path-amogh', 'path-drink');
    arrowLayer.classList.add('path-straight');
    
    // Show a hint including the Wizard instruction
    const popup = document.createElement('div');
    popup.id = 'task3-hint';
    popup.className = 'popup-notification';
    popup.innerHTML = `
        <div class="font-bold">Following Planned Route</div>
        <div class="text-xs mt-1">Wizard: Press 'P' to simulate Pull-Down</div>
        <div class="text-xs text-white/50 mt-1">Gaze at a badge to reorder/prioritize</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
}

function renderBadgeList() {
    let html = `
        <div class="add-btn-wrapper">
            <button 
                onmouseenter="startGaze('open_quick_add')"
                onmouseleave="cancelGaze()"
                class="btn-quick-add pointer-events-auto">
                +
            </button>
            <div class="text-[10px] text-white/50 mt-1 mr-2">ADD STOP</div>
        </div>
    `;

    currentItinerary.forEach((item, index) => {
        // Only show connecting line if it's not the last item
        const showLine = index < currentItinerary.length - 1;
        const activeClass = item.active ? 'badge-active' : '';
        const newClass = item.type === 'urgent' ? 'badge-new' : '';
        
        // Add gaze listener for reordering (prioritizeStop)
        html += `
            <div class="badge-wrapper">
                <div class="badge-item ${activeClass} ${newClass} pointer-events-auto"
                     onmouseenter="startGaze(() => prioritizeStop(${index}))"
                     onmouseleave="cancelGaze()">
                    <div class="badge-circle">
                        <div class="badge-number">${index + 1}</div>
                        <span>${item.icon}</span>
                    </div>
                    <div class="badge-info">
                        <div class="font-bold text-lg leading-none">${item.name}</div>
                        <div class="badge-eta text-cyan-400">${item.eta}</div>
                    </div>
                </div>
                ${showLine ? '<div class="badge-line"></div>' : ''}
            </div>
        `;
    });

    itinerarySidebar.innerHTML = html;
}

// NEW FUNCTION: Allow user to gaze at a badge to move it to top
function prioritizeStop(index) {
    if (index === 0) return; // Already top
    
    // Remove item from current position
    const item = currentItinerary.splice(index, 1)[0];
    
    // Reset all actives
    currentItinerary.forEach(i => i.active = false);
    
    // Set clicked item to active and move to top
    item.active = true;
    currentItinerary.unshift(item);
    
    // Re-render
    renderBadgeList();
    
    // Visual feedback
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    popup.innerHTML = `
        <div class="font-bold">Rerouting...</div>
        <div class="text-xs">Prioritizing ${item.name}</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
}

function toggleQuickAddMenu() {
    quickAddMenu.classList.remove('hidden');
    quickAddMenu.innerHTML = `
        <div class="quick-menu-grid">
            <div class="col-span-3 text-center text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">
                Quick Add Stop
            </div>
            
            <button class="quick-option" 
                onmouseenter="startGaze(() => insertUrgentStop('drink'))" 
                onmouseleave="cancelGaze()">
                <span class="text-3xl">☕</span>
                <span class="text-xs font-bold">DRINKS</span>
            </button>
            
            <button class="quick-option" 
                onmouseenter="startGaze(() => insertUrgentStop('wc'))" 
                onmouseleave="cancelGaze()">
                <span class="text-3xl">🚻</span>
                <span class="text-xs font-bold">WC</span>
            </button>
            
            <button class="quick-option" 
                onmouseenter="startGaze(() => insertUrgentStop('gift'))" 
                onmouseleave="cancelGaze()">
                <span class="text-3xl">🎁</span>
                <span class="text-xs font-bold">GIFTS</span>
            </button>
            
            <div class="col-span-3 text-center mt-2">
                <button onclick="document.getElementById('quick-add-menu').classList.add('hidden')" class="text-xs text-white/50 hover:text-white border border-white/30 rounded-full px-4 py-1">Cancel</button>
            </div>
        </div>
    `;
}

function insertUrgentStop(type) {
    // 1. Hide Menu
    quickAddMenu.classList.add('hidden');
    
    // 2. Define the new stop
    let newStop = { id: 99, type: 'urgent', active: true };
    
    if (type === 'drink') {
        newStop.name = "Hot Cider";
        newStop.icon = "☕";
        newStop.eta = "< 2 min";
    } else if (type === 'wc') {
        newStop.name = "Restroom";
        newStop.icon = "🚻";
        newStop.eta = "1 min";
    } else {
        newStop.name = "Souvenirs";
        newStop.icon = "🎁";
        newStop.eta = "4 min";
    }
    
    // 3. Update Data: Deactivate current active, Insert new at top
    currentItinerary.forEach(i => i.active = false);
    currentItinerary.unshift(newStop); // Add to beginning
    
    // 4. Re-render List
    renderBadgeList();
    
    // 5. Update AR View (Arrows)
    arrowLayer.classList.remove('hidden', 'path-left', 'path-right', 'path-straight', 'path-amogh');
    arrowLayer.classList.add('path-drink'); // Uses the orange arrow style defined in CSS
    
    // 6. Show Notification
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    popup.innerHTML = `
        <div class="font-bold text-orange-400">Route Updated</div>
        <div class="text-xs">New stop added. Rerouting...</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}


/* ==================== UTILS ==================== */

function resetViews() {
    arView.innerHTML = '';
    hudLayer.innerHTML = '';
    itinerarySidebar.innerHTML = '';
    itinerarySidebar.classList.add('hidden');
    quickAddMenu.classList.add('hidden');
    arrowLayer.classList.add('hidden');
    
    // Remove any popups
    const popups = document.querySelectorAll('.popup-notification');
    popups.forEach(p => p.remove());
}

/* ==================== WIZARD CONTROLS ==================== */

function wizardAction(key) {
    if (key === 'P') {
        // P key simulates the pull-down gesture for Task 3
        if (currentTask === 'task3') {
            toggleQuickAddMenu();
        } else {
            console.log("Pull-down only active in Route mode (Task 3)");
        }
    }
    if (key === 'X') {
        location.reload();
    }
}

window.addEventListener('keydown', e => {
    wizardAction(e.key.toUpperCase());
});

/* ==================== INITIALIZATION ==================== */

reality.style.backgroundImage = `url("${ASSETS.landing}")`;