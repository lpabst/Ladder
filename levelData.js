var levelData = {
  1: {
    // time allowed in milliseconds
    timeAllowed: 100000,
    player: { x: 380, y: 480 },
    levelCompletePortal: { x: 600, y: 580 },
    enemyPortals: [
      { x: 600, y: 300, spawnMovingLeft: true },
      { x: 200, y: 300, spawnMovingLeft: false },
    ],
    food: [{ x: 400, y: 560 }],
    pointsFood: [{ x: 500, y: 660 }],
    ladders: [{ x: 400, y: 450, h: 80 }],
    walls: [
      { x: 520, y: 660, w: 30, h: 4 },
      { x: 480, y: 320, w: 300, h: 4 },
      { x: 350, y: 600, w: 400, h: 4 },
      { x: 200, y: 680, w: 400, h: 4 },
      { x: 100, y: 750, w: 400, h: 4 },
      { x: 580, y: 720, w: 4, h: 30 },
      { x: 580, y: 570, w: 4, h: 30 },
      { x: 380, y: 650, w: 4, h: 30 },
      { x: 480, y: 650, w: 4, h: 30 },
      { x: 380, y: 550, w: 4, h: 30 },
    ],
    spikes: [{ x: 650, y: 580 }],
  },
  2: {
    timeAllowed: 100000,
    player: { x: 380, y: 480 },
    levelCompletePortal: { x: 600, y: 600 },
    enemyPortals: [{ x: 600, y: 300, spawnMovingLeft: true }],
    food: [{ x: 200, y: 200 }],
    pointsFood: [{ x: 500, y: 700 }],
    ladders: [{ x: 200, y: 430, h: 80 }],
    walls: [
      { x: 480, y: 320, w: 300, h: 4 },
      { x: 580, y: 720, w: 4, h: 30 },
    ],
    spikes: [{ x: 500, y: 500 }],
  },
};
