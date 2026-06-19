# ⚽ FIFA World Cup 2026 Match Predictor

An AI powered match prediction tool for the FIFA World Cup 2026. Select any fixture from the official schedule and get an instant prediction with win probabilities — completely free.

## Live Demo

🔗 https://fifa-predictor-o1sw.vercel.app/

## What it does

- Browse all 66 group stage fixtures grouped by matchday
- Select any match to see teams, venue, and kickoff time
- Get an AI prediction with win probability bars
- Green glow on predicted winner, red glow on loser, yellow on draw
- Predictions get smarter as real 2026 results are added after each match

## Tech Stack

- **Frontend & Backend** — Next.js 15 (App Router)
- **Styling** — Tailwind CSS
- **AI** — Groq API (Llama 3.3 70B)
- **Deployment** — Vercel
- **Data** — Official FIFA 2026 fixtures + live results

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

## Updating Match Results

After each match, add the result to `data/results2026.js`:

```javascript
{ home: "Team A", away: "Team B", score: "2-1", date: "2026-06-XX", note: "One sentence describing the match story" }
```

If it was an upset, say it clearly in the note. The AI reads every result before predicting — better notes mean smarter predictions.

Then push:

```bash
git add .
git commit -m "results: Team A 2-1 Team B"
git push
```

Vercel auto deploys within 60 seconds.

## Project Structure
fifa-predictor/

├── app/

│   ├── api/

│   │   ├── fixtures/        # Fixtures API route

│   │   └── predict/         # Groq AI prediction route

│   ├── page.js              # Main homepage

│   ├── layout.js            # Root layout

│   └── globals.css          # Global styles

├── data/

│   ├── fixtures.js          # All 66 FIFA 2026 group stage fixtures

│   ├── results2026.js       # Live match results updated after each game

│   └── teamFlags.js         # Country code mapping for flags

└── public/                  # Static assets

## Contributing

Contributions are welcome. Here is how you can help:

- **Add match results** — Update `data/results2026.js` after each game
- **UI improvements** — Better design, animations, mobile experience
- **Knockout fixtures** — Add bracket once FIFA confirms round of 16
- **Bug fixes** — Open an issue describing what you found

### Steps to contribute

1. Fork the repository
2. Create a new branch `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit `git commit -m "feat: describe your change"`
5. Push `git push origin feature/your-feature-name`
6. Open a Pull Request

## Roadmap

- [ ] Knockout bracket once FIFA confirms round of 16
- [ ] Post match accuracy tracker
- [ ] Share prediction as image card
- [ ] Mobile improvements
- [ ] Country flags using official sources

## License

MIT — free to use, modify, and distribute.