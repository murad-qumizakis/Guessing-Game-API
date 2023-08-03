import express from "express";
import {
  getAllGames,
  getGameById,
  createGame,
  deleteGame,
} from "./database.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

const checkTokenMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorizationHeader.split(" ")[1];

  if (token !== process.env.TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

app.use(checkTokenMiddleware);

app.get("/", async (req, res) => {
  const games = await getAllGames();
  res.json(games);
});

app.get("/game/:id", async (req, res) => {
  const { id } = req.params;
  const game = await getGameById(id);
  res.send(game);
});

app.post("/game", async (req, res) => {
  const { name } = req.body;
  const [newGame] = await createGame(name);
  res.json(newGame);
});

app.delete("/game/:id", async (req, res) => {
  const { id } = req.params;
  await deleteGame(id);
  res.send("Game deleted");
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
