var editor = {
  init: function () {
    // show editor specific elements
    document.getElementById("editorElements").style = "display: block;";

    // this is the data the editor cares about
    const data = {
      canvas: null,
      animationFrame: 0,
      player: null,
      levelCompletePortal: null,
      enemyPortals: [],
      enemies: [],
      walls: [],
      ladders: [],
      food: [],
      pointsFood: [],
      spikes: [],
      click: {
        count: 0,
        lastLocation: null,
      },
      additionHistory: [],
      undoHistory: [],
    };

    editor.initCanvas(data);
    editor.initEventListeners(data);

    editor.run(data);
  },

  initCanvas: function (data) {
    const canvas = new Canvas("canvas");
    canvas.clear();
    data.canvas = canvas;
  },

  initEventListeners: function (data) {
    document
      .getElementById("canvas")
      .addEventListener("mousedown", (e) => editor.handleMousedown(e, data));
    document
      .getElementById("logEditorEntities")
      .addEventListener("click", (e) => editor.logEntities(e, data));
    document
      .getElementById("saveButton")
      .addEventListener("click", (e) => editor.saveLevel(e, data));
    document
      .getElementById("loadButtonStorage")
      .addEventListener("click", (e) => editor.loadLevelFromStorage(e, data));
    document
      .getElementById("loadButtonData")
      .addEventListener("click", (e) => editor.loadLevelFromData(e, data));
    document
      .getElementById("restoreButton")
      .addEventListener("click", (e) => editor.restoreLastSave(e, data));
    document
      .getElementById("playLevelButton")
      .addEventListener("click", (e) => editor.playThisData(e, data));
    window.addEventListener("keydown", (e) => editor.handleKeydown(e, data));
  },

  handleKeydown: function (e, data) {
    e.preventDefault();

    const key = e.which || e.keyCode || 0;
    data.lastKey = key;

    switch (key) {
      // z = undo last addition
      case 90: {
        if (!data || !data.additionHistory || data.additionHistory.length === 0)
          return;

        // get the last entityType out of the history array
        const historyLength = data.additionHistory.length;
        const entityType = data.additionHistory[historyLength - 1] || "";
        if (!entityType) return;

        let deletedEntity;
        if (entityType === "player" || entityType === "levelCompletePortal") {
          deletedEntity = data[entityType];
          data[entityType] = null;
        } else {
          deletedEntity = data[entityType].splice(
            data[entityType].length - 1,
            1
          )[0];
        }

        // move the deleted entity into the undoHistory array
        data.additionHistory.splice(historyLength - 1, 1);
        data.undoHistory.push(deletedEntity);
        break;
      }
      // y = restores the most recently deleted item
      // NOTE: if that is the player or levelCompletePortal, and a new one has been placed, this will overwrite the new one
      case 89: {
        if (!data || !data.undoHistory || data.undoHistory.length === 0) return;
        // put the most recently deleted item back
        const itemToRestore = data.undoHistory.splice(
          data.undoHistory.length - 1,
          1
        )[0];
        data.additionHistory.push(itemToRestore.type);

        if (
          itemToRestore.type === "player" ||
          itemToRestore.type === "levelCompletePortal"
        ) {
          data[itemToRestore.type] = itemToRestore;
        } else {
          data[itemToRestore.type].push(itemToRestore);
        }
        break;
      }
    }
  },

  handleMousedown: function (e, data) {
    console.log(data.lastKey);
    if (data.click.currentLocation) {
      data.click.lastLocation = data.click.currentLocation;
    }
    data.click.currentLocation = { x: e.offsetX, y: e.offsetY };
    data.click.count++;

    switch (data.lastKey) {
      // d = delete object the mouse is touching
      case 68: {
        const mousePos = { x: e.offsetX, y: e.offsetY, w: 1, h: 1 };
        function deleteIfTouchingMouse(entity) {
          if (isCollision(mousePos, entity)) {
            data.undoHistory.push(entity);
            if (entity.type === "player") data.player = null;
            if (entity.type === "levelCompletePortal")
              data.levelCompletePortal = null;
            console.log(data, entity);
            data[entity.type].forEach((item, index) => {
              if (item.id === entity.id) {
                data[entity.type].splice(index, 1);
              }
            })
          }
        }
        if (data.player) deleteIfTouchingMouse(data.player);
        if (data.levelCompletePortal) deleteIfTouchingMouse(data.levelCompletePortal);
        if (data.walls) data.walls.forEach((wall) => deleteIfTouchingMouse(wall));
        if (data.ladders) data.ladders.forEach((ladder) => deleteIfTouchingMouse(ladder));
        if (data.food) data.food.forEach((food) => deleteIfTouchingMouse(food));
        if (data.pointsFood) data.pointsFood.forEach(
          (pointsFood) =>deleteIfTouchingMouse(pointsFood)
        );
        if (data.enemyPortals) data.enemyPortals.forEach(
          (enemyPortal) => deleteIfTouchingMouse(enemyPortal)
        );
        if (data.enemies) data.enemies.forEach((enemy) => deleteIfTouchingMouse(enemy));
        if (data.spikes) data.spikes.forEach((spike) => deleteIfTouchingMouse(spike));
        break;
      }
      // p = player
      case 80: {
        const player = new Player(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.player = player;
        data.additionHistory.push(player.type);
        break;
      }
      // w = wall
      case 87: {
        if (data.click.count >= 2) {
          data.click.count = 0;
          var dimensions = calculateDimensions(
            data.click.currentLocation,
            data.click.lastLocation,
            4
          );

          const wall = new Wall(
            dimensions.x,
            dimensions.y,
            dimensions.w,
            dimensions.h
          );
          data.walls.push(wall);
          data.additionHistory.push(wall.type);
        }
        break;
      }
      // e = enemy portal
      case 69: {
        const enemyPortal = new EnemyPortal(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.enemyPortals.push(enemyPortal);
        data.additionHistory.push(enemyPortal.type);
        break;
      }
      // c/4 = level complete portal
      case 52:
      case 67: {
        const portal = new LevelCompletePortal(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.levelCompletePortal = portal;
        data.additionHistory.push(portal.type);
        break;
      }
      // l = ladder
      case 76: {
        if (data.click.count >= 2) {
          data.click.count = 0;
          //   console.log(data);
          const dimensions = calculateDimensions(
            data.click.currentLocation,
            data.click.lastLocation,
            16
          );
          const ladder = new Ladder(dimensions.x, dimensions.y, dimensions.h);
          console.log(dimensions);
          data.ladders.push(ladder);
          data.additionHistory.push(ladder.type);
        }
        break;
      }
      // s = spike
      case 83: {
        const spike = new Spike(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.spikes.push(spike);
        data.additionHistory.push(spike.type);
        break;
      }
      // f = food
      case 70: {
        const food = new Food(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.food.push(food);
        data.additionHistory.push(food.type);
        break;
      }
      // + = pointsFood
      case 187: {
        const pointsFood = new PointsFood(
          data.click.currentLocation.x,
          data.click.currentLocation.y
        );
        data.pointsFood.push(pointsFood);
        data.additionHistory.push(pointsFood.type);
        break;
      }
      default: {
      }
    }
  },

  run: function (data) {
    function loop() {
      editor.render(data);
      data.animationFrame++;

      window.requestAnimationFrame(loop);
    }

    loop();
  },

  render: function (data) {
    data.canvas.clear();
    if (data.player) data.player.render(data);
    if (data.enemyPortals)
      data.enemyPortals.forEach((portal) => portal.render(data));
    if (data.levelCompletePortal) data.levelCompletePortal.render(data);
    if (data.enemies) data.enemies.forEach((enemy) => enemy.render(data));
    if (data.walls) data.walls.forEach((wall) => wall.render(data));
    if (data.ladders) data.ladders.forEach((ladder) => ladder.render(data));
    if (data.food) data.food.forEach((food) => food.render(data));
    if (data.pointsFood)
      data.pointsFood.forEach((pointsFood) => pointsFood.render(data));
    if (data.spikes) data.spikes.forEach((spike) => spike.render(data));
  },

  logEntities: function (e, data) {
    let playerText = "null",
      levelCompletePortalText = "null",
      enemyPortalsText = "",
      foodText = "",
      pointsFoodText = "",
      laddersText = "",
      wallsText = "",
      spikesText = "";

    if (data.player) {
      playerText = `{ x: ${data.player.x}, y: ${data.player.y}}`;
    }
    if (data.levelCompletePortal) {
      levelCompletePortalText = `{ x: ${data.levelCompletePortal.x}, y: ${data.levelCompletePortal.y}}`;
    }
    if (data.enemyPortals) {
      data.enemyPortals.forEach((portal, i) => {
        if (i !== 0) enemyPortalsText += "\n";
        enemyPortalsText += `{ x: ${portal.x}, y: ${portal.y}, spawnMovingLeft: ${portal.spawnMovingLeft} },`;
      });
    }
    if (data.food) {
      data.food.forEach((food, i) => {
        if (i !== 0) foodText += "\n";
        foodText += `{ x: ${food.x}, y: ${food.y} },`;
      });
    }
    if (data.pointsFood) {
      data.pointsFood.forEach((pointsFood, i) => {
        if (i !== 0) pointsFoodText += "\n";
        pointsFoodText += `{ x: ${pointsFood.x}, y: ${pointsFood.y} },`;
      });
    }
    if (data.ladders) {
      data.ladders.forEach((ladder, i) => {
        if (i !== 0) laddersText += "\n";
        laddersText += `{ x: ${ladder.x}, y: ${ladder.y}, h: ${ladder.h} },`;
      });
    }
    if (data.walls) {
      data.walls.forEach((wall, i) => {
        if (i !== 0) wallsText += "\n";
        wallsText += `{ x: ${wall.x}, y: ${wall.y}, w: ${wall.w}, h: ${wall.h} },`;
      });
    }
    if (data.spikes) {
      data.spikes.forEach((spike, i) => {
        if (i !== 0) spikesText += "\n";
        spikesText += `{ x: ${spike.x}, y: ${spike.y} },`;
      });
    }

    console.log(`
        timeAllowed: 100000,
        player: ${playerText},
        levelCompletePortal: ${levelCompletePortalText},
        enemyPortals: [
            ${enemyPortalsText}
        ],
        food: [
            ${foodText}
        ],
        pointsFood: [
            ${pointsFoodText}
        ],
        ladders: [
            ${laddersText}
        ],
        walls: [
            ${wallsText}
        ],
        spikes: [
            ${spikesText}
        ],

    `);
  },

  /************** LOCAL STORAGE INTERACTIONS ***************/
  saveLevel: function (e, data) {
    const level = document.getElementById("level").value;
    this.saveDataForKey(level, data);
    this.saveDataForKey("lastData", data);
  },

  loadLevelFromStorage: function (e, data) {
    // save current work
    this.saveDataForKey("lastData", data);

    const level = document.getElementById("level").value;
    return this.loadDataForKey(level, data);
  },

  loadLevelFromData: function (e, data) {
    // save current work
    this.saveDataForKey("lastData", data);

    const level = document.getElementById("level").value;
    const loadedData = levelData[level];
    this.buildEntitiesFromData(data, loadedData);
  },

  buildEntitiesFromData: function (data, entityData) {
    console.log(
      "buid entities from data\ndata: ",
      data,
      "\nentityData: ",
      entityData
    );
    data.player = null;
    data.levelCompletePortal = null;
    data.enemyPortals = [];
    data.enemies = [];
    data.food = [];
    data.pointsFood = [];
    data.spikes = [];
    data.ladders = [];
    data.walls = [];
    if (entityData.player) {
      data.player = new Player(entityData.player.x, entityData.player.y);
    }
    if (entityData.levelCompletePortal) {
      data.levelCompletePortal = new LevelCompletePortal(
        entityData.levelCompletePortal.x,
        entityData.levelCompletePortal.y
      );
    }
    if (entityData.enemyPortals) {
      entityData.enemyPortals.forEach((p) =>
        data.enemyPortals.push(new EnemyPortal(p.x, p.y, p.spawnMovingLeft))
      );
    }
    if (entityData.food) {
      entityData.food.forEach((f) => data.food.push(new Food(f.x, f.y)));
    }
    if (entityData.pointsFood) {
      entityData.pointsFood.forEach((pf) =>
        data.pointsFood.push(new PointsFood(pf.x, pf.y))
      );
    }
    if (entityData.spikes) {
      entityData.spikes.forEach((s) => data.spikes.push(new Spike(s.x, s.y)));
    }
    if (entityData.ladders) {
      entityData.ladders.forEach((l) =>
        data.ladders.push(new Ladder(l.x, l.y, l.h))
      );
    }
    if (entityData.walls) {
      entityData.walls.forEach((w) =>
        data.walls.push(new Wall(w.x, w.y, w.w, w.h))
      );
    }
  },

  restoreLastSave: function (e, data) {
    return this.loadDataForKey("lastData", data);
  },

  loadDataForKey: function (key, data) {
    const loadedData = localStorage.getItem(key);
    if (!loadedData) {
      alert("no data to load");
      return;
    }

    const parsedData = JSON.parse(loadedData);
    console.log("loaded data for key : ", key);

    // update data object
    this.buildEntitiesFromData(data, parsedData);
  },

  saveDataForKey: function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log("saved data for key: ", key);
  },

  playThisData: function (e, data) {
    this.logEntities(null, data)
    if (
      !data.player ||
      !data.levelCompletePortal ||
      !data.enemyPortals ||
      !data.food ||
      !data.pointsFood ||
      !data.walls ||
      !data.ladders
    ) {
      alert("insufficient data to play");
      return;
    }

    game.init(data);
  },
};
