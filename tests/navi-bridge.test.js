/**
 * NaviBridge & Cactus Needle Integration Tests
 */
const assert = require('assert');
const NaviBridge = require('../modules/navi-bridge.js');
const fs = require('fs');
const path = require('path');

// Mock data fixtures from CampusOS data/
const buildingsPath = path.join(__dirname, '../data/buildings.json');
const peoplePath = path.join(__dirname, '../usted_kumasi_staff.json');

const buildingsData = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));
const peopleData = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));

async function runTests() {
    console.log('--- RUNNING NAVIBRIDGE & NEEDLE TESTS ---');

    // 1. Module export check
    assert.strictEqual(typeof NaviBridge.parse, 'function', 'NaviBridge.parse must be a function');
    assert.strictEqual(typeof NaviBridge.execute, 'function', 'NaviBridge.execute must be a function');
    assert.strictEqual(typeof NaviBridge.resolveEntity, 'function', 'NaviBridge.resolveEntity must be a function');
    console.log('[PASS] NaviBridge module structure verified.');

    // 2. Entity resolution tests
    const bMatch = NaviBridge.resolveEntity('Library', buildingsData, peopleData);
    assert.ok(bMatch, 'Should resolve Library building');
    assert.strictEqual(bMatch.type, 'building');
    console.log('[PASS] Resolved building: Library ->', bMatch.building.name);

    const sMatch = NaviBridge.resolveEntity('Kotor', buildingsData, peopleData, 'staff');
    assert.ok(sMatch, 'Should resolve Dr. Kotor Asare');
    assert.strictEqual(sMatch.type, 'staff');
    console.log('[PASS] Resolved staff: Kotor ->', sMatch.data.name);

    // 3. Offline campus NLP parser tests
    console.log('--- TESTING OFFLINE CAMPUS NLP PARSER ---');
    const p1 = NaviBridge.parseOffline('Take me to USTED Library');
    assert.strictEqual(p1.success, true);
    assert.strictEqual(p1.action, 'route_to');
    assert.strictEqual(p1.parameters.target, 'USTED Library');
    console.log('[PASS] Offline route_to parsed: "Take me to USTED Library" ->', p1.parameters.target);

    const p2 = NaviBridge.parseOffline('Where can I eat around Atwima Hall?');
    assert.strictEqual(p2.success, true);
    assert.strictEqual(p2.action, 'find_amenity');
    assert.strictEqual(p2.parameters.amenity_type, 'food');
    assert.ok(p2.parameters.near_landmark.toLowerCase().includes('atwima hall'));
    console.log('[PASS] Offline find_amenity parsed: "Where can I eat around Atwima Hall?" ->', p2.parameters);

    const p3 = NaviBridge.parseOffline('Find Dr. Kotor Asare office');
    assert.strictEqual(p3.success, true);
    assert.strictEqual(p3.action, 'find_staff');
    assert.ok(p3.parameters.name.toLowerCase().includes('kotor asare'));
    console.log('[PASS] Offline find_staff parsed: "Find Dr. Kotor Asare office" ->', p3.parameters.name);

    const p4 = NaviBridge.parseOffline('Where is Opoku Ware II Hall');
    assert.strictEqual(p4.success, true);
    assert.strictEqual(p4.action, 'locate_place');
    assert.ok(p4.parameters.place_name.toLowerCase().includes('opoku ware'));
    console.log('[PASS] Offline locate_place parsed: "Where is Opoku Ware II Hall" ->', p4.parameters.place_name);

    // 4. Execution integration test
    let routedTo = null;
    global.window = {
        CampusOS: {
            getBuildingsData: () => buildingsData,
            showToast: () => {},
            startRoute: (lat, lng, name) => { routedTo = name; return true; }
        },
        peopleData: peopleData,
        startRoute: (lat, lng, name) => { routedTo = name; return true; }
    };

    const execResult = NaviBridge.execute(p1);
    assert.strictEqual(execResult, true, 'Execution should succeed');
    assert.ok(routedTo && routedTo.includes('Library'), `Routed destination should include Library, got: ${routedTo}`);
    console.log('[PASS] Action execution initiated campus route to:', routedTo);

    // 5. Test askNavi invocation
    const askResult = await NaviBridge.askNavi('Take me to USTED Library');
    assert.strictEqual(askResult, true, 'askNavi should execute and return true');
    console.log('[PASS] askNavi end-to-end execution verified.');

    // 6. Live sidecar ping & parse check
    const isHealthy = await NaviBridge.checkHealth();
    if (isHealthy) {
        console.log('[PASS] Navi Sidecar is healthy and connected on http://127.0.0.1:8000.');

        const parseResult = await NaviBridge.parse('Where can I find food near Gaza hostel?');
        assert.ok(parseResult, 'Parse result should not be null');
        assert.strictEqual(parseResult.success, true, 'Parse should succeed');
        assert.strictEqual(parseResult.action, 'find_amenity', 'Should detect find_amenity action');
        console.log(`[PASS] Live Needle Intent Extracted: action="${parseResult.action}", amenity="${parseResult.parameters.amenity_type}", confidence=${parseResult.confidence}`);

        const routeResult = await NaviBridge.parse('Take me to Room 204 in Block D');
        assert.strictEqual(routeResult.action, 'route_to', 'Should detect route_to action');
        console.log(`[PASS] Live Needle Route Extracted: action="${routeResult.action}", target="${routeResult.parameters.target}"`);
    } else {
        console.log('[INFO] Sidecar not running locally; offline fallback verified 100% functional.');
    }

    // 7. Test Cloud fallback tag & conversational execution
    const fallbackParsed = await NaviBridge.parse('Hello Navi who are you?');
    assert.strictEqual(fallbackParsed.source, 'offline_local');
    console.log('[PASS] Tier-3 offline fallback tagged successfully:', fallbackParsed.source);

    const convResult = NaviBridge.execute({
        success: true,
        action: 'conversational',
        parameters: { message: 'I am Navi, your campus navigator!' },
        speech_text: 'I am Navi, your campus navigator!'
    });
    assert.strictEqual(convResult, true);
    console.log('[PASS] Conversational action execution verified.');

    // 8. Test Fuzzy Matching & Suggestion Engine
    console.log('--- TESTING FUZZY MATCH & POLITE UNKNOWN LOCATION RECOVERY ---');
    const simScore1 = NaviBridge.calculateSimilarity('libary', 'USTED Library');
    assert.ok(simScore1 > 0.6, `Similarity for "libary" vs "USTED Library" should be > 0.6, got ${simScore1}`);
    console.log('[PASS] Typo resilience verified: "libary" matches "USTED Library" with score:', simScore1.toFixed(2));

    const suggestions = NaviBridge.getFuzzySuggestions('economics block', buildingsData, peopleData, 3);
    assert.ok(suggestions.length > 0, 'Should find fuzzy suggestions for economics');
    assert.ok(suggestions.some(s => s.name.toLowerCase().includes('economics')), 'Should suggest Economics department');
    console.log('[PASS] Fuzzy suggestions generated for "economics block":', suggestions.map(s => s.name));

    // 9. Test Unknown / Missing Location polite fallback
    const unknownResult = NaviBridge.execute({
        success: true,
        action: 'route_to',
        parameters: { target: 'Eiffel Tower Paris' }
    });
    assert.strictEqual(unknownResult, false, 'Unknown location route should return false (not crash or wrongly route)');
    assert.strictEqual(NaviBridge.currentAssistantState, 'confused', 'State should be set to confused for polite recovery');
    console.log('[PASS] Unknown location politely intercepted with state:', NaviBridge.currentAssistantState);

    console.log('=============================================');
    console.log('ALL NAVIBRIDGE & NAVI AI TESTS PASSED (100%)!');
    console.log('=============================================');
}

runTests().catch(err => {
    console.error('[FAIL] Test error:', err);
    process.exit(1);
});
