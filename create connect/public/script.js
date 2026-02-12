// CommunityConnect - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('CommunityConnect loaded!');
    
    // Demo data - in real app, this comes from backend
    const demoExchanges = [
        { id: 1, user: "Maria", skill: "Cooking Lesson", type: "need", distance: "2 blocks", time: "30 min", points: 15 },
        { id: 2, user: "John", skill: "IKEA Assembly", type: "offer", distance: "Same street", time: "1 hour", points: 20 },
        { id: 3, user: "Alex", skill: "Gardening Help", type: "need", distance: "3 blocks", time: "2 hours", points: 25 },
        { id: 4, user: "Sarah", skill: "Math Tutoring", type: "offer", distance: "4 blocks", time: "1.5 hours", points: 30 }
    ];
    
    // Load exchanges on homepage
    if (document.getElementById('live-exchanges')) {
        loadExchanges();
    }
    
    // Load exchanges into the page
    function loadExchanges() {
        const container = document.getElementById('live-exchanges');
        if (!container) return;
        container.innerHTML = '';
        
        demoExchanges.forEach(exchange => {
            const color = exchange.type === 'need' ? 'red' : 'green';
            const icon = exchange.type === 'need' ? '❓' : '✅';
            
            const exchangeHTML = `
                <div class="border-l-4 border-${color}-500 bg-${color}-50 p-4 rounded-lg skill-card cursor-pointer hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-bold">${icon} ${exchange.skill}</p>
                            <p class="text-sm mt-1">${exchange.user} ${exchange.type === 'need' ? 'needs help with' : 'offers help for'} this</p>
                            <p class="text-xs text-gray-500 mt-2">${exchange.distance} • ${exchange.time}</p>
                        </div>
                        <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">${exchange.points} pts</span>
                    </div>
                    <button class="mt-3 bg-${color}-500 text-white px-3 py-1 rounded text-sm hover:bg-${color}-600 transition-colors">
                        ${exchange.type === 'need' ? 'Offer Help' : 'Request Help'}
                    </button>
                </div>
            `;
            container.innerHTML += exchangeHTML;
        });
    }

    // Simple form handling
    const offerForm = document.getElementById('offer-form');
    if (offerForm) {
        offerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Skill offered successfully! You\'ll be notified when a neighbor needs help.');
            this.reset();
        });
    }

    // Initialize Demo Magic
    addDemoMagic();
});

// Demo mode toggle logic
document.getElementById('demoMode')?.addEventListener('click', function() {
    this.classList.toggle('bg-gradient-to-r');
    this.classList.toggle('from-green-500');
    this.classList.toggle('to-emerald-600');
    this.classList.toggle('from-purple-500');
    this.classList.toggle('to-pink-600');
    
    const isActive = this.innerHTML.includes('ON');
    
    if (isActive) {
        this.innerHTML = '<i class="fas fa-magic mr-2"></i>Demo Mode';
        alert('Demo mode OFF - Real data restored');
    } else {
        this.innerHTML = '<i class="fas fa-sparkles mr-2"></i>Demo Mode: ON';
        alert('Demo mode ON - Simulating live neighborhood activity!');
        simulateLiveActivity();
    }
});

function addDemoMagic() {
    // 1. Auto-increment points during demo
    setInterval(() => {
        const pointsEl = document.querySelector('[id*="point"], .points');
        if (pointsEl && Math.random() > 0.7) {
            const current = parseInt(pointsEl.textContent) || 100;
            pointsEl.textContent = current + 5;
            pointsEl.classList.add('point-gain');
            setTimeout(() => pointsEl.classList.remove('point-gain'), 500);
        }
    }, 3000);

    // 2. FIXED: Unified Map marker animation
    // Using a MutationObserver to catch markers added by Leaflet dynamically
    const applyMarkerStyles = () => {
        const mapMarkers = document.querySelectorAll('.leaflet-marker-icon');
        mapMarkers.forEach(marker => {
            if (marker.dataset.styled) return; // Prevent double listeners
            
            marker.style.transition = 'transform 0.3s ease-out';
            
            marker.addEventListener('mouseenter', () => {
                // Add scale without destroying Leaflet's translation
                if (!marker.style.transform.includes('scale')) {
                    marker.style.transform += ' scale(1.3)';
                }
                marker.style.zIndex = "1000";
            });
            
            marker.addEventListener('mouseleave', () => {
                // Safely remove only the scale
                marker.style.transform = marker.style.transform.replace(' scale(1.3)', '');
                marker.style.zIndex = "auto";
            });
            
            marker.dataset.styled = "true";
        });
    };

    // Run once and then periodically to catch new markers
    applyMarkerStyles();
    setInterval(applyMarkerStyles, 2000);

    // 3. Simulate live exchanges
    const exchangeTypes = ['Gardening', 'Cooking', 'Tutoring', 'Repairs', 'Moving Help'];
    const names = ['Maria', 'John', 'Sarah', 'Alex', 'David', 'Lisa'];
    
    setInterval(() => {
        const container = document.getElementById('live-exchanges');
        if (Math.random() > 0.5 && container) {
            const type = exchangeTypes[Math.floor(Math.random() * exchangeTypes.length)];
            const name = names[Math.floor(Math.random() * names.length)];
            const isNeed = Math.random() > 0.5;
            
            const newExchange = {
                type: isNeed ? 'need' : 'offer',
                skill: type,
                user: name,
                distance: `${Math.floor(Math.random() * 5) + 1} blocks`,
                time: `${Math.floor(Math.random() * 3) + 1} hour(s)`,
                points: Math.floor(Math.random() * 20) + 10
            };
            
            const newHTML = createExchangeHTML(newExchange);
            container.insertAdjacentHTML('afterbegin', newHTML);
            
            if (container.children.length > 6) {
                container.lastElementChild.remove();
            }
            
            container.firstElementChild.classList.add('bg-yellow-50', 'border-yellow-400');
            setTimeout(() => {
                container.firstElementChild?.classList.remove('bg-yellow-50', 'border-yellow-400');
            }, 2000);
        }
    }, 5000);
}

function createExchangeHTML(exchange) {
    const color = exchange.type === 'need' ? 'red' : 'green';
    const icon = exchange.type === 'need' ? '❓' : '✅';
    
    return `
        <div class="border-l-4 border-${color}-500 bg-${color}-50 p-4 rounded-lg skill-card">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold">${icon} ${exchange.skill}</p>
                    <p class="text-sm mt-1">${exchange.user} ${exchange.type === 'need' ? 'needs help with' : 'offers help for'} this</p>
                    <p class="text-xs text-gray-500 mt-2">${exchange.distance} • ${exchange.time}</p>
                </div>
                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">${exchange.points} pts</span>
            </div>
            <button class="mt-3 bg-${color}-500 text-white px-3 py-1 rounded text-sm hover:bg-${color}-600 transition-colors">
                ${exchange.type === 'need' ? 'Offer Help' : 'Request Help'}
            </button>
        </div>
    `;
}

function simulateLiveActivity() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-handshake text-2xl mr-3"></i>
            <div>
                <p class="font-bold">New Match Found!</p>
                <p class="text-sm">Maria needs gardening help - 2 blocks away</p>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    
    const pointsEl = document.getElementById('userPoints') || document.querySelector('.points');
    if (pointsEl) {
        let points = parseInt(pointsEl.textContent) || 100;
        pointsEl.textContent = points + 25;
        pointsEl.classList.add('text-green-600', 'font-bold');
        setTimeout(() => pointsEl.classList.remove('text-green-600', 'font-bold'), 1000);
    }
}






