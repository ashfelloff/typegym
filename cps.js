document.addEventListener('DOMContentLoaded', () => {
    const cpsBox = document.querySelector('.cps-box');
    const cpsTest = document.querySelector('.cps-test');
    const statsContainer = document.querySelector('.stats-container');
    let currentChart = null;

    let isActive = false;
    let clicks = 0;
    let startTime;
    let timeLeft = 10;
    let timeInterval;
    let clickTimes = [];
    let cpsHistory = [];
    let timeHistory = [];

    function startTest() {
        if (!isActive) {
            statsContainer.classList.remove('visible');
            
            clickTimes = [];
            cpsHistory = [];
            timeHistory = [];
            timeLeft = 10;
            
            if (currentChart) {
                currentChart.destroy();
                currentChart = null;
            }

            isActive = true;
            clicks = 0;
            startTime = Date.now();
            
            cpsTest.classList.add('active');
            updateStats();
            
            cpsBox.textContent = '10s';
            
            timeInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                timeLeft = Math.max(0, 10 - elapsed);
                cpsBox.textContent = timeLeft + 's';
                
                if (timeLeft === 0) {
                    endTest();
                }
            }, 10);
        }
    }

    function handleClick() {
        if (!isActive) {
            timeLeft = 10;
            startTest();
            return;
        }
        
        if (isActive && timeLeft > 0) {
            clicks++;
            clickTimes.push(Date.now());
            
            const timeElapsed = (Date.now() - startTime) / 1000;
            const currentCPS = clicks / timeElapsed;
            cpsHistory.push(currentCPS);
            timeHistory.push(timeElapsed);
            
            document.getElementById('clicksValue').textContent = clicks;
            
            cpsTest.classList.add('clicked');
            setTimeout(() => cpsTest.classList.remove('clicked'), 50);
            
            updateStats();
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
                labels: timeHistory,
                datasets: [{
                    label: 'CPS',
                    data: cpsHistory,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
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
                        max: 15,  // Adjusted for typical CPS ranges
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            stepSize: 5
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
                                return `${(10 - time).toFixed(1)}s`;  // Countdown from 10 seconds
                            },
                            label: (context) => {
                                return `CPS: ${context.parsed.y.toFixed(1)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    function getSpeedRating(cps) {
        if (cps < 4) return 'slow';
        if (cps < 7) return 'avg';
        return 'fast';
    }

    function endTest() {
        isActive = false;
        clearInterval(timeInterval);
        
        cpsTest.classList.remove('active');
        cpsBox.textContent = 'Wait...';
        
        const finalCPS = (clicks / 10).toFixed(1);
        document.getElementById('cpsValue').textContent = finalCPS;
        document.getElementById('clicksValue').textContent = clicks;
        document.getElementById('speedValue').textContent = getSpeedRating(parseFloat(finalCPS));
        
        createChart();
        statsContainer.classList.add('visible');

        cpsTest.style.pointerEvents = 'none';
        
        setTimeout(() => {
            cpsBox.textContent = 'Click to restart';
            cpsTest.style.pointerEvents = 'auto';
        }, 2000);
    }

    function updateStats() {
        document.getElementById('cpsValue').textContent = '0.0';
        document.getElementById('clicksValue').textContent = '0';
        document.getElementById('speedValue').textContent = 'slow';
    }

    cpsTest.addEventListener('mousedown', handleClick);
    cpsTest.addEventListener('selectstart', (e) => e.preventDefault());
});