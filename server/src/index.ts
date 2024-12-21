// src/index.ts
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { Game } from './game.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Sequence Game Server Running');
});

// Game state endpoint
app.get('/api/games', (req, res) => {
  const gameStates = Array.from(games.entries()).map(([id, game]) => ({
    id,
    state: game.getState()
  }));
  res.json(gameStates);
});

const server = app.listen(port, () => {
  console.log(`
    Server running on http://localhost:${port}
    Test API: http://localhost:${port}/api/games
  `);
});

const wss = new WebSocketServer({ server });
const games = new Map<string, Game>();

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  
  ws.on('message', (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);
      
      switch (data.type) {
        case 'CREATE_GAME':
          const gameId = Math.random().toString(36).substring(7);
          games.set(gameId, new Game(gameId));
          ws.send(JSON.stringify({ 
            type: 'GAME_CREATED', 
            gameId,
            timestamp: Date.now() 
          }));
          break;
          
        case 'PING':
          ws.send(JSON.stringify({ 
            type: 'PONG',
            timestamp: Date.now() 
          }));
          break;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });
});