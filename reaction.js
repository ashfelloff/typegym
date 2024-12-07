document.addEventListener('DOMContentLoaded', () => {
    const reactionBox = document.querySelector('.reaction-box');
    const reactionTest = document.querySelector('.reaction-test');
    const statsContainer = document.querySelector('.stats-container');
    let currentChart = null;

    let state = 'idle'; // idle, waiting, ready, finished
    let startTime;
    let waitTimeout;
    let reactionTimes = [];
    const maxTests = 5;
    let currentTest = 0;

    function getRandomWaitTime() {
        return Math.floor(Math.random() * 4000) + 1000; // 1-5 seconds
    }

    function getSpeedRating(ms) {
        if (ms < 200) return 'fast';
        if (ms < 300) return 'avg';
        return 'slow';
    }

    function startTest() {
        if (state === 'idle') {
            state = 'waiting';
            reactionTest.classList.add('waiting');
            reactionBox.textContent = 'Wait for green...';
            
            waitTimeout = setTimeout(() => {
                state = 'ready';
                startTime = Date.now();
                reactionTest.classList.remove('waiting');
                reactionTest.classList.add('ready');
                reactionBox.textContent = 'Click!';
            }, getRandomWaitTime());
        }
    }

    function updateStats(reactionTime) {
        document.getElementById('msValue').textContent = reactionTime;
        
        if (reactionTimes.length > 0) {
            const avg = Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length);
            document.getElementById('avgValue').textContent = avg;
            document.getElementById('speedValue').textContent = getSpeedRating(avg);
        }
    }

    function createChart() {
        const ctx = document.getElementById('statsChart').getContext('2d');
        
        if (currentChart) {
            currentChart.destroy();
        }

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: reactionTimes.map((_, i) => `Test ${i + 1}`),
                datasets: [{
                    label: 'Reaction Time',
                    data: reactionTimes,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    tension: 0.4,
                    pointRadius: 0
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
                        max: 500,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            stepSize: 100
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
                        displayColors: false,
                        callbacks: {
                            title: (tooltipItems) => {
                                return `Test ${tooltipItems[0].dataIndex + 1}`;
                            },
                            label: (context) => {
                                return `${context.parsed.y}ms`;
                            }
                        }
                    }
                }
            }
        });
    }

    function handleClick() {
        if (state === 'idle') {
            currentTest = 0;
            reactionTimes = [];
            statsContainer.classList.remove('visible');
            startTest();
        }
        else if (state === 'waiting') {
            clearTimeout(waitTimeout);
            state = 'idle';
            reactionTest.classList.remove('waiting');
            reactionBox.textContent = 'Too early! Click to retry';
        }
        else if (state === 'ready') {
            const reactionTime = Date.now() - startTime;
            reactionTimes.push(reactionTime);
            currentTest++;

            updateStats(reactionTime);

            reactionTest.classList.remove('ready');
            reactionTest.classList.add('clicked');
            
            if (currentTest < maxTests) {
                state = 'idle';
                reactionBox.textContent = `${reactionTime}ms - Click to continue`;
                setTimeout(() => {
                    reactionTest.classList.remove('clicked');
                }, 50);
            } else {
                state = 'finished';
                createChart();
                statsContainer.classList.add('visible');
                reactionTest.style.pointerEvents = 'none';
                reactionBox.textContent = 'Wait...';
                
                setTimeout(() => {
                    reactionBox.textContent = 'Click to restart';
                    reactionTest.classList.remove('clicked');
                    reactionTest.style.pointerEvents = 'auto';
                    state = 'idle';
                }, 2000);
            }
        }
    }

    reactionTest.addEventListener('mousedown', handleClick);
    reactionTest.addEventListener('selectstart', (e) => e.preventDefault());
});