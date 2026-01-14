# Weather App

En väderapplikation byggd med React och Vite som visar väderdata för olika städer.

## Funktioner

- Sök efter väderdata för olika städer
- Visa temperatur, luftfuktighet, vindhastighet och UV-index
- Modern och responsiv design
- Integrerad med OpenWeatherMap API

## Installation

1. Installera dependencies för både frontend och backend:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## Konfiguration

### API-nyckel för väderdata

För att använda riktig väderdata behöver du en API-nyckel från OpenWeatherMap:

1. Skapa ett gratis konto på [OpenWeatherMap](https://openweathermap.org/api)
2. Hämta din API-nyckel från kontot
3. Skapa en `.env`-fil i `frontend/`-mappen:
   ```
   VITE_WEATHER_API_KEY=din_api_nyckel_här
   ```

**Obs:** Om ingen API-nyckel anges kommer appen att använda demo-data.

## Starta applikationen

### Backend
```bash
cd backend
npm start
```
Backend körs på port 4000.

### Frontend
```bash
cd frontend
npm run dev
```
Frontend körs på port 5173.

Öppna [http://localhost:5173](http://localhost:5173) i din webbläsare.

## Projektstruktur

```
Weather-App-main/
├── backend/
│   └── src/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── SearchBar.jsx
│       │   ├── Sidebar.jsx
│       │   └── WeatherDisplay.jsx
│       ├── pages/
│       │   └── HomePage.jsx
│       ├── services/
│       │   └── weatherApi.js
│       └── styles/
└── README.md
```

## Användning

1. Använd sökfältet på högersidan för att söka efter en stad
2. Väderdata kommer att visas automatiskt när sökningen är klar
3. Appen visar temperatur, väderbeskrivning, luftfuktighet, vindhastighet och UV-index

## Teknologier

- React 19
- Vite
- Express (Backend)
- OpenWeatherMap API
- React Icons

