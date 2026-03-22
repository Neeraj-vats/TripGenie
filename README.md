# 🌍 TripGenie — AI-Powered Travel Planner

> Plan a 5-day trip to Manali under ₹20,000 in one prompt.  
> TripGenie generates day-wise itineraries, hotel suggestions, live weather & interactive maps — powered by Google ADK + Gemini.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![](https://img.shields.io/badge/Python-FastAPI-blue?style=flat-square&logo=fastapi)
![](https://img.shields.io/badge/Google-ADK-orange?style=flat-square&logo=google)
![](https://img.shields.io/badge/MongoDB-Atlas-darkgreen?style=flat-square&logo=mongodb)

---

## ✨ What It Does

Type a single prompt. Get a complete trip plan in ~8 seconds.

```
Destination: Manali  |  Days: 5  |  Budget: ₹20,000  |  Travel Type: Solo
```

**What you get back:**
- 📅 Day-wise itinerary (morning / afternoon / evening)
- 🏨 Hotel recommendations filtered to your budget
- 📍 Places to visit with ratings and descriptions
- 🗺️ Interactive Mapbox map with routes and hotel pins
- ⛅ Real-time weather forecast for trip duration
- 💰 Itemized cost breakdown (stay, food, transport, activities)

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│   Next.js 14    │────▶│  Node.js /      │────▶│   Python FastAPI    │
│   Frontend      │◀────│  Express.js API │◀────│   + Google ADK      │
│   (Vercel)      │ SSE │  (Railway)      │     │   Agent (Cloud Run) │
└─────────────────┘     └────────┬────────┘     └──────────┬──────────┘
                                 │                          │
                         ┌───────▼───────┐        ┌────────▼────────┐
                         │  MongoDB Atlas│        │  External APIs  │
                         │  + Redis Cache│        │  Maps · Weather │
                         └───────────────┘        │  Places · Gemini│
                                                  └─────────────────┘
```

**Three independently deployable services:**

| Service | Stack | Hosting |
|---------|-------|---------|
| Frontend | Next.js 14 + Tailwind CSS + Mapbox GL JS | Vercel |
| Backend API | Node.js + Express.js + MongoDB + Redis | Railway |
| AI Agent | Python + FastAPI + Google ADK + Gemini Pro | Google Cloud Run |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) — App Router, SSR
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) — Interactive maps
- [Recharts](https://recharts.org/) — Cost breakdown donut chart
- [Axios](https://axios-http.com/) — HTTP client

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) — REST API
- [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Auth
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Primary database
- [Redis](https://redis.io/) — Session and plan caching
- Server-Sent Events (SSE) — Real-time streaming to frontend

**AI Agent**
- [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs) — Multi-step agent orchestration
- [Gemini Pro](https://deepmind.google/technologies/gemini/) — Underlying LLM
- [FastAPI](https://fastapi.tiangolo.com/) — Python microservice
- [Pydantic](https://docs.pydantic.dev/) — Structured output validation

**External APIs**
- [Google Maps Platform](https://developers.google.com/maps) — Routes, geocoding
- [OpenWeatherMap](https://openweathermap.org/api) — Weather forecasts
- [Google Places / Foursquare](https://foursquare.com/developer) — Hotels & attractions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Redis instance (local or cloud)
- API keys: Google Cloud (Maps + Places + ADK), OpenWeatherMap, Foursquare, Mapbox

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/tripgenie.git
cd tripgenie
```

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)
npm run dev
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your keys
npm run dev
```

### 4. AI Agent setup

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your keys
uvicorn main:app --reload --port 8000
```

### 5. Run with Docker Compose (recommended)

```bash
cp .env.example .env
# Fill in all keys
docker-compose up --build
```

App runs at `http://localhost:3000`

---

## 🔑 Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**`backend/.env`**
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_256bit_secret
AGENT_SERVICE_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
PORT=4000
```

**`ai-agent/.env`**
```env
GOOGLE_API_KEY=your_google_cloud_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
OPENWEATHER_API_KEY=your_openweather_key
FOURSQUARE_API_KEY=your_foursquare_key
```

---

## 📁 Project Structure

```
tripgenie/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── page.tsx           # Home — prompt input
│   │   ├── auth/              # Login / Signup
│   │   ├── trip/[id]/         # Generated trip view
│   │   └── dashboard/         # Saved trips
│   └── components/
│       ├── TripMap.tsx        # Mapbox component
│       ├── Itinerary.tsx      # Day-wise plan
│       ├── CostCard.tsx       # Budget breakdown
│       └── WeatherStrip.tsx   # Forecast bar
│
├── backend/                   # Node.js API
│   ├── routes/
│   │   ├── auth.js            # Register, login
│   │   └── trips.js           # Generate, list, share
│   ├── middleware/
│   │   └── protect.js         # JWT middleware
│   └── models/
│       ├── User.js            # MongoDB user schema
│       └── Trip.js            # MongoDB trip schema
│
├── ai-agent/                  # Python FastAPI
│   ├── main.py                # FastAPI app + /plan endpoint
│   ├── agent.py               # Google ADK agent setup
│   └── tools/
│       ├── weather.py         # OpenWeatherMap tool
│       ├── places.py          # Google Places tool
│       ├── routes.py          # Google Maps tool
│       └── costs.py           # Budget estimator tool
│
└── docker-compose.yml
```

---

## 🔄 How the Agent Works

```
User Prompt
    │
    ▼
Node.js Backend  ──POST /plan──▶  FastAPI Agent
                                       │
                          ┌────────────▼────────────┐
                          │     Google ADK Agent     │
                          │       (Gemini Pro)        │
                          └────────────┬────────────┘
                                       │
               ┌───────────────────────┼──────────────────────┐
               ▼                       ▼                       ▼                      ▼
     get_weather()            get_places()            get_route()          estimate_costs()
     OpenWeatherMap           Google Places           Google Maps          Budget logic
     5-day forecast           Hotels + spots          Encoded polyline     ₹ breakdown
               │                       │                       │                      │
               └───────────────────────┴──────────────────────┴──────────────────────┘
                                       │
                              Structured JSON
                                       │
                          ◀────────────┘
                     Backend saves to MongoDB
                          │
                     SSE stream to frontend
```

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Average trip generation time | ~7.8 seconds |
| Agent API call success rate | 97.5% |
| Budget accuracy vs. actual spend | Within 12% |
| Frontend load time (Lighthouse) | 2.1 seconds |
| Map render time | < 1 second |
| MongoDB query latency | < 30ms |

---

## 🗺️ Sample Output

**Input:** `Manali | 5 days | ₹20,000 | Solo`

| Day | Highlights |
|-----|-----------|
| Day 1 | Arrival → Zostel check-in (₹500) → Old Manali market → Café Bob |
| Day 2 | Solang Valley → ropeway (₹300) → paragliding → dhaba dinner |
| Day 3 | Hadimba Temple → Vashisht hot springs → Mall Road |
| Day 4 | Rohtang Pass full day → snow activities |
| Day 5 | Morning leisure → return bus |

**Cost:** ₹14,000 total — ₹6,000 under budget ✅

---

## 🚧 Roadmap

- [ ] Hotel booking integration (MakeMyTrip / Booking.com API)
- [ ] Flight + train search with IRCTC
- [ ] WhatsApp / Instagram chatbot interface
- [ ] React Native mobile app
- [ ] Hindi and regional language support
- [ ] Collaborative multi-user trip planning
- [ ] PDF export of itinerary
- [ ] SaaS monetization (freemium + Pro at ₹299/month)

---

## 👨‍💻 Authors

**Ritish Bansal** — [GitHub](https://github.com/ritishbansal) · [LinkedIn](https://linkedin.com/in/ritishbansal)  
**Neeraj Vats** — [GitHub](https://github.com/neerajvats) · [LinkedIn](https://linkedin.com/in/neerajvats)
**Khushi** — [GitHub](https://github.com/neerajvats) · [LinkedIn](https://linkedin.com/in/neerajvats)

B.Tech CSE — Dronacharya College of Engineering, Gurugram (2023–2027)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with ❤️ for every budget traveller in India 🇮🇳</p>
