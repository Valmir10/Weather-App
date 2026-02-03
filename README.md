# Weather App

En modern väderapplikation byggd med React och Vite som visar realtidsväderdata för städer över hela världen. Applikationen använder OpenWeatherMap API.

## Funktioner

- Sök efter väderdata för städer världen över
- Visa temperatur, luftfuktighet, vindhastighet och UV-index
- Hämta väder för din aktuella position via geolocation
- Spara favoritstäder för snabb åtkomst
- Modern glassmorphism-design med frostad glass-effekt
- Fully responsive design för desktop, tablet och mobil
- Custom on-screen keyboard för mobila enheter
- Demo-läge som automatiskt aktiveras om API-nyckel saknas

## Installation

1. Klona projektet:
```bash
git clone https://github.com/Valmir10/Weather-App.git
cd Weather-App
```

2. Installera dependencies för frontend:
```bash
cd frontend
npm install
```

3. Installera dependencies för backend:
```bash
cd backend
npm install
```

## Konfiguration

### API-nyckel för väderdata

För att använda riktig väderdata behöver du en API-nyckel från OpenWeatherMap:

1. Skapa en fil som heter .env i backend/-mappen med detta innehåll:
```
WEATHER_API_KEY=6802549fb7737b629d4647b7afd9ac03
PORT=4000
```

**Observera:** Om ingen API-nyckel anges kommer appen automatiskt att använda demo-data.

## Starta applikationen

1. Starta backend:
```bash
cd backend
npm start
```
Backend körs på http://localhost:4000

2. Starta frontend:
```bash
cd frontend
npm run dev
```
Frontend körs på http://localhost:5173

3. Öppna http://localhost:5173 i din webbläsare

## Projektstruktur

```
Weather-App/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI workflow
├── backend/
│   ├── src/
│   │   └── server.js                   # Express server och API routes
│   ├── package.json
│   └── .env                            # Environment variables (ej i Git)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CurrentLocationButton.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Keyboard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── WeatherDisplay.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── services/
│   │   │   └── weatherApi.js
│   │   ├── styles/
│   │   │   ├── CurrentLocationButton.css
│   │   │   ├── Header.css
│   │   │   ├── HomePage.css
│   │   │   ├── Keyboard.css
│   │   │   ├── SearchBar.css
│   │   │   ├── Sidebar.css
│   │   │   ├── WeatherDisplay.css
│   │   │   └── WeatherDisplayResponsive.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── vercel.json                          # Vercel deployment konfiguration
└── README.md
```

## Användning

- Använd sökfältet för att söka efter en stad
- Klicka på "My Position" för att använda din aktuella position
- Favoriter sparas automatiskt och visas i sidebaren
- Klicka på en favorit för att visa dess väderdata

## Teknologier

### Frontend
- React 19
- Vite 5
- React Icons
- CSS3

### Backend
- Node.js 20
- Express
- CORS
- dotenv

### APIs
- OpenWeatherMap API
- Geolocation API
