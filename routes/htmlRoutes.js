var db = require("../models");

module.exports = function(app) {
  // Load main page
  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/home.html");
  });

  // Load game page
  app.get("/game", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
