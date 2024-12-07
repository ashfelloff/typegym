document.addEventListener('DOMContentLoaded', () => {
    const aimTest = document.querySelector('.aim-test');
    const aimBox = document.querySelector('.aim-box');
    const target = document.querySelector('.target');
    const statsContainer = document.querySelector('.stats-container');

    let isActive = false;
    let timeLeft = 10;
    let startTime;
    let animationFrame;
    let hits = 0;

    function spawnTarget() {
        const testRect = aimTest.getBoundingClientRect();
        const targetSize = 20; // Size of target in pixels
        
        // Calculate random position within bounds
        const x = Math.random() * (testRect.width - targetSize * 2) + targetSize;
        const y = Math.random() * (testRect.height - targetSize * 2) + targetSize;
        
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        target.classList.add('active');
    }

    function updateTimer() {
        if (isActive) {
            timeLeft = Math.max(0, 10 - (Date.now() - startTime) / 1000);
            aimBox.textContent = timeLeft.toFixed(1) + 's';
            
            if (timeLeft > 0) {
                animationFrame = requestAnimationFrame(updateTimer);
            } else {
                endGame();
            }
        }
    }

    function startGame() {
        isActive = true;
        hits = 0;
        timeLeft = 10;
        startTime = Date.now();
        aimBox.textContent = '10.0s';
        aimBox.style.opacity = '0.7';
        spawnTarget();
        updateTimer();
    }

    function endGame() {
        isActive = false;
        cancelAnimationFrame(animationFrame);
        target.classList.remove('active');
        aimBox.textContent = 'Click to restart';
        aimBox.style.opacity = '0.7';
        statsContainer.classList.add('visible');
    }

    target.addEventListener('click', (e) => {
        if (isActive) {
            hits++;
            target.classList.add('hit');
            setTimeout(() => {
                target.classList.remove('hit');
                spawnTarget();
            }, 100);
            e.stopPropagation();
        }
    });

    aimTest.addEventListener('click', () => {
        if (!isActive) {
            statsContainer.classList.remove('visible');
            startGame();
        }
    });
}); 