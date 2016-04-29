var Game = function(stage){
  // All game properties
  // Stage is from stage class. see at stage.js
  var plainText = [
    "Kata kata mutiara dirangkai sedemikian rupa hingga tercipta sebuah kalimat yang memiliki makna tersembunyi dan tidak semua orang dapat mengartikannya. Keindahan rangkainan kata-katanya juga dapat menyejukkan hati siapa saja yang membacanya. Selain itu kata mutiara yang baik juga dapat memotivasi baik yang membuat maupun siapa saja yang membaca atau mendengarnya. Kata kata mutiara dikelompokkan menjadi beberapa bagian atau kategori, bebrapa diantaranya adalah kata mutiara cinta, persahabatan, kerja, islami, kehidupan, galau bahkan lucu. Bukan hanya itu saja, ada beberapa bahasa yang sering digunakan dalam kata mutiara seperti bahasa Indonesia, Ingris, Jawa, Sunda, dan bahasa daerah lainnya.",
    "Kata kata mutiara dapat kita diucapkan kepada siapa saja baik itu orang tua, sahabat, kekasih, bahkan di media sosial sekalipun. Di sosial media seperti facebook dan twitter, sering kita temui beberapa orang teman kita membuat postingan tentang kata bijak yang di dalamnya tentu saja mengandung makna mendalam. update status kata bijak mutiara seringkali dilakukan seseorang sesuai dengan kondisinya. Kata yang baik tentu saja akan membuat hati menjadi tenang dan dapat dijadikan sebagai motivasi untuk ke depannya nanti supaya lebih baik lagi.",
    "Pasti walaupun cuma sepentas Anda pernahh menonton salah satu program di televisi swasata Indonesia yang berjudul Golden Ways. Sosok yang menjadi pengisi acara tersebut tak lain dan tak bukan salah satu motivator terbaik Indonesia yaitu bapak Mario Teguh. Gaya bahasa yang khas dan juga kata motivasi yang super membuat banyak orang meniru kata bijak Mario Teguh. Acara lain yang berisi kata mutiara adalah Hitam Putih, di akhir acara talkshow yang sangat inspiratif ini biasanay dihadirkan kata kata mutiara yang sangat bagus sesuai dengan tema yang sedang diangkat saat itu."
  ].join(" ").toLowerCase().replace(/[^\sa-z]/ig,"")
  var texts = Array.from(new Set(plainText.split(" ")));
  this.stage = stage;
  this.backgrounds = [];
  this.usedTexts = [];
  this.threadId = 0;
  this.typedWords = 0;
  this.missedWords = 0;
  this.startTime = new Date();
  this.endTime = new Date();
  this.isPlayed = true;

  this.updateBar = function(){
    this.endTime = new Date();
    this.stage.updateScore(this.typedWords * SCORE_PER_WORD);
    this.stage.updateMissed(MAX_MISSED_WORDS-this.missedWords);
    var gap = Math.floor((this.endTime.getTime() - this.startTime.getTime())/1000);
    var minutes = 0, seconds = gap;
    if((minutes = Math.floor(gap/60)) > 0){
      seconds = gap%60;
    }
    if(seconds < 10){
      seconds = "0"+seconds;
    }
    if(minutes < 10){
      minutes = "0"+minutes;
    }
    this.stage.updateTime(minutes+":"+seconds);
    this.stage.refresh();
    if(MAX_MISSED_WORDS - this.missedWords <= 0){
      IS_PLAY = false;
      createjs.Sound.play("noo");
      // console.log(threadId);
      cancelAnimationFrame(this.threadId);
      return;
    }
  };
  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };
  function getRandomWord(){
    var randomKey = getRandomArbitrary(1,texts.length)-1;
    return texts[randomKey].toLowerCase().replace(/[^a-z]/ig, "");
  };

  this.getHeight = function(){
    var height = getRandomArbitrary(this.stage.renderer.view.height, this.stage.renderer.view.height+MAX_TEXT_APPEAR_POSITION);
    for(var key in this.backgrounds){
      if(height < this.backgrounds[key].y || height > this.backgrounds[key].height + this.backgrounds[key].y){
        continue;
      }
      else {
        height += CONTAINER_TOLERANCE;
      }
    }
    return height;
  }


  this.markBackground = function(key){
    background = this.backgrounds[key];
    word = this.usedTexts[key];
    var width = background.width;
    var height = background.height;
    for(child in background.children){
      background.removeChild(background.children[child]);
    }
    background.clear();
    var rightWord = word.text.replace(word.mark, "");
    var leftText = new PIXI.Text(word.mark, {font:  FONT_BOLD+" "+FONT_SIZE+" "+FONT_FAMILY, align: TEXT_ALIGN,tint: TEXT_MARKED_COLOR});
    var rightText = new PIXI.Text(rightWord, {font:  FONT_SIZE+" "+FONT_FAMILY, align: TEXT_ALIGN,tint: TEXT_COLOR});
    rightText.x = leftText.width;
    background.addChild(leftText);
    background.addChild(rightText);
    background.beginFill(BACKGROUND_MARK_COLOR);
    var margin = PADDING_TEXT;
    background.drawRoundedRect(-(margin/2),-(margin/2),leftText.width+rightText.width+margin,leftText.height + margin,5);
    // background.bringToFront();
    this.stage.wordStage.removeChild(background);
    this.stage.wordStage.addChild(background);
    this.stage.refresh();
  }

  this.animate = function() {
    this.threadId = requestAnimationFrame(this.animate.bind(this));
    for(key in this.backgrounds){
      if(this.backgrounds[key].y <= MAX_TEXT_DISAPPEAR_POSITION){
        this.missedWords += 1;
        this.removeWord(key, false);
        this.randomWord();
      }
      this.backgrounds[key].y -= SPEED_TEXT;
    }
    this.updateBar();
    this.stage.refresh();
  };

  this.removeWord = function(key, animated){
    this.stage.wordStage.removeChild(this.backgrounds[key]);
    this.backgrounds.splice(key, 1);
    this.usedTexts.splice(key, 1);
  };

  this.start = function(){
    for(var i=0;i<MAX_WORDS;i++){
      this.randomWord();
    }
    this.animate();
    document.addEventListener('keydown', this.keydownHandler.bind(this));
  };

  this.keydownHandler = function(event){
    var prevents = [8];
    if(prevents.indexOf(event.keyCode) >= 0){
      event.preventDefault();
    }
    var keyString = String.fromCharCode(event.keyCode).toLowerCase();
    var word;
    var selectedKey;
    // console.log(usedTexts);
    for(key in this.usedTexts){
      if(this.usedTexts[key].isMarked){
        word = this.usedTexts[key];
        selectedKey = key;
        if(word.text.charAt(word.mark.length) == keyString){
          word.mark += keyString;
        }
        else {
          break;
        }
        this.markBackground(key);
        if(word.mark.length == word.text.length && word.mark == word.text){
            this.removeWord(key, true);
            this.randomWord();
            createjs.Sound.play("ding");
            this.typedWords += 1;
        }
        break;
      }
    }
    if(word == undefined){
      var possibleWords = []
      for(key in this.usedTexts){
        if(this.usedTexts[key].text[0] == keyString){
          possibleWords.push({
            key: key,
            background: this.backgrounds[key]
          });
        }
      }
      possibleWords.sort(function(a, b){
        return a.background.y - b.background.y;
      });
      if(possibleWords.length == 0){
        return;
      }
      word = this.usedTexts[possibleWords[0].key];
      word.isMarked = true;
      word.mark += keyString;

      this.markBackground(possibleWords[0].key);
    }
    if(word == undefined){
      return;
    }
  };

  this.randomWord = function(){
    var word = getRandomWord();
    var text = new PIXI.Text(word, {font: FONT_SIZE+" "+FONT_FAMILY, align: TEXT_ALIGN,tint: TEXT_COLOR});
    // load the texture we need
    var background = new PIXI.Graphics();
    background.beginFill(BACKGROUND_COLOR);
    var margin = PADDING_TEXT;
    background.drawRoundedRect(-(margin/2),-(margin/2),text.width + margin,text.height + margin,5);
    background.endFill();
    background.x = getRandomArbitrary(PADDING_APPERANCE_TEXT, (this.stage.renderer.view.width - background.width) - PADDING_APPERANCE_TEXT);
    background.y = this.getHeight();
    background.addChild(text);
    this.backgrounds.push(background);
    this.usedTexts.push({
      text: word,
      isMarked: false,
      mark: ""
    });
    // toggles.push(1);
    this.stage.wordStage.addChild(background);
  };
};
