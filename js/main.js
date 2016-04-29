createjs.Sound.on("fileload", handleLoadComplete);
createjs.Sound.alternateExtensions = ["mp3"];
var sounds = [
  {id: "ding", path: "assets/ding.ogg"},
  {id: "noo", path: "assets/nooo.ogg"}
];
var loadedSounds = 0;
for(sound in sounds){
  createjs.Sound.registerSound({src:sounds[sound].path, id:sounds[sound].id});
}
function handleLoadComplete(event) {
  loadedSounds += 1;
  if(loadedSounds == sounds.length){
    var stage = new Stage(document.querySelector("#mainContainer"));
    var game = new Game(stage);
    game.start();
  }
}
