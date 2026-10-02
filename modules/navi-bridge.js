/**
 * NaviBridge - CampusOS <-> Cactus Needle Agent Dispatcher
 * Bridges student natural language queries through the Cactus Needle
 * sidecar and routes clean intents directly into CampusOS data & map layer.
 */
(function(root) {
    const DEFAULT_SIDECAR_URL = 'http://127.0.0.1:8000';

    const NaviBridge = {
        sidecarUrl: DEFAULT_SIDECAR_URL,
        cloudUrl: '',
        isAvailable: false,
        isCloudAvailable: false,
        lastCheck: 0,
        recognition: null,
        isListening: false,

        getCloudUrl() {
            if (this.cloudUrl) return this.cloudUrl.replace(/\/+$/, '');
            if (typeof window !== 'undefined' && window.ENV && window.ENV.naviCloudUrl) {
                return window.ENV.naviCloudUrl.replace(/\/+$/, '');
            }
            // Auto-detect same-origin ONLY on live deployments (e.g. *.vercel.app), not static local dev servers
            if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.protocol.startsWith('http')) {
                const host = (window.location.hostname || '').toLowerCase();
                const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local');
                if (!isLocal) {
                    return window.location.origin;
                }
            }
            return '';
        },

        getCloudEndpoint(path) {
            const base = this.getCloudUrl();
            if (!base) return '';
            const cleanBase = base.replace(/\/+$/, '');
            const cleanPath = path.startsWith('/') ? path : '/' + path;
            if (cleanBase.endsWith('/api')) {
                return cleanBase + cleanPath.replace(/^\/api/, '');
            }
            if (typeof window !== 'undefined' && cleanBase === window.location?.origin) {
                return cleanBase + (cleanPath.startsWith('/api') ? cleanPath : '/api' + cleanPath);
            }
            return cleanBase + cleanPath;
        },

        /**
         * Initialize Speech Recognition (Chrome, Edge, Safari, Android)
         */
        initSpeech() {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRec) {
                console.warn('[NaviBridge] Web Speech API not supported on this browser.');
                return false;
            }
            if (this.recognition) {
                try { this.recognition.abort(); } catch(e) {}
                this.recognition = null;
            }
            this.recognition = new SpeechRec();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI(true, 'Listening... Speak your destination');

                // Safety Watchdog: max 6.5s listening window so it NEVER hangs
                if (this.maxVoiceTimer) clearTimeout(this.maxVoiceTimer);
                this.maxVoiceTimer = setTimeout(() => {
                    if (this.isListening) {
                        const toSend = (this.lastSpokenText || '').trim();
                        this.lastSpokenText = '';
                        this.stopVoice();
                        if (toSend && toSend.length > 2) {
                            this.askNavi(toSend);
                        }
                    }
                }, 6500);
            };

            this.recognition.onresult = (event) => {
                let interim = '';
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                const spoken = (final || interim).trim();
                const input = document.getElementById('searchInput');
                if (input && spoken) input.value = spoken;
                this.lastSpokenText = spoken;
                this.updateVoiceUI(true, spoken || 'Listening...', 'Listening...');

                // Instant dispatch on browser final speech event
                if (final && final.trim()) {
                    if (this.silenceTimer) clearTimeout(this.silenceTimer);
                    if (this.maxVoiceTimer) clearTimeout(this.maxVoiceTimer);
                    const toSend = final.trim();
                    this.lastSpokenText = '';
                    this.stopVoice();
                    this.askNavi(toSend);
                    return;
                }

                // Ultra-responsive silence debounce: submit 500ms after user pauses
                if (this.silenceTimer) clearTimeout(this.silenceTimer);
                if (spoken && spoken.length > 2) {
                    this.silenceTimer = setTimeout(() => {
                        if (this.isListening && this.lastSpokenText) {
                            if (this.maxVoiceTimer) clearTimeout(this.maxVoiceTimer);
                            const toSend = this.lastSpokenText;
                            this.lastSpokenText = '';
                            this.stopVoice();
                            this.askNavi(toSend);
                        }
                    }, 500);
                }
            };

            this.recognition.onerror = (event) => {
                console.warn('[NaviBridge] Speech recognition error:', event.error);
                this.stopVoice();
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    this.notify('Voice recognition note: ' + event.error);
                }
            };

            this.recognition.onend = () => {
                this.stopVoice();
            };

            return true;
        },

        startVoice() {
            // Fresh instance every time to prevent Chromium audio capture hang
            if (!this.initSpeech()) {
                this.notify('Voice input is not supported in this browser.');
                return;
            }
            try {
                this.recognition.start();
            } catch (e) {
                console.warn('[NaviBridge] Speech start retry:', e);
                try {
                    this.recognition.abort();
                    this.recognition.start();
                } catch(err) {}
            }
        },

        stopVoice() {
            this.isListening = false;
            if (this.silenceTimer) clearTimeout(this.silenceTimer);
            if (this.maxVoiceTimer) clearTimeout(this.maxVoiceTimer);
            this.updateVoiceUI(false);
            if (this.recognition) {
                try { this.recognition.abort(); } catch(e) {}
                this.recognition = null;
            }
        },

        toggleVoice() {
            if (this.isListening) {
                // If user clicks mic while already speaking, immediately submit what was spoken!
                if (this.lastSpokenText && this.lastSpokenText.trim().length > 2) {
                    const toSend = this.lastSpokenText.trim();
                    this.lastSpokenText = '';
                    this.stopVoice();
                    this.askNavi(toSend);
                    return;
                }
                this.stopVoice();
            } else {
                this.startVoice();
            }
        },

        speak(text) {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
                try {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.rate = 1.05;
                    utterance.pitch = 1.0;
                    window.speechSynthesis.speak(utterance);
                } catch(e) {}
            }
        },

        autoHideTimeout: null,

        autoHideVoiceUI(delayMs = 3500) {
            if (this.autoHideTimeout) clearTimeout(this.autoHideTimeout);
            this.autoHideTimeout = setTimeout(() => {
                this.updateVoiceUI(false);
            }, delayMs);
        },

        updateVoiceUI(active, text = '', statusText = '') {
            if (typeof document === 'undefined') return;
            const btn = document.getElementById('searchVoiceBtn');
            const hud = document.getElementById('naviVoiceHud') || document.getElementById('charlieVoiceHud');
            const transcript = document.getElementById('naviTranscript') || document.getElementById('charlieTranscript');
            const status = document.getElementById('naviStatus') || document.getElementById('charlieStatus');

            if (btn) {
                if (active) btn.classList.add('listening');
                else btn.classList.remove('listening');
            }
            if (hud) {
                hud.style.display = active ? 'flex' : 'none';
            }
            if (transcript && text) {
                transcript.textContent = text;
            }
            if (status) {
                status.textContent = statusText || (active ? 'Listening...' : 'Ready');
            }
        },

        /**
         * Check Cloud Navi and local sidecar connectivity
         */
        async checkHealth() {
            const checks = [];

            // 1. Check Cloud Navi if online and URL configured
            const healthUrl = this.getCloudEndpoint('/health');
            if (healthUrl && (typeof navigator === 'undefined' || navigator.onLine)) {
                checks.push(
                    (async () => {
                        try {
                            const ctrl = new AbortController();
                            const timeoutId = setTimeout(() => ctrl.abort(), 1200);
                            const res = await fetch(healthUrl, { signal: ctrl.signal });
                            clearTimeout(timeoutId);
                            if (res.ok) {
                                const data = await res.json();
                                this.isCloudAvailable = true;
                                console.log('[NaviBridge] Cloud Navi connected:', data);
                                return true;
                            }
                        } catch (e) {
                            this.isCloudAvailable = false;
                        }
                        return false;
                    })()
                );
            }

            // 2. Check Local Sidecar
            checks.push(
                (async () => {
                    try {
                        const ctrl = new AbortController();
                        const timeoutId = setTimeout(() => ctrl.abort(), 600);
                        const res = await fetch(`${this.sidecarUrl}/health`, { signal: ctrl.signal });
                        clearTimeout(timeoutId);
                        if (res.ok) {
                            const data = await res.json();
                            this.isAvailable = true;
                            this.lastCheck = Date.now();
                            console.log('[NaviBridge] Local sidecar connected:', data);
                            return true;
                        }
                    } catch (e) {
                        this.isAvailable = false;
                        this.lastCheck = Date.now();
                    }
                    return false;
                })()
            );

            const results = await Promise.all(checks);
            return results.some(Boolean);
        },

        /**
         * High-precision offline campus NLP parser
         * Resolves intents and parameters locally without server dependencies
         */
        parseOffline(query) {
            if (!query || !query.trim()) return null;
            const q = query.trim().replace(/[?!.,]+$/g, '').trim();
            const lower = q.toLowerCase();

            // 1. Amenity intent
            const amenityKeywords = [
                { type: 'food', terms: ['food', 'eat', 'eating', 'canteen', 'cafeteria', 'chop bar', 'snack', 'restaurant', 'lunch', 'breakfast'] },
                { type: 'washroom', terms: ['toilet', 'washroom', 'restroom', 'wc', 'urinal', 'bathroom'] },
                { type: 'atm', terms: ['atm', 'bank', 'cash', 'money', 'momo'] },
                { type: 'print', terms: ['print', 'printing', 'photocopy', 'photocopying', 'stationery', 'xerox'] },
                { type: 'clinic', terms: ['clinic', 'hospital', 'first aid', 'health centre', 'infirmary', 'nurse', 'medical'] },
                { type: 'library', terms: ['library', 'books', 'quiet study', 'study area'] }
            ];

            let matchedAmenity = null;
            for (const ak of amenityKeywords) {
                if (ak.terms.some(t => new RegExp(`\\b${t}\\b`, 'i').test(lower))) {
                    matchedAmenity = ak.type;
                    break;
                }
            }

            const nearMatch = lower.match(/\b(?:near|around|close to|at|next to|beside)\s+([a-z0-9\s]+)$/i);
            const landmark = nearMatch ? nearMatch[1].trim() : '';

            if (matchedAmenity && (landmark || lower.includes('where can i') || lower.includes('find') || lower.includes('where is'))) {
                return {
                    success: true,
                    action: 'find_amenity',
                    parameters: {
                        amenity_type: matchedAmenity,
                        near_landmark: landmark
                    },
                    confidence: 0.95,
                    offline: true,
                    raw_query: query
                };
            }

            // 2. Route intent
            const routeRegex = /^(?:please\s+)?(?:can\s+you\s+)?(?:take|navigate|guide|lead|route|walk|bring)\s+(?:me\s+)?(?:to\s+)?(.+)$/i;
            const dirRegex = /^(?:directions\s+to|how\s+do\s+i\s+get\s+to|way\s+to|go\s+to)\s+(.+)$/i;
            const rMatch = q.match(routeRegex) || q.match(dirRegex);
            if (rMatch) {
                const target = rMatch[1].trim()
                    .replace(/^(?:the|a|an)\s+/i, '')
                    .replace(/\s+(?:please|now)$/i, '')
                    .trim();
                return {
                    success: true,
                    action: 'route_to',
                    parameters: { target, mode: 'walking' },
                    confidence: 0.95,
                    offline: true,
                    raw_query: query
                };
            }

            // 3. Staff intent
            const staffRegex = /^(?:find\s+(?:lecturer|prof(?:essor)?\.?|dr\.?|doctor|mr\.?|mrs\.?|miss|dean|hod)\s+|office\s+of\s+|who\s+is\s+|contact\s+)(.+)$/i;
            const sMatch = q.match(staffRegex);
            if (sMatch) {
                const name = sMatch[1].trim()
                    .replace(/^(?:the|a|an)\s+/i, '')
                    .replace(/\s+(?:office|room)?$/i, '')
                    .trim();
                return {
                    success: true,
                    action: 'find_staff',
                    parameters: { name },
                    confidence: 0.92,
                    offline: true,
                    raw_query: query
                };
            }

            // 4. Locate place intent
            const locateRegex = /^(?:where\s+is|show\s+me|locate|find\s+(?:building|hall|lab|room)?|point\s+me\s+to|which\s+block\s+is)\s+(.+)$/i;
            const lMatch = q.match(locateRegex);
            if (lMatch) {
                const place = lMatch[1].trim()
                    .replace(/^(?:the|a|an)\s+/i, '')
                    .replace(/\s+(?:please)$/i, '')
                    .trim();
                return {
                    success: true,
                    action: 'locate_place',
                    parameters: { place_name: place },
                    confidence: 0.92,
                    offline: true,
                    raw_query: query
                };
            }

            // 5. Default entity locate
            const cleaned = q.replace(/^(?:where\s+is|find|show\s+me|take\s+me\s+to|the)\s+/i, '').trim();
            return {
                success: true,
                action: 'locate_place',
                parameters: { place_name: cleaned || q },
                confidence: 0.80,
                offline: true,
                raw_query: query
            };
        },

        /**
         * Parse natural language query into structured action
         * Cascade:
         * 1. Cloud Navi (Needle 2 + Groq / Cerebras cloud intelligence when online)
         * 2. Local Sidecar (Desktop / Device local Needle engine)
         * 3. Instant 0ms Local Offline Campus Engine (PWA offline fallback)
         */
        async parse(query) {
            if (!query || !query.trim()) return null;
            const q = query.trim();

            // TIER 1: Cloud Navi (when online & configured)
            const parseUrl = this.getCloudEndpoint('/parse');
            const isOnline = typeof navigator === 'undefined' || navigator.onLine;

            if (parseUrl && isOnline) {
                try {
                    const ctrl = new AbortController();
                    const timeoutId = setTimeout(() => ctrl.abort(), 2000);
                    const resp = await fetch(parseUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: q }),
                        signal: ctrl.signal
                    });
                    clearTimeout(timeoutId);

                    if (resp.ok) {
                        const data = await resp.json();
                        if (data && data.success) {
                            this.isCloudAvailable = true;
                            data.source = 'cloud';
                            return data;
                        }
                    }
                } catch (err) {
                    console.warn('[NaviBridge] Cloud Navi timeout/error, falling back to local engine');
                }
            }

            // TIER 2: Local Sidecar (when active)
            if (this.isAvailable) {
                try {
                    const ctrl = new AbortController();
                    const timeoutId = setTimeout(() => ctrl.abort(), 1000);
                    const resp = await fetch(`${this.sidecarUrl}/parse`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: q }),
                        signal: ctrl.signal
                    });
                    clearTimeout(timeoutId);

                    if (resp.ok) {
                        const data = await resp.json();
                        data.source = 'local_sidecar';
                        return data;
                    }
                } catch (err) {
                    this.isAvailable = false;
                    console.warn('[NaviBridge] Sidecar went offline, switching to instant offline engine');
                }
            }

            // TIER 3: Zero-delay local offline parser
            const offlineResult = this.parseOffline(q);
            if (offlineResult) {
                offlineResult.source = 'offline_local';
            }
            return offlineResult;
        },

        /**
         * Resolves destination entity from CampusOS datasets
         */
        resolveEntity(nameQuery, bData, pData, preferredType = null) {
            if (!nameQuery) return null;
            const q = nameQuery.toLowerCase().trim();

            const buildings = bData || (typeof window !== 'undefined' && window.CampusOS ? window.CampusOS.getBuildingsData() : []) || [];
            const people = pData || (typeof window !== 'undefined' && window.peopleData ? window.peopleData : []) || [];

            // Helper: Find matching staff
            const findStaffMatch = () => {
                const pMatch = people.find(p => {
                    const pName = (p.name || p.full_name || '').toLowerCase();
                    const pRole = (p.role || p.position || '').toLowerCase();
                    const pDept = (p.department || p.faculty || '').toLowerCase();
                    return (pName && pName.includes(q)) || (pRole && pRole.includes(q)) || (pDept && pDept.includes(q));
                });
                if (pMatch) {
                    const bCode = (pMatch.building || pMatch.buildingName || pMatch.buildingId || '').toLowerCase();
                    const bOffice = buildings.find(b => 
                        (b.id && String(b.id).toLowerCase() === bCode) ||
                        (b.shortName && b.shortName.toLowerCase() === bCode) ||
                        (b.name && b.name.toLowerCase().includes(bCode))
                    ) || null;
                    return { 
                        type: 'staff', 
                        data: { ...pMatch, name: pMatch.name || pMatch.full_name }, 
                        building: bOffice 
                    };
                }
                return null;
            };

            // Helper: Find matching building
            const findBuildingMatch = () => {
                const bDirect = buildings.find(b => 
                    (b.name && b.name.toLowerCase().includes(q)) ||
                    (b.shortName && b.shortName.toLowerCase() === q) ||
                    (b.keywords && b.keywords.some(k => k && k.toLowerCase().includes(q)))
                );
                if (bDirect) return { type: 'building', data: bDirect, building: bDirect };
                return null;
            };

            // Helper: Find matching room
            const findRoomMatch = () => {
                for (const b of buildings) {
                    if (b.rooms && Array.isArray(b.rooms)) {
                        const rMatch = b.rooms.find(r => {
                            const rName = (typeof r === 'string' ? r : r.name || r.number || '').toLowerCase();
                            return rName && (rName.includes(q) || q.includes(rName));
                        });
                        if (rMatch) {
                            return { type: 'room', data: rMatch, building: b };
                        }
                    }
                }
                return null;
            };

            // Helper: Find matching service
            const findServiceMatch = () => {
                for (const b of buildings) {
                    if (b.services && Array.isArray(b.services)) {
                        const sMatch = b.services.find(s => {
                            const sName = (typeof s === 'string' ? s : s.name || '').toLowerCase();
                            return sName && (sName.includes(q) || q.includes(sName));
                        });
                        if (sMatch) {
                            return { type: 'service', data: sMatch, building: b };
                        }
                    }
                }
                return null;
            };

            // If staff preferred
            if (preferredType === 'staff') {
                return findStaffMatch() || findBuildingMatch() || findRoomMatch() || findServiceMatch();
            }

            // If room/building preferred
            if (preferredType === 'room') {
                return findRoomMatch() || findBuildingMatch() || findStaffMatch() || findServiceMatch();
            }

            // Default resolution priority
            return findBuildingMatch() || findStaffMatch() || findRoomMatch() || findServiceMatch();
        },

        /**
         * Dispatches structured action into CampusOS map and UI
         */
        execute(parseResult) {
            if (!parseResult) return false;
            const { action, parameters } = parseResult;
            const bData = (typeof window !== 'undefined' && window.CampusOS ? window.CampusOS.getBuildingsData() : []) || [];
            const pData = (typeof window !== 'undefined' && window.peopleData ? window.peopleData : []) || [];

            console.log('[NaviBridge] Executing action:', action, parameters);

            switch (action) {
                case 'route_to': {
                    const target = parameters.target || parameters.place_name;
                    const entity = this.resolveEntity(target, bData, pData);
                    if (entity && entity.building) {
                        const b = entity.building;
                        const destName = entity.type === 'room' 
                            ? `${b.name} (${entity.data.name || entity.data.number || target})`
                            : (entity.type === 'staff' ? `${entity.data.name} (${b.name})` : b.name);

                        this.notify(`Routing to ${destName}...`);
                        this.speak(`Routing to ${destName}`);
                        this.updateVoiceUI(true, `Routing to ${destName}`, 'Navigating');
                        this.autoHideVoiceUI(3500);
                        if (this.triggerCampusRoute(b.lat, b.lng, destName)) {
                            return true;
                        }
                    }
                    this.notify(`Could not pinpoint "${target}" for direct routing. Searching...`);
                    this.updateVoiceUI(true, `Searching directory for "${target}"`, 'Pinpointing');
                    this.autoHideVoiceUI(3000);
                    this.fallbackSearch(target);
                    return false;
                }

                case 'locate_place': {
                    const placeName = parameters.place_name || parameters.target;
                    const entity = this.resolveEntity(placeName, bData, pData);
                    if (entity && entity.building) {
                        const b = entity.building;
                        const destName = entity.type === 'room' 
                            ? `${b.name} (${entity.data.name || entity.data.number || placeName})`
                            : b.name;

                        this.notify(`Found ${destName}`);
                        this.speak(`Here is ${destName}`);
                        this.updateVoiceUI(true, `Found ${destName}`, 'Located');
                        this.autoHideVoiceUI(3500);

                        if (!this.triggerCampusRoute(b.lat, b.lng, destName)) {
                            this.flyToBuilding(b);
                            if (typeof window.showBuilding === 'function') {
                                setTimeout(() => window.showBuilding(b), 850);
                            }
                        }
                        return true;
                    }
                    this.updateVoiceUI(true, `Searching directory for "${placeName}"`, 'Searching');
                    this.autoHideVoiceUI(3000);
                    this.fallbackSearch(placeName);
                    return false;
                }

                case 'find_staff': {
                    const staffQuery = parameters.name || parameters.role || parameters.department;
                    const entity = this.resolveEntity(staffQuery, bData, pData, 'staff');
                    if (entity && entity.type === 'staff') {
                        const p = entity.data;
                        const b = entity.building;
                        const destName = b ? `${p.name} (${b.name})` : p.name;
                        this.notify(`Found ${p.name}`);
                        this.speak(`${p.name}'s office is at ${b ? b.name : 'the campus'}`);
                        this.updateVoiceUI(true, `${p.name} • ${b ? b.name : 'Campus'}`, 'Staff Found');
                        this.autoHideVoiceUI(3500);

                        if (!b || !this.triggerCampusRoute(b.lat, b.lng, destName)) {
                            if (b) this.flyToBuilding(b);
                            if (typeof window.showStaff === 'function') {
                                setTimeout(() => window.showStaff(p, b), 850);
                            }
                        }
                        return true;
                    }
                    this.updateVoiceUI(true, `Searching staff directory for "${staffQuery}"`, 'Searching');
                    this.autoHideVoiceUI(3000);
                    this.fallbackSearch(staffQuery);
                    return false;
                }

                case 'find_amenity': {
                    const amenity = (parameters.amenity_type || '').toLowerCase();
                    const near = (parameters.near_landmark || '').toLowerCase();
                    
                    // Match amenities across buildings
                    const matches = [];
                    for (const b of bData) {
                        const bName = (b.name || '').toLowerCase();
                        const bDesc = (b.description || '').toLowerCase();
                        const facs = (b.facilities || []).map(f => (f || '').toLowerCase());
                        const servs = (b.services || []).map(s => ((typeof s === 'string' ? s : s.name) || '').toLowerCase());
                        
                        let matchScore = 0;
                        if (facs.some(f => f.includes(amenity)) || servs.some(s => s.includes(amenity))) matchScore += 3;
                        if (bDesc.includes(amenity) || bName.includes(amenity)) matchScore += 2;
                        if (near && (bName.includes(near) || bDesc.includes(near))) matchScore += 5;

                        if (matchScore > 0) matches.push({ building: b, score: matchScore });
                    }

                    matches.sort((a, b) => b.score - a.score);

                    if (matches.length > 0) {
                        const top = matches[0].building;
                        this.notify(`Routing to ${amenity} at ${top.name}...`);
                        this.speak(`Routing to ${amenity} at ${top.name}`);
                        this.updateVoiceUI(true, `${amenity.toUpperCase()} at ${top.name}`, 'Amenity Located');
                        this.autoHideVoiceUI(3500);

                        if (!this.triggerCampusRoute(top.lat, top.lng, top.name)) {
                            this.flyToBuilding(top);
                            if (typeof window.showBuilding === 'function') {
                                setTimeout(() => window.showBuilding(top), 850);
                            }
                        }
                        return true;
                    }

                    this.updateVoiceUI(true, `Searching amenities for "${amenity}"`, 'Searching');
                    this.autoHideVoiceUI(3000);
                    this.fallbackSearch(amenity);
                    return false;
                }

                case 'conversational': {
                    const msg = parameters.message || parameters.reply || parseResult.speech_text || 'Hello! I am Navi, your campus guide.';
                    this.notify(msg);
                    this.speak(msg);
                    this.updateVoiceUI(true, msg, 'Navi');
                    this.autoHideVoiceUI(4500);
                    return true;
                }

                default:
                    if (parseResult.speech_text) {
                        this.speak(parseResult.speech_text);
                    }
                    this.fallbackSearch(parameters.place_name || parameters.target || '');
                    return false;
            }
        },

        triggerCampusRoute(lat, lng, name) {
            if (typeof window === 'undefined') return false;
            if (typeof window.startRoute === 'function') {
                window.startRoute(lat, lng, name);
                return true;
            }
            if (window.CampusOS && typeof window.CampusOS.startRoute === 'function') {
                window.CampusOS.startRoute(lat, lng, name);
                return true;
            }
            if (typeof window.RouteModule !== 'undefined' && typeof window.RouteModule.calculateRoute === 'function') {
                window.RouteModule.calculateRoute(lat, lng, name);
                return true;
            }
            return false;
        },

        flyToBuilding(b) {
            if (!b || typeof window === 'undefined') return;
            if (window.ViewControllerModule && window.ViewControllerModule.getMode() === '3D') {
                window.CesiumViewerModule?.syncCameraFrom2D(b.lng, b.lat, 18);
            }
            if (window.map && typeof window.map.flyTo === 'function') {
                window.map.flyTo({ center: [b.lng, b.lat], zoom: 19, duration: 800, essential: true });
            }
        },

        fallbackSearch(text) {
            if (!text || typeof document === 'undefined') return;
            const input = document.getElementById('searchInput');
            if (input) {
                input.value = text;
                input.focus();
                if (typeof window.doSearch === 'function') {
                    window.doSearch(text);
                } else {
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        },

        notify(msg) {
            if (typeof window !== 'undefined' && window.CampusOS && typeof window.CampusOS.showToast === 'function') {
                window.CampusOS.showToast(msg);
            } else if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                window.showToast(msg);
            } else {
                console.log('[NaviBridge Notification]:', msg);
            }
        },

        /**
         * Main entry point: parses natural text and dispatches immediately
         */
        async askNavi(query) {
            this.notify('Asking Navi...');
            this.updateVoiceUI(true, `"${query}"`, 'Thinking...');
            const parseResult = await this.parse(query);
            if (parseResult && parseResult.success) {
                return this.execute(parseResult);
            } else {
                this.fallbackSearch(query);
                this.updateVoiceUI(true, `Searching directory for "${query}"`, 'Directory');
                this.autoHideVoiceUI(3000);
                return false;
            }
        },

        // Backward compatibility alias
        askCharlie(query) {
            return this.askNavi(query);
        }
    };

    // Auto-check health in browser environment
    if (typeof window !== 'undefined') {
        window.NaviBridge = NaviBridge;
        window.addEventListener('DOMContentLoaded', () => {
            NaviBridge.checkHealth();
        });
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NaviBridge;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
