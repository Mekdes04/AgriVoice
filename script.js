document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));

    // --- Waitlist Logic ---
    const waitlistForm = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('waitlist-success');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                country: document.getElementById('country').value,
                date: new Date().toISOString()
            };

            // Store in localStorage
            const existing = JSON.parse(localStorage.getItem('agri_voice_waitlist') || '[]');
            existing.push(data);
            localStorage.setItem('agri_voice_waitlist', JSON.stringify(existing));

            // Visual feedback
            waitlistForm.style.display = 'none';
            successMsg.style.display = 'block';
        });
    }

    // --- AI Dashboard Logic ---
    const startBtn = document.getElementById('start-btn');
    const initialState = document.getElementById('initial-state');
    const callState = document.getElementById('call-state');
    const queryText = document.getElementById('query-text');
    const progressBar = document.getElementById('progress-bar');
    const stepLabel = document.getElementById('current-step-label');
    const probVal = document.getElementById('prob-val');
    const dialectVal = document.getElementById('dialect-val');
    const diagnosisPanel = document.getElementById('diagnosis-panel');
    const diagnosisPlaceholder = document.getElementById('diagnosis-placeholder');
    const bars = document.querySelectorAll('.bar');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            initialState.style.display = 'none';
            callState.style.display = 'flex';
            runFiveStepSimulation();
        });
    }

    async function runFiveStepSimulation() {
        const steps = [
            { id: 1, label: "Connecting call...", duration: 2000, color: "#10B981" },
            { id: 2, label: "Farmer speaking...", duration: 4000, color: "#10B981" },
            { id: 3, label: "Translating local language...", duration: 3000, color: "#10B981" },
            { id: 4, label: "Analyzing disease...", duration: 3000, color: "#10B981" },
            { id: 5, label: "Generating solution...", duration: 2000, color: "#10B981" }
        ];

        let vizInterval;

        for (const step of steps) {
            // Update UI for the step
            stepLabel.innerText = step.label;
            document.getElementById(`step-${step.id}`).classList.add('active');
            
            // Progress Bar Reset & Fill
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            await delay(50);
            progressBar.style.transition = `width ${step.duration/1000}s linear`;
            progressBar.style.width = '100%';

            // Step-specific Actions
            if (step.id === 2) {
                // Intense waveform
                vizInterval = setInterval(() => {
                    bars.forEach(bar => {
                        bar.style.height = `${Math.floor(Math.random() * 140) + 40}px`;
                    });
                }, 80);
            }

            if (step.id === 3) {
                // Transcription reveal
                const query = '"Yellowing leaves on my wheat stalks... possible rust."';
                let current = "";
                for(let char of query) {
                    current += char;
                    queryText.innerText = current;
                    await delay(40);
                }
            }

            if (step.id === 4) {
                // Telemetry update
                updateTelemetry(probVal, 98.42);
                updateTelemetry(dialectVal, 94.15);
            }

            if (step.id === 5) {
                // Stop waveform
                clearInterval(vizInterval);
                bars.forEach(bar => bar.style.height = "20px");
            }

            await delay(step.duration);
        }

        // Final Result
        diagnosisPlaceholder.style.display = 'none';
        diagnosisPanel.style.display = 'block';
        diagnosisPanel.classList.add('show');
    }

    async function updateTelemetry(element, target) {
        let current = 0;
        const step = target / 20;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                element.innerText = `${target.toFixed(2)}%`;
                clearInterval(interval);
            } else {
                element.innerText = `${current.toFixed(2)}%`;
            }
        }, 50);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
