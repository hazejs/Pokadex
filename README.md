# Pokédex

## Key Features

- **React 19 Hooks**: Leverages the new React compiler (no manual `memo` or `useCallback` needed).
- **Infinite Scroll**: Smooth data fetching with immediate UI feedback and 0.4s slide-up animations.
- **Advanced Filtering**: Filter by Pokemon Type or Capture status using custom animated dropdowns.
- **Fuzzy Search**: Real-time searching across names, stats, and Pokédex numbers.
- **Capture System**: Mark Pokemon as captured with persistent in-memory server state.
- **Smooth Theming**: Light and Dark modes with automatic system detection and manual toggle.
- **Scroll Restoration**: Automatically remembers your exact scroll position on page refresh.

---

## Prerequisites

- **Python 3.8+**
- **Node.js 18+**

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/hazejs/Pokadex.git
cd Pokadex
```

### 2. Install Backend Dependencies

```powershell
pip install -r requirements.txt
```

_Note: This project requires specifically Flask 2.0.2 and Werkzeug < 3.0 to ensure compatibility._

### 3. Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

### 4. Run the Project

You can run both the backend and frontend simultaneously with a single command from the **root directory**:

```powershell
npm run dev
```

The application will be available at:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

---

## Project Structure

- `/app.py`: Flask backend server and API endpoints.
- `/db.py`: Database abstraction layer.
- `/pokemon_db.json`: JSON data containing over 800+ Pokemon.
- `/frontend/src/components`:
  - `Header.tsx`: Animated search and filter controls.
  - `PokemonCard.tsx`: Individual Pokemon data visualization.
  - `CustomDropdown.tsx`: Custom animated selection menus.
  - `Loader.tsx`: Performance-optimized loading states.
- `/frontend/src/App.tsx`: Main application logic and state management.

---

## Performance Optimizations

- **Backend Caching**: 60-second TTL cache for DB lookups to pick up live file changes while keeping API response times under 50ms.
- **Throttled Scroll**: Uses `requestAnimationFrame` for high-frequency scroll tracking.
- **Asset Fallbacks**: Intelligent image sanitization and Pokeball placeholder for missing sprites.
