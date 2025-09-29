# MongoDB Installation Instructions

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Replace MONGO_URI in .env file with your Atlas connection string

## Option 2: Install MongoDB Community Server Locally
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install it with default settings
3. Start MongoDB service:
   - Windows: Open Services.msc → Start "MongoDB" service
   - Or run: net start MongoDB

## Option 3: Use Development Mode (No Database)
Run the server without MongoDB:
```bash
npm run dev-no-db
```

This will start a mock server with your player data but no persistent storage.

## Quick Start for Development
If you just want to test the frontend immediately:
```bash
npm run dev-no-db
```

The server will run on http://localhost:5000 with mock data.
