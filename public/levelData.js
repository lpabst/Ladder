var easyStreet = {
  timeAllowed: 100000,
  player: { x: 68, y: 660 },
  levelCompletePortal: { x: 636, y: 101 },
  enemyPortals: [
    { x: 397, y: 47, spawnMovingLeft: true, spawnFrame: 20, spawnChance: 0.2 },
  ],
  food: [],
  pointsFood: [{ x: 109, y: 387 }],
  ladders: [
    { x: 630, y: 121, h: 53 },
    { x: 106, y: 139, h: 241 },
    { x: 649, y: 343, h: 147 },
    { x: 289, y: 334, h: 92 },
    { x: 129, y: 467, h: 148 },
    { x: 288, y: 490, h: 29 },
    { x: 666, y: 595, h: 133 },
  ],
  walls: [
    { x: 51, y: 195, w: 54, h: 4 },
    { x: 123, y: 195, w: 579, h: 4 },
    { x: 19, y: 370, w: 86, h: 4 },
    { x: 123, y: 370, w: 166, h: 4 },
    { x: 306, y: 370, w: 237, h: 4 },
    { x: 587, y: 370, w: 61, h: 4 },
    { x: 665, y: 370, w: 122, h: 4 },
    { x: 70, y: 500, w: 59, h: 4 },
    { x: 146, y: 500, w: 141, h: 4 },
    { x: 305, y: 500, w: 118, h: 4 },
    { x: 472, y: 500, w: 212, h: 4 },
    { x: 13, y: 620, w: 210, h: 4 },
    { x: 248, y: 620, w: 272, h: 4 },
    { x: 556, y: 620, w: 110, h: 4 },
    { x: 683, y: 620, w: 75, h: 4 },
    { x: 5, y: 726, w: 794, h: 4 },
    { x: 11, y: 100, w: 4, h: 625 },
    { x: 786, y: 100, w: 4, h: 625 },
    { x: 71, y: 686, w: 4, h: 40 },
  ],
  spikes: [],
  enemySpikes: [
    { x: 81, y: 718 },
    { x: 775, y: 718 },
  ],
};

var longIsland = {
  timeAllowed: 100000,
  player: { x: 48, y: 692 },
  levelCompletePortal: { x: 744, y: 211 },
  enemyPortals: [
    { x: 676, y: 264, spawnMovingLeft: true },
    { x: 157, y: 264, spawnMovingLeft: false },
  ],
  food: [],
  pointsFood: [
    { x: 290, y: 377 },
    { x: 676, y: 245 },
  ],
  ladders: [
    { x: 66, y: 476, h: 142 },
    { x: 727, y: 592, h: 152 },
    { x: 719, y: 355, h: 164 },
    { x: 50, y: 255, h: 139 },
    { x: 740, y: 236, h: 46 },
  ],
  walls: [
    { x: 9, y: 285, w: 40, h: 4 },
    { x: 67, y: 285, w: 285, h: 4 },
    { x: 376, y: 285, w: 225, h: 4 },
    { x: 630, y: 285, w: 133, h: 4 },
    { x: 5, y: 400, w: 293, h: 4 },
    { x: 342, y: 400, w: 53, h: 4 },
    { x: 427, y: 400, w: 169, h: 4 },
    { x: 630, y: 400, w: 88, h: 4 },
    { x: 736, y: 400, w: 32, h: 4 },
    { x: 5, y: 515, w: 60, h: 4 },
    { x: 83, y: 515, w: 231, h: 4 },
    { x: 366, y: 515, w: 40, h: 4 },
    { x: 456, y: 515, w: 139, h: 4 },
    { x: 630, y: 515, w: 148, h: 4 },
    { x: 5, y: 630, w: 294, h: 4 },
    { x: 343, y: 630, w: 65, h: 4 },
    { x: 459, y: 630, w: 134, h: 4 },
    { x: 630, y: 630, w: 96, h: 4 },
    { x: 744, y: 630, w: 31, h: 4 },
    { x: 5, y: 715, w: 77, h: 4 },
    { x: 3, y: 749, w: 795, h: 4 },
    { x: 3, y: 5, w: 4, h: 748 },
    { x: 798, y: 5, w: 4, h: 744 },
    { x: 78, y: 716, w: 4, h: 34 },
    { x: 345, y: 367, w: 4, h: 33 },
    { x: 347, y: 586, w: 4, h: 45 },
    { x: 404, y: 464, w: 4, h: 55 },
    { x: 695, y: 260, w: 4, h: 29 },
    { x: 427, y: 686, w: 4, h: 60 },
  ],
  spikes: [],
  enemySpikes: [
    { x: 350, y: 740 },
    { x: 612, y: 740 },
  ],
};

var ghostTown = {
  timeAllowed: 100000,
  player: { x: 57, y: 171 },
  levelCompletePortal: { x: 745, y: 167 },
  enemyPortals: [
    { x: 327, y: 50, spawnMovingLeft: false },
    { x: 481, y: 50, spawnMovingLeft: true },
    { x: 597, y: 50, spawnMovingLeft: true },
  ],
  food: [{ x: 164, y: 493 }],
  pointsFood: [{ x: 573, y: 444 }],
  ladders: [
    { x: 714, y: 553, h: 165 },
    { x: 490, y: 567, h: 62 },
    { x: 312, y: 444, h: 162 },
    { x: 130, y: 160, h: 140 },
    { x: 660, y: 173, h: 153 },
  ],
  walls: [
    { x: 17, y: 195, w: 112, h: 4 },
    { x: 147, y: 195, w: 58, h: 4 },
    { x: 631, y: 195, w: 28, h: 4 },
    { x: 677, y: 195, w: 114, h: 4 },
    { x: 75, y: 320, w: 133, h: 4 },
    { x: 260, y: 320, w: 40, h: 4 },
    { x: 365, y: 320, w: 8, h: 4 },
    { x: 413, y: 320, w: 50, h: 4 },
    { x: 513, y: 320, w: 8, h: 4 },
    { x: 560, y: 320, w: 16, h: 4 },
    { x: 624, y: 320, w: 35, h: 4 },
    { x: 677, y: 320, w: 51, h: 4 },
    { x: 131, y: 460, w: 180, h: 4 },
    { x: 329, y: 460, w: 257, h: 4 },
    { x: 620, y: 460, w: 129, h: 4 },
    { x: 200, y: 590, w: 111, h: 4 },
    { x: 329, y: 590, w: 160, h: 4 },
    { x: 507, y: 590, w: 206, h: 4 },
    { x: 731, y: 590, w: 36, h: 4 },
    { x: 2, y: 718, w: 796, h: 4 },
    { x: 789, y: 60, w: 4, h: 660 },
    { x: 2, y: 60, w: 4, h: 660 },
    { x: 744, y: 400, w: 4, h: 62 },
    { x: 131, y: 428, w: 4, h: 33 },
    { x: 209, y: 562, w: 4, h: 26 },
  ],
  spikes: [
    { x: 215, y: 345 },
    { x: 225, y: 345 },
    { x: 235, y: 345 },
    { x: 305, y: 345 },
    { x: 313, y: 345 },
    { x: 321, y: 345 },
    { x: 329, y: 345 },
    { x: 337, y: 345 },
    { x: 345, y: 345 },
    { x: 379, y: 345 },
    { x: 387, y: 345 },
    { x: 395, y: 345 },
    { x: 403, y: 345 },
    { x: 471, y: 345 },
    { x: 478, y: 345 },
    { x: 504, y: 345 },
    { x: 526, y: 345 },
    { x: 538, y: 345 },
    { x: 550, y: 345 },
    { x: 581, y: 345 },
    { x: 591, y: 345 },
    { x: 601, y: 345 },
    { x: 319, y: 675 },
    { x: 306, y: 695 },
    { x: 318, y: 695 },
    { x: 331, y: 695 },
  ],
  enemySpikes: [
    { x: 15, y: 710 },
    { x: 781, y: 710 },
  ],
};

var tunnelVision = {
  timeAllowed: 100000,
  player: { x: 767, y: 648 },
  levelCompletePortal: { x: 52, y: 698 },
  enemyPortals: [
    { x: 680, y: 113, spawnMovingLeft: true },
    { x: 421, y: 120, spawnMovingLeft: true },
  ],
  food: [{ x: 395, y: 247 }],
  pointsFood: [
    { x: 413, y: 247 },
    { x: 549, y: 532 },
  ],
  ladders: [
    { x: 723, y: 635, h: 85 },
    { x: 727, y: 349, h: 91 },
    { x: 600, y: 184, h: 534 },
    { x: 43, y: 163, h: 435 },
    { x: 246, y: 176, h: 160 },
    { x: 469, y: 303, h: 154 },
    { x: 175, y: 450, h: 168 },
  ],
  walls: [
    { x: 5, y: 212, w: 37, h: 4 },
    { x: 60, y: 212, w: 56, h: 4 },
    { x: 153, y: 212, w: 92, h: 4 },
    { x: 263, y: 212, w: 191, h: 4 },
    { x: 483, y: 212, w: 33, h: 4 },
    { x: 541, y: 212, w: 58, h: 4 },
    { x: 617, y: 212, w: 90, h: 4 },
    { x: 375, y: 267, w: 127, h: 4 },
    { x: 207, y: 350, w: 73, h: 4 },
    { x: 307, y: 350, w: 25, h: 4 },
    { x: 353, y: 350, w: 115, h: 4 },
    { x: 485, y: 350, w: 12, h: 4 },
    { x: 165, y: 425, w: 93, h: 4 },
    { x: 386, y: 425, w: 82, h: 4 },
    { x: 192, y: 490, w: 104, h: 4 },
    { x: 339, y: 490, w: 23, h: 4 },
    { x: 400, y: 490, w: 114, h: 4 },
    { x: 669, y: 490, w: 126, h: 4 },
    { x: 5, y: 598, w: 37, h: 4 },
    { x: 60, y: 598, w: 54, h: 4 },
    { x: 162, y: 626, w: 136, h: 4 },
    { x: 339, y: 626, w: 23, h: 4 },
    { x: 400, y: 626, w: 154, h: 4 },
    { x: 37, y: 660, w: 34, h: 4 },
    { x: 669, y: 675, w: 53, h: 4 },
    { x: 740, y: 675, w: 53, h: 4 },
    { x: 5, y: 726, w: 794, h: 4 },
    { x: 2, y: 30, w: 4, h: 698 },
    { x: 794, y: 30, w: 4, h: 698 },
    { x: 450, y: 177, w: 4, h: 35 },
    { x: 375, y: 226, w: 4, h: 41 },
    { x: 165, y: 392, w: 4, h: 35 },
    { x: 510, y: 455, w: 4, h: 35 },
    { x: 550, y: 558, w: 4, h: 68 },
    { x: 110, y: 599, w: 4, h: 127 },
  ],
  spikes: [],
  enemySpikes: [
    { x: 150, y: 715 },
    { x: 318, y: 715 },
    { x: 383, y: 715 },
    { x: 589, y: 715 },
    { x: 715, y: 715 },
  ],
};

var riskAndReward = {
  timeAllowed: 100000,
  player: { x: 425, y: 697 },
  levelCompletePortal: { x: 85, y: 265 },
  enemyPortals: [
    { x: 622, y: 85, spawnMovingLeft: true },
    { x: 632, y: 85, spawnMovingLeft: true },
    { x: 673, y: 85, spawnMovingLeft: true },
    { x: 719, y: 85, spawnMovingLeft: true },
  ],
  food: [
    { x: 780, y: 190 },
    { x: 15, y: 577 },
  ],
  pointsFood: [
    { x: 780, y: 305 },
    { x: 780, y: 420 },
    { x: 780, y: 535 },
    { x: 780, y: 650 },
  ],
  ladders: [{ x: 448, y: 275, h: 161 }],
  walls: [
    // right side of map
    { x: 457, y: 50, w: 165, h: 4 },
    { x: 750, y: 210, w: 48, h: 4 },
    { x: 750, y: 325, w: 48, h: 4 },
    { x: 750, y: 440, w: 48, h: 4 },
    { x: 750, y: 555, w: 48, h: 4 },
    { x: 750, y: 670, w: 48, h: 4 },
    { x: 2, y: 726, w: 796, h: 4 },
    { x: 2, y: 30, w: 4, h: 698 },
    { x: 794, y: 30, w: 4, h: 698 },
    { x: 558, y: 52, w: 4, h: 613 },
    { x: 650, y: 75, w: 4, h: 52 },
    { x: 604, y: 130, w: 4, h: 52 },
    { x: 650, y: 190, w: 4, h: 52 },
    { x: 604, y: 245, w: 4, h: 52 },
    { x: 650, y: 305, w: 4, h: 52 },
    { x: 604, y: 360, w: 4, h: 52 },
    { x: 650, y: 420, w: 4, h: 52 },
    { x: 604, y: 475, w: 4, h: 52 },
    { x: 650, y: 535, w: 4, h: 52 },
    { x: 604, y: 590, w: 4, h: 52 },
    { x: 650, y: 650, w: 4, h: 52 },
    // left side of map
    { x: 402, y: 111, w: 126, h: 4 },
    { x: 77, y: 290, w: 222, h: 4 },
    { x: 464, y: 290, w: 63, h: 4 },
    { x: 344, y: 435, w: 136, h: 4 },
    { x: 81, y: 530, w: 154, h: 4 },
    { x: 385, y: 570, w: 172, h: 4 },
    { x: 125, y: 590, w: 57, h: 4 },
    { x: 215, y: 590, w: 76, h: 4 },
    { x: 76, y: 660, w: 279, h: 4 },
    { x: 401, y: 2, w: 4, h: 111 },
    { x: 526, y: 112, w: 4, h: 346 },
    { x: 409, y: 252, w: 4, h: 33 },
    { x: 285, y: 484, w: 4, h: 108 },
  ],
  spikes: [
    { x: 308, y: 295 },
    { x: 318, y: 295 },
    { x: 328, y: 295 },
    { x: 338, y: 295 },
    { x: 348, y: 295 },
    { x: 358, y: 295 },
    { x: 368, y: 295 },
    { x: 378, y: 295 },
    { x: 388, y: 295 },
    { x: 398, y: 295 },
    { x: 410, y: 295 },
    { x: 420, y: 295 },
    { x: 430, y: 295 },
    { x: 360, y: 576 },
    { x: 370, y: 576 },
    { x: 380, y: 576 },
    { x: 183, y: 595 },
    { x: 193, y: 595 },
    { x: 203, y: 595 },
    { x: 14, y: 604 },
    { x: 24, y: 604 },
    { x: 34, y: 604 },
    { x: 44, y: 604 },
    { x: 54, y: 604 },
    { x: 64, y: 604 },
  ],
  enemySpikes: [
    { x: 624, y: 696 },
    { x: 634, y: 696 },
    { x: 675, y: 696 },
    { x: 721, y: 696 },
  ],
};

var easyStreet2 = Object.assign({}, easyStreet, {
  enemyPortals: [{ x: 397, y: 47, spawnMovingLeft: true, spawnChance: 0.28 }],
});

var longIsland2 = Object.assign({}, longIsland, {
  enemyPortals: [
    { x: 676, y: 264, spawnMovingLeft: true, spawnChance: 0.28 },
    { x: 157, y: 264, spawnMovingLeft: false, spawnChance: 0.28 },
  ],
});

var ghostTown2 = Object.assign({}, ghostTown, {
  enemyPortals: [
    { x: 327, y: 50, spawnMovingLeft: false, spawnFrame: 17 },
    { x: 481, y: 50, spawnMovingLeft: true, spawnFrame: 17 },
    { x: 597, y: 50, spawnMovingLeft: true, spawnFrame: 15 },
  ],
});

var easyStreet3 = Object.assign({}, easyStreet, {
  enemyPortals: [
    { x: 370, y: 47, spawnMovingLeft: true, spawnChance: 0.28 },
    { x: 420, y: 47, spawnMovingLeft: false, spawnChance: 0.28 },
  ],
});

var levelData = {
  1: easyStreet,
  2: longIsland,
  3: easyStreet2,
  4: longIsland,
  5: ghostTown,
  6: easyStreet3,
  7: ghostTown2,
  8: tunnelVision,
  9: longIsland2,
  10: riskAndReward,
};
