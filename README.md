# Project 07 #AIAugustAppADay: Movie Recommendation App

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-07)  

**📆 Date**: 11/Aug/2025  
**🎯 Project Objective**: Get AI-powered movie recommendations by genre, mood, or prompt.  
**🚀 Features**: Search by genre, mood, prompt; Get AI recommendations; Show movie posters/info. Stretch goals: two or more people start same session, get shown a selection of movies and all pick which ones they'd be willing to watch, then the app shows them their common picks  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API, OMDb API ([https://www.omdbapi.com/](https://www.omdbapi.com/))  
**▶️ Live Demo**: *[https://dave-donnelly-ai-august-07.netlify.app/](https://dave-donnelly-ai-august-07.netlify.app/)*  

## 🗒️ Summary

Today’s app was a movie recommendation tool built with the OpenAI API and the OMDb API — a direct attempt to solve a real problem my husband and I face almost every week. As usual, I had a long wish list of features I wanted to build (see [ai-august-2025-07.drawio.png](./ai-august-2025-07.drawio.png) for details), but I’m getting more comfortable with not completing everything within a single day’s sprint.  

One of the main challenges was working around the OpenAI API’s knowledge cut-off date. The model can’t recommend recent releases unless I switch to a setup that uses a tool for web search. Since that approach comes with higher costs, I built a system that only triggers the model switch and tool usage if the user specifically asks for something “new” or “recent.” It became a balancing act — using the right tool for the right job while keeping API costs under control.  

The OMDb API brought its own limitations: the free tier caps requests at 1,000 calls per day. When each recommendation might involve retrieving details and posters for 10 movies, those calls could disappear quickly. To prevent waste, I implemented a caching mechanism that stores movie data in `localStorage` for the session. If the same movies appear in later recommendations, the data is pulled instantly from cache, and only new movies trigger additional OMDb API calls.  

**Lessons learned**
- Design API workflows to adapt to both capability limitations and cost constraints.  
- Implement caching early when dealing with APIs that have strict call limits.  
- It’s okay to leave some planned features for “version 2” — especially when the MVP solves the core problem.  

**Final thoughts**
This project forced me to think about the real-world trade-offs between API usage, costs, and user experience. While the app isn’t yet feature-complete, the caching and selective tool usage make it both more efficient and sustainable.  



This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).  

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-07/actions/workflows/npm_test.yml/badge.svg)  
*Note: Test suite runs automatically with each push/merge.*  

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/davedonnellydev/ai-august-2025-07.git
   cd ai-august-2025-07
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# OMDb API (for movie data)
OMDB_API_KEY=your_omdb_api_key_here
```

### Key Configuration Files

- `next.config.mjs` – Next.js config with bundle analyzer
- `tsconfig.json` – TypeScript config with path aliases (`@/*`)
- `theme.ts` – Mantine theme customization
- `eslint.config.mjs` – ESLint rules (Mantine + TS)
- `jest.config.cjs` – Jest testing config
- `.nvmrc` – Node.js version

### Path Aliases

```ts
import { Component } from '@/components/Component'; // instead of '../../../components/Component'
```

## 📦 Available Scripts
### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyze production bundle

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `prettier:check`, `lint`, `typecheck` and `jest`

### Other scripts

- `npm run prettier:check` – checks files with Prettier
- `npm run prettier:write` – formats files with Prettier



## 📜 License
![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-07)  
This project is licensed under the MIT License.  
