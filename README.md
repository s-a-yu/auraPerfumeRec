# Aura - AI-Powered Perfume Recommendation System

a full-stack app that helps you discover fragrances based on your scent preferences. pick the notes you love, and get personalized perfume recommendations.

## how it works

select fragrance notes you like (vanilla, musk, rose, citrus, etc.) and aura finds perfumes that match. there are two ways to get recommendations:

### 1. instant recommendations (TF-IDF)
- searches a local dataset of 65,000+ fragrances
- uses machine learning (TF-IDF vectorization + cosine similarity)
- returns results in ~1 second
- works offline, no API key needed

### 2. deep web research (AI-powered)
- uses pydantic_ai agents to search the web in real-time
- finds perfumes beyond the fixed dataset
- takes 30-60 seconds (background task with progress bar)
- requires a free API key (groq recommended)

both methods return the same format: perfume name, brand, and notes - so you can save any recommendation to your favorites.

## quick start

```bash
./start_all.sh
```

then open http://localhost:3000

see [START_GUIDE.md](START_GUIDE.md) for detailed setup instructions, troubleshooting, and environment configuration.

## tech stack

| layer | tech |
|-------|------|
| frontend | react 18, react router, bootstrap 5 |
| backend | node.js, express, mongodb |
| recsystem | python, flask, scikit-learn (TF-IDF) |
| deep research | python, flask, pydantic_ai, groq/gemini |
| auth | JWT tokens, bcrypt |

## architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Express API    │────▶│    MongoDB      │
│   (Port 3000)   │     │  (Port 8080)    │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │ /recommend            │ /api/research/*
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   Flask API     │     │  Deep Research  │
│   (Port 5000)   │     │  (Port 5001)    │
│   TF-IDF ML     │     │  pydantic_ai    │
└─────────────────┘     └─────────────────┘
```

## features

- interactive scent note selection
- two recommendation engines (instant + deep research)
- user auth with secure password storage
- personal fragrance collection dashboard
- save/remove favorites
- progress tracking for deep research tasks

## project structure

```
perfumeRec/
├── my-app/                 # react frontend
├── backend/                # express api + auth
├── recSystem/              # TF-IDF recommendation engine
├── deepResearch/           # pydantic_ai web research agents
│   ├── agents/             # planner, searcher, analyzer
│   ├── models/             # pydantic schemas
│   └── tasks/              # background task manager
├── start_all.sh            # start everything
├── stop_all.sh             # stop everything
├── START_GUIDE.md          # detailed setup guide
└── README.md
```

## api endpoints

### auth
- `POST /api/auth/register` - create account
- `POST /api/auth/login` - login, get JWT

### fragrances
- `GET /api/frag/user/favorites?email=...` - get saved fragrances
- `POST /api/frag/save/user/fragrance` - save a fragrance
- `POST /api/frag/remove/user/fragrance` - remove a fragrance

### recommendations
- `GET /recommend?notes=vanilla+musk&n=5` - instant TF-IDF recommendations (port 5000)
- `POST /api/research/start` - start deep research task (port 5001)
- `GET /api/research/status/:taskId` - poll task status

## running tests

```bash
# backend (jest)
cd backend && npm test

# recsystem (pytest)
cd recSystem && source venv/bin/activate && pytest test_app.py -v
```

## license

ISC
