require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Game = require("./game.js");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

io.on("connection", function(socket) {
  socket.on("addPlayer", function(name) {
    Game.addPlayer(io, name);
  });

  socket.on("startGame", function(start) {
    console.log("start 1");
    Game.start(io, start);
  });

  socket.on("endTurn", function(turn) {
    Game.endTurn(io, turn);
  });

  socket.on("startTurn", function(turn) {
    Game.startTurn(io, turn);
  });

  socket.on("playerMove", function(playerId) {
    Game.playerMove(io, playerId);
  });
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  http.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
