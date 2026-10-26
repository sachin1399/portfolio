/**
 * SACHIN.DEV | Modern Developer Portfolio Engine
 * Features:
 *  - Three.js Interactive 3D Cyber Core & Constellation Background
 *  - Dual Custom Cursor (Laser Dot + Ring Follower + Spark Particle Trail)
 *  - 3D Card Perspective Tilt & Mouse Spotlight Flashlight Effect
 *  - Full Interactive Developer CLI Terminal (SachinOS v2.4)
 *  - Typewriter Dynamic Headline
 *  - Project Category Filtering
 *  - Web Audio API Synthesized Cyber Audio FX
 *  - Smooth Scroll Spy & Theme Toggling
 */

document.addEventListener('DOMContentLoaded', () => {
    /* ===================================================================
       1. Audio FX Synthesizer (Web Audio API - Zero External Files)
       =================================================================== */
    let audioCtx = null;
    let soundEnabled = false;
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
    }

    function playCyberBeep(freq = 600, type = 'sine', duration = 0.05, gainValue = 0.04) {
        if (!soundEnabled || !audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            initAudio();
            soundEnabled = !soundEnabled;
            if (soundIcon) {
                soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
            }
            if (soundEnabled) {
                playCyberBeep(880, 'sine', 0.08, 0.06);
            }
        });
    }

    /* ===================================================================
       2. Three.js Interactive 3D WebGL Visualization
       =================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Central Cyber 3D Group
        const cyberGroup = new THREE.Group();
        scene.add(cyberGroup);

        // 1. Outer Hologram Wireframe (Icosahedron)
        const icoGeo = new THREE.IcosahedronGeometry(7.5, 2);
        const icoMat = new THREE.MeshBasicMaterial({
            color: 0x00f5d4,
            wireframe: true,
            transparent: true,
            opacity: 0.28
        });
        const icosahedron = new THREE.Mesh(icoGeo, icoMat);
        cyberGroup.add(icosahedron);

        // 2. Inner Glowing Core (Octahedron)
        const octGeo = new THREE.OctahedronGeometry(3.8, 0);
        const octMat = new THREE.MeshBasicMaterial({
            color: 0x7928ca,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const octahedron = new THREE.Mesh(octGeo, octMat);
        cyberGroup.add(octahedron);

        // 3. Orbital Ring
        const ringGeo = new THREE.TorusGeometry(10.5, 0.05, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.4
        });
        const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
        orbitalRing.rotation.x = Math.PI / 3;
        cyberGroup.add(orbitalRing);

        // 4. Secondary Counter-Orbital Ring
        const ring2Geo = new THREE.TorusGeometry(12, 0.04, 16, 100);
        const ring2Mat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.25
        });
        const orbitalRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
        orbitalRing2.rotation.y = Math.PI / 4;
        cyberGroup.add(orbitalRing2);

        // Position Cyber Group off-center (aligning nicely with hero layout)
        cyberGroup.position.set(11, 2, 0);

        // 5. Ambient Particle Constellation (1,400 Stars)
        const particlesCount = 1400;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const colorCyan = new THREE.Color(0x00f5d4);
        const colorPurple = new THREE.Color(0x7928ca);
        const colorBlue = new THREE.Color(0x38bdf8);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            // Distribute in a spherical volume around the viewer
            positions[i3] = (Math.random() - 0.5) * 110;
            positions[i3 + 1] = (Math.random() - 0.5) * 110;
            positions[i3 + 2] = (Math.random() - 0.5) * 80;

            const randColor = Math.random();
            let c = colorCyan;
            if (randColor > 0.66) c = colorPurple;
            else if (randColor > 0.33) c = colorBlue;

            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.45,
            vertexColors: true,
            transparent: true,
            opacity: 0.75
        });

        const particleCloud = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleCloud);

        // Responsive positioning for mobile devices
        function update3DPosition() {
            if (window.innerWidth < 960) {
                cyberGroup.position.set(0, 8, -5);
                cyberGroup.scale.set(0.65, 0.65, 0.65);
            } else {
                cyberGroup.position.set(11, 2, 0);
                cyberGroup.scale.set(1, 1, 1);
            }
        }
        update3DPosition();

        // Mouse Parallax Controls
        let targetX = 0;
        let targetY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - windowHalfX) * 0.0006;
            targetY = (e.clientY - windowHalfY) * 0.0006;
        });

        // Scroll Parallax Controls
        let scrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        }, { passive: true });

        // Animation Loop
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotate Cyber Mesh Core
            icosahedron.rotation.x = elapsedTime * 0.22;
            icosahedron.rotation.y = elapsedTime * 0.35;

            octahedron.rotation.x = -elapsedTime * 0.4;
            octahedron.rotation.z = elapsedTime * 0.3;

            orbitalRing.rotation.z = elapsedTime * 0.15;
            orbitalRing2.rotation.x = -elapsedTime * 0.2;

            // Rotate Particle Galaxy gently
            particleCloud.rotation.y = elapsedTime * 0.03;
            particleCloud.rotation.x = elapsedTime * 0.015;

            // Smooth Lerp towards Mouse
            cyberGroup.rotation.y += (targetX * 2 - cyberGroup.rotation.y) * 0.06;
            cyberGroup.rotation.x += (targetY * 2 - cyberGroup.rotation.x) * 0.06;

            // Parallax scroll reaction
            camera.position.y = -scrollY * 0.012;
            camera.rotation.z = scrollY * 0.0002;

            renderer.render(scene, camera);
        }
        animate();

        // Resize Listener
        window.addEventListener('resize', () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            update3DPosition();
        });
    }

    /* ===================================================================
       3. Custom Dual Cursor & Spark Particle Trail
       =================================================================== */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorRing = document.getElementById('custom-cursor-ring');
    const cursorText = cursorRing ? cursorRing.querySelector('.cursor-text') : null;
    const trailCanvas = document.getElementById('cursor-trail-canvas');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouch && cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dotX = e.clientX;
            dotY = e.clientY;

            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            // Spawn trail spark particle occasionally on movement
            if (trailCanvas && Math.random() > 0.4) {
                spawnSpark(mouseX, mouseY);
            }
        });

        // Smooth Lerp for Cursor Ring
        function renderCursor() {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Interactive Cursor Hover Events
        const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, .card-3d, .skill-pill, .command-chip, .window-tab, .filter-btn, .cert-filter-btn, .cert-card-img-wrap'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                const label = el.getAttribute('data-cursor');
                if (cursorText) {
                    cursorText.textContent = label || 'CLICK';
                }
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                if (cursorText) {
                    cursorText.textContent = 'VIEW';
                }
            });

            el.addEventListener('click', () => {
                playCyberBeep(720, 'sine', 0.04, 0.04);
            });
        });
    }

    // Spark Trail Canvas Particle System
    let sparks = [];
    let trailCtx = null;

    if (trailCanvas && !isTouch) {
        trailCtx = trailCanvas.getContext('2d');
        function resizeTrailCanvas() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        resizeTrailCanvas();
        window.addEventListener('resize', resizeTrailCanvas);

        function spawnSpark(x, y) {
            sparks.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1,
                alpha: 0.8,
                color: Math.random() > 0.5 ? '#00f5d4' : '#7928ca'
            });
            if (sparks.length > 45) sparks.shift();
        }

        function renderTrail() {
            trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= 0.025;

                if (s.alpha <= 0) {
                    sparks.splice(i, 1);
                    continue;
                }

                trailCtx.save();
                trailCtx.globalAlpha = s.alpha;
                trailCtx.fillStyle = s.color;
                trailCtx.beginPath();
                trailCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                trailCtx.fill();
                trailCtx.restore();
            }
            requestAnimationFrame(renderTrail);
        }
        renderTrail();
    }

    /* ===================================================================
       4. 3D Card Perspective Tilt & Mouse Spotlight Flashlight Effect
       =================================================================== */
    const cards = document.querySelectorAll('.card-3d');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for radial flashlight glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
            const rotateY = ((x - centerX) / centerX) * 6;  // Max 6 deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ===================================================================
       5. Interactive Developer Terminal (SachinOS CLI v2.4)
       =================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const commandChips = document.querySelectorAll('.command-chip');
    const tabTerminalBtn = document.getElementById('tab-terminal-btn');
    const tabCodeBtn = document.getElementById('tab-code-btn');
    const terminalView = document.getElementById('terminal-view');
    const codeView = document.getElementById('code-view');
    const copyCodeBtn = document.getElementById('copy-code-btn');

    let cmdHistoryList = [];
    let historyIndex = -1;

    // Terminal Commands Database
    const commandsDB = {
        help: `Available CLI Commands:
  - <strong>skills</strong>     : Display categorized tech stack & proficiencies
  - <strong>projects</strong>   : List key software & AI projects
  - <strong>certs</strong>      : View Robotics & AI Innovation Engineer and certifications
  - <strong>experience</strong> : Inspect internship history at Q-Spider & CodSoft
  - <strong>about</strong>      : Read engineering background & bio
  - <strong>education</strong>  : Academic credentials (B.Tech CSE @ AKTU)
  - <strong>contact</strong>    : Get verified email, LinkedIn & GitHub coordinates
  - <strong>sudo hire</strong>  : Unlock immediate engineering hiring dispatch
  - <strong>clear</strong>      : Clear current terminal screen
  - <strong>date</strong>       : Display current system time & status`,

        skills: `Technical Proficiency Matrix:
  • Languages: Python, JavaScript (ES6+), C, Node.js
  • Frameworks: Django, ReactJS, REST APIs
  • Core CS: DSA, DAA, DBMS, Operating Systems, Automata
  • Data & AI: Robotics & AI Systems, MySQL, Power BI, OpenAI GPT, Electronics, Speech APIs
  • Tools: Git, GitHub, VS Code, Windows Terminal`,

        certs: `Tiered Credential Registry (10 Verified Accreditations):
  [LEVEL 1: PREMIER & ELITE NATIONAL]
  ★ Robotics & AI Innovation Engineer — The Smart Minds AI Lab (3 Months STEAM Trainer)
  ★ Python for Data Science (Elite 66%) — NPTEL, IIT Madras (MoE Govt. of India, 2 Credits)

  [LEVEL 2: INDUSTRY INTERNSHIPS & CORPORATE]
  ◆ Python Programming Virtual Internship — CodSoft (ISO 9001:2015 & MSME, C.ID: 4169d07)
  ◆ Data Analytics & Forensic Technology Simulation — Deloitte (Code: FCbYJoSbr2McAJ4hs)

  [LEVEL 3: NATIONAL HACKATHONS & ASSESSMENTS]
  ▲ Adobe India Hackathon (Round 1 - MCQ + Coding) — Adobe & Unstop (Team Hustle Coder)
  ▲ AI Agent Hackathon — Product Space & Unstop (Autonomous Workflows)
  ▲ Python (Basic) Skill Certification — HackerRank (ID: 5D1AC2FA43A3)
  ▲ SQL (Basic) Skill Certification — HackerRank (ID: 5F66B61ECA14)

  [LEVEL 4: BI & DATA MASTERCLASSES]
  ● Power BI Workshop: AI-Powered Dashboards — OfficeMaster
  ● Power BI Dashboard for Data Analytics — WsCube Tech (Reg: WS/2025/M/11746)`,
        achievements: `Tiered Credential Registry (10 Verified Accreditations):
  [LEVEL 1: PREMIER & ELITE NATIONAL]
  ★ Robotics & AI Innovation Engineer — The Smart Minds AI Lab (3 Months STEAM Trainer)
  ★ Python for Data Science (Elite 66%) — NPTEL, IIT Madras (MoE Govt. of India, 2 Credits)

  [LEVEL 2: INDUSTRY INTERNSHIPS & CORPORATE]
  ◆ Python Programming Virtual Internship — CodSoft (ISO 9001:2015 & MSME, C.ID: 4169d07)
  ◆ Data Analytics & Forensic Technology Simulation — Deloitte (Code: FCbYJoSbr2McAJ4hs)

  [LEVEL 3: NATIONAL HACKATHONS & ASSESSMENTS]
  ▲ Adobe India Hackathon (Round 1 - MCQ + Coding) — Adobe & Unstop (Team Hustle Coder)
  ▲ AI Agent Hackathon — Product Space & Unstop (Autonomous Workflows)
  ▲ Python (Basic) Skill Certification — HackerRank (ID: 5D1AC2FA43A3)
  ▲ SQL (Basic) Skill Certification — HackerRank (ID: 5F66B61ECA14)

  [LEVEL 4: BI & DATA MASTERCLASSES]
  ● Power BI Workshop: AI-Powered Dashboards — OfficeMaster
  ● Power BI Dashboard for Data Analytics — WsCube Tech (Reg: WS/2025/M/11746)`,

        projects: `Featured Systems & Code Repositories:
  [1] Voice-Controlled Virtual Assistant (Python, OpenAI GPT, SpeechRecognition, gTTS)
  [2] Code Comics Web App (JavaScript, HTML5, CSS3 Grid, Responsive Reader)
  [3] Fuel Analytics Dashboard (Power BI, DAX, KPI Analytics, Dimensional Modeling)`,

        experience: `Professional Career Track:
  • Full-Stack Development Intern @ Q-Spider NOIDA (Sep 2025 - Dec 2025)
    - Python, Django backend APIs, ReactJS UI components.
  • Python Programming Intern @ CodSoft (Jul 2025 - Aug 2025)
    - Algorithm optimization, clean code, modular Python scripts.`,

        about: `About Sachin:
  Computer Science Engineer pursuing B.Tech CSE (2022-2026) at AKTU, Lucknow.
  Passionate about Python Full-Stack architectures, responsive web experiences,
  and autonomous AI agent systems. Driven by efficiency, scalability & clean code.`,

        education: `Academic Credentials:
  Degree: Bachelor of Technology (B.Tech)
  Major: Computer Science and Engineering (CSE)
  Institution: Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow
  Period: 2022 - Present`,

        contact: `Direct Communication Coordinates:
  • Email   : sachin022AI0064@rdec.in
  • GitHub  : https://github.com/sachin1399
  • Location: Uttar Pradesh, India
  • Status  : 🟢 Open for Internships & Full-Time Software Roles`,

        date: `System Time: ${new Date().toLocaleString()} [UTC/Local Engine Active]`,

        'sudo hire': `🎉 ACCESS GRANTED! You are about to hire an exceptional Full-Stack Engineer!
Dispatching priority handshake to: <strong>sachin022AI0064@rdec.in</strong>.
Ready to build, ship, and scale high-impact software solutions with your team!`
    };

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        cmdHistoryList.push(rawCmd);
        historyIndex = cmdHistoryList.length;

        // Render command input in history
        const lineElem = document.createElement('div');
        lineElem.className = 'terminal-line';
        lineElem.innerHTML = `<span class="terminal-prompt-label">sachin@dev-box:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
        terminalHistory.appendChild(lineElem);

        // Handle Clear
        if (cmd === 'clear') {
            terminalHistory.innerHTML = '';
            if (terminalInput) terminalInput.value = '';
            playCyberBeep(450, 'square', 0.04, 0.03);
            return;
        }

        // Render response
        const outputElem = document.createElement('div');
        outputElem.className = 'terminal-output';

        if (commandsDB[cmd]) {
            outputElem.innerHTML = commandsDB[cmd].replace(/\n/g, '<br>');
            outputElem.classList.add('info');
            playCyberBeep(800, 'sine', 0.05, 0.04);
        } else {
            outputElem.innerHTML = `zsh: command not found: <span style="color: var(--accent-rose);">${escapeHtml(cmd)}</span>. Type <strong>help</strong> for available commands.`;
            outputElem.classList.add('error');
            playCyberBeep(250, 'sawtooth', 0.06, 0.05);
        }

        terminalHistory.appendChild(outputElem);

        // Auto-scroll to bottom
        terminalView.scrollTop = terminalView.scrollHeight;
        if (terminalInput) terminalInput.value = '';
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(terminalInput.value);
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = cmdHistoryList[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < cmdHistoryList.length - 1) {
                    historyIndex++;
                    terminalInput.value = cmdHistoryList[historyIndex] || '';
                } else {
                    historyIndex = cmdHistoryList.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    // Quick Command Chips
    commandChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                if (terminalInput) terminalInput.value = cmd;
                executeCommand(cmd);
            }
        });
    });

    // Terminal vs Python Code Tab Switcher
    if (tabTerminalBtn && tabCodeBtn && terminalView && codeView) {
        tabTerminalBtn.addEventListener('click', () => {
            tabTerminalBtn.classList.add('active');
            tabCodeBtn.classList.remove('active');
            terminalView.style.display = 'block';
            codeView.classList.remove('active');
            playCyberBeep(650, 'sine', 0.03, 0.03);
        });

        tabCodeBtn.addEventListener('click', () => {
            tabCodeBtn.classList.add('active');
            tabTerminalBtn.classList.remove('active');
            terminalView.style.display = 'none';
            codeView.classList.add('active');
            playCyberBeep(650, 'sine', 0.03, 0.03);
        });
    }

    // Copy Code Snippet Button
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeText = codeView.querySelector('code').innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                copyCodeBtn.textContent = '✓ Copied!';
                playCyberBeep(950, 'sine', 0.06, 0.05);
                setTimeout(() => {
                    copyCodeBtn.textContent = '📋 Copy Code';
                }, 2000);
            });
        });
    }

    /* ===================================================================
       6. Dynamic Typewriter Headline
       =================================================================== */
    const typewriterElem = document.getElementById('typewriter');
    const titles = [
        'Full-Stack Developer',
        'Python & Django Specialist',
        'React & Modern UI Builder',
        'AI & Autonomous Agent Explorer',
        'Data Analyst & Problem Solver'
    ];
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function handleTypewriter() {
        if (!typewriterElem) return;
        const currentTitle = titles[titleIdx];

        if (isDeleting) {
            typewriterElem.textContent = currentTitle.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 45;
        } else {
            typewriterElem.textContent = currentTitle.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 90;
        }

        if (!isDeleting && charIdx === currentTitle.length) {
            typeDelay = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            typeDelay = 450;
        }

        setTimeout(handleTypewriter, typeDelay);
    }
    handleTypewriter();

    /* ===================================================================
       7. Interactive Project Category Filtering
       =================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 30);
                } else {
                    card.style.display = 'none';
                }
            });
            playCyberBeep(700, 'sine', 0.04, 0.03);
        });
    });

    /* ===================================================================
       8. Copy Email to Clipboard Tooltip
       =================================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'sachin022AI0064@rdec.in';
            navigator.clipboard.writeText(email).then(() => {
                const orig = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<span>✓ Address Copied!</span>';
                playCyberBeep(880, 'sine', 0.05, 0.04);
                setTimeout(() => {
                    copyEmailBtn.innerHTML = orig;
                }, 2200);
            });
        });
    }

    /* ===================================================================
       9. Contact Form Simulation
       =================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playCyberBeep(1000, 'sine', 0.1, 0.05);

            if (formStatus) {
                formStatus.classList.add('success');
                formStatus.textContent = '✓ Communication link established! Thank you Sachin will be in touch soon.';
            }

            contactForm.reset();
            setTimeout(() => {
                if (formStatus) formStatus.classList.remove('success');
            }, 6000);
        });
    }

    /* ===================================================================
       10. Theme Mode Switcher (Dark / Light) with LocalStorage
       =================================================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check saved preference
    const savedTheme = localStorage.getItem('sachin-portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            if (themeIcon) {
                themeIcon.textContent = isLight ? '☀️' : '🌙';
            }
            localStorage.setItem('sachin-portfolio-theme', isLight ? 'light' : 'dark');
            playCyberBeep(750, 'sine', 0.05, 0.04);
        });
    }

    /* ===================================================================
       11. Mobile Menu Toggle
       =================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            playCyberBeep(550, 'sine', 0.03, 0.03);
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    /* ===================================================================
       12. Scroll Reveal Animations & Active Nav Spy
       =================================================================== */
    const faders = document.querySelectorAll('.fade-in-up');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-link');

    // Reveal on scroll using IntersectionObserver
    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach((fader) => {
            appearOnScroll.observe(fader);
        });

        // Active Section Scroll Spy
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach((sec) => spyObserver.observe(sec));
    } else {
        // Fallback for older browsers
        faders.forEach((f) => f.classList.add('visible'));
    }

    /* ===================================================================
       13. Project Output Inspection Modal (Lightbox)
       =================================================================== */
    const previewModal = document.getElementById('preview-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const triggerElements = document.querySelectorAll('.project-preview-frame, .inspect-output-btn, .cert-preview-wrapper, .cert-card-img-wrap');

    function openOutputModal(src) {
        if (!previewModal || !modalImg || !src) return;
        modalImg.src = src;
        previewModal.classList.add('active');
        playCyberBeep(880, 'sine', 0.06, 0.05);
    }

    function closeOutputModal() {
        if (!previewModal) return;
        previewModal.classList.remove('active');
        playCyberBeep(450, 'sine', 0.04, 0.03);
    }

    triggerElements.forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const modalSrc = el.getAttribute('data-modal');
            openOutputModal(modalSrc);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeOutputModal);
    }

    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closeOutputModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && previewModal && previewModal.classList.contains('active')) {
            closeOutputModal();
        }
    });

    /* ===================================================================
       14. Certificate Tier Category Filtering
       =================================================================== */
    const certFilterButtons = document.querySelectorAll('.cert-filter-btn');
    const certLevelBlocks = document.querySelectorAll('.cert-level-block');

    certFilterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            certFilterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterTier = btn.getAttribute('data-cert-filter');

            certLevelBlocks.forEach((block) => {
                const blockTier = block.getAttribute('data-tier');
                if (filterTier === 'all' || blockTier === filterTier) {
                    block.style.display = 'block';
                    block.style.opacity = '0';
                    block.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        block.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        block.style.opacity = '1';
                        block.style.transform = 'translateY(0)';
                    }, 30);
                } else {
                    block.style.display = 'none';
                }
            });
            playCyberBeep(700, 'sine', 0.04, 0.03);
        });
    });
});
