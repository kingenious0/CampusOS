/**
 * Search Module - Smart campus location search for AAMUSTED
 */
const SearchModule = (() => {
    let searchInput, searchResults;
    let buildingsData = [];
    let debounceTimer;

    const typeLabels = {
        faculty: 'Faculty',
        lecture_hall: 'Lecture Hall / Lab',
        hostel: 'Hostel',
        administration: 'Administration',
        facility: 'Facility',
        service: 'Service',
        room: 'Room'
    };

    const typeColors = {
        faculty: '#4f46e5',
        lecture_hall: '#f59e0b',
        hostel: '#10b981',
        administration: '#ef4444',
        facility: '#8b5cf6',
        service: '#06b6d4',
        room: '#84cc16'
    };

    const SYNONYMS = {
        "lr": ["lecture room", "lecture hall", "classroom"],
        "lecture room": ["lr", "classroom"],
        "lab": ["laboratory", "workshop"],
        "work shop": ["workshop"],
        "library": ["lib"],
        "lib": ["library"],
        "mosque": ["masjid"],
        "clinic": ["medical", "hospital", "health"],
        "admin": ["administration", "registry"],
        "fbe": ["faculty of business education", "rob"],
        "fas": ["faculty of applied sciences"],
        "fte": ["faculty of technical education"],
        "ow": ["opoku ware"],
        "wc": ["washroom", "toilet", "restroom"],
        "washroom": ["wc", "toilet", "restroom"],
        "toilet": ["wc", "washroom", "restroom"],
        "restroom": ["wc", "washroom", "toilet"]
    };

    const init = () => {
        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');
        buildingsData = MapModule.getBuildingsData();

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => handleSearch(e.target.value), 200);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') clearSearch();
        });

        // Close results on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-section')) clearSearch();
        });
    };

    const fuzzyMatchScore = (text, token) => {
        if (token.length < 2) return 0;
        let textIdx = 0;
        let tokenIdx = 0;
        let score = 0;
        let matches = 0;

        while (textIdx < text.length && tokenIdx < token.length) {
            if (text[textIdx] === token[tokenIdx]) {
                tokenIdx++;
                matches++;
                score += 5;
                if (textIdx > 0 && text[textIdx - 1] === token[tokenIdx - 2]) {
                    score += 5;
                }
            } else {
                score -= 1;
            }
            textIdx++;
        }

        if (tokenIdx === token.length || matches >= token.length * 0.7) {
            return Math.max(5, score);
        }
        return 0;
    };

    const getMatchScore = (text, queryTokens, queryExpanded) => {
        if (!text) return 0;
        const normalized = text.toLowerCase();
        let totalScore = 0;
        let matchedAny = false;

        queryExpanded.forEach(token => {
            if (normalized.includes(token)) {
                matchedAny = true;
                totalScore += 30;
                if (normalized.startsWith(token)) {
                    totalScore += 15;
                }
            } else {
                const fuzzy = fuzzyMatchScore(normalized, token);
                if (fuzzy > 0) {
                    matchedAny = true;
                    totalScore += fuzzy;
                }
            }
        });

        const fullQuery = queryTokens.join(' ');
        if (normalized.includes(fullQuery)) {
            totalScore += 50;
            if (normalized === fullQuery) {
                totalScore += 100;
            }
        }

        return matchedAny ? totalScore : 0;
    };

    const handleSearch = (query) => {
        const rawQ = query.toLowerCase().trim();
        searchResults.innerHTML = '';

        if (rawQ.length < 2) return;

        // Split query into tokens and expand with synonyms
        const queryTokens = rawQ.split(/\s+/).filter(t => t.length > 0);
        const queryExpanded = [...queryTokens];
        queryTokens.forEach(token => {
            if (SYNONYMS[token]) {
                queryExpanded.push(...SYNONYMS[token]);
            }
        });

        let results = [];

        // Score buildings
        buildingsData.forEach(b => {
            let maxScore = 0;

            // Score name, shortName, description, department
            const nameScore = getMatchScore(b.name, queryTokens, queryExpanded) * 2.5;
            const shortNameScore = getMatchScore(b.shortName, queryTokens, queryExpanded) * 2.0;
            const descScore = getMatchScore(b.description, queryTokens, queryExpanded) * 1.0;
            const deptScore = getMatchScore(b.department, queryTokens, queryExpanded) * 1.5;

            maxScore = Math.max(nameScore, shortNameScore, descScore, deptScore);

            // Score facilities array
            if (b.facilities) {
                b.facilities.forEach(f => {
                    const fScore = getMatchScore(f, queryTokens, queryExpanded) * 1.2;
                    maxScore = Math.max(maxScore, fScore);
                });
            }

            if (maxScore > 0) {
                results.push({ ...b, matchScore: maxScore });
            }
        });

        // Score services
        buildingsData.filter(b => b.services).forEach(b => {
            b.services.forEach(s => {
                const sScore = getMatchScore(s.name, queryTokens, queryExpanded) * 2.0;
                if (sScore > 0) {
                    results.push({ ...s, building: b, type: 'service', matchScore: sScore });
                }
            });
        });

        // Score rooms
        buildingsData.filter(b => b.rooms).forEach(b => {
            b.rooms.forEach(r => {
                // Score number and keywords
                let rScore = getMatchScore(r.number, queryTokens, queryExpanded) * 2.2;
                if (r.keywords) {
                    r.keywords.forEach(kw => {
                        const kwScore = getMatchScore(kw, queryTokens, queryExpanded) * 1.5;
                        rScore = Math.max(rScore, kwScore);
                    });
                }
                if (rScore > 0) {
                    results.push({ ...r, building: b, type: 'room', matchScore: rScore });
                }
            });
        });

        // Sort by match score descending
        results.sort((a, b) => b.matchScore - a.matchScore);

        // De-duplicate results referencing the same building
        // If a building is matched multiple times (e.g. by name and rooms), keep the highest score
        const uniqueResults = [];
        const seen = new Set();
        results.forEach(r => {
            const key = r.type === 'service' ? `s-${r.building.id}-${r.name}` :
                        r.type === 'room' ? `r-${r.building.id}-${r.number}` : `b-${r.id}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(r);
            }
        });

        displayResults(uniqueResults.slice(0, 10), rawQ);
    };

    const displayResults = (results, query) => {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results" style="padding: 16px; text-align: center; color: var(--muted); font-size: 13px;">
                    <i class="fas fa-search-minus" style="font-size: 20px; display: block; margin-bottom: 8px;"></i>
                    <span>No results for "<strong>${query}</strong>"</span>
                </div>`;
            return;
        }

        results.forEach(r => {
            const item = document.createElement('div');
            item.className = 'result-item'; // aligned with CSS class name
            const color = typeColors[r.type] || '#6b7280';
            const label = typeLabels[r.type] || r.type;

            let displayName = r.name;
            let subtitle = label;

            if (r.type === 'service') {
                displayName = r.name;
                subtitle = `Service at ${r.building.name}`;
            } else if (r.type === 'room') {
                displayName = r.number;
                subtitle = `Room in ${r.building.name}`;
            }

            item.innerHTML = `
                <div class="result-dot" style="background:${color}"></div>
                <div class="result-name">
                    <strong>${highlightMatch(displayName, query)}</strong>
                    <span>${subtitle}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                if (r.type === 'service' || r.type === 'room') {
                    MapModule.centerOnBuilding(r.building);
                    BuildingModule.displayServiceOrRoom(r.building, r);
                } else {
                    MapModule.centerOnBuilding(r);
                    BuildingModule.displayInfo(r);
                }
                searchInput.value = displayName;
                searchResults.innerHTML = '';
            });
            searchResults.appendChild(item);
        });
    };

    const highlightMatch = (text, query) => {
        if (!text) return '';
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx !== -1) {
            return text.slice(0, idx) +
                `<mark style="background: rgba(79, 70, 229, 0.15); color: var(--accent); border-radius: 2px; padding: 0 2px;">${text.slice(idx, idx + query.length)}</mark>` +
                text.slice(idx + query.length);
        }
        
        // Token highlighting fallback
        const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
        let highlighted = text;
        tokens.forEach(token => {
            const regex = new RegExp(`(${token})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark style="background: rgba(79, 70, 229, 0.15); color: var(--accent); border-radius: 2px; padding: 0 2px;">$1</mark>');
        });
        return highlighted;
    };

    const clearSearch = () => {
        searchResults.innerHTML = '';
    };

    return { init };
})();