// Game Variables
let secretNumber;
let attempts = 0;
let guessHistory = [];
let gameActive = true;

// Stats Variables
let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalAttempts: 0,
    bestScore: null
};

// DOM Elements
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const newGameBtn = document.getElementById('newGameBtn');
const messageBox = document.getElementById('messageBox');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const bestScoreDisplay = document.getElementById('bestScore');
const historyList = document.getElementById('historyList');

// Stats DOM Elements
const gamesPlayedDisplay = document.getElementById('gamesPlayed');
const gamesWonDisplay = document.getElementById('gamesWon');
const winRateDisplay = document.getElementById('winRate');
const avgAttemptsDisplay = document.getElementById('avgAttempts');

// Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize Game
function initGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessHistory = [];
    gameActive = true;
    
    updateDisplay();
    showMessage('🎯 I\'m thinking of a number... Can you guess it?', 'default');
    historyList.innerHTML = '<p class="empty-state">No guesses yet. Start playing!</p>';
    guessInput.value = '';
    guessInput.focus();
}

// Handle Guess
function handleGuess() {
    if (!gameActive) {
        showMessage('⚠️ Game over! Start a new game.', 'warning');
        return;
    }

    const guess = parseInt(guessInput.value);
    
    // Validation
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('⚠️ Please enter a valid number between 1 and 100!', 'warning');
        return;
    }

    // Check for duplicate guess
    if (guessHistory.includes(guess)) {
        showMessage('🔄 You already guessed that number! Try a different one.', 'warning');
        return;
    }

    attempts++;
    guessHistory.push(guess);
    updateDisplay();

    // Check guess
    if (guess === secretNumber) {
        handleWin();
    } else if (guess > secretNumber) {
        showMessage(`📉 ${guess} is too high! Try a lower number.`, 'error');
        addToHistory(guess, 'too-high');
    } else {
        showMessage(`📈 ${guess} is too low! Try a higher number.`, 'warning');
        addToHistory(guess, 'too-low');
    }

    guessInput.value = '';
    guessInput.focus();
}

// Handle Win
function handleWin() {
    gameActive = false;
    stats.gamesWon++;
    stats.totalAttempts += attempts;
    
    if (!stats.bestScore || attempts < stats.bestScore) {
        stats.bestScore = attempts;
        updateBestScore();
    }

    showMessage(
        `🎉 Congratulations! You found the number ${secretNumber} in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`,
        'success'
    );
    
    addToHistory(secretNumber, 'correct');
    updateStats();
    saveStats();
    
    // Confetti effect (visual feedback)
    createConfetti();
}

// Show Message
function showMessage(text, type) {
    message.textContent = text;
    messageBox.className = 'message-box';
    
    if (type === 'success') {
        messageBox.classList.add('success');
    } else if (type === 'error') {
        messageBox.classList.add('error');
    } else if (type === 'warning') {
        messageBox.classList.add('warning');
    }
}

// Add to History
function addToHistory(guess, type) {
    if (historyList.querySelector('.empty-state')) {
        historyList.innerHTML = '';
    }

    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${type}`;
    
    let icon = '';
    let label = '';
    
    if (type === 'too-high') {
        icon = '⬇️';
        label = 'Too High';
    } else if (type === 'too-low') {
        icon = '⬆️';
        label = 'Too Low';
    } else if (type === 'correct') {
        icon = '🎯';
        label = 'Correct!';
    }
    
    historyItem.innerHTML = `
        <span><strong>Guess ${guessHistory.length}:</strong> ${guess}</span>
        <span>${icon} ${label}</span>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Update Display
function updateDisplay() {
    attemptsDisplay.textContent = attempts;
}

// Update Best Score
function updateBestScore() {
    bestScoreDisplay.textContent = stats.bestScore || '-';
}

// Update Stats
function updateStats() {
    gamesPlayedDisplay.textContent = stats.gamesPlayed;
    gamesWonDisplay.textContent = stats.gamesWon;
    
    const winRate = stats.gamesPlayed > 0 
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
        : 0;
    winRateDisplay.textContent = winRate + '%';
    
    const avgAttempts = stats.gamesWon > 0 
        ? Math.round(stats.totalAttempts / stats.gamesWon) 
        : 0;
    avgAttemptsDisplay.textContent = avgAttempts;
}

// Save Stats to LocalStorage
function saveStats() {
    localStorage.setItem('guessGameStats', JSON.stringify(stats));
}

// Load Stats from LocalStorage
function loadStats() {
    const savedStats = localStorage.getItem('guessGameStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
        updateStats();
        updateBestScore();
    }
}

// Confetti Effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        confetti.style.transition = 'all 3s ease-out';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = window.innerHeight + 'px';
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// New Game
function startNewGame() {
    stats.gamesPlayed++;
    updateStats();
    saveStats();
    initGame();
}

// Event Listeners
guessBtn.addEventListener('click', handleGuess);
newGameBtn.addEventListener('click', startNewGame);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});

// Hamburger Menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translate(5px, 5px)' 
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translate(7px, -6px)' 
        : 'none';
});

// Smooth Scrolling for Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Reset hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Initialize on Page Load
window.addEventListener('DOMContentLoaded', () => {
    loadStats();
    initGame();
});

// Highlight active section on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});