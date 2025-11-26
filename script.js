document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const playingScreen = document.getElementById('playing-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const restartBtn = document.getElementById('restart-btn');

    const targetTimeDisplay = document.getElementById('target-time');
    const resultTargetDisplay = document.getElementById('result-target');
    const resultActualDisplay = document.getElementById('result-actual');
    const resultDiffDisplay = document.getElementById('result-diff');
    const feedbackMsg = document.getElementById('feedback-msg');

    const countdownDisplay = document.getElementById('countdown');
    const nebulaDisplay = document.querySelector('.nebula');

    // Game State
    let targetDuration = 0;
    let startTime = 0;
    let timerRunning = false;

    // Constants
    const MIN_DURATION = 10;
    const MAX_DURATION = 30;

    // Event Listeners
    startBtn.addEventListener('click', startCountdown);
    stopBtn.addEventListener('click', stopGame);
    restartBtn.addEventListener('click', resetGame);

    function startCountdown() {
        // Generate random duration between 10 and 30 seconds
        targetDuration = Math.floor(Math.random() * (MAX_DURATION - MIN_DURATION + 1)) + MIN_DURATION;

        // Update UI
        targetTimeDisplay.textContent = targetDuration;

        // Switch screens
        switchScreen(playingScreen);

        // Prepare for countdown
        stopBtn.disabled = true;
        nebulaDisplay.classList.add('hidden');
        countdownDisplay.classList.remove('hidden');

        let count = 3;
        countdownDisplay.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownDisplay.textContent = count;
                // Re-trigger animation
                countdownDisplay.style.animation = 'none';
                countdownDisplay.offsetHeight; /* trigger reflow */
                countdownDisplay.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            } else if (count === 0) {
                countdownDisplay.textContent = "GO!";
                countdownDisplay.style.animation = 'none';
                countdownDisplay.offsetHeight; /* trigger reflow */
                countdownDisplay.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            } else {
                clearInterval(countdownInterval);
                startGame();
            }
        }, 1000);
    }

    function startGame() {
        // Hide countdown, show nebula
        countdownDisplay.classList.add('hidden');
        nebulaDisplay.classList.remove('hidden');

        // Enable stop button
        stopBtn.disabled = false;

        // Start timer
        startTime = performance.now();
        timerRunning = true;
    }

    function stopGame() {
        if (!timerRunning) return;

        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
        timerRunning = false;

        showResults(elapsedTime);
    }

    function showResults(actualTime) {
        const diff = Math.abs(actualTime - targetDuration);
        const diffFormatted = diff.toFixed(3);
        const actualFormatted = actualTime.toFixed(3);

        // Update Result UI
        resultTargetDisplay.textContent = `${targetDuration}s`;
        resultActualDisplay.textContent = `${actualFormatted}s`;
        resultDiffDisplay.textContent = `${diffFormatted}s`;

        // Generate feedback based on accuracy
        let feedback = '';
        let color = '';

        if (diff < 0.5) {
            feedback = "Incredible! You are a human clock! 🤖";
            color = "#22c55e"; // Success green
        } else if (diff < 1.0) {
            feedback = "Great job! Very close! 🎯";
            color = "#38bdf8"; // Accent blue
        } else if (diff < 3.0) {
            feedback = "Not bad, but you can do better! 👍";
            color = "#facc15"; // Warning yellow
        } else {
            feedback = "Way off! Try again! 😅";
            color = "#ef4444"; // Danger red
        }

        feedbackMsg.textContent = feedback;
        feedbackMsg.style.color = color;

        switchScreen(resultScreen);
    }

    function resetGame() {
        switchScreen(startScreen);
    }

    function switchScreen(screenToShow) {
        // Hide all screens
        [startScreen, playingScreen, resultScreen].forEach(screen => {
            screen.classList.remove('active');
        });

        // Show requested screen
        screenToShow.classList.add('active');
    }
});
