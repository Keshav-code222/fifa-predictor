# ⚽ FIFA World Cup 2026 Match Predictor

An AI powered match prediction tool for the FIFA World Cup 2026. Select any fixture from the official schedule and get an instant prediction with scoreline, analysis, and confidence level — completely free.

## Live Demo

🔗 https://fifa-predictor-o1sw.vercel.app/

## What it does

- Browse all 66 group stage fixtures grouped by matchday
- Select any match to see teams, venue, and kickoff time
- Get an AI generated prediction with predicted score, winner, match analysis, and confidence level
- Works on mobile and desktop

## Tech Stack

- **Frontend & Backend** — Next.js 15 (App Router)
- **Styling** — Tailwind CSS
- **AI** — Groq API (Llama 3.3 70B)
- **Deployment** — Vercel
- **Data** — Hardcoded official FIFA 2026 fixtures

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Keshav-code222/fifa-predictor.git
cd fifa-predictor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

Get your free Groq API key at https://console.groq.com

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

fifa-predictor/

├── app/

│   ├── api/

│   │   ├── fixtures/     # Fixtures API route (unused, kept for reference)

│   │   └── predict/      # Groq AI prediction route

│   ├── page.js           # Main homepage

│   ├── layout.js         # Root layout

│   └── globals.css       # Global styles

├── data/

│   └── fixtures.js       # All 66 FIFA 2026 group stage fixtures

└── public/               # Static assets


## Contributing

Contributions are welcome. Here's how you can help:

- **Update fixtures** — As FIFA confirms knockout round matchups, update `data/fixtures.js`
- **UI improvements** — Better design, mobile responsiveness, country flags
- **Features** — Share prediction card, results tracker, accuracy stats
- **Bug fixes** — Open an issue first describing what you found

### Steps to contribute

1. Fork the repository
2. Create a new branch `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit `git commit -m "feat: describe your change"`
5. Push `git push origin feature/your-feature-name`
6. Open a Pull Request

## Roadmap

- [ ] Country flags for each team
- [ ] Better prediction formatting
- [ ] Share prediction as image card
- [ ] Knockout bracket once FIFA confirms
- [ ] Post match accuracy tracker

## License

MIT — free to use, modify, and distribute.