# CampusOS - Smart Campus Infrastructure Intelligence System

**A scalable, open-source campus navigation and infrastructure platform built on OpenStreetMap, Leaflet.js, and OSRM.**

![Status](https://img.shields.io/badge/status-Phase%201%20MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tech Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20ES6%20JS-orange)

---

## Overview

CampusOS transforms campus navigation from a frustrating student experience into a seamless digital infrastructure layer. Built entirely on open-source technologies, it provides:

- **Interactive Campus Maps** - Real-time navigation powered by OpenStreetMap
- **Building Discovery** - Search and locate any campus facility
- **Smart Routing** - Walking directions with time estimates (OSRM + Haversine fallback)
- **Lecture Hall Availability** - Real-time status indicators
- **Exam Room Locator** - Find your exam assignment instantly
- **Facility Reporting** - Report maintenance issues directly
- **Indoor Navigation** - SVG-based floor plan exploration (Phase 3)

---

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required (100% client-side)
- Internet connection for map tiles and routing

### Installation

```bash
# Clone the repository
git clone https://gitlab.com/kingenious-creative-dev/CampusOS.git
cd CampusOS

# Open in browser
open pages/index.html
# or
firefox pages/index.html
```

### Local Development Server (Optional)

For better development experience with live reload:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/pages/index.html`

---

## Project Structure

```
CampusOS/
├── pages/
│   ├── index.html          # Main campus map
│   ├── exam.html           # Exam room locator
│   └── report.html         # Facility issue reporting
├── modules/
│   ├── map.js              # Leaflet map management
│   ├── geojsonLoader.js    # Data loading
│   ├── search.js           # Building search
│   ├── routing.js          # Route calculation
│   ├── status.js           # Hall availability
│   ├── exam.js             # Exam locator logic
│   └── report.js           # Report submission
├── styles/
│   ├── main.css            # Global styles
│   ├── map.css             # Map-specific styles
│   └── responsive.css      # Mobile-first responsive
├── data/
│   ├── buildings.geojson   # Campus buildings (GeoJSON)
│   ├── halls.json          # Lecture hall metadata
│   ├── exam_seating.json   # Exam assignments
│   └── floors/             # SVG floor plans (Phase 3)
├── app.js                  # Main app initialization
├── exam.js                 # Exam page script
├── report.js               # Report page script
├── INFRASTRUCTURE_PRD.md    # Infrastructure-level PRD
├── ARCHITECTURE.md         # Technical architecture
├── CONTRIBUTING_OSM.md     # OpenStreetMap guide
├── SETUP.md                # Setup and deployment
├── ROADMAP.md              # Development roadmap
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| **Map Engine** | [Leaflet.js](https://leafletjs.com) | Interactive map rendering |
| **Base Map** | [OpenStreetMap](https://openstreetmap.org) | Open geographic data |
| **Routing** | [OSRM](http://project-osrm.org) | Walking route calculation |
| **Data Format** | [GeoJSON](https://geojson.org) | Geospatial data standard |
| **Indoor Maps** | SVG | Clickable floor layouts |
| **Frontend** | HTML5 + CSS3 + ES6 JS | Responsive UI |
| **Storage** | localStorage | Client-side persistence |

---

## Features

### Phase 1 - Campus Navigation MVP ✅

- [x] Interactive OpenStreetMap integration
- [x] Building search and filtering
- [x] Building information panels
- [x] Route calculation (OSRM + Haversine)
- [x] Walking time estimation
- [x] Mobile-responsive design
- [x] GeoJSON layer management

### Phase 2 - Smart Infrastructure Layer 🟡

- [x] Lecture hall availability status
- [x] Exam room locator
- [x] Facility issue reporting
- [ ] Lost & Found board (planned)
- [ ] Real-time status updates
- [ ] Admin dashboard

### Phase 3 - Indoor Mapping Engine 🔴

- [ ] SVG floor plan viewer
- [ ] Multi-floor navigation
- [ ] Room-level search
- [ ] Accessibility routing
- [ ] 3D building visualization (future)

---

## Data Architecture

### Dual-Layer Model

```
┌──────────────────────────────────────────┐
│  Application Intelligence Layer          │
│  (buildings.geojson, halls.json)         │
├──────────────────────────────────────────┤
│  OpenStreetMap Base Layer                │
│  (Building outlines, roads)              │
└──────────────────────────────────────────┘
```

**Layer 1: OpenStreetMap (Public)**
- Building outlines
- Roads and walkways
- Land use areas
- Community-maintained

**Layer 2: CampusOS (Internal)**
- Room metadata
- Lecture hall status
- Exam assignments
- Administrative data

---

## Usage Guide

### Campus Map

1. **Search Buildings**
   - Type building name in search bar
   - Press Enter or click Search
   - Building highlights on map

2. **View Building Info**
   - Click any building on map
   - Info panel opens on right
   - Shows capacity, floors, description

3. **Get Directions**
   - Click "Get Directions" button
   - Route displays on map
   - Shows distance and walking time

### Exam Room Locator

1. Navigate to **Exam Locator** page
2. Enter your Student ID or Index Number
3. System displays:
   - Assigned building
   - Room number
   - Seat assignment
   - Exam date
   - Route on map

### Report Facility Issue

1. Navigate to **Report Issue** page
2. Select building and room
3. Choose issue category
4. Describe the problem
5. (Optional) Provide contact info
6. Submit report

Reports stored locally and can be exported for admin review.

---

## Configuration

### Map Center & Zoom

Edit `app.js`:
```javascript
const map = MapManager.init('map', [5.6037, -0.1870], 15);
//                              latitude, longitude, zoom
```

### OSRM Routing Server

Edit `modules/routing.js`:
```javascript
const OSRM_API = 'https://router.project-osrm.org/route/v1/foot';
// Change to self-hosted instance if needed
```

### Walking Speed

Edit `modules/routing.js`:
```javascript
function estimateWalkingTime(distanceKm, speedKmh = 5) {
  // Default: 5 km/h (typical walking speed)
}
```

---

## Contributing

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a merge request

### OpenStreetMap Contributions

See [CONTRIBUTING_OSM.md](CONTRIBUTING_OSM.md) for detailed guide on:
- Adding missing buildings to OSM
- Updating building information
- Tagging best practices
- Verification process

### Data Updates

To update campus data:

1. Edit `data/buildings.geojson` for building locations
2. Edit `data/halls.json` for lecture hall info
3. Edit `data/exam_seating.json` for exam assignments
4. Test locally before submitting

---

## Development

### Adding a New Module

```javascript
// modules/mymodule.js
const MyModule = (() => {
  // Private variables
  let data = null;

  // Public API
  return {
    init() {
      // Initialize
    },
    getData() {
      return data;
    }
  };
})();
```

### Adding a New Page

1. Create `pages/mypage.html`
2. Create `myscript.js` for page logic
3. Add navigation link in navbar
4. Import required modules

### Testing

```bash
# Manual testing checklist
- [ ] Map loads correctly
- [ ] Search functionality works
- [ ] Routes display properly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Data loads from JSON files
```

---

## Performance

### Optimization Strategies

- **Lazy Loading**: Floor plans loaded on demand
- **Caching**: GeoJSON cached in memory
- **localStorage**: Hall status persisted locally
- **Lightweight**: No heavy frameworks
- **Vector Tiles**: Efficient map rendering

### Load Time Targets

- Initial load: < 2 seconds
- Search response: < 100ms
- Route calculation: < 500ms

---

## Troubleshooting

### Map Not Loading

- Check internet connection
- Verify Leaflet CDN is accessible
- Check browser console for errors
- Try different browser

### Search Not Working

- Ensure `buildings.geojson` is in `/data` folder
- Check file format is valid JSON
- Verify building names match exactly

### Routes Not Displaying

- OSRM server may be down (fallback to Haversine)
- Check coordinates are valid
- Verify routing module is loaded

### Data Not Persisting

- Check localStorage is enabled
- Clear browser cache if needed
- Verify JSON files are accessible

---

## Documentation

- **[INFRASTRUCTURE_PRD.md](INFRASTRUCTURE_PRD.md)** - Complete product requirements
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture details
- **[CONTRIBUTING_OSM.md](CONTRIBUTING_OSM.md)** - OpenStreetMap contribution guide
- **[SETUP.md](SETUP.md)** - Setup and deployment guide
- **[ROADMAP.md](ROADMAP.md)** - Development roadmap

---

## Roadmap

### Q2 2024
- [x] Phase 1 MVP completion
- [x] OSM integration
- [x] GeoJSON layer system
- [ ] Phase 2 smart features

### Q3 2024
- [ ] Real-time occupancy tracking
- [ ] Admin dashboard
- [ ] User authentication
- [ ] Backend API integration

### Q4 2024
- [ ] Phase 3 indoor mapping
- [ ] Multi-campus support
- [ ] Mobile app (React Native)
- [ ] Self-hosted OSRM instance

---

## License

MIT License - See [LICENSE](LICENSE) file for details

---

## Support

### Getting Help

- **Issues**: Report bugs on GitLab
- **Discussions**: Start a discussion for features
- **Documentation**: Check docs folder
- **Community**: Join OSM community forums

### Contact

- **Institution**: Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development
- **Project**: CampusOS

---

## Acknowledgments

- **OpenStreetMap Community** - Geographic data foundation
- **Leaflet.js** - Map rendering engine
- **OSRM Project** - Open routing service
- **AAMUSTED** - Campus infrastructure partner

---

## Citation

If you use CampusOS in your research or project, please cite:

```bibtex
@software{campusos2024,
  title={CampusOS: Smart Campus Infrastructure Intelligence System},
  year={2024},
  url={https://gitlab.com/kingenious-creative-dev/CampusOS}
}
```

---

**CampusOS is not just a campus map. It is a spatial intelligence layer built on open geographic infrastructure.**
