# Aura - Perfume Recommendation System

## quick start

to start everything (backend, recsystem, deep research, frontend):

```bash
./start_all.sh
```

this starts:
- **backend** (node/express) on port 8080
- **recsystem** (python/flask) on port 5000 - TF-IDF recommendations
- **deep research** (python/flask) on port 5001 - AI-powered web research
- **frontend** (react) on port 3000

to stop everything:

```bash
./stop_all.sh
```

---

## services

### frontend (react)
- **url**: http://localhost:3000
- **location**: `my-app/`

### backend (node/express)
- **url**: http://localhost:8080
- **location**: `backend/`
- **endpoints**:
  - `/api/auth/login` - user login
  - `/api/auth/register` - user registration
  - `/api/frag/*` - fragrance management
  - `/api/research/*` - deep research proxy

### recsystem (python/flask)
- **url**: http://localhost:5000
- **location**: `recSystem/`
- **endpoints**:
  - `/recommend` - get recommendations from 65k dataset

### deep research (python/flask + pydantic_ai)
- **url**: http://localhost:5001
- **location**: `deepResearch/`
- **endpoints**:
  - `POST /api/research/start` - start web research task
  - `GET /api/research/status/:taskId` - poll task status
  - `POST /api/research/cancel/:taskId` - cancel task

---

## deep research setup

the deep research feature uses AI to search the web for perfume recommendations beyond the fixed dataset.

1. get a free API key:
   - **groq** (recommended): https://console.groq.com/keys
   - **gemini**: https://aistudio.google.com/app/apikey

2. configure `deepResearch/.env`:
   ```bash
   LLM_PROVIDER=groq
   GROQ_API_KEY=your-key-here
   ```

3. the venv is auto-created on first run via `start_all.sh`

---

## manual start (individual services)

### backend
```bash
cd backend && node index.js
```

### recsystem
```bash
cd recSystem && source venv/bin/activate && python app.py
```

### deep research
```bash
cd deepResearch && ./venv/bin/python server.py
```

### frontend
```bash
cd my-app && npm start
```

---

## logs

all logs in `logs/` directory:

```bash
tail -f logs/*.log           # all logs
tail -f logs/backend.log     # backend only
tail -f logs/recsystem.log   # recsystem only
tail -f logs/deepresearch.log # deep research only
tail -f logs/frontend.log    # frontend only
```

---

## troubleshooting

### port already in use
```bash
./stop_all.sh && ./start_all.sh
```

### mongodb connection issues
check `backend/.env` for correct `MONGO_URI`

### python venv issues
```bash
cd recSystem && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

### deep research not working
1. check logs: `tail -f logs/deepresearch.log`
2. verify `.env` has valid API key
3. try switching provider (groq vs gemini)

### react build issues
```bash
cd my-app && npm install && npm start
```

---

## first time setup

1. install dependencies:
   ```bash
   # backend
   cd backend && npm install

   # frontend
   cd ../my-app && npm install

   # recsystem
   cd ../recSystem && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

   # deep research (optional - auto-created on start)
   cd ../deepResearch && python -m venv venv && ./venv/bin/pip install -r requirements.txt
   ```

2. configure env files:
   - `backend/.env` - mongodb uri, jwt secret
   - `deepResearch/.env` - llm provider and api key

3. start:
   ```bash
   ./start_all.sh
   ```

4. open http://localhost:3000

---

## env variables

### backend/.env
- `MONGO_URI` - mongodb connection string
- `PORT` - server port (default: 8080)
- `JWT_SECRET` - jwt secret key

### deepResearch/.env
- `LLM_PROVIDER` - "groq" or "gemini"
- `GROQ_API_KEY` - groq api key (free)
- `GEMINI_API_KEY` - gemini api key (optional)
