const textDisplay = document.querySelector('.text-display');
const inputField = document.querySelector('#input-field');
const statsContainer = document.querySelector('.stats-container');

const typingTexts = {
    quotes: [
        "The only way to do great work is to love what you do.",
        "Innovation distinguishes between a leader and a follower.",
        "Stay hungry, stay foolish.",
        "Quality is more important than quantity.",
        "Simplicity is the ultimate sophistication."
    ],
    
    programming: [
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "First, solve the problem. Then, write the code.",
        "Code is like humor. When you have to explain it, it's bad.",
        "Programming isn't about what you know; it's about what you can figure out.",
        "The best error message is the one that never shows up."
    ],
    
    pangrams: [
        "The quick brown fox jumps over the lazy dog.",
        "Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump.",
        "The five boxing wizards jump quickly.",
        "Quick zephyrs blow, vexing daft Jim."
    ],
    
    science: [
        "The good thing about science is that it's true whether or not you believe in it.",
        "In science, the credit goes to the man who convinces the world, not to whom the idea first occurs.",
        "Science is not only compatible with spirituality; it is a profound source of spirituality.",
        "The science of today is the technology of tomorrow.",
        "Science never solves a problem without creating ten more."
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.querySelector('.text-display');
    const inputField = document.querySelector('#input-field');
    const statsContainer = document.querySelector('.stats-container');
    const typeTest = document.querySelector('.type-test');

    const texts = [
        "Innovation distinguishes between a leader and a follower.",
        "Stay hungry, stay foolish.",
        "Quality is more important than quantity.",
        "Simplicity is the ultimate sophistication.",
        "First, solve the problem. Then, write the code."
    ];

    let currentText = '';
    let startTime = null;
    let currentChart = null;
    let wpmHistory = [];
    let timeHistory = [];
    let isTyping = false;

    function updateCharacters() {
        const inputChars = inputField.value.split('');
        const textChars = currentText.split('');
        const charElements = document.querySelectorAll('.char');

        charElements.forEach((charEl, i) => {
            if (i < inputChars.length) {
                charEl.classList.remove('current');
                if (inputChars[i] === textChars[i]) {
                    charEl.classList.add('correct');
                    charEl.classList.remove('incorrect');
                } else {
                    charEl.classList.add('incorrect');
                    charEl.classList.remove('correct');
                }
            } else if (i === inputChars.length) {
                charEl.classList.add('current');
                charEl.classList.remove('correct', 'incorrect');
            } else {
                charEl.classList.remove('current', 'correct', 'incorrect');
            }
        });
    }

    function initializeTest() {
        currentText = texts[Math.floor(Math.random() * texts.length)];
        textDisplay.innerHTML = currentText.split('').map(char => 
            `<span class="char">${char}</span>`
        ).join('');
        
        inputField.value = '';
        startTime = null;
        wpmHistory = [];
        timeHistory = [];
        isTyping = false;
        statsContainer.classList.remove('visible');
        typeTest.classList.remove('completed');
        inputField.focus();
        updateCharacters();
    }

    function checkInput() {
        if (!startTime && inputField.value.length > 0) {
            startTime = Date.now();
            isTyping = true;
        }

        if (isTyping) {
            const timeElapsed = (Date.now() - startTime) / 1000;
            const wordsTyped = inputField.value.length / 5;
            const currentWPM = Math.round((wordsTyped / timeElapsed) * 60);
            
            // Record data point
            wpmHistory.push(currentWPM);
            timeHistory.push(timeElapsed);
        }

        if (inputField.value.length === currentText.length) {
            isTyping = false;
            showStats();
            typeTest.classList.add('completed');
            statsContainer.classList.add('visible');
        }

        updateCharacters();
    }

    function showStats() {
        const endTime = Date.now();
        const timeElapsed = (endTime - startTime) / 1000;
        const wordsTyped = inputField.value.length / 5;
        const wpm = Math.round((wordsTyped / timeElapsed) * 60);
        
        const correctChars = Array.from(document.querySelectorAll('.char.correct')).length;
        const accuracy = Math.round((correctChars / currentText.length) * 100);

        document.getElementById('wpmValue').textContent = wpm;
        document.getElementById('accuracyValue').textContent = accuracy + '%';
        document.getElementById('charactersValue').textContent = currentText.length;

        createChart();
    }

    function createChart() {
        const ctx = document.getElementById('statsChart').getContext('2d');
        
        if (currentChart) {
            currentChart.destroy();
        }

        // Calculate raw WPM (without accuracy penalty)
        const rawWPM = wpmHistory.map((wpm, i) => {
            const timeElapsed = timeHistory[i];
            const totalChars = inputField.value.length;
            return Math.round((totalChars / 5) / (timeElapsed / 60));
        });

        // Calculate accuracy over time
        const accuracyHistory = wpmHistory.map((_, i) => {
            const inputChars = inputField.value.slice(0, i * 5).split('');
            const textChars = currentText.slice(0, i * 5).split('');
            const correct = inputChars.filter((char, index) => char === textChars[index]).length;
            return Math.round((correct / inputChars.length) * 100);
        });

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeHistory,
                datasets: [{
                    label: 'WPM',
                    data: wpmHistory,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }, {
                    label: 'Accuracy',
                    data: accuracyHistory,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }, {
                    label: 'Raw',
                    data: rawWPM,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            stepSize: 50
                        }
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true,
                        callbacks: {
                            title: (tooltipItems) => {
                                const time = timeHistory[tooltipItems[0].dataIndex];
                                return `${time.toFixed(1)}s`;
                            },
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += Math.round(context.parsed.y);
                                    if (label.includes('Accuracy')) {
                                        label += '%';
                                    }
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    inputField.addEventListener('input', checkInput);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            initializeTest();
        } else {
            inputField.focus();
        }
    });

    initializeTest();
});
