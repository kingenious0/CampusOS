# CampusOS -- Smart Campus Infrastructure Mapper

## Product Requirements Document (PRD)

------------------------------------------------------------------------

## 1. Executive Summary

CampusOS is a web-based campus navigation and infrastructure visibility
platform designed to help students and administrators efficiently
navigate and manage campus spaces.

Built using modern HTML5, CSS3, and modular JavaScript, the system
provides:

-   Outdoor campus navigation
-   Building and lecture hall search
-   Exam room locator
-   Facility issue reporting
-   Indoor floor navigation
-   Lecture hall availability tracking

------------------------------------------------------------------------

## 2. Problem Statement

Students face: - Difficulty locating classrooms - Confusion during exam
seating - Poor visibility of facility status - Multi-floor building
navigation issues

Administrators face: - Lack of centralized facility monitoring - Manual
issue reporting - Inefficient space utilization tracking

There is currently no unified digital infrastructure layer for campus
navigation.

------------------------------------------------------------------------

## 3. Product Vision

To become the digital infrastructure backbone for campus navigation and
spatial intelligence across universities.

------------------------------------------------------------------------

## 4. Target Users

### Primary Users

-   Undergraduate students
-   Freshers
-   Visiting lecturers
-   New staff

### Secondary Users

-   Department administrators
-   Facility managers
-   IT teams

------------------------------------------------------------------------

# PHASE 1 -- CAMPUS NAVIGATION MVP

## Objective

Provide outdoor navigation and building discovery.

### Core Features

-   Interactive campus map (Leaflet.js or Google Maps API)
-   Custom building markers
-   Search by building, lecture hall, department, hostel
-   Walking route display
-   Distance and estimated time calculation
-   Building info panel

### Technical Requirements

-   HTML5 semantic structure
-   CSS Grid and Flexbox
-   CSS variables for theming
-   ES6 modular JavaScript
-   JSON-based building data

------------------------------------------------------------------------

# PHASE 2 -- SMART INFRASTRUCTURE LAYER

## Objective

Transform the system into an operational campus tool.

### Core Features

-   Lecture hall availability indicator (Available, Occupied,
    Maintenance)
-   Exam room locator (search by index number or student ID)
-   Facility reporting system
-   Lost & Found digital board

### Data Structure

-   hall_status.json
-   exam_seating.json
-   buildings.json

------------------------------------------------------------------------

# PHASE 3 -- INDOOR MAPPING ENGINE

## Objective

Enable detailed indoor navigation within buildings.

### Core Features

-   SVG-based interactive floor plans
-   Clickable rooms
-   Multi-floor navigation selector
-   Room detail panel
-   Accessibility route filtering

------------------------------------------------------------------------

## 5. System Architecture

### Project Structure

/index.html\
/map.html\
/building.html\
/exam.html\
/report.html\
/admin (future expansion)

### JavaScript Modules

/modules\
- map.js\
- search.js\
- route.js\
- building.js\
- indoor.js\
- exam.js\
- report.js

/data\
- buildings.json\
- halls.json\
- exam.json\
- floors.json

------------------------------------------------------------------------

## 6. Non-Functional Requirements

-   Fully responsive (mobile-first)
-   Load time under 2 seconds
-   Cross-browser support
-   Clean modern UI
-   Scalable architecture
-   Offline-ready (future PWA upgrade)

------------------------------------------------------------------------

## 7. Performance Strategy

-   Lazy loading of floor maps
-   Cached JSON files
-   Minified CSS and JS
-   Lightweight SVG floor plans

------------------------------------------------------------------------

## 8. Future Scalability

-   Admin dashboard
-   Role-based permissions
-   Real-time occupancy tracking
-   Multi-campus support
-   Backend API integration

------------------------------------------------------------------------

## 9. KPIs

Phase 1: - High fresher adoption rate - Reduced late attendance

Phase 2: - Increased facility reporting - Reduced lecture hall conflicts

Phase 3: - Full indoor coverage - Accurate room-level navigation

------------------------------------------------------------------------

## 10. Development Timeline

Week 1--2: Map MVP + Search\
Week 3--4: Smart Infrastructure Features\
Week 5--6: Indoor Mapping Engine\
Week 7: Testing & UI polish\
Week 8: Documentation & Defense

------------------------------------------------------------------------

## Conclusion

CampusOS is not just a campus map.\
It is a scalable campus infrastructure intelligence system designed with
modular frontend architecture, built to evolve into a full institutional
digital platform.
