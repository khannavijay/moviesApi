const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

const dbpath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started up and running on port number: 3000");
    });
  } catch (error) {
    console.log(`DB Error ${error}`);
    process.exit(1);
  }
};

initializeDb();

app.get("/movies/", async (req, res) => {
  const query = "select movie_name from movie";
  const resultArr = await db.all(query);
  const newResult = resultArr.map((item) => {
    return { movieName: item.movie_name };
  });
  res.send(newResult);
});

app.get("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const qry = `select * from movie where movie_id=${movieId}`;
  const getMovie = await db.get(qry);
  response.send(getMovie);
});

app.delete("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const qry = `delete from movie where movie_id=${movieId}`;
  await db.run(qry);
  response.send("Movie Removed");
});

app.post("/movies/", async (req, res) => {
  const { directoId, movieName, leadActor } = req.body;
  const qury = `insert into movie (director_id, movie_name, lead_actor) values(${directoId},'${movieName}', '${leadActor}')`;
  await db.run(qury);
  response.send("Movie Successfully Added");
});

app.put("/movies/:movieId/", async (req, res) => {
  const { directorId, movieName, leadActor } = req.body;
  const { movieId } = req.params;
  const qury = `update movie set director_id=${directorId}, movie_name='${movieName}', lead_actor='${leadActor}' where movie_id=${movieId}`;
  await db.run(qury);
  res.send("Movie Details Updated");
});

app.get("/directors/", async (req, res) => {
  const query = "select * from director";
  const resultArr = await db.all(query);
  const newResult = resultArr.map((item) => {
    return { directorId: item.director_id, directorName: item.director_name };
  });
  res.send(newResult);
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  const { directorId } = req.params;
  const query = `select movie_name from movie where director_id=${directorId}`;
  const resultArr = await db.all(query);
  const newResult = resultArr.map((item) => {
    return { movieName: item.movie_name };
  });
  res.send(newResult);
});

module.exports = app;
