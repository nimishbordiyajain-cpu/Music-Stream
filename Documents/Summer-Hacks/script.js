// ==================== MAIN APP STATE ====================
const app = {
    currentScreen: 'home',
    currentRoutine: null,
    currentStep: 0,
    routineTimeout: null,
    timerInterval: null,
    timerStart: null,
    titleTapCount: 0,
    titleTapTimeout: null,
    data: null,
    baseline: null,
    actionConfirming: null,
    darkMode: false,
    remindersEnabled: false,
    reminderChecked: false,

    // Motivational messages
    morningMotivations: [
        "You showed up today. 💪",
        "That matters. 🌟",
        "You're building momentum. ⏰",
        "Small steps, big impact. 🚀",
        "Today is yours to shape. 🎯",
        "You've got this. ✨",
        "Every day counts. 📈",
        "Showing up is the hardest part. ✓"
    ],
    nightMotivations: [
        "You made it through another day. 💚",
        "Rest is productive too. 🌙",
        "Tomorrow is a fresh start. 🔄",
        "You did your best today. ⭐",
        "Sleep well, you've earned it. 😴",
        "Reflection is strength. 🧘",
        "Be proud of yourself. 🏆",
        "You're taking care of you. 💝"
    ],

    // ==================== INITIALIZATION ====================
    init() {
        this.loadData();
        this.loadSettings();
        this.setupEventListeners();
        this.applySavedTheme();
        this.updateHome();
        this.displayDate();
        this.checkReminders();
        setInterval(() => this.checkReminders(), 60000); // Check every minute
    },

    loadData() {
        this.data = JSON.parse(localStorage.getItem('burnoutAppData')) || {};
        this.baseline = JSON.parse(localStorage.getItem('burnoutAppBaseline')) || null;
    },

    saveData() {
        localStorage.setItem('burnoutAppData', JSON.stringify(this.data));
    },

    saveBaseline() {
        localStorage.setItem('burnoutAppBaseline', JSON.stringify(this.baseline));
    },

    loadSettings() {
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.remindersEnabled = localStorage.getItem('remindersEnabled') !== 'false';
    },

    applySavedTheme() {
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggleText').textContent = 'Disable Dark Mode';
        }
        if (this.remindersEnabled) {
            document.getElementById('remindersToggleText').textContent = 'Disable Reminders';
        }
    },

    setupEventListeners() {
        document.getElementById('appTitle').addEventListener('click', () => this.handleTitleTap());
        document.getElementById('backBtn').addEventListener('click', () => this.goHome());
        document.getElementById('settingsBtn').addEventListener('click', () => this.goToSettings());
        document.getElementById('darkModeBtn').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('riskIndicator').addEventListener('click', () => this.goToDashboard());

        // Sliders
        document.getElementById('sleepHours').addEventListener('input', (e) => {
            document.getElementById('sleepHoursValue').textContent = e.target.value + 'h';
        });
        document.getElementById('sleepQuality').addEventListener('input', (e) => {
            document.getElementById('sleepQualityValue').textContent = e.target.value + '/10';
        });
        document.getElementById('morningEnergy').addEventListener('input', (e) => {
            document.getElementById('morningEnergyValue').textContent = e.target.value + '/10';
        });
        document.getElementById('morningMood').addEventListener('input', (e) => {
            document.getElementById('morningMoodValue').textContent = e.target.value + '/10';
        });
        document.getElementById('screenTime').addEventListener('input', (e) => {
            document.getElementById('screenTimeValue').textContent = e.target.value + 'h';
        });
        document.getElementById('nightMood').addEventListener('input', (e) => {
            document.getElementById('nightMoodValue').textContent = e.target.value + '/10';
        });
    },

    // ==================== DARK MODE ====================
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        document.body.classList.toggle('dark-mode');
        document.getElementById('darkModeToggleText').textContent = 
            this.darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode';
        this.showNotification('Dark mode ' + (this.darkMode ? 'enabled' : 'disabled'), 'success');
    },

    // ==================== REMINDERS ====================
    toggleReminders() {
        this.remindersEnabled = !this.remindersEnabled;
        localStorage.setItem('remindersEnabled', this.remindersEnabled);
        document.getElementById('remindersToggleText').textContent = 
            this.remindersEnabled ? 'Disable Reminders' : 'Enable Reminders';
        this.showNotification('Reminders ' + (this.remindersEnabled ? 'enabled' : 'disabled'), 'success');
    },

    checkReminders() {
        if (!this.remindersEnabled || this.reminderChecked) return;

        const today = this.getDateString(new Date());
        const todayData = this.data[today] || {};
        const now = new Date();
        const hour = now.getHours();

        // Morning reminder at 11am
        if (hour === 11 && !todayData.morning) {
            this.showNotification('⏰ Time to start your morning routine?', 'warning');
            this.reminderChecked = true;
            setTimeout(() => { this.reminderChecked = false; }, 3600000); // Reset after 1 hour
        }

        // Night reminder at 11pm
        if (hour === 23 && !todayData.night) {
            this.showNotification('🌙 Ready to close the day with your night routine?', 'warning');
            this.reminderChecked = true;
            setTimeout(() => { this.reminderChecked = false; }, 3600000);
        }
    },

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.innerHTML = `
            <span>${message}</span>
            <span class="notification-close" onclick="this.parentElement.remove()">✕</span>
        `;
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    },

    // ==================== NAVIGATION ====================
    goToScreen(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenName + 'Screen').classList.add('active');
        this.currentScreen = screenName;

        const header = document.getElementById('header');
        const backBtn = document.getElementById('backBtn');
        const headerTitle = document.getElementById('headerTitle');

        if (screenName === 'home') {
            header.style.display = 'none';
        } else {
            header.style.display = 'flex';
            if (screenName === 'routine') {
                backBtn.style.display = 'none';
                headerTitle.textContent = this.currentRoutine === 'morning' ? 'Morning Routine' : 'Night Routine';
            } else {
                backBtn.style.display = 'flex';
                headerTitle.textContent = screenName.charAt(0).toUpperCase() + screenName.slice(1);
            }
        }
    },

    goHome() {
        this.stopTimer();
        this.goToScreen('home');
        this.updateHome();
    },

    goToDashboard() {
        this.goToScreen('dashboard');
        this.updateDashboard();
    },

    goToSettings() {
        this.goToScreen('settings');
    },

    // ==================== HOME SCREEN ====================
    updateHome() {
        const today = this.getDateString(new Date());
        const todayData = this.data[today] || {};

        const morningStatus = document.getElementById('morningCard');
        const nightStatus = document.getElementById('nightCard');

        if (todayData.morning) {
            morningStatus.classList.add('done');
        } else {
            morningStatus.classList.remove('done');
        }

        if (todayData.night) {
            nightStatus.classList.add('done');
        } else {
            nightStatus.classList.remove('done');
        }

        this.updateRiskIndicator();
        this.updateStreak();
    },

    updateRiskIndicator() {
        const riskScore = this.calculateRiskScore();
        document.getElementById('riskScore').textContent = riskScore.score;
        const gauge = document.getElementById('riskGauge');
        gauge.className = 'risk-gauge ' + riskScore.level;

        const levelLabels = {
            'safe': 'Stable',
            'watch': 'Strained',
            'danger': 'At Risk'
        };
        document.getElementById('riskStatus').textContent = levelLabels[riskScore.level];
    },

    updateStreak() {
        let streak = 0;
        let checkDate = new Date();
        while (true) {
            const dateStr = this.getDateString(checkDate);
            const dayData = this.data[dateStr];
            if (dayData && (dayData.morning || dayData.night)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        document.getElementById('streakCount').textContent = streak;
    },

    displayDate() {
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateStr = today.toLocaleDateString('en-US', options);
        document.getElementById('dateBadge').textContent = dateStr;
        document.getElementById('greetingDate').textContent = dateStr;
        document.getElementById('dashboardDate').textContent = dateStr;
    },

    // ==================== ROUTINE SCREEN ====================
    startRoutine(type) {
        this.currentRoutine = type;
        this.currentStep = 0;
        this.goToScreen('routine');
        this.updateRoutineUI();
        this.startTimer();
        this.resetRoutineForm();
    },

    updateRoutineUI() {
        const steps = document.querySelectorAll(`.routine-step[data-routine="${this.currentRoutine}"]`);
        const progressBar = document.getElementById('progressBar');
        progressBar.innerHTML = '';

        steps.forEach((step, idx) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (idx === this.currentStep) dot.classList.add('active');
            if (idx < this.currentStep) dot.classList.add('done');
            progressBar.appendChild(dot);
        });

        document.querySelectorAll('.routine-step').forEach((step, idx) => {
            step.classList.remove('active');
            if (step.dataset.routine === this.currentRoutine && parseInt(step.dataset.step) === this.currentStep) {
                step.classList.add('active');
            }
        });
    },

    nextStep() {
        const steps = document.querySelectorAll(`.routine-step[data-routine="${this.currentRoutine}"]`);
        if (this.currentStep < steps.length - 1) {
            this.currentStep++;
            this.updateRoutineUI();
        }
    },

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateRoutineUI();
        }
    },

    selectChoice(button, inputId) {
        const siblings = button.parentElement.querySelectorAll('.choice-button');
        siblings.forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        document.getElementById(inputId).value = button.dataset.value;
    },

    getRandomMotivation(type) {
        const messages = type === 'morning' ? this.morningMotivations : this.nightMotivations;
        return messages[Math.floor(Math.random() * messages.length)];
    },

    resetRoutineForm() {
        document.getElementById('sleepHours').value = 7;
        document.getElementById('sleepQuality').value = 6;
        document.getElementById('morningEnergy').value = 5;
        document.getElementById('morningMood').value = 6;
        document.getElementById('morningNote').value = '';
        document.getElementById('morningIntention').value = '';
        document.getElementById('nightActivity').value = '';
        document.getElementById('screenTime').value = 6;
        document.getElementById('nightSocial').value = '';
        document.getElementById('nightMood').value = 6;
        document.getElementById('dayIdentity').value = '';
        document.getElementById('nightIntention').value = '';

        document.querySelectorAll('.choice-button').forEach(b => b.classList.remove('selected'));

        document.getElementById('sleepHoursValue').textContent = '7h';
        document.getElementById('sleepQualityValue').textContent = '6/10';
        document.getElementById('morningEnergyValue').textContent = '5/10';
        document.getElementById('morningMoodValue').textContent = '6/10';
        document.getElementById('screenTimeValue').textContent = '6h';
        document.getElementById('nightMoodValue').textContent = '6/10';
    },

    completeRoutine() {
        const today = this.getDateString(new Date());
        if (!this.data[today]) {
            this.data[today] = {};
        }

        if (this.currentRoutine === 'morning') {
            this.data[today].morning = {
                sleepHours: parseFloat(document.getElementById('sleepHours').value),
                sleepQuality: parseInt(document.getElementById('sleepQuality').value),
                energy: parseInt(document.getElementById('morningEnergy').value),
                mood: parseInt(document.getElementById('morningMood').value),
                note: document.getElementById('morningNote').value,
                intention: document.getElementById('morningIntention').value,
                timestamp: new Date().toISOString(),
            };
        } else {
            this.data[today].night = {
                activity: document.getElementById('nightActivity').value,
                screenTime: parseFloat(document.getElementById('screenTime').value),
                social: document.getElementById('nightSocial').value,
                mood: parseInt(document.getElementById('nightMood').value),
                dayIdentity: document.getElementById('dayIdentity').value,
                intention: document.getElementById('nightIntention').value,
                timestamp: new Date().toISOString(),
            };
        }

        this.saveData();
        this.computeBaseline();
        this.stopTimer();
        this.showNotification(this.getRandomMotivation(this.currentRoutine), 'success');
        this.currentRoutine = null;
        this.updateHome();
        setTimeout(() => this.goHome(), 1500);
    },

    startTimer() {
        this.timerStart = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.timerStart) / 1000);
            const remaining = Math.max(0, 240 - elapsed);
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            const timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;
            const timerEl = document.getElementById('routineTimer');
            if (timerEl) timerEl.textContent = timeStr;
        }, 100);
    },

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    },

    // ==================== DETECTION ENGINE ====================
    calculateRiskScore() {
        const breakdown = this.getRiskBreakdown();
        let totalScore = 0;

        const weights = {
            sleep: 1,
            mood: 1,
            activity: 0.8,
            screen: 0.7,
            social: 0.9,
            adherence: 1
        };

        for (const [signal, score] of Object.entries(breakdown)) {
            totalScore += score * (weights[signal] || 1);
        }

        totalScore = totalScore / Object.keys(breakdown).length;

        const elevatedSignals = Object.values(breakdown).filter(s => s > 50).length;
        if (elevatedSignals >= 3) {
            totalScore = Math.min(100, totalScore * 1.3);
        }

        if (breakdown.adherence >= 90) {
            totalScore = Math.min(100, totalScore + 15);
        }

        const score = Math.round(totalScore);
        let level = 'safe';
        if (score >= 70) level = 'danger';
        else if (score >= 40) level = 'watch';

        return { score, level, breakdown };
    },

    getRiskBreakdown() {
        const baseline = this.getBaseline();
        const breakdown = {
            sleep: 0,
            mood: 0,
            activity: 0,
            screen: 0,
            social: 0,
            adherence: 0
        };

        // Sleep drift
        const sleep7d = this.get7DayAverage('sleep');
        if (sleep7d) {
            const sleepDrop = ((baseline.sleep - sleep7d) / baseline.sleep) * 100;
            if (sleepDrop > 35) breakdown.sleep = 90;
            else if (sleepDrop > 20) breakdown.sleep = 70;
            else if (sleepDrop > 10) breakdown.sleep = 40;
        }

        // Mood drift
        const mood7d = this.get7DayAverage('mood');
        if (mood7d) {
            const moodDrop = baseline.mood - mood7d;
            if (moodDrop >= 3) breakdown.mood = 85;
            else if (moodDrop >= 2) breakdown.mood = 60;
            else if (moodDrop >= 1) breakdown.mood = 30;
        }

        // Activity
        const activity14d = this.get14DayActivity();
        if (activity14d !== null) {
            const activityDrop = ((baseline.activity - activity14d) / baseline.activity) * 100;
            if (activityDrop > 40) breakdown.activity = 70;
            else if (activityDrop > 20) breakdown.activity = 40;
        }

        // Screen time
        const screen7d = this.get7DayAverage('screen');
        if (screen7d) {
            const screenIncrease = ((screen7d - baseline.screen) / baseline.screen) * 100;
            if (screenIncrease > 50) breakdown.screen = 60;
            else if (screenIncrease > 25) breakdown.screen = 40;
        }

        // Social
        const social14d = this.get14DaySocial();
        if (social14d !== null) {
            const socialDrop = baseline.social - social14d;
            if (socialDrop >= 3) breakdown.social = 80;
            else if (socialDrop >= 2) breakdown.social = 50;
        }

        // Routine adherence
        const adherence = this.getAdherenceRisk();
        breakdown.adherence = adherence;

        return breakdown;
    },

    get7DayAverage(signal) {
        const dates = this.getLast7Days();
        const values = [];

        dates.forEach(date => {
            const dayData = this.data[date];
            if (dayData && dayData.morning) {
                if (signal === 'sleep') values.push(dayData.morning.sleepHours);
                else if (signal === 'mood') values.push(dayData.morning.mood);
            }
            if (dayData && dayData.night) {
                if (signal === 'screen') values.push(dayData.night.screenTime);
            }
        });

        return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : null;
    },

    get14DayActivity() {
        const dates = this.getLast14Days();
        let activeCount = 0;

        dates.forEach(date => {
            const dayData = this.data[date];
            if (dayData && dayData.night && dayData.night.activity && dayData.night.activity !== 'none') {
                activeCount++;
            }
        });

        return activeCount / dates.length;
    },

    get14DaySocial() {
        const dates = this.getLast14Days();
        const values = [];

        dates.forEach(date => {
            const dayData = this.data[date];
            if (dayData && dayData.night && dayData.night.social) {
                const val = dayData.night.social === 'meaningfully' ? 3 : dayData.night.social === 'briefly' ? 1 : 0;
                values.push(val);
            }
        });

        return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : null;
    },

    getAdherenceRisk() {
        const dates = this.getLast7Days();
        let missedDays = 0;
        let consecutiveMissed = 0;
        let maxConsecutive = 0;

        dates.forEach(date => {
            const dayData = this.data[date];
            if (!dayData || (!dayData.morning && !dayData.night)) {
                missedDays++;
                consecutiveMissed++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveMissed);
            } else {
                consecutiveMissed = 0;
            }
        });

        if (maxConsecutive >= 4) return 90;
        if (missedDays >= 5) return 80;
        if (missedDays >= 3) return 50;
        return 0;
    },

    getBaseline() {
        if (this.baseline) return this.baseline;

        const dates = this.getLast14Days();
        const sleepValues = [];
        const moodValues = [];
        const screenValues = [];
        let activeCount = 0;
        let socialValues = [];

        dates.forEach(date => {
            const dayData = this.data[date];
            if (dayData && dayData.morning) {
                sleepValues.push(dayData.morning.sleepHours);
                moodValues.push(dayData.morning.mood);
            }
            if (dayData && dayData.night) {
                screenValues.push(dayData.night.screenTime);
                if (dayData.night.activity && dayData.night.activity !== 'none') {
                    activeCount++;
                }
                if (dayData.night.social) {
                    const val = dayData.night.social === 'meaningfully' ? 3 : dayData.night.social === 'briefly' ? 1 : 0;
                    socialValues.push(val);
                }
            }
        });

        return {
            sleep: sleepValues.length > 0 ? sleepValues.reduce((a, b) => a + b) / sleepValues.length : 7.5,
            mood: moodValues.length > 0 ? moodValues.reduce((a, b) => a + b) / moodValues.length : 6.5,
            screen: screenValues.length > 0 ? screenValues.reduce((a, b) => a + b) / screenValues.length : 6,
            activity: 0.7,
            social: socialValues.length > 0 ? socialValues.reduce((a, b) => a + b) / socialValues.length : 1.5
        };
    },

    computeBaseline() {
        const dataArray = Object.keys(this.data);
        if (dataArray.length >= 14) {
            this.baseline = this.getBaseline();
            this.saveBaseline();
        }
    },

    getFindingsAndDiagnosis() {
        const breakdown = this.calculateRiskScore().breakdown;
        const findings = [];
        const signals = {};

        // Sleep findings
        const sleep7d = this.get7DayAverage('sleep');
        const baseline = this.getBaseline();
        if (sleep7d) {
            const sleepDrop = ((baseline.sleep - sleep7d) / baseline.sleep) * 100;
            if (sleepDrop > 20) {
                findings.push(`Sleep duration has dropped ${Math.round(sleepDrop)}% over the past 8 days`);
                signals.sleep = sleepDrop;
            }
        }

        // Mood findings
        const mood7d = this.get7DayAverage('mood');
        if (mood7d) {
            const moodDrop = baseline.mood - mood7d;
            if (moodDrop >= 2) {
                findings.push(`Your mood has drifted down by ${Math.round(moodDrop * 10) / 10} points`);
                signals.mood = moodDrop;
            }
        }

        // Activity findings
        const activity14d = this.get14DayActivity();
        if (activity14d < 0.5) {
            findings.push(`Movement has been low — less than half your usual activity`);
            signals.activity = true;
        }

        // Social findings
        const social14d = this.get14DaySocial();
        if (social14d !== null && social14d < baseline.social - 1) {
            findings.push(`You've had less social contact than usual`);
            signals.social = true;
        }

        // Pattern detection
        let diagnosis = 'unknown';
        let rootCause = 'general-depletion';
        let actions = [];

        if (signals.sleep && signals.mood) {
            rootCause = 'sleep-debt-spiral';
            diagnosis = 'This looks like sleep deprivation compounding itself — poor sleep → mood drops → harder to recover.';
            actions = [
                'This week, protect one full 8h sleep night',
                'Avoid screens 1 hour before bed'
            ];
        }

        if (signals.social && signals.mood) {
            rootCause = 'social-isolation';
            diagnosis = 'You\'ve stepped back from people, and it\'s affecting your mood.';
            actions = [
                'Reach out to one person this week for meaningful connection',
                'Schedule something social non-negotiably'
            ];
        }

        if (signals.sleep && signals.activity) {
            rootCause = 'work-week-overload';
            diagnosis = 'High demands are cutting into sleep and movement time.';
            actions = [
                'Block one meeting-free afternoon this week',
                'Take a 20-minute walk daily, non-negotiable'
            ];
        }

        if (breakdown.screen > 50) {
            rootCause = 'screen-escape-loop';
            diagnosis = 'Screen time is elevated — possibly using it to escape stress.';
            actions = [
                'Set a hard screen-off time (e.g., 10pm)',
                'Replace one hour of scrolling with something tactile'
            ];
        }

        if (Object.keys(signals).length === 0) {
            diagnosis = 'You\'re holding up well across all signals.';
            actions = ['Keep doing what you\'re doing'];
        }

        return {
            findings,
            diagnosis,
            rootCause,
            actions
        };
    },

    // ==================== DASHBOARD ====================
    updateDashboard() {
        const { score, level, breakdown } = this.calculateRiskScore();
        const levelLabels = {
            'safe': 'Stable',
            'watch': 'Strained',
            'danger': 'At Risk'
        };

        document.getElementById('dashboardRiskCircle').textContent = score;
        document.getElementById('dashboardRiskCircle').className = 'risk-circle ' + level;
        document.getElementById('riskLevelLabel').textContent = levelLabels[level];
        document.getElementById('dashboardRiskLevel').textContent = levelLabels[level];
        document.getElementById('dashboardRiskDescription').textContent = 'Based on your last 7-14 days of data.';

        this.updateSignalGrid();
        this.updateFindings();
        this.updateInsight();
    },

    updateSignalGrid() {
        const dates = this.getLast7Days();
        const baseline = this.getBaseline();
        const grid = document.getElementById('signalGrid');
        grid.innerHTML = '';

        const signals = ['Sleep', 'Mood', 'Activity', 'Screen', 'Social'];

        signals.forEach(signal => {
            const row = document.createElement('div');
            row.className = 'grid-row';

            const label = document.createElement('div');
            label.className = 'grid-header-label grid-signal-label';
            label.textContent = signal;
            row.appendChild(label);

            dates.forEach((date, idx) => {
                const dayData = this.data[date];
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                let cellValue = null;
                let cellStatus = 'missing';

                if (signal === 'Sleep' && dayData && dayData.morning) {
                    cellValue = dayData.morning.sleepHours;
                    const drop = ((baseline.sleep - cellValue) / baseline.sleep) * 100;
                    cellStatus = drop > 25 ? 'critical' : drop > 10 ? 'warning' : 'good';
                    cell.textContent = cellValue.toFixed(1);
                } else if (signal === 'Mood' && dayData && dayData.morning) {
                    cellValue = dayData.morning.mood;
                    const drop = baseline.mood - cellValue;
                    cellStatus = drop > 2 ? 'critical' : drop > 1 ? 'warning' : 'good';
                    cell.textContent = cellValue;
                } else if (signal === 'Activity' && dayData && dayData.night) {
                    cellStatus = dayData.night.activity && dayData.night.activity !== 'none' ? 'good' : 'critical';
                    cell.textContent = cellStatus === 'good' ? '✓' : '-';
                } else if (signal === 'Screen' && dayData && dayData.night) {
                    cellValue = dayData.night.screenTime;
                    const increase = ((cellValue - baseline.screen) / baseline.screen) * 100;
                    cellStatus = increase > 50 ? 'critical' : increase > 25 ? 'warning' : 'good';
                    cell.textContent = cellValue.toFixed(1);
                } else if (signal === 'Social' && dayData && dayData.night) {
                    const val = dayData.night.social === 'meaningfully' ? 3 : dayData.night.social === 'briefly' ? 1 : 0;
                    cellStatus = val >= 2 ? 'good' : val >= 1 ? 'warning' : 'critical';
                    cell.textContent = ['−', '◐', '◑'][val] || '−';
                }

                cell.className = 'grid-cell ' + cellStatus;
                row.appendChild(cell);
            });

            grid.appendChild(row);
        });
    },

    updateFindings() {
        const { findings } = this.getFindingsAndDiagnosis();
        const findingsEl = document.getElementById('findings');
        findingsEl.innerHTML = '';

        if (findings.length === 0) {
            const finding = document.createElement('div');
            finding.className = 'finding';
            finding.textContent = 'All signals look good. Keep maintaining your routine.';
            findingsEl.appendChild(finding);
        } else {
            findings.forEach(f => {
                const finding = document.createElement('div');
                finding.className = 'finding';
                finding.textContent = f;
                findingsEl.appendChild(finding);
            });
        }
    },

    updateInsight() {
        const { diagnosis, actions } = this.getFindingsAndDiagnosis();
        const insightEl = document.getElementById('insight');
        insightEl.innerHTML = '';

        const diagEl = document.createElement('div');
        diagEl.className = 'insight-diagnosis';
        diagEl.textContent = diagnosis;
        insightEl.appendChild(diagEl);

        const actionsEl = document.createElement('div');
        actionsEl.className = 'insight-actions';

        actions.forEach(action => {
            const actionEl = document.createElement('div');
            actionEl.className = 'insight-action';
            actionEl.textContent = '→ ' + action;
            actionsEl.appendChild(actionEl);
        });

        insightEl.appendChild(actionsEl);
    },

    // ==================== UTILITIES ====================
    getDateString(date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    },

    getLast7Days() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(this.getDateString(d));
        }
        return dates;
    },

    getLast14Days() {
        const dates = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(this.getDateString(d));
        }
        return dates;
    },

    // ==================== SETTINGS & DATA ====================
    handleTitleTap() {
        this.titleTapCount++;
        clearTimeout(this.titleTapTimeout);
        this.titleTapTimeout = setTimeout(() => {
            this.titleTapCount = 0;
        }, 500);

        if (this.titleTapCount === 3) {
            this.titleTapCount = 0;
            this.seedDemoData();
        }
    },

    showClearDataModal() {
        this.actionConfirming = 'clearData';
        document.getElementById('modalTitle').textContent = 'Clear All Data?';
        document.getElementById('modalText').textContent = 'This cannot be undone. You\'ll lose all your check-ins and insights.';
        document.getElementById('modal').classList.add('active');
    },

    confirmAction() {
        if (this.actionConfirming === 'clearData') {
            localStorage.clear();
            this.data = {};
            this.baseline = null;
            this.darkMode = false;
            this.remindersEnabled = false;
            this.loadSettings();
            this.applySavedTheme();
            this.closeModal();
            this.goHome();
            this.updateHome();
            this.showNotification('All data cleared', 'success');
        }
    },

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        this.actionConfirming = null;
    },

    seedDemoData() {
        this.data = {};
        const now = new Date();

        // 21 days of data with burnout arc
        for (let day = 20; day >= 0; day--) {
            const d = new Date();
            d.setDate(d.getDate() - day);
            const dateStr = this.getDateString(d);

            this.data[dateStr] = {};

            // Days 0-9: stable
            // Days 10-20: gradual decline
            const declinePhase = Math.max(0, day - 10);
            const declinePercent = declinePhase / 11;

            const sleepBase = 7.5;
            const moodBase = 7;

            this.data[dateStr].morning = {
                sleepHours: sleepBase - (declinePercent * 2),
                sleepQuality: 7 - (declinePercent * 3),
                energy: 6.5 - (declinePercent * 2),
                mood: moodBase - (declinePercent * 2.5),
                note: day < 10 ? 'Feeling good' : day < 15 ? 'A bit tired' : 'Brain fog',
                intention: 'Focus block',
                timestamp: d.toISOString()
            };

            this.data[dateStr].night = {
                activity: day < 10 ? 'some' : day < 15 ? 'little' : 'none',
                screenTime: 5 + (declinePercent * 3),
                social: day < 10 ? 'meaningfully' : day < 15 ? 'briefly' : 'none',
                mood: moodBase - (declinePercent * 2),
                dayIdentity: day < 10 ? 'yes' : day < 15 ? 'mostly' : 'not-really',
                intention: 'Rest',
                timestamp: d.toISOString()
            };
        }

        this.saveData();
        this.baseline = this.getBaseline();
        this.saveBaseline();
        this.updateHome();
        this.closeModal();

        this.showNotification('✓ Demo data loaded (21-day burnout arc)', 'success');
    }
};

// Initialize app
app.init();