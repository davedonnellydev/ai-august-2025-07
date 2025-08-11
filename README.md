# Project 07 #AIAugustAppADay: Movie Recommendation App

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-07)

**📆 Date**: 11/Aug/2025  
**🎯 Project Objective**: Get AI-powered movie recommendations by genre, mood, or prompt.  
**🚀 Features**: Search by genre, mood, prompt; Get AI recommendations; Show movie posters/info. Stretch goals: two or more people start same session, get shown a selection of movies and all pick which ones they'd be willing to watch, then the app shows them their common picks  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API, OMDb API ([https://www.omdbapi.com/](https://www.omdbapi.com/))  
**▶️ Live Demo**: *[https://your-demo-url.com](https://your-demo-url.com)*  
*(Link will be added after deployment)*  

## 🗒️ Summary
**Lessons learned**  
*A little summary of learnings*  

**Blockers**  
*Note any blockers here*  

**Final thoughts**  
*Any final thoughts here*  


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
   # Edit .env.local with your values
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

# Optional: External API URLs
USER_API_URL=https://jsonplaceholder.typicode.com/users
PRODUCT_API_URL=https://dummyjson.com/products

# Optional: Proxy Settings
ENABLE_CACHE=true
CACHE_DURATION=300000
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
