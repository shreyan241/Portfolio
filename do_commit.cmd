@echo off
git rm --cached tsconfig.app.tsbuildinfo tsconfig.node.tsbuildinfo
git add -A
git commit -m "Ignore Vite cache and TS build info artifacts"
