# Overview
- This is a reproduction of an old game called Ladder that I used to play on the K-Pro 2
- https://www.youtube.com/watch?v=9_-LG0KAhZY

## TODO
### Map
- add a one directional wall where you can fall through but not jump up it
    - enemies can choose to fall through or traverse these
    - update the maps to include these where they should be
### Bugs
- Walls 60 vertical pixels apart you can stick to the bottom of the wall with a double jump???
### Game Over / High Scores
- users should be able to enter their name if they score a high score, plus see the high scores, etc

## DB
- to connectt to db in cli, I'm using pgcli `pgcli -h host -U user -W 'password' -d database`