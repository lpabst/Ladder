function getHighScores(callback) {
  makeAjaxCall("GET", "/scores", null, function (res) {
    if (!res || !res.data) {
      return;
    }

    if (res.data.highScores) {
      // create new infinite high scores table body and replace the old one
      var newInfiniteScoresTbody = document.createElement("tbody");
      newInfiniteScoresTbody.id = "highScoresTableBody";
      res.data.highScores.forEach(function (row) {
        var tr = newInfiniteScoresTbody.insertRow(-1);
        var cell1 = tr.insertCell(0);
        var cell1Text = document.createTextNode(row.name || "Anonymous");
        cell1.appendChild(cell1Text);
        var cell2 = tr.insertCell(1);
        var cell2Text = document.createTextNode(row.score);
        cell2.appendChild(cell2Text);
      });
      var highScoresTableBody = document.getElementById("highScoresTableBody");
      highScoresTableBody.parentNode.replaceChild(
        newInfiniteScoresTbody,
        highScoresTableBody
      );
    }

    if (res.data.challengeHighScores) {
      // create new challenge high scores table body and replace the old one
      var newChallengeScoresTbody = document.createElement("tbody");
      newChallengeScoresTbody.id = "challengeHighScoresTableBody";
      res.data.challengeHighScores.forEach(function (row) {
        var tr = newChallengeScoresTbody.insertRow(-1);
        var cell1 = tr.insertCell(0);
        var cell1Text = document.createTextNode(row.name || "Anonymous");
        cell1.appendChild(cell1Text);
        var cell2 = tr.insertCell(1);
        var cell2Text = document.createTextNode(row.score);
        cell2.appendChild(cell2Text);
        var cell3 = tr.insertCell(1);
        var cell3Text = document.createTextNode(row.difficulty);
        cell3.appendChild(cell3Text);
      });
      var challengeHighScoresTableBody = document.getElementById(
        "challengeHighScoresTableBody"
      );
      challengeHighScoresTableBody.parentNode.replaceChild(
        newChallengeScoresTbody,
        challengeHighScoresTableBody
      );
    }

    if (callback) {
      callback();
    }
  });
}
getHighScores();
