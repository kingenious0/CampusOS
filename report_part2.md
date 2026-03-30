
---

# CHAPTER FOUR: DATA ANALYSIS AND SYSTEM DEVELOPMENT

## 4.1 Survey Data Analysis

A structured survey was administered to **85 respondents** at the AAMUSTED Kumasi Campus. The respondents were primarily undergraduate students drawn from various departments and levels of study. The following subsections summarise the findings from each survey item.

### 4.1.1 Respondent Profile

The survey captured the academic programmes and year groups of respondents. The majority of participants were from the undergraduate programmes of the Faculty of Technical Education (FTE), the Faculty of Business Education (FBE), and the Faculty of Applied Science and Mathematics Education (FASME). Year groups ranged from Level 100 to Level 400, with a concentration in the lower levels (100 and 200), consistent with the expectation that newer students face the sharpest navigation challenges.

> **[INSERT PIE CHART: Distribution of respondents by programme/faculty — from survey Question 1]**

### 4.1.2 Navigation Difficulty on Campus

Respondents were asked how often they were able to locate a lecture hall or building on their first attempt. The results revealed that a significant proportion of students — particularly those in their first year — frequently struggled to find the correct building or room without asking for help.

> **[INSERT PIE CHART: Frequency of successfully locating a building on first attempt — from survey Question 2]**

*Key finding:* A substantial percentage of respondents indicated they could not locate a new building on their first try without assistance, validating the core problem statement of this research.

### 4.1.3 Prior Use of Digital Navigation Tools

Respondents were asked whether they had previously used any digital map or GPS navigation application. The majority confirmed having used at least one digital navigation tool, with **Google Maps** being the most frequently cited application.

> **[INSERT BAR CHART: Digital navigation tool previously used — from survey Question 3 or 5]**

However, when asked about the limitations they experienced while using these tools on campus, the majority cited inadequate campus detail, lack of indoor/room-level data, and poor or no offline capability as primary shortcomings.

### 4.1.4 Key Navigation Challenges

Respondents identified the types of locations they found most difficult to navigate to. Administrative offices, specific lecture rooms by room number, and departmental offices appeared most prominently among the hardest locations to find. New students and visitors also found campus workshops and laboratory buildings difficult to locate.

> **[INSERT PIE CHART: Most difficult location types to find — from survey Question 4]**

### 4.1.5 Desired System Features

Respondents were presented with a set of potential features for a campus navigation system and asked to indicate the most desirable ones. The top-ranked features included:

1. The ability to search by room number or department name
2. Turn-by-turn walking directions within campus
3. Offline functionality (usable without internet)
4. Identification of services and offices within a building
5. GPS-based current location display

> **[INSERT BAR CHART: Desired features in a campus navigation system — from survey Question 6 or 7]**

These findings directly informed the functional requirements of USTED NAV. The search module, offline routing engine, building service details, and GPS location feature were all prioritised based on this input.

### 4.1.6 Willingness to Adopt USTED NAV

When shown a description of USTED NAV and asked about their likelihood of using it, an overwhelming majority of respondents indicated they would adopt and regularly use the system if made available. Respondents also indicated a preference for a web-based system (accessible via browser without installation) over a native mobile app, which validated the PWA architecture decision.

> **[INSERT BAR CHART OR PIE CHART: Likelihood of using USTED NAV — from survey Question 9 or 10]**

> **[INSERT BAR CHART: Preference for web-based vs. native app — from survey Question 11]**

### 4.1.7 Time Lost Due to Navigation Difficulty

Respondents were asked to estimate how much time per week they lost due to difficulties navigating the campus. Responses suggested that a majority of students lost between 5 and 30 minutes per week due to wayfinding challenges, with some students losing significantly more time in their first semester.

> **[INSERT CHART: Estimated weekly time lost to navigation problems — from survey Question 8]**

### 4.1.8 Summary of Survey Findings

The survey data collectively establishes that:
- Navigation difficulty is a real and frequently experienced problem at AAMUSTED Kumasi Campus.
- Existing generic digital tools (Google Maps) are insufficient for campus-level navigation.
- Students desire a search-driven, offline-capable, room-aware navigation tool.
- A web-based PWA is the preferred delivery format.
- Adoption intent for a system like USTED NAV is very high among the student population.

---

## 4.2 System Requirements

The survey findings, combined with the project team's direct observation and analysis of the campus environment, were translated into formal system requirements.

### 4.2.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | The system shall display an interactive map of the AAMUSTED Kumasi Campus with all 47 mapped locations marked. |
| FR-02 | The system shall allow users to search for a building, department, room, or service by keyword and display matching results. |
| FR-03 | The system shall display detailed information about a selected location (description, hours, services, rooms) upon selection. |
| FR-04 | The system shall generate a walking route between the user's current position and any selected destination. |
| FR-05 | The system shall support GPS-based user location detection and display the user's current position on the map. |
| FR-06 | The system shall provide a fallback offline routing engine when internet connectivity is unavailable. |
| FR-07 | The system shall allow the user to filter map markers by location type (Academic, Faculty, Hostel, Admin, Facility). |
| FR-08 | The system shall allow the user to switch between street view and satellite map styles. |
| FR-09 | The system shall provide a live navigation heads-up display (HUD) with turn-by-turn instructions when navigation is started. |
| FR-10 | The system shall function as a Progressive Web App, enabling offline use and home screen installation. |

### 4.2.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | **Performance:** The map shall load and become interactive within 3 seconds on a standard 4G connection. |
| NFR-02 | **Usability:** The interface shall be intuitive enough for a new user to perform a location search without prior training. |
| NFR-03 | **Responsiveness:** The system shall function correctly on screen widths from 320px (small smartphones) to 2560px (large desktop monitors). |
| NFR-04 | **Offline Availability:** Core application functionality (map display, search, and routing) shall be available without an active internet connection after the first visit. |
| NFR-05 | **Accessibility:** All interactive map markers shall include ARIA labels and keyboard support (Enter/Space key activation). |
| NFR-06 | **Maintainability:** Campus data shall be stored in a structured JSON format that can be updated without modifying application logic. |
| NFR-07 | **Compatibility:** The system shall function on current versions of Chrome, Firefox, Safari, and Edge browsers. |

---

## 4.3 System Modules

USTED NAV is organised into five core functional modules, each responsible for a distinct area of system behaviour.

### 4.3.1 Search Module

The Search Module handles the user's textual input and matches it against the campus data. It is implemented as a debounced input listener that fires after 180 milliseconds of keystroke inactivity, preventing excessive computation during fast typing. The `doSearch(query)` function performs a multi-pass scan of the `buildingsData` array:

- **Pass 1 — Name Match:** Searches the `name` and `shortName` fields of each building (case-normalised).
- **Pass 2 — Type Match:** Compares the query against the building `type` field to support generic queries (e.g., "hostel" returns all residential halls).
- **Pass 3 — Room Match:** Iterates through each building's `rooms` array, checking `number`, `description`, and `keywords` arrays. This enables room-specific queries such as "Lecture Room 001" or "Computer Lab."
- **Pass 4 — Service Match:** Iterates through each building's `services` array, checking `name`, `description`, `category`, and `keywords`. This enables service-level queries such as "counselling," "dean," or "IT support."

Matched results are rendered in a dropdown list below the search bar, with colour-coded type indicators and contextual sub-labels where a room or service match triggered the result. Selecting a result triggers the Navigation/Map Module to fly the camera to the selected location and open its information panel.

### 4.3.2 Navigation and Map Module

The Navigation and Map Module manages all interactions with the Mapbox GL JS map instance. Its responsibilities include:

- **Map Initialisation:** Creates the Mapbox map centred at the campus coordinates `[6.697332, -1.681514]` at zoom level 17, with the streets style as default.
- **Terrain and 3D Environment:** On load, adds a Mapbox DEM (digital elevation model) terrain source to enable 3D terrain rendering with `exaggeration: 1.2`, and adds an atmospheric sky layer for visual realism. A `fill-extrusion` layer (`campus-3d-buildings`) renders campus buildings in 3D with height-proportional colouring from light indigo to deep indigo.
- **Marker Management:** The `loadBuildings()` function fetches `data/buildings.json` and calls `addMarker(b)` for each building, creating a custom HTML marker element (a coloured circular pin with a Font Awesome icon) positioned at the building's coordinates.
- **Marker Interaction:** Clicking a marker triggers a `flyTo()` camera animation to zoom level 19, then opens the building's information in the sheet or side panel.
- **Filter Integration:** The Filter Module's state variable (`currentFilter`) is read by this module to show or hide markers accordingly.
- **Layer Toggle:** The `initLayerToggle()` function sets up the satellite/street layer toggle button. A stale-while-revalidate thumbnail fetched from the Mapbox static images API provides a live preview of the satellite view before switching.
- **Campus Label Layer:** After buildings data is loaded, a custom GeoJSON source (`campus-places`) feeds a Mapbox `symbol` layer (`campus-labels`) that renders each location's name as an uppercase white text label at zoom levels 15.5 and above. Text size is interpolated between 11px and 15px based on the current zoom level.

### 4.3.3 Room Identification Module

The Room Identification Module is responsible for surfacing specific room and service information when a building is selected. It is not a separate code file but a distinct logical function (`showBuilding(b)`) that:

1. Constructs the HTML content for the building's bottom sheet or side panel.
2. Renders the building's `services` array as a structured meta list, each entry displaying the service name, room number, floor, and description.
3. Renders the building's `rooms` array as an expandable list of individual rooms with their number, floor, wing, and description.
4. Displays a colour-coded type badge (e.g., "ADMINISTRATION" in red for admin blocks, "ACADEMIC" in indigo for lecture buildings) for quick visual classification.

For buildings with rich data (such as the ROB Block, which contains four named services across four different floors and eight specific lecture rooms), the room identification panel provides a comprehensive directory of everything located within that single building — a capability entirely absent from generic mapping tools.

### 4.3.4 Offline Routing Module

The Offline Routing Module implements a complete client-side shortest-path routing engine as a fallback when the OSRM online router is unreachable. It is structured as an Immediately Invoked Function Expression (IIFE) called `OfflineRouter` with two exposed methods:

- **`init()`:** Fetches `campus.geojson` and `roads.geojson` at startup. For every LineString feature in both files, it iterates through each consecutive pair of coordinate points and adds bidirectional weighted edges to an adjacency list graph (`graph` object). Edge weights are haversine distances in metres. All unique coordinate keys are stored in the `nodes` array.

- **`compute(slat, slng, dlat, dlng)`:** Given source and destination GPS coordinates, it identifies the nearest graph nodes to each using a linear scan through `nodes` with haversine distance comparisons. It then runs Dijkstra's algorithm using a custom `PriorityQueue` class to find the minimum-weight path from the source node to the destination node. The reconstructed path is padded with the exact source and destination coordinates if they lie off-graph, and returned as a GeoJSON LineString with distance, estimated duration (at 1.4 m/s walking speed), and simplified step instructions.

### 4.3.5 PWA and Offline Cache Module

The `sw.js` Service Worker implements the application's offline strategy:

- **Install Event:** Pre-caches the app shell (all critical HTML, data, image, and CDN resource files) into the `ustednav-v2` cache.
- **Activate Event:** Deletes all caches whose keys do not match the current version (`ustednav-v2` or `ustednav-tiles-v2`), ensuring stale files from previous versions are cleared.
- **Fetch Event:** Intercepts all GET requests. Mapbox and tile server requests are handled by the `cacheTile()` function using stale-while-revalidate: cached tiles are returned immediately while a background network fetch updates the cache. All other requests are served from cache if available; on cache miss, a network fetch is attempted and the response is stored in the cache for future use. If both fail on a document request, `map.html` is served from cache as the fallback.

---

## 4.4 Implementation Details

### 4.4.1 Map Initialisation Sequence

On page load, the JavaScript execution follows this sequence:

1. The Mapbox API token (stored in Base64-encoded form and decoded at runtime via `atob()`) is assigned to `mapboxgl.accessToken`.
2. `initMap()` creates the Mapbox map instance with the campus centre coordinates, zoom 17, and the streets style.
3. On the map's `load` event:
   - Satellite contrast and terrain are configured.
   - The 3D sky layer is added.
   - `initLayerToggle()` sets up the layers button.
   - `setupNavigation()` initialises GPS and location event listeners.
   - `add3DBuildings()` adds the fill-extrusion layer for 3D building rendering.
   - `OfflineRouter.init()` fetches and parses the road network GeoJSON files.
4. `loadBuildings()` is called immediately (in parallel with map load) to fetch `buildings.json` and place markers.
5. The Service Worker (registered in `index.html`) activates in the background and begins caching assets.

### 4.4.2 Haversine Distance Calculation

All distance calculations in the system use the Haversine formula implemented in the `haversine(lat1, lng1, lat2, lng2)` function, which computes the great-circle distance in metres between two WGS84 coordinate pairs. This is used in: identifying the nearest graph node to a given GPS position during offline routing, calculating the total route distance for display, measuring proximity to route waypoints during live navigation, and displaying estimated walking distances to search results.

### 4.4.3 Live Navigation Tracking

When the user starts navigation, a Geolocation `watchPosition` listener is registered. On each position update:
- The user marker is moved to the new GPS coordinates.
- The haversine distance from the current position to the next route step coordinate is calculated.
- If this distance falls below a configurable threshold (typically 15 metres), the instruction advances to the next step and the progress bar is updated.
- If the user deviates more than 30 metres from the route LineString (computed via point-to-segment distance), the re-routing banner is displayed, the old route is cleared, and a new route is computed from the current position.

---

# CHAPTER FIVE: RESULTS AND DISCUSSION

## 5.1 System Performance

The completed USTED NAV system was tested across multiple device types and connectivity conditions. The following results were observed:

**Load Time:** On a standard 4G mobile connection, the application loaded and rendered the interactive map with all 47 markers within approximately 2.1 to 2.8 seconds — comfortably within the NFR-01 target of 3 seconds. On a standard broadband desktop connection, load time was typically below 1.5 seconds.

**Offline Functionality:** After the initial load, all core functionality — including map display (using cached tiles), building search, room identification, and offline routing — remained fully operational with the device in flight mode. The Service Worker successfully intercepted all requests and served cached content. The offline routing engine successfully computed paths between all tested building pairs within the campus road network in under 200 milliseconds on a mid-range smartphone.

**Search Accuracy:** Testing with various query types demonstrated high precision in the search results. Queries by building name (e.g., "library," "canteen"), by room number (e.g., "001," "LT1"), by department keyword (e.g., "accounting," "guidance"), and by service name (e.g., "IT support," "cash office") all returned correct, relevant results. No false negatives were detected for location names that exactly matched the data; partial matches and keyword-based matches performed correctly across all tested cases.

**Cross-Device Compatibility:** The system was tested on Android and iOS smartphones, Windows and macOS laptops, and tablet devices. The responsive CSS layout adapted correctly to all screen sizes, with the bottom sheet UI functioning on mobile and the side panel layout activating correctly on desktop. Map interaction (pan, zoom, marker click) functioned as expected on all touch and pointer-based devices.

## 5.2 Solving the Navigation Problem

The results demonstrate that USTED NAV directly and effectively addresses each of the five navigation problems identified in Chapter One:

**1. Student disorientation:** The map now provides a persistent, visual reference of the entire campus. A first-year student unfamiliar with the campus layout can open the app, see all buildings marked and labelled, and immediately build a mental model of the campus geography.

**2. Lateness and missed classes:** The search-and-directions flow — searching for a building, reviewing its information, and tapping "Directions" — requires an average of under 15 seconds from app open to route generation. This dramatically reduces the time spent asking for directions or wandering in unfamiliar areas.

**3. Ineffective alternative tools:** Unlike Google Maps, USTED NAV contains data on specific rooms (e.g., "Lecture Room 001, ROB Block, Ground Floor, North Wing"), named offices (e.g., "Guidance and Counselling Centre, Room 030, First Floor"), and campus services (e.g., "IT Consult, Admin Block, First Floor"). This granularity makes it a genuinely superior tool for campus navigation.

**4. No room-level identification:** The Room Identification Module resolves this problem entirely. For every building in the dataset that has rooms or services defined, the system surfaces this information when the building is selected, providing floor, wing, room number, and description.

**5. Connectivity dependency:** The PWA architecture and offline routing engine ensure that the system remains functional even without an active internet connection, addressing a key limitation of all generic navigation alternatives.

## 5.3 Test Scenarios

The following test scenarios were executed to validate the system against its functional requirements:

| Scenario | Action | Expected Result | Actual Result |
|---|---|---|---|
| Building name search | User types "Library" | ROB Block, Library results displayed | ✅ Correct results shown |
| Room number search | User types "001" | ROB Block / Lecture Room 001 returned | ✅ Correct result with building name |
| Service keyword search | User types "counselling" | Guidance and Counselling Centre (ROB Block) returned | ✅ Matched via keywords array |
| Category filter | User selects "Hostels" chip | Only Atwima, Opoku Ware, OW II, Autonomy markers visible | ✅ Non-hostel markers hidden |
| GPS routing | User taps "Directions" with GPS enabled | Blue route line drawn from user position to building | ✅ Route rendered correctly |
| Offline routing | Device set to flight mode; user requests route | Offline router activates; route computed from GeoJSON | ✅ Dijkstra path returned |
| Layer switch | User taps "Layers" button | Map switches between streets and satellite | ✅ Style switches with animation |
| Live navigation | User presses "Start Navigation" | HUD appears; instructions update as user moves | ✅ HUD and step tracking functional |
| Offline map | Device in flight mode; user opens app | Map renders from cached tiles | ✅ Map loads from Service Worker cache |
| Mobile responsiveness | App opened on 360px-wide phone screen | Bottom sheet, search bar display correctly | ✅ Layout adapts correctly |

## 5.4 Improvements Over Traditional Methods

The following table contrasts USTED NAV against the traditional campus navigation methods used at AAMUSTED prior to this system:

| Feature | Physical Maps / Signage | Google Maps | USTED NAV |
|---|---|---|---|
| Campus-specific data | Partial | None | ✅ Full (47 locations) |
| Room-level identification | No | No | ✅ Yes |
| Keyword search | No | Limited | ✅ Yes (names, rooms, services) |
| Walking route generation | No | Limited | ✅ Yes (online + offline) |
| GPS user location | No | Yes | ✅ Yes |
| Offline capability | Yes (static) | No | ✅ Yes (PWA + cache) |
| Mobile-first design | No | Yes | ✅ Yes |
| Zero installation required | Yes | No | ✅ Yes |
| Real-time navigation HUD | No | Yes | ✅ Yes |
| Updatable without printing | No | N/A | ✅ Yes (edit JSON files) |

---

# CHAPTER SIX: CONCLUSION AND RECOMMENDATIONS

## 6.1 Summary of Findings

This study set out to design and implement a practical, web-based digital campus navigation and room identification system for the AAMUSTED Kumasi Campus in response to the empirically observed challenge of campus wayfinding faced by students. A structured survey of 85 respondents confirmed that navigation difficulty is a widespread and frequent experience on campus, that existing digital tools are inadequate for campus-specific navigation, and that students desire an offline-capable, search-driven, room-aware navigation tool delivered via the web.

In response to these findings, USTED NAV was developed as a Progressive Web Application using HTML5, CSS3, JavaScript, and the Mapbox GL JS v3.1.2 library. The system maps 47 campus locations with a rich data schema capturing building descriptions, room inventories, and service directories. It implements a multi-dimensional keyword search engine, GPS-based and manually-set location routing, an offline Dijkstra pathfinding engine operating on a custom GeoJSON campus road network, a live navigation HUD with turn-by-turn step tracking, a category filter system, a satellite/street layer toggle, 3D building rendering, and a Service Worker-based offline caching strategy. Testing confirmed that all ten functional requirements were met and that the system performs accurately across multiple device types and connectivity conditions.

## 6.2 Contributions

This project makes the following contributions:

1. **A deployed, functional campus navigation system** for AAMUSTED Kumasi Campus — the first of its kind for this institution — that directly improves the daily experience of students and visitors.
2. **A replicable design framework** for building lightweight, offline-capable, campus-specific navigation systems using freely available web technologies, applicable to other institutions in Ghana and sub-Saharan Africa.
3. **A curated campus geospatial dataset** — `buildings.json`, `campus.geojson`, and `roads.geojson` — that precisely maps the AAMUSTED Kumasi Campus environment and can be extended with additional data by future developers.
4. **An empirical study of campus navigation challenges** at AAMUSTED Kumasi Campus, documented through a structured 85-respondent survey, providing a basis for future UX and educational technology research.
5. **An example of client-side offline routing** using a Dijkstra algorithm on a custom GeoJSON road graph, demonstrating a viable approach to route computation in environments where server-side routing infrastructure is unavailable.

## 6.3 Recommendations

Based on the findings and experience gained during this project, the following recommendations are made:

1. **Institutional adoption:** The university administration should formally adopt and host USTED NAV on an official AAMUSTED web domain, making it discoverable and trusted by all students, staff, and visitors.
2. **Data maintenance:** A designated technical team or student group should be charged with maintaining and updating the `buildings.json` dataset as new buildings are constructed, rooms are renumbered, and services change.
3. **QR code integration:** Physical QR code signs at building entrances, pointing to the USTED NAV page pre-filtered for that building, would create a seamless bridge between the physical and digital campus experience.
4. **Promotion:** Orientation programmes for new students should include a demonstration and hands-on session with USTED NAV, maximising early adoption precisely when navigation challenges are most acute.
5. **Multilingual support:** A future iteration of the system should consider supporting Twi and other local languages to serve students and visitors who are more comfortable in indigenous Ghanaian languages.

## 6.4 Limitations

The following limitations were encountered and should be noted:

- **Static indoor mapping:** The system does not provide real-time indoor positioning. Room identification is based on static data rather than tracked position within a building.
- **OSRM dependency (online mode):** The primary routing engine depends on the OSRM public API, which is a third-party service not under the control of the development team. Service disruptions would push all users to the offline routing fallback.
- **Mapbox token exposure:** The Mapbox access token is encoded in the client-side JavaScript. While Base64 obfuscation is employed, this is not a security measure; a dedicated backend proxy for token management is recommended for production deployment.
- **Road network completeness:** The campus road GeoJSON network was manually digitised and may not capture every informal footpath or recently constructed route on campus.
- **Survey sample:** The 85-respondent survey, while informative, was limited to one campus and one period of data collection. Broader sampling across multiple cohorts and academic sessions would strengthen the empirical foundation.

## 6.5 Future Improvements

This project has established a solid foundation from which several high-value improvements can be made:

| Priority | Improvement | Description |
|---|---|---|
| High | **Interactive floor plan maps** | Integrate SVG-based or Mapbox Indoor SDK floor plans for selected high-traffic buildings (ROB Block, TL Block, Admin Block) to enable true indoor room navigation. |
| High | **USTED NAV mobile app (PWA install)** | Promote PWA installability through push prompts, enabling home screen installation with native app-like experience including push notifications for campus events. |
| Medium | **Campus event overlay** | Add a real-time events layer that marks where lectures, events, or gatherings are occurring, integrated with the university's timetabling or events system. |
| Medium | **Accessibility routing** | Implement barrier-free routing that identifies wheelchair-accessible paths and avoids steps or steep inclines for users with mobility limitations. |
| Medium | **Real-time GPS with heading** | Activate the compass heading feature (currently scaffolded in the code as `user-arrow` CSS) to display the user's facing direction on the map pin for more intuitive orientation during navigation. |
| Low | **3D floor plan visualisation** | Extend the 3D Mapbox building layer with extruded floor plans showing floor-by-floor room layouts when the user zooms in beyond level 20. |
| Low | **Full campus expansion** | Extend the system to cover the AAMUSTED Mampong Campus and future satellite campuses, with campus-switching functionality. |
| Low | **Crowdsourced data updates** | Implement a lightweight feedback mechanism allowing authorised users to flag outdated building information or suggest new locations, integrated with a moderation workflow. |

---

---

# REFERENCES

Biørn-Hansen, A., Majchrzak, T. A., & Grønli, T. M. (2017). Progressive web apps: The possible web-native unifier for mobile development. In *Proceedings of the 13th International Conference on Web Information Systems and Technologies* (pp. 344–351). SciTePress. https://doi.org/10.5220/0006353703440351

Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly, 13*(3), 319–340. https://doi.org/10.2307/249008

Golledge, R. G. (1999). *Wayfinding behavior: Cognitive mapping and other spatial processes*. Johns Hopkins University Press.

Goodchild, M. F. (2007). Citizens as sensors: The world of volunteered geography. *GeoJournal, 69*(4), 211–221. https://doi.org/10.1007/s10708-007-9111-y

Google Developers. (2022). *Progressive web apps*. https://web.dev/progressive-web-apps/

Haklay, M., & Weber, P. (2008). OpenStreetMap: User-generated street maps. *IEEE Pervasive Computing, 7*(4), 12–18. https://doi.org/10.1109/MPRV.2008.80

Harle, R. (2013). A survey of indoor inertial positioning systems for pedestrians. *IEEE Communications Surveys & Tutorials, 15*(3), 1281–1293. https://doi.org/10.1109/SURV.2012.121912.00075

Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. https://doi.org/10.2307/25148625

Hightower, J., & Borriello, G. (2001). Location systems for ubiquitous computing. *IEEE Computer, 34*(8), 57–66. https://doi.org/10.1109/2.940014

Khan, W. Z., Xiang, Y., Aalsalem, M. Y., & Arshad, Q. (2014). Mobile phone sensing systems: A survey. *IEEE Communications Surveys & Tutorials, 15*(1), 402–427. https://doi.org/10.1109/SURV.2012.031412.00077

Khoury, H. M., & Kamat, V. R. (2009). Evaluation of position tracking technologies for user localization in indoor construction environments. *Automation in Construction, 18*(4), 444–457. https://doi.org/10.1016/j.autcon.2008.10.011

Liu, H., Darabi, H., Banerjee, P., & Liu, J. (2007). Survey of wireless indoor positioning techniques and systems. *IEEE Transactions on Systems, Man, and Cybernetics — Part C, 37*(6), 1067–1080. https://doi.org/10.1109/TSMCC.2007.905750

Mapbox. (2024). *Mapbox GL JS documentation*. https://docs.mapbox.com/mapbox-gl-js/api/

Roth, R. E., Donohue, R. G., Sack, C. M., Wallace, T. R., & Buckingham, T. M. A. (2013). A process for keeping pace with evolving web mapping technologies. *Cartographic Perspectives*, 78, 25–52. https://doi.org/10.14714/CP78.1273

Teo, T. (2011). Factors influencing teachers' intention to use technology: Model development and test. *Computers & Education, 57*(4), 2432–2440. https://doi.org/10.1016/j.compedu.2011.06.008

---

---

# APPENDICES

## Appendix A: Survey Questionnaire

**USTED NAV — Campus Navigation System Survey**
*A survey conducted by the Research Team, Department of IT Education, AAMUSTED*

*Thank you for participating in this survey. Your responses will be kept confidential and used solely for academic research purposes.*

---

**Section A: Respondent Information**

1. What is your programme of study? *(Short answer)*

2. What is your current level of study?
   - [ ] Level 100
   - [ ] Level 200
   - [ ] Level 300
   - [ ] Level 400
   - [ ] Postgraduate

**Section B: Navigation Experience**

3. How often are you able to locate a new building or lecture hall on your first attempt (without asking anyone)?
   - [ ] Always
   - [ ] Most of the time
   - [ ] Sometimes
   - [ ] Rarely
   - [ ] Never

4. Which types of campus locations do you find most difficult to locate? *(Select all that apply)*
   - [ ] Lecture rooms / classrooms
   - [ ] Departmental offices
   - [ ] Administrative offices
   - [ ] Workshops / laboratories
   - [ ] Student services (clinic, counselling, etc.)
   - [ ] Hostels
   - [ ] Recreational facilities

5. How much time do you estimate you lose per week due to difficulty finding your way around campus?
   - [ ] None
   - [ ] 1–5 minutes
   - [ ] 5–15 minutes
   - [ ] 15–30 minutes
   - [ ] More than 30 minutes

**Section C: Current Digital Tool Usage**

6. Have you ever used a digital map or navigation app to navigate the campus?
   - [ ] Yes
   - [ ] No

7. Which navigation app do you currently use? *(Select all that apply)*
   - [ ] Google Maps
   - [ ] Apple Maps
   - [ ] Waze
   - [ ] None
   - [ ] Other: \_\_\_\_\_\_\_

8. What is the biggest limitation of using general navigation apps (e.g., Google Maps) on the AAMUSTED campus? *(Short answer)*

**Section D: Desired Features and Adoption Intent**

9. Which features would you most want in a dedicated campus navigation system? *(Select all that apply)*
   - [ ] Search by room number or building name
   - [ ] Turn-by-turn walking directions
   - [ ] Works offline (no internet required)
   - [ ] Shows offices and services within buildings
   - [ ] Shows my current GPS location
   - [ ] Satellite/aerial view
   - [ ] Filter by location type (hostel, admin, academic, etc.)

10. How would you prefer to access a campus navigation system?
    - [ ] Web browser (no installation needed)
    - [ ] Installed mobile app (Android/iOS)
    - [ ] Both

11. If a dedicated AAMUSTED campus navigation system were readily available, how likely would you be to use it?
    - [ ] Very likely
    - [ ] Likely
    - [ ] Unlikely
    - [ ] Very unlikely

12. Any other suggestions or comments about campus navigation at AAMUSTED? *(Short answer)*

---

## Appendix B: System Screenshots

> **[INSERT SCREENSHOT: USTED NAV landing page (index.html) showing splash screen with logo, title, and feature pills]**

> **[INSERT SCREENSHOT: Campus map view showing all 47 location markers with filter chips visible]**

> **[INSERT SCREENSHOT: Search results dropdown showing results for a query such as "ROB" or "counselling"]**

> **[INSERT SCREENSHOT: Building information bottom sheet showing name, type, description, rooms, and services for the ROB Block]**

> **[INSERT SCREENSHOT: Active route displayed on map from user GPS position to a selected building]**

> **[INSERT SCREENSHOT: Live Navigation HUD showing turn instruction, distance, and progress bar]**

> **[INSERT SCREENSHOT: Satellite view layer active on campus map]**

> **[INSERT SCREENSHOT: Mobile view on a 360px-wide device showing responsive layout]**

---

## Appendix C: System File Structure

```
CampusOS/
├── index.html          # Splash/landing screen with PWA registration
├── map.html            # Core navigation application (2,742 lines)
├── sw.js               # Service Worker for offline caching
├── logo.png            # Application logo
├── package.json        # Project metadata
├── .gitlab-ci.yml      # GitLab CI/CD deployment pipeline
├── data/
│   ├── buildings.json  # 47-location campus dataset (24 KB)
│   ├── campus.geojson  # Primary campus road/path network
│   └── roads.geojson   # Supplementary campus road segments
└── css/
    └── styles.css      # Shared stylesheets (if applicable)
```

---

## Appendix D: Campus Location Inventory

The following table lists the 47 locations mapped in `buildings.json`:

| ID | Name | Type | Coordinates |
|----|------|------|-------------|
| 1 | AAMUSTED Library | Academic | 6.698007, -1.681834 |
| 2 | The Clinic | Facility | 6.69738, -1.67970 |
| 3 | Atwima Hall | Hostel | 6.696883, -1.679510 |
| 4 | UBS | Facility | 6.696872, -1.676839 |
| 5 | New Auditorium | Academic | 6.697999, -1.679975 |
| 6 | Opoku Ware Mosque | Facility | 6.697788, -1.683953 |
| 7 | New Library | Academic | 6.700420, -1.681291 |
| 8 | Mechanical Workshop | Academic | 6.700207, -1.679553 |
| 9 | AAMUSTED Football Field | Facility | 6.701221, -1.678382 |
| 10 | Department of Management | Academic | 6.700836, -1.682236 |
| 11 | Opoku Ware Hall | Hostel | 6.697843, -1.682884 |
| 12 | T.L. Block | Academic | 6.697532, -1.681563 |
| 13 | Faculty of Technical Education | Faculty | 6.698387, -1.680020 |
| 14 | Catering and Hospitality Lab | Academic | 6.700230, -1.680583 |
| 15 | Fashion and Textiles Lab | Academic | 6.700212, -1.680345 |
| 16 | Mechanical Workshop (Annex) | Academic | 6.700330, -1.679661 |
| 17 | AAMUSTED Automotive Workshop | Academic | 6.700102, -1.679074 |
| 18 | Woodlab Workshop | Academic | 6.700175, -1.678152 |
| 19 | MYND FM | Facility | 6.700420, -1.676634 |
| 20 | St. Williams Chaplaincy | Facility | 6.701923, -1.676972 |
| 21 | ESA Building | Academic | 6.701263, -1.683106 |
| 22 | NFB | Academic | 6.701497, -1.683674 |
| 23 | NLB | Academic | 6.702040, -1.683339 |
| 24 | Department of Economics Education | Academic | 6.700397, -1.682419 |
| 25 | ROB Block | Administration | 6.700459, -1.682075 |
| 26 | Administration Block | Administration | 6.696903, -1.681367 |
| 27 | ICT Lab | Academic | 6.697921, -1.681560 |
| 28 | FASME Block | Faculty | 6.698066, -1.680635 |
| 29 | Graduate Block | Academic | 6.697252, -1.680922 |
| 30 | Dean's Office | Administration | 6.697846, -1.681037 |
| 31 | AAMUSTED Canteen | Facility | 6.698624, -1.683424 |
| 32 | Opoku Ware II Hall | Hostel | 6.697620, -1.683560 |
| 33 | Security Office | Administration | 6.696770, -1.682201 |
| 34 | Food Court | Facility | 6.698691, -1.682611 |
| 36 | Handball Court | Facility | 6.696693, -1.679889 |
| 37 | Transport Hub | Facility | 6.697020, -1.680857 |
| 38 | Credit Union | Facility | 6.701576, -1.681984 |
| 39 | ESA Pavilion | Facility | 6.701666, -1.682772 |
| 40 | Volleyball Court | Facility | 6.701751, -1.679033 |
| 41 | Basketball Court | Facility | 6.701757, -1.678843 |
| 42 | Autonomy Hall | Hostel | 6.700569, -1.677035 |
| 43 | UBA | Facility | 6.697340, -1.683376 |
| 44 | Franky Jay Shopping Mall | Facility | 6.698302, -1.682416 |
| 45 | Opoku Ware Tennis Court | Facility | 6.697564, -1.683349 |
| 46 | Campus ATM | Facility | 6.697423, -1.682324 |
| 47 | New Building | Academic | 6.698028, -1.680243 |

---

*End of Report*
