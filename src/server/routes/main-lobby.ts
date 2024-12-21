import express from "express";
import { GameModel } from "../models/game";

const router = express.Router();

interface Game {
  id: string;
  players: number;
  player_count: number;
  [key: string]: any;
}

router.get("/", async (request, response, next) => {
  try {
    const user = request.session.user;

    // Redirect guests to login
    if (!user) {
      return response.redirect("/auth/login");
    }

    // Fetch available games
    const availableGames = await GameModel.availableGames();

    // Fetch games the user has joined
    const playerGames = await GameModel.playerGames(user.id.toString());

    // Add currentPlayerIsMember flag to each game
    const gamesWithMembershipFlag = availableGames.map((game: Game) => ({
      ...game,
      currentPlayerIsMember: Boolean(playerGames[game.id]),
    }));

    // Render main lobby
    response.render("main-lobby", {
      title: "Game Lobby",
      user,
      availableGames: gamesWithMembershipFlag,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    next(error); // Pass error to the global error handler
  }
});

export default router;
