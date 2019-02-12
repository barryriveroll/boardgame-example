module.exports = function(sequelize, DataTypes) {
  var GameLogic = sequelize.define("Board", {
    turnOrder: DataTypes.STRING,
    currentTurn: DataTypes.INTEGER,
    boardSpots: DataTypes.TEXT
  });
  return GameLogic;
};
