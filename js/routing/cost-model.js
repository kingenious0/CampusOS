/**
 * Cost Model & Routing Profiles — CampusOS Routing Engine V2
 * Calculates traversal impedance for edges based on distance, mode, accessibility,
 * stairs, elevators, ramps, and status restrictions.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CostModel = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // Default walking speed: 1.35 m/s (~4.86 km/h typical pedestrian walking pace)
    const DEFAULT_WALKING_SPEED = 1.35;

    // Configurable traversal penalties (in equivalent meters of travel effort or seconds)
    // NOTE: These values are initial baseline estimates and require empirical calibration.
    const DEFAULT_PENALTIES = Object.freeze({
        // Stair traversal effort penalty factor (pedestrian profile):
        // climbing stairs is physically more effortful than flat walking
        STAIRS_EFFORT_FACTOR: 2.0,

        // Elevator wait & transit baseline penalty in seconds
        LIFT_BASE_WAIT_SECONDS: 25.0,

        // Ramp effort factor (mild gradient)
        RAMP_EFFORT_FACTOR: 1.2,

        // Building entrance transition delay (door opening, navigation re-orientation)
        DOORWAY_TRANSITION_SECONDS: 3.0,

        // Crossing delay (pedestrian road crossing caution)
        CROSSING_DELAY_SECONDS: 5.0
    });

    /**
     * Pedestrian Profile:
     * Standard walking routing. Prefers walkways and paths, permits stairs and ramps.
     */
    function getPedestrianEdgeCost(edge, options = {}) {
        if (!edge || edge.status === 'closed') {
            return { traversable: false, cost: Infinity, durationSeconds: Infinity };
        }

        const distance = edge.distanceMeters;
        const walkingSpeed = options.walkingSpeed || DEFAULT_WALKING_SPEED;
        let baseTime = distance / walkingSpeed;
        let costMultiplier = 1.0;
        let fixedTimePenalty = 0;

        switch (edge.type) {
            case 'stairs':
                costMultiplier = DEFAULT_PENALTIES.STAIRS_EFFORT_FACTOR;
                break;
            case 'ramp':
                costMultiplier = DEFAULT_PENALTIES.RAMP_EFFORT_FACTOR;
                break;
            case 'lift':
                fixedTimePenalty = DEFAULT_PENALTIES.LIFT_BASE_WAIT_SECONDS;
                break;
            case 'crossing':
                fixedTimePenalty = DEFAULT_PENALTIES.CROSSING_DELAY_SECONDS;
                break;
            case 'doorway':
            case 'entrance':
                fixedTimePenalty = DEFAULT_PENALTIES.DOORWAY_TRANSITION_SECONDS;
                break;
            default:
                break;
        }

        const totalDuration = (baseTime * costMultiplier) + fixedTimePenalty;
        // Cost corresponds directly to effective impedance (seconds)
        return {
            traversable: true,
            cost: totalDuration,
            durationSeconds: totalDuration,
            distanceMeters: distance
        };
    }

    /**
     * Accessible Profile:
     * Barrier-free routing (wheelchairs, strollers, heavy luggage).
     * Strictly avoids stairs (cost = Infinity). Requires accessible edges.
     */
    function getAccessibleEdgeCost(edge, options = {}) {
        if (!edge || edge.status === 'closed') {
            return { traversable: false, cost: Infinity, durationSeconds: Infinity };
        }

        // Accessibility filter: strictly disallow stairs or edges marked accessible: false
        if (edge.type === 'stairs' || edge.accessible === false) {
            return { traversable: false, cost: Infinity, durationSeconds: Infinity };
        }

        const distance = edge.distanceMeters;
        const walkingSpeed = options.walkingSpeed || (DEFAULT_WALKING_SPEED * 0.9); // slightly adjusted pace
        let baseTime = distance / walkingSpeed;
        let costMultiplier = 1.0;
        let fixedTimePenalty = 0;

        switch (edge.type) {
            case 'ramp':
                costMultiplier = DEFAULT_PENALTIES.RAMP_EFFORT_FACTOR * 1.1;
                break;
            case 'lift':
                fixedTimePenalty = DEFAULT_PENALTIES.LIFT_BASE_WAIT_SECONDS;
                break;
            case 'crossing':
                fixedTimePenalty = DEFAULT_PENALTIES.CROSSING_DELAY_SECONDS * 1.2;
                break;
            case 'doorway':
            case 'entrance':
                fixedTimePenalty = DEFAULT_PENALTIES.DOORWAY_TRANSITION_SECONDS;
                break;
            default:
                break;
        }

        const totalDuration = (baseTime * costMultiplier) + fixedTimePenalty;
        return {
            traversable: true,
            cost: totalDuration,
            durationSeconds: totalDuration,
            distanceMeters: distance
        };
    }

    /**
     * Main costing dispatcher
     */
    function calculateEdgeCost(edge, profileName = 'pedestrian', options = {}) {
        if (profileName === 'accessible' || profileName === 'wheelchair') {
            return getAccessibleEdgeCost(edge, options);
        }
        return getPedestrianEdgeCost(edge, options);
    }

    return {
        DEFAULT_WALKING_SPEED,
        DEFAULT_PENALTIES,
        calculateEdgeCost
    };
}));
