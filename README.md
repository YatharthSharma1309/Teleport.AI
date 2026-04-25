
# Teleport AI Monorepo

This project allows users to input coordinates and have their photo background changed to that location.

## Architecture
- **Backend:** Django + DRF (Handles Image Processing)
- **Frontend:** React Native (Handles Interactive UI)

## API Keys Required
- Google Street View Static API
- Remove.bg API

## Setup
1. Backend: `pip install requests djangorestframework django-cors-headers`
2. Frontend: `npm install expo-image-picker`
