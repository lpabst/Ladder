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

## DB/Hosted App
- to connect to the db in cli, I'm using pgcli `pgcli -h host -U user -W 'password' -d database`
- `git push heroku master` will deploy my changes to my hosted heroku app
- see server logs by navigating to this directory, then run `herokuk logs --tail` 