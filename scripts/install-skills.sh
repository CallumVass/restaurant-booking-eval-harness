#!/usr/bin/env bash
set -euo pipefail

npx skills add https://github.com/wshobson/agents --skill dotnet-backend-patterns --copy -y
npx skills add https://github.com/mhagrelius/dotfiles --skill dotnet-10-csharp-14 --copy -y
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices --copy -y
npx skills add https://github.com/shadcn/ui --skill shadcn --copy -y
npx skills add https://github.com/deckardger/tanstack-agent-skills --skill tanstack-query-best-practices --copy -y
npx skills add https://github.com/orval-labs/orval --skill orval --copy -y
