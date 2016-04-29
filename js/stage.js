var Stage = function(element){
  this.element = element;
  this.renderer = new PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.stage = new PIXI.Container();
  this.wordStage = new PIXI.Graphics();
  this.barStage = new PIXI.Graphics();
  this.scoreStage = new PIXI.Graphics();
  this.missedStage = new PIXI.Graphics();
  this.timeStage = new PIXI.Graphics();
  this.scoreText = new PIXI.Text("", {font: "italic 15px Arial"});
  this.missedText = new PIXI.Text("", {font: "italic 15px Arial"});
  this.timeText = new PIXI.Text("", {font: "italic 15px Arial"});
  this.center = function(parent, child){
    return (parent.width - child.width) / 2;
  };
  this.setupStage = function(){
    this.wordStage.beginFill(STAGE_COLOR);
    this.wordStage.drawRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT-SCORE_BAR_HEIGHT);
    this.wordStage.y = SCORE_BAR_HEIGHT;
    this.wordStage.endFill();
    this.barStage.beginFill(BAR_COLOR);
    this.barStage.drawRect(0,0,CANVAS_WIDTH, SCORE_BAR_HEIGHT);
    this.barStage.lineStyle(2,0x000000,1);
    this.barStage.endFill();
    var stages = [this.scoreStage, this.missedStage, this.timeStage];

    var scoreLabel = new PIXI.Text("SCORE", {font: "italic bold 15px Arial"});
    this.scoreText.y = scoreLabel.height + 20;
    this.scoreStage.beginFill(0xFFFC5C);
    this.scoreStage.drawRect(0,0,this.barStage.width/stages.length,this.barStage.height);
    this.scoreStage.addChild(scoreLabel);
    this.scoreStage.addChild(this.scoreText);
    scoreLabel.x = this.center(this.scoreStage, scoreLabel);
    this.scoreText.x = this.center(this.scoreStage, this.scoreText);
    var missedLabel = new PIXI.Text("LIVES LEFT", {font: "italic bold 15px Arial"});
    this.missedText.y = missedLabel.height + 20;

    var timeLabel = new PIXI.Text("TIME SPENT", {font: "italic bold 15px Arial"});
    this.timeText.y = timeLabel.height + 20;

    this.scoreStage.endFill();
    this.missedStage.beginFill(0xB2373B);
    this.missedStage.drawRect(0,0,this.barStage.width/stages.length,this.barStage.height);
    this.missedStage.x = this.scoreStage.width;
    this.missedStage.addChild(missedLabel);
    this.missedStage.addChild(this.missedText);
    this.missedStage.endFill();
    missedLabel.x = this.center(this.scoreStage, missedLabel);;
    this.missedText.x = this.center(this.scoreStage, this.missedText);;
    this.timeStage.x = this.missedStage.x + this.missedStage.width;
    this.timeStage.beginFill(0x75CCFF);
    this.timeStage.drawRect(0,0,this.barStage.width/stages.length,this.barStage.height);
    this.timeText.x = this.center(this.scoreStage, this.timeText);
    timeLabel.x = this.center(this.scoreStage, timeLabel);
    this.timeStage.addChild(timeLabel);
    this.timeStage.addChild(this.timeText);
    for(key in stages){
      this.barStage.addChild(stages[key])
    }

    this.stage.addChild(this.wordStage);
    this.stage.addChild(this.barStage);
  };
  this.updateScore = function(text){
    this.scoreText.text = text;
  };
  this.updateMissed = function(text){
    this.missedText.text = text;
  };
  this.updateTime = function(text){
    this.timeText.text = text;
  };
  this.refresh = function(){
    this.renderer.render(this.stage);
  };

  this.setupStage();
  element.appendChild(this.renderer.view);
};
