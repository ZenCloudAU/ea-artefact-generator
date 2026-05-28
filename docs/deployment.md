# Deployment

## Purpose

Enterprise architecture artefact generation workspace for structured EA outputs, engagement materials, and export-ready architecture content.

## Production

- Production URL: https://ea.velocityarchitecture.com.au/
- Deployment platform: Cloudflare Pages / custom domain target
- Source branch: main
- Build command: npm run build
- Output directory: dist
- Ecosystem role: EA artefact tooling

## Notes

This repo is part of the Velocity tool layer and should remain connected to VAF, VAF-SA, and Academy learning pathways.

## Health Check

- Confirm Cloudflare Pages production branch is main.
- Confirm build output is dist.
- Confirm no secrets or local environment files are committed.
- Confirm exported artefacts and demo content are clearly separated from production code.
