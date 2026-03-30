
---

# UNIVERSITY OF SKILLS TRAINING AND ENTREPRENEURIAL DEVELOPMENT
## FACULTY OF APPLIED SCIENCE AND MATHEMATICS EDUCATION
### DEPARTMENT OF INFORMATION TECHNOLOGY EDUCATION

---

# DESIGN AND IMPLEMENTATION OF A DIGITAL CAMPUS NAVIGATION AND ROOM IDENTIFICATION SYSTEM

**A PROJECT REPORT**

Submitted to the Department of Information Technology Education in partial fulfilment of the requirements for the award of **Bachelor of Technology Education (B.Tech. Ed.)** in Information Technology Education

---

**Submitted by:**

| # | Name | Index Number |
|---|------|-------------|
| 1 | [Member 1 Full Name] | [Index No.] |
| 2 | [Member 2 Full Name] | [Index No.] |
| 3 | [Member 3 Full Name] | [Index No.] |
| 4 | [Member 4 Full Name] | [Index No.] |
| 5 | [Member 5 Full Name] | [Index No.] |
| 6 | [Member 6 Full Name] | [Index No.] |
| 7 | [Member 7 Full Name] | [Index No.] |
| 8 | [Member 8 Full Name] | [Index No.] |
| 9 | [Member 9 Full Name] | [Index No.] |
| 10 | [Member 10 Full Name] | [Index No.] |

---

**Supervisor:** [Supervisor's Name and Title]

**Date:** March 2026

---

## DECLARATION

We hereby declare that this project report is entirely our own original work and that, to the best of our knowledge, it contains no material previously submitted for a degree or diploma in any university or institution, except where due acknowledgment has been made. All sources of information and assistance have been duly cited.

**Signed:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ **Date:** \_\_\_\_\_\_\_\_\_\_\_\_

---

## CERTIFICATION

This is to certify that this project report has been supervised and approved for submission to the Department of Information Technology Education, University of Skills Training and Entrepreneurial Development (USTED), in partial fulfilment of the requirements for the award of a Bachelor of Technology Education.

**Supervisor:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ **Date:** \_\_\_\_\_\_\_\_\_\_\_\_

**Head of Department:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ **Date:** \_\_\_\_\_\_\_\_\_\_\_\_

---

## DEDICATION

This project is dedicated to our families, friends, and all members of the USTED community whose daily navigation challenges inspired the creation of this system.

---

## ACKNOWLEDGEMENTS

The group wishes to express sincere gratitude to our project supervisor for the guidance, patience, and expert counsel provided throughout the entire research and development process. We are also grateful to the Department of Information Technology Education for providing the academic framework within which this work was conducted. Our appreciation extends to all respondents who participated in the survey that informed this project, and to our families and colleagues for their unwavering moral support.

---

## ABSTRACT

Navigating a large and growing university campus efficiently is a challenge that affects thousands of students and visitors worldwide. At the Ahafo Ano Municipal University of Skills Training and Entrepreneurial Development (AAMUSTED), Kumasi Campus, the absence of a purpose-built digital navigation system has resulted in recurring incidents of students arriving late to lectures, struggling to locate offices, and generally experiencing difficulty finding their way around the campus environment. This study presents the design and implementation of **USTED NAV**, a web-based digital campus navigation and room identification system developed specifically for the AAMUSTED Kumasi Campus.

The system was built using a client-side web technology stack comprising HTML5, CSS3, and JavaScript, integrated with the Mapbox GL JS v3.1.2 mapping library. The application renders an interactive, real-time campus map with categorised markers for 47 mapped locations — including academic blocks, faculty buildings, hostels, administrative offices, and campus facilities. Users can search for any building, department, room, or service by name or keyword. Upon selecting a result, the system displays detailed information about the location including its type, operating hours, available services, and rooms, before generating a walking route to the destination using either an online OSRM router or a built-in offline Dijkstra-based routing engine that operates on a custom campus road network stored in GeoJSON format. The system further supports GPS-based user location tracking, satellite and street view map layer switching, and a Progressive Web App (PWA) architecture that enables offline access through a Service Worker caching strategy.

A structured survey was administered to 85 respondents — predominantly students at the AAMUSTED Kumasi Campus — to gather empirical data on navigation challenges, existing digital tool usage, and desired system features. The findings revealed that a significant proportion of students have experienced difficulty locating buildings or rooms on first attempt, and that the majority expressed strong interest in a campus-specific digital navigation tool. Analysis of the survey data guided both the functional requirements and the design priorities of the system. Testing of the completed system confirmed that USTED NAV effectively resolves the identified navigation challenges, works offline in low-connectivity environments, and delivers a smooth, intuitive user experience comparable to mainstream navigation tools such as Google Maps.

**Keywords:** Campus navigation, indoor wayfinding, web mapping, Mapbox GL JS, Progressive Web App, GeoJSON, Dijkstra algorithm, offline routing, AAMUSTED.

---

## TABLE OF CONTENTS

- Abstract
- Chapter One: Introduction
- Chapter Two: Literature Review
- Chapter Three: Methodology
- Chapter Four: Data Analysis and System Development
- Chapter Five: Results and Discussion
- Chapter Six: Conclusion and Recommendations
- References
- Appendices

---

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study

The physical layout of a modern university campus can be vast and complex, encompassing dozens of academic buildings, administrative offices, student residential halls, recreational facilities, and service centres spread over a large land area. For first-year students and visitors in particular, the process of navigating such an environment without an adequate guidance system can be disorienting, time-consuming, and stressful. As universities across the world continue to expand their physical infrastructure to accommodate growing student populations, the gap between physical growth and navigational support has widened significantly.

The Ahafo Ano Municipal University of Skills Training and Entrepreneurial Development (AAMUSTED), Kumasi Campus — formerly known as USTED — is a public technical university in Ghana that has grown substantially in terms of both student enrolment and physical infrastructure over recent years. The campus hosts multiple faculties, departments, workshops, laboratories, student halls of residence, banking services, dining facilities, and sports infrastructure across a relatively compact but topographically varied site. Despite this growth, the campus has not had access to a dedicated digital navigation tool. Students, particularly freshmen, have historically relied on verbal directions from colleagues, physical notice boards, or generic mapping tools such as Google Maps, none of which provide the campus-specific granularity, indoor room identification, or offline capability needed to navigate the environment effectively.

This project was motivated by the recognition that technology-driven navigation solutions — already standard in major cities and institutions globally — can be adapted and deployed at the campus level to address these challenges. The result is USTED NAV: a web-based digital campus map and room identification system designed specifically for the AAMUSTED Kumasi Campus, accessible on both mobile and desktop devices without requiring any app installation.

## 1.2 Problem Statement

Despite the increasing digital literacy of students in Ghanaian universities, the AAMUSTED Kumasi Campus has lacked a reliable, purpose-built digital navigation system. Several specific problems have emerged from this gap:

1. **Student disorientation:** Many students, especially those in their first semester, struggle to locate lecture halls, departmental offices, laboratories, and support services such as the clinic, security office, and counselling centre within the campus.
2. **Lateness and missed classes:** The inability to quickly identify and reach a destination in time has contributed to students arriving late for lectures, practical sessions, and administrative appointments.
3. **Ineffective alternatives:** General-purpose applications such as Google Maps lack indoor accuracy and do not contain data on specific campus locations — they cannot, for instance, identify "Lecture Room 001 in the ROB Block" or provide walking directions to the "Guidance and Counselling Centre." Physical campus maps, where available, are often outdated, static, and inaccessible in digital form.
4. **No room-level identification:** The campus lacks any system that can help a user identify not just a building, but a specific room, lab, or office within that building with its exact floor and location context.
5. **Connectivity dependency:** Existing generic navigation tools require continuous internet access, which is not always guaranteed on campus, particularly in congested peak hours.

These challenges collectively create an inefficient and sometimes frustrating campus experience for students, staff, and visitors alike. This project directly addresses these gaps by delivering a campus-tailored digital navigation system.

## 1.3 Aim and Objectives

**Aim:**
The primary aim of this study is to design and implement a web-based digital campus navigation and room identification system for the AAMUSTED Kumasi Campus that enables users to efficiently search for, locate, and navigate to any building, office, room, or facility on campus.

**Objectives:**

1. To investigate the navigation challenges currently faced by students and visitors at the AAMUSTED Kumasi Campus through a structured survey.
2. To design and implement an interactive web-based campus map that accurately plots and labels all major buildings, departments, rooms, and facilities on the AAMUSTED Kumasi Campus.
3. To develop a keyword-based search module capable of identifying specific buildings, room numbers, department names, and campus services by name.
4. To implement both online and offline navigation routing that generates turn-by-turn walking directions between any two campus points.
5. To build a Progressive Web App (PWA) architecture that allows the system to function on mobile and desktop browsers without installation, and to remain accessible offline through Service Worker caching.
6. To evaluate the system's usability and effectiveness in addressing the identified navigation challenges.

## 1.4 Research Questions

This study was guided by the following research questions:

1. What navigation challenges do students and visitors encounter at the AAMUSTED Kumasi Campus, and how frequently do these occur?
2. What digital tools, if any, are currently used by students to navigate the campus, and what are the limitations of those tools?
3. How can a web-based campus navigation system be designed to accurately represent the physical layout, buildings, and internal spaces of the AAMUSTED Kumasi Campus?
4. How can an offline-capable routing engine be integrated into a browser-based map to provide walking directions within a campus environment lacking persistent internet connectivity?
5. Does the implemented USTED NAV system effectively resolve the navigation challenges identified in the survey data?

## 1.5 Scope and Limitations

**Scope:**
This project covers the design, implementation, and preliminary evaluation of a web-based navigation system specifically for the AAMUSTED Kumasi Campus. The system maps 47 verified campus locations including academic buildings, faculty blocks, workshops, student halls, administrative offices, and facilities. It implements location search, route generation, GPS tracking, map layer switching, filter-based browsing, and offline support via a Service Worker. The system is accessible on any HTML5-capable browser without installation.

**Limitations:**

- The system does not provide real-time indoor positioning (e.g., Bluetooth beacons or Wi-Fi triangulation); room identification is based on pre-loaded static data rather than live tracking within a building.
- Route generation in offline mode relies on a pre-mapped campus road network stored in GeoJSON, which may not capture every informal campus footpath.
- The Mapbox GL JS library requires a valid API access token, which may have usage limits. An internet connection is required for the initial load of satellite and street tile data; subsequent visits can operate from cache.
- The system was validated through user surveys and developer testing rather than a full-scale formal usability experiment.
- At the time of development, 3D floor plan integration (i.e., interactive indoor maps within buildings) was not implemented, representing an opportunity for future development.

## 1.6 Significance of the Study

This project is significant for several reasons:

**For students:** USTED NAV provides an immediate, practical tool that reduces the stress of campus navigation, helps them locate rooms and services without relying on others, and decreases instances of lateness due to wayfinding difficulty.

**For the institution:** The system represents a modern, digitally-driven campus service that improves the overall experience of students and visitors, demonstrates the university's commitment to technological integration, and can serve as a foundation for more advanced campus information systems.

**For the academic community:** This project demonstrates that a fully functional, campus-specific navigation system can be developed using open-source web technologies and freely available geographic data, making it replicable and scalable to other institutions with limited resources.

**For the field of educational technology:** This work contributes empirical evidence on navigation challenges in Ghanaian university campuses and presents a validated design framework for similar systems in comparable institutional settings.

## 1.7 Structure of the Report

This report is organised into six chapters:

- **Chapter One** introduces the study, providing background, problem statement, aim, objectives, research questions, scope, and significance.
- **Chapter Two** reviews relevant literature on campus navigation, digital mapping systems, indoor navigation challenges, and web-based mapping frameworks. It identifies the theoretical basis for the study and the research gap the project addresses.
- **Chapter Three** describes the research methodology, system architecture, design approach, and tools used in the development of USTED NAV.
- **Chapter Four** presents the survey data analysis and a detailed account of the system development process, including the system modules and implementation logic.
- **Chapter Five** discusses the results, including system performance, test scenarios, and a comparison with traditional navigation approaches.
- **Chapter Six** provides conclusions, summarises findings, identifies contributions, and outlines recommendations for future work.

---

---

# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction

This chapter reviews existing literature on digital navigation and wayfinding systems, with particular attention to campus environments, indoor navigation challenges, web-based mapping technologies, and the theoretical models that underpin the design of such systems. It concludes by identifying the research gap that this project addresses.

## 2.2 Traditional Navigation in Campus Environments

Before the advent of digital mapping, university campuses relied entirely on physical infrastructure to guide users. This included static signage at building entrances and intersections, printed campus maps distributed during orientation weeks, and human guides assigned to direct visitors (Hightower & Borriello, 2001). While these methods remain in use, they suffer from significant limitations: physical maps become outdated as buildings are added or renamed; signage may be absent, obscured, or illegible; and verbal directions depend on the availability of knowledgeable individuals.

Golledge (1999) noted that spatial orientation in unfamiliar environments is a cognitively demanding task. In university settings, where a new intake of hundreds or thousands of students must rapidly familiarise themselves with a complex physical space, the absence of effective navigational support is not merely inconvenient — it directly impacts academic outcomes through increased anxiety, lateness, and reduced engagement in the first weeks of study.

## 2.3 Digital Maps and Navigation Systems

The emergence of Geographic Information Systems (GIS) and web-based mapping platforms has fundamentally changed how people navigate both outdoor and indoor spaces. Systems such as Google Maps, Apple Maps, HERE Maps, and OpenStreetMap have become ubiquitous navigation tools that provide real-time positioning, route generation, and points-of-interest data at a global scale (Goodchild, 2007).

Google Maps, in particular, has demonstrated the power of combining satellite imagery, street-level photography, and vector-based maps to create an intuitive navigation experience. Its adoption in mobile devices through the Android and iOS ecosystems has normalised the expectation of turn-by-turn digital navigation for billions of users. Research by Roth et al. (2013) highlighted that interactive web maps have democratised cartographic access, allowing non-experts to engage with geographic data fluently.

However, these general-purpose tools have significant shortcomings when applied to university campuses. They do not contain data on specific rooms or offices within buildings, they do not model pedestrian-only paths or campus-internal footways accurately, and they cannot distinguish between types of campus locations (academic, administrative, residential, etc.) with the granularity needed for effective wayfinding (Khan et al., 2014).

## 2.4 Indoor Navigation Challenges

Indoor navigation presents a suite of challenges that outdoor systems are not equipped to handle. GPS signals are unreliable or entirely unavailable indoors due to signal attenuation by building materials (Harle, 2013). Room-level identification requires floor plan data that is typically proprietary, inconsistently formatted, and not publicly available. Wireless positioning systems using Bluetooth Low Energy (BLE) beacons, Wi-Fi fingerprinting, or Ultra-Wideband (UWB) technology can address GPS limitations, but they require significant hardware infrastructure investment (Liu et al., 2007).

Researchers such as Khoury and Kamat (2009) have proposed augmented reality overlays for indoor wayfinding, while others have explored QR code-based room identification as a low-cost alternative. However, none of these approaches have been widely adopted in the African university context, where resource constraints often preclude infrastructure-intensive solutions.

This project takes a pragmatic approach: rather than attempting full indoor positioning, it provides room-level identification through pre-loaded static room and service data associated with each building, making it accessible immediately without additional hardware.

## 2.5 Web-Based Mapping Systems and Libraries

The availability of JavaScript-based mapping libraries has made it feasible for developers to build rich, interactive map applications entirely within the browser. Leaflet.js, OpenLayers, Google Maps JavaScript API, and Mapbox GL JS are among the most widely used libraries (Haklay & Weber, 2008). Each offers a different balance of features, performance, and cost.

Mapbox GL JS, used in this project, renders maps using WebGL for smooth, high-performance rendering even on mobile devices. It supports custom map styles, 3D building extrusion, real-time data overlays, and GeoJSON-based custom geographic features (Mapbox, 2024). Its ability to handle both vector and raster tile sources, combined with a mature API for marker management, layer filtering, and camera animation, makes it particularly suited for a campus navigation application that demands visual richness and interactive precision.

The integration of OSRM (Open Source Routing Machine) as an external routing backend, and the fallback to a custom Dijkstra-based offline router using locally stored GeoJSON road data, represents a novel architectural decision that ensures routing capability even when the device is disconnected from the internet.

## 2.6 Progressive Web Applications in Educational Contexts

A Progressive Web App (PWA) is a web application that uses modern browser features — including Service Workers, Web App Manifests, and the Cache API — to deliver app-like experiences through a standard web browser (Google Developers, 2022). PWAs can be installed on the home screen of a mobile device, receive push notifications, and function offline, without requiring distribution through a platform-specific app store.

In educational technology, PWAs have attracted growing interest as a deployment model for learning tools and campus services, particularly in low-resource environments where users may not have the storage capacity, data plans, or device compatibility to install native applications (Biørn-Hansen et al., 2017). The service worker architecture of USTED NAV, which caches the application shell, building data, road network, and map tiles on first load, exemplifies this approach and ensures that students can continue to use the navigation system even during periods of poor connectivity.

## 2.7 Theoretical Framework

### 2.7.1 Technology Acceptance Model (TAM)

The Technology Acceptance Model, originally proposed by Davis (1989), posits that a user's intention to adopt a technology is determined primarily by two factors: Perceived Usefulness (the degree to which the technology is believed to improve performance) and Perceived Ease of Use (the degree to which the technology is believed to be free of effort). TAM has been widely applied in educational technology research to predict and explain the adoption of new digital tools in learning environments (Teo, 2011).

In the context of USTED NAV, the TAM framework guided both the user survey design and the interface design process. Survey questions were structured to assess whether students found the navigation problem significant (informing Perceived Usefulness) and what interface features they would consider intuitive (informing Perceived Ease of Use). The resulting design — a familiar, Google Maps-inspired interface with a prominent search bar, colour-coded markers, and a smooth bottom sheet panel — was deliberately chosen to minimise the learning curve and maximise perceived ease of use from first interaction.

### 2.7.2 Design Science Research (DSR)

Design Science Research, as articulated by Hevner et al. (2004), is a research methodology in information systems that involves the creation of innovative artefacts (systems, models, methods) to address identified organisational problems. It insists that such artefacts be rigorously designed, practically evaluated, and contributed to the knowledge base. DSR is particularly appropriate for applied computing projects where the primary output is a working technological system rather than a purely theoretical contribution.

This project follows the DSR paradigm: it identifies a real and significant problem (campus navigation inefficiency), designs and builds an artefact (USTED NAV) as a solution, evaluates the artefact through survey analysis and system testing, and contributes the findings to the academic record through this report.

## 2.8 Existing Comparable Systems

Several institutions have developed or adopted campus navigation systems. MIT's campus map (accessible via mit.edu/map) provides a browser-based interactive map with building outlines, indoor floor plans for selected buildings, and event-based overlays. The University of Michigan's campus wayfinding system integrates with the university's accessibility database to provide barrier-free routing. In Ghana, the University of Ghana's campus map (available through the university portal) offers a basic point-and-click interface with building names, but lacks search functionality, routing, or offline support.

These examples demonstrate the institutional appetite for campus-specific mapping tools, but also the variation in sophistication and accessibility. USTED NAV fills the gap at AAMUSTED by providing a system that is: (1) search-driven and interactive, (2) route-generating, (3) offline-capable, (4) mobile-first, and (5) built entirely with freely available web technologies.

## 2.9 Research Gap

Having reviewed the literature, the following gap is identified: while digital navigation tools are well-established in urban contexts, and while general frameworks for indoor navigation and campus GIS have been proposed, there is a scarcity of lightweight, fully implemented, offline-capable, web-based campus navigation systems tailored to the specific institutional geography and user needs of technical universities in Ghana and sub-Saharan Africa more broadly. This project directly addresses this gap by producing a deployable, tested system grounded in real survey data from the AAMUSTED Kumasi Campus.

---

---

# CHAPTER THREE: METHODOLOGY

## 3.1 Research Design

This study adopted the **Design Science Research (DSR)** methodology as its overarching research paradigm. DSR is particularly well-suited to information systems projects where the goal is the creation of a functional artefact — in this case, the USTED NAV web application — that solves a clearly articulated real-world problem (Hevner et al., 2004). The DSR approach involves three cycles: the Relevance Cycle (understanding the problem through empirical investigation), the Design Cycle (building and refining the artefact), and the Rigor Cycle (grounding the design in established knowledge and evaluating it).

The Relevance Cycle was executed through a structured survey administered to students at AAMUSTED Kumasi Campus, establishing the navigation problem empirically. The Design Cycle encompassed the full system development process: requirements elicitation, architecture design, front-end implementation, data collection and formatting, and testing. The Rigor Cycle was addressed through the application of established theoretical frameworks (TAM, PWA architecture, graph-based routing algorithms) and comparison of the system's outcomes against the identified problems.

## 3.2 Data Collection

### 3.2.1 Survey Instrument

A structured self-administered questionnaire was developed and distributed to students at the AAMUSTED Kumasi Campus. The questionnaire comprised twelve items covering: respondent demographics (programme and level of study), frequency of navigation difficulty on campus, specific types of locations that were hardest to find, familiarity with and usage of digital map applications, satisfaction with current navigation methods, desired features in a campus navigation tool, and willingness to adopt a dedicated campus navigation system.

The questionnaire was distributed via Google Forms and collected a total of **85 valid responses**. Respondents were drawn from across multiple departments and year groups.

### 3.2.2 Campus Location Data

Campus location data was collected through direct physical survey of the AAMUSTED Kumasi Campus. Each building and facility was visited, photographed, and geo-tagged using a GPS-enabled mobile device. The recorded coordinates were subsequently verified against satellite imagery within the Mapbox GL JS development environment. The final dataset comprises **47 mapped locations**, structured as a JSON array in `buildings.json`. Each entry captures the location's:

- **Name and short name**
- **Type** (academic, faculty, hostel, administration, or facility)
- **GPS coordinates** (latitude and longitude, WGS84 datum)
- **Description** (a brief narrative of the location's function)
- **Operating hours**
- **Services** (a list of named services, with floor, room number, keywords, and description where applicable)
- **Rooms** (specific rooms within the building, with room number, floor, wing, description, and searchable keywords)

For example, the ROB Block entry includes data for four services (FBE Dean's Office, Guidance and Counselling Centre, CCBTR, and Graduate School) and eight named rooms (including Lecture Rooms 001, 003, 023, and 025, and Computer Lab 016), each with floor, wing, and keyword data to support precise search matching.

### 3.2.3 Campus Road Network

The campus road and pathway network was digitised from satellite imagery and physical observation into the GeoJSON standard format, stored in two files: `campus.geojson` (primary road network) and `roads.geojson` (supplementary paths). The road network encodes campus infrastructure including the Main Entrance Road, the Academic Loop North and South, the West Campus Loop, the East Campus Road, and a series of named pedestrian connectors. Each LineString feature represents a segment of road or path, defined by a series of WGS84 coordinate pairs. This network is consumed at runtime by the offline routing engine.

## 3.3 System Architecture

USTED NAV is a **single-page web application** with no server-side backend. All logic, data processing, and rendering occur entirely within the browser (client-side). This architecture was chosen to eliminate hosting infrastructure costs, reduce latency, and support offline operation without a server dependency.

The application is composed of the following architectural layers:

### 3.3.1 Presentation Layer (index.html)

The `index.html` file serves as a splash/landing screen. It displays the USTED NAV branding — a pulsing logo ring animation, the institution name, and descriptive feature pills — and provides a single "Open Navigation" call-to-action button that navigates to `map.html`. On page load, it registers the Service Worker (`sw.js`) to activate caching for future offline visits. The splash screen uses the Inter typeface (loaded from Google Fonts) and a dark navy (`#0f172a`) background with an indigo primary colour (`#4338ca`) consistent throughout the application.

### 3.3.2 Application Layer (map.html)

The `map.html` file is the core of the system. At 2,742 lines, it contains the complete CSS, HTML markup, and JavaScript logic for:

- Map initialisation and tile management
- Building marker rendering and interaction
- Search input handling and fuzzy matching
- Category filter chip logic
- Bottom sheet and side panel UI management
- Route calculation and rendering (online and offline)
- GPS location tracking and user position display
- Live navigation HUD with turn instruction display
- Satellite/street view layer toggling with a stale-while-revalidate thumbnail preview
- Toast notifications and offline detection banner

The root-level CSS variables define a consistent design system: primary colour `#4338ca` (indigo), surface white `#ffffff`, background `#f1f5f9`, muted text `#64748b`, and semantic colours for each location type (academic: indigo, faculty: amber, hostel: green, administration: red, facility: purple).

### 3.3.3 Data Layer

- **`data/buildings.json`:** A structured JSON array of 47 building and facility objects. This file is fetched asynchronously on map load and used to populate markers, search results, and information panels.
- **`data/roads.geojson`:** A GeoJSON FeatureCollection of 11 LineString road and path features representing the campus road network, consumed by the offline routing engine.
- **`data/campus.geojson`:** A supplementary GeoJSON file encoding additional campus features (paths, additional road segments) also consumed by the offline router.

### 3.3.4 Service Worker (sw.js)

The `sw.js` file implements the PWA's offline strategy using the browser's Cache API. On installation, it pre-caches the **app shell** — defined as the set of files required to render the application without a network connection — including `map.html`, `index.html`, `logo.png`, `data/buildings.json`, `data/campus.geojson`, `data/roads.geojson`, and the Mapbox GL JS, Font Awesome, and Google Fonts CDN resources. A separate `TILE_CACHE` ('ustednav-tiles-v2') is maintained for Mapbox map tile images, using a **stale-while-revalidate** strategy: cached tiles are served immediately and updated in the background when the network is available.

## 3.4 System Design

### 3.4.1 User Search Flow

When a user types a query into the search input (`#searchInput`), a debounced input listener fires the `doSearch(query)` function after 180 milliseconds of keystroke inactivity. The function performs a multi-dimensional string match against the `buildingsData` array:

1. **Primary name and short name match:** Checks whether the query appears in the building's `name` or `shortName` fields (case-insensitive).
2. **Type match:** Checks the building's `type` field against the query (e.g., searching "hostel" returns all hostels).
3. **Room match:** Iterates through each building's `rooms` array, checking room `number`, `description`, and `keywords` arrays for the query string.
4. **Service match:** Iterates through each building's `services` array, checking `name`, `description`, `category`, and `keywords` arrays.

All matching entries are collected into a results array and rendered as a dropdown list below the search bar (`#searchResults`). Each result item displays a colour-coded dot matching the building type, the building name, and a secondary label indicating the matched room or service where applicable. Results are limited to prevent an overwhelming list, and a "No results found" message is displayed if no matches are identified.

### 3.4.2 Building Information Display

When a user selects a search result or clicks a map marker, the `showBuilding(b)` function executes:

1. The map camera animates to the selected building's coordinates at zoom level 19 using `map.flyTo()`.
2. The previously selected marker (if any) is de-highlighted; the newly selected marker receives the `selected` CSS class (scale 1.2, stronger shadow).
3. On mobile, the **bottom sheet** (`#sheet`) slides up from below the viewport with a smooth CSS cubic-bezier transition, revealing the building's details.
4. On desktop (viewport ≥ 768px), the same information is rendered within the **side panel** (`#sidePanel`) on the left of the screen.

The displayed information includes: the building's icon (type-coloured), name, type badge, description, operating hours, contact email (if available), a "Directions" action button, and expandable lists of services and rooms.

### 3.4.3 Route Generation

When the user taps "Directions" within the building sheet:

1. The system first attempts to acquire the user's GPS position via `navigator.geolocation.getCurrentPosition()`.
2. If GPS is available, the user's coordinates are used as the route origin; a custom animated blue dot marker represents the user's position on the map.
3. If GPS is denied or unavailable, the user is offered the option to tap their location manually on the map (`settingManualLocation` mode), or to use a defaulted campus centre point.
4. With origin and destination coordinates established, the system first attempts to call the OSRM API (`https://router.project-osrm.org/route/v1/foot/{lng1},{lat1};{lng2},{lat2}`) to retrieve a route as a GeoJSON LineString.
5. If the OSRM request fails (network unavailable), the `OfflineRouter.compute()` function is invoked as a fallback.

The **offline routing engine** is implemented as a Dijkstra shortest-path algorithm operating on a graph built from the GeoJSON road network. Each road segment's LineString coordinates are parsed into graph nodes (keyed by `"lng,lat"` strings) and weighted edges representing the haversine distance between consecutive coordinate pairs. The nearest graph nodes to the origin and destination are identified, and Dijkstra's algorithm computes the minimum-weight path. The resulting coordinate sequence is rendered on the map as a blue route line using Mapbox's `addSource`/`addLayer` GeoJSON source.

The route information panel (distance in metres/kilometres and estimated walking duration) is displayed in the bottom sheet, along with a list of turn-by-turn steps derived from the OSRM response or simplified offline step descriptions.

### 3.4.4 Live Navigation HUD

Upon pressing "Start Navigation," the system activates the live navigation HUD — a fixed panel that slides down from the top of the viewport showing the current turn instruction, direction icon, distance to the next manoeuvre, and a progress bar. As the user walks and their GPS position updates, the `trackLiveNav()` function recalculates distance to each remaining route step, advances the instruction to the next step when the user approaches within a threshold distance, and updates the progress bar proportionally. If the user deviates significantly from the planned route, a re-routing banner is displayed and a fresh route is calculated from the current position.

### 3.4.5 Filter Chip Logic

Six category filter chips are available: All, Academic, Faculty, Hostels, Admin, and Facilities. When a chip is activated, the `currentFilter` state variable is updated and the visibility (`display` CSS property) of all map markers is toggled to show only those whose `type` matches the selected category. This enables users to quickly scan the map for a specific class of locations without the visual noise of all 47 markers simultaneously.

## 3.5 Data Handling

USTED NAV does not use a traditional relational or NoSQL database. All campus data is stored in flat files (`buildings.json`, `roads.geojson`, `campus.geojson`) that are fetched via the browser's `fetch()` API at runtime and held in memory as JavaScript objects for the duration of the session. This decision was made deliberately to:

- Eliminate the need for a server-side database engine or backend API
- Enable the data to be cached by the Service Worker for offline access
- Simplify deployment to static hosting environments (GitHub Pages, GitLab Pages, Netlify, etc.)
- Allow data to be updated simply by editing the JSON files without touching application logic

The trade-off is that the system does not support real-time data updates (e.g., room booking status) without a page reload. Future versions of the system could introduce a lightweight API endpoint or a Firestore/Supabase backend to address this limitation.

## 3.6 Tools and Technologies Used

The following tools and technologies were employed in the development of USTED NAV:

| Category | Tool / Technology | Purpose |
|---|---|---|
| **Markup** | HTML5 | Application structure and semantic layout |
| **Styling** | CSS3 (Vanilla) | UI design, animations, responsive layout |
| **Logic** | JavaScript (ES6+) | Search, routing, map interaction, offline logic |
| **Mapping Library** | Mapbox GL JS v3.1.2 | WebGL map rendering, markers, layers, 3D buildings |
| **Routing (Online)** | OSRM (Open Source Routing Machine) | Walking and driving route calculation online |
| **Routing (Offline)** | Custom Dijkstra Engine | Shortest-path routing on campus GeoJSON road network |
| **Data Format (Locations)** | JSON (buildings.json) | Campus building, room, and service data storage |
| **Data Format (Roads)** | GeoJSON (LineString) | Campus road and path network for routing |
| **Offline Support** | Service Worker (sw.js), Cache API | PWA offline caching of app shell and tiles |
| **Typography** | Inter (Google Fonts) | Clean, modern interface typography |
| **Icons** | Font Awesome 6.4.0 | UI iconography for markers and controls |
| **Version Control** | Git / GitLab | Source code management and CI/CD deployment |
| **Hosting** | GitLab Pages / Static CDN | Zero-cost static web hosting |
| **Survey Tool** | Google Forms | Survey administration and data collection |

