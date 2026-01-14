# Backend Miljövariabler Setup

För att använda riktig väderdata från OpenWeatherMap API, skapa en `.env`-fil i `backend/`-mappen med följande innehåll:

```env
WEATHER_API_KEY=din_api_nyckel_här
PORT=4000
```

## Så här får du en API-nyckel:

1. Gå till [OpenWeatherMap](https://openweathermap.org/api)
2. Skapa ett gratis konto
3. Navigera till "API keys" i din dashboard
4. Kopiera din API-nyckel
5. Lägg till den i `.env`-filen som `WEATHER_API_KEY`

## Viktigt:

- `.env`-filen är redan i `.gitignore` och kommer inte att committas till git
- Om ingen API-nyckel anges, kommer backend automatiskt att använda demo-data
- Projektet fungerar direkt när någon klonar det, även utan API-nyckel

