var target, targetImg, bonusTargetImg, targets, bTargets;
var bow, bowImg, arrow, arrowImg, arrows;
var rand;
var score, timer;
var gameState;
function preload(){
  targetImg = loadImage("target.png");
  bonusTargetImg = loadAnimation("bonusTarget0.png", "bonusTarget1.png", "bonusTarget2.png");
  bowImg = loadImage("bow0.png");
  arrowImg = loadImage("arrow0.png");
}

function setup() {
  createCanvas(400, 500);
  
  //create target groups
  targets = createGroup();
  bTargets = createGroup();

  //create arrow groups
  arrows = createGroup();

  //create bow
  bow = createSprite(200, 350, 50, 30);
  bow.addImage("image", bowImg);
  bow.rotation = 90;

  //create score
  score = 0;

  //create gameState
  gameState = "start";

  //create Timer
  timer = 60;
}

function draw() {
  background(0, 255, 0);

  if(gameState=="start"){
    textSize(20);
    fill("blue");
    text("Welcome to the archery game!", 75, 200);
    textSize(15);
    text("Use your mouse to move the bow and space to shoot. Shoot as many targets as you can before the timer runs out! The moving, flashy targets give you bonus points. Press space to start.", 75, 230, 300, 120);

    if(keyDown("space")){
      gameState="play";
    }
  }

  if(gameState=="play"){
    //Initialize timer
    if(frameCount%30==0){
      timer -= 1;
    }

    if(timer == 0){
      gameState = "end";
    }

    //create Edge sprites
    edges = createEdgeSprites();

    //move bow
    bow.x = mouseX;

    //shoot arrow
    if(keyWentDown("space")){
      spawnArrow();
    }

    // check if arrow hits
    for (var i = 0; i < targets.length; i++){

      if(targets[i].isTouching(arrows)){
        targets[i].lifetime = 0;
        score ++;
      }
    }

    for (var i = 0; i < bTargets.length; i++){
      bTargets[i].velocityX = Math.round(random(-10, 10));
      bTargets[i].velocityY = Math.round(random(-10, 10));

      bTargets[i].bounceOff(targets);
      bTargets[i].bounceOff(bTargets);
      bTargets[i].bounceOff(edges);

      if(bTargets[i].isTouching(arrows)){
        bTargets[i].lifetime = 0;
        score += 10;
      }
    }

    for (var i = 0; i < arrows.length; i++){
      if(arrows[i].isTouching(targets) || arrows[i].isTouching(bTargets)){
        arrows[i].destroy();
      }
    }

    

    //spawn targets
    spawnTarget();

    //display score
    fill("blue");
    text("Score: " + score, 10, 20);

    //display timer
    fill("blue");
    text("Timer: " + timer, 10, 40);
  }

  if(gameState=="end"){
    textSize(20);
    fill("blue");
    text("Times up! You scored " + score, 100, 200);

    targets.destroyEach();
    bTargets.destroyEach();
  }

  

  drawSprites();

}

function spawnTarget() {
  if(frameCount%10==0){
    target = createSprite(Math.round(random(20, 380)), Math.round(random(30, 150)), 30, 30);  

    rand = Math.round(random(1, 2));
    switch(rand){

      case 1: 
        target.addImage("Img", targetImg);
        targets.add(target);
        break;

      case 2: 
        target.addAnimation("bonus", bonusTargetImg);
        bTargets.add(target);
        break;
    }

    target.scale = 3;
    target.lifetime = 50;
  }
}

function spawnArrow(){
  arrow = createSprite(bow.x, bow.y, 10, 10);
  arrow.addImage("image", arrowImg);
  arrow.scale = 0.25;
  arrow.rotation = 90;
  arrow.setCollider("rectangle", 0, 0, 300, 50);
  arrow.velocityY = -20;
  arrows.add(arrow);


}
