var platformGameplayState = function(game) {

}
////////////////////
//PLAYER VARIABLES//
////////////////////
//Player movement parameters
var gravityStrength = 50;

var playerJumpStrength = 1000;
var playerJumpLeeway = 15;

var playerWallGrabLeeway = 10;
var wallJumpYComponentFactor = 0.7;
var wallJumpXComponentFactor = 0.5;

var playerMoveAcceleration = 1200;
var playerMaxHorizontalSpeed = 500;
var playerHorizontalDrag = 20;

var playerAirborneAccelFactor = 0.4;
var playerAirborneDragFactor = 0.1;

//Player sprite settings
var playerSpriteScale = 0.5;
var playerHitboxWidthFactor = 0.7;
var playerHitboxHeightFactor = 1;

var player1Color = 0xff0000;
var player2Color = 0x00ff00;

//Player input settings
var player1JumpKey = Phaser.Keyboard.SPACEBAR;
var player1LeftMoveKey = Phaser.Keyboard.A;
var player1RightMoveKey = Phaser.Keyboard.D;

var player2JumpKey = Phaser.Keyboard.UP;
var player2LeftMoveKey = Phaser.Keyboard.LEFT;
var player2RightMoveKey = Phaser.Keyboard.RIGHT;


////////////////////
//TETRIS VARIABLES//
////////////////////
var tamañoCubo=50;
var time=45;
var spawnizq=600;
var pieceSpriteScale = 0.5;

platformGameplayState.prototype = {

    preload: function() 
    {
        //Load sprites
        game.load.image("personaje", "Assets/Sprites/TestCharacter.png");
        game.load.image("suelo", "Assets/Sprites/TestGround.png");
        game.load.spritesheet("playerSpriteSheet", "Assets/Sprites/SpriteSheetJ1.png", 250, 200, 10);
        game.load.image("piece", "Assets/Sprites/cuboPrueba.png");
    },
    

    create: function() {
        //Background
        this.stage.backgroundColor = 0x333333;

        //Physics initialization
        this.createPhysicGroups();

        //Create the ground
        this.ground = this.createWall(0, gameHeight - 100, 5, 1);
        this.wall = this.createWall(600, 0, 1, 5);

        //Create the player
        this.player1 = this.createPlayer(1, 0, 0);
        this.player2 = this.createPlayer(2, 300, 0);

        //Player pieces
        this.player1Piece = this.createPiece(game.rnd.integerInRange(1, 5));
        this.player2Piece = this.createPiece(game.rnd.integerInRange(1, 5));
    },

    createPhysicGroups: function()
    {
        this.groundPhysicsGroup = game.add.physicsGroup();
        this.playerPhysicsGroup = game.add.physicsGroup();
        this.piecePhysicsGroup = game.add.physicsGroup();
        this.frozenPiecesPhysicsGroup = game.add.physicsGroup();
    },

    createWall: function(xPosition, yPosition, xScale, yScale) {
        //Sprite
        wall = game.add.sprite(xPosition, yPosition, "suelo");
        wall.scale.setTo(xScale, yScale);

        //Physics
        game.physics.arcade.enable(wall);
        wall.body.allowGravity = false;
        wall.body.immovable = true;
        wall.body.moves = false;
        wall.body.enable = true;
        wall.body.collideWorldBounds = true;
        this.groundPhysicsGroup.add(wall);

        return wall;
    },

    createPlayer: function(playerNumber, xPosition, yPosition)
    {
        //Sprite
        player = game.add.sprite(xPosition, yPosition, "playerSpriteSheet");
        switch (playerNumber)
        {
            case 1:
                player.tint = player1Color;
                break;
            case 2:
                player.tint = player2Color;
            break;
            default:
                console.log("Unsupported player number " + playerNumber);
        }
        
        player.animations.add("walk", [1, 2, 3, 4, 5], 10, true);
        player.animations.add("idle", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 8, 9, 8], 4, true);
        player.animations.add("jump", [6], 1, true);
        player.animations.add("grabWall", [7], 1, true);
    
        //Scaling
        player.anchor.setTo(0.5, 0.5);
        player.scale.x = playerSpriteScale;
        player.scale.y = playerSpriteScale;

        //Physics
        game.physics.arcade.enable(player);
        player.body.allowGravity = false;     //We'll use our own gravity
        player.body.drag = 0;                 //We'll use our own drag
        player.body.enable = true;

        player.body.maxVelocity.x = playerMaxHorizontalSpeed;
        player.body.drag.x = playerHorizontalDrag;

        this.playerPhysicsGroup.add(player);

        //Hitbox
        player.body.width = player.body.width * playerHitboxWidthFactor;
        player.body.height = player.body.height * playerHitboxHeightFactor;

        //Input variables
        switch (playerNumber)
        {
            case 1:
                player.jumpKey = player1JumpKey;
                player.leftMoveKey = player1LeftMoveKey;
                player.rightMoveKey = player1RightMoveKey;
                break;
            case 2:
                player.jumpKey = player2JumpKey;
                player.leftMoveKey = player2LeftMoveKey;
                player.rightMoveKey = player2RightMoveKey;
                break;
        }

        player.liftedJumpKey = true;

        return player;
    },

    createPiece: function(estilo){
        var pieza = new Object();
        
        switch(estilo){
            case 1:
            //Creación de la pieza L
                pieza.bricks = new Array(4);
                
                pieza.bricks[0] = game.add.sprite(gameWidth - spawnizq, gameHeight - spawnizq, "piece");
                pieza.bricks[1] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - spawnizq, "piece");
                pieza.bricks[2] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - (spawnizq+tamañoCubo), "piece");
                pieza.bricks[3] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - (spawnizq+(2*tamañoCubo)), "piece");
                for(var i=0;i<=3;i++){
                    pieza.bricks[i].code="L";
                    pieza.bricks[i].index=i;
                }
                break;
            case 2:
            //Creación de la pieza T.
                pieza.bricks = new Array(4);
                
                pieza.bricks[0] = game.add.sprite(gameWidth - spawnizq, gameHeight - spawnizq, "piece");
                pieza.bricks[1] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - spawnizq, "piece");
                pieza.bricks[2] = game.add.sprite(gameWidth - (spawnizq-tamañoCubo), gameHeight - spawnizq, "piece");
                pieza.bricks[3] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq+tamañoCubo), "piece");
                for(var i=0;i<=3;i++){
                    pieza.bricks[i].code="T";
                    pieza.bricks[i].index=i;
                }
                
                break;
            case 3:
            //Creación de la pieza Z.
                pieza.bricks = new Array(4);
                
                pieza.bricks[0] = game.add.sprite(gameWidth - spawnizq, gameHeight - spawnizq, "piece");
                pieza.bricks[1] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq-tamañoCubo), "piece");
                pieza.bricks[2] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - (spawnizq-tamañoCubo), "piece");
                pieza.bricks[3] = game.add.sprite(gameWidth - (spawnizq-tamañoCubo), gameHeight - spawnizq, "piece");
                for(var i=0;i<=3;i++){
                    pieza.bricks[i].code="Z";
                    pieza.bricks[i].index=i; 
                }
                break;
            case 4:
            //Creación de la pieza I
                pieza.bricks = new Array(4);

                pieza.bricks[0] = game.add.sprite(gameWidth - spawnizq, gameHeight - spawnizq, "piece");
                pieza.bricks[1] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq+tamañoCubo), "piece");
                pieza.bricks[2] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq+(2*tamañoCubo)), "piece");
                pieza.bricks[3] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq+(3*tamañoCubo)), "piece");
                for(var i=0;i<=3;i++){
                    pieza.bricks[i].code="I";
                    pieza.bricks[i].index=i; 
                }
                break;
            case 5:
            //Creación de la pieza O
                pieza.bricks = new Array(4);  
                
                pieza.bricks[0] = game.add.sprite(gameWidth - spawnizq, gameHeight - spawnizq, "piece");
                pieza.bricks[1] = game.add.sprite(gameWidth - spawnizq, gameHeight - (spawnizq+tamañoCubo), "piece");
                pieza.bricks[2] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - (spawnizq+tamañoCubo), "piece");
                pieza.bricks[3] = game.add.sprite(gameWidth - (spawnizq+tamañoCubo), gameHeight - spawnizq, "piece");
                break;
        }
        
        //Inicializacion de los parametros de las piezas.
        for (var i = 0; i <= 3; i++) {
            game.physics.arcade.enable(pieza.bricks[i]);
            pieza.bricks[i].body.allowGravity = false;
            pieza.bricks[i].body.immovable = false;
            pieza.bricks[i].body.moves = true;
            pieza.bricks[i].body.enable = true;
            pieza.bricks[i].colision = false;
            
            //Escalando
            pieza.bricks[i].anchor.setTo(0.5, 0.5);
            pieza.bricks[i].scale.x = pieceSpriteScale;
            pieza.bricks[i].scale.y = pieceSpriteScale;
            this.piecePhysicsGroup.add(pieza.bricks[i]);
        }
        
        pieza.moveTimer = 0;

        return pieza;
    },

    update: function() {
        //Collisions
        game.physics.arcade.collide(this.groundPhysicsGroup, this.playerPhysicsGroup);

        //Player input
        this.reactToPlayerInput(this.player1);
        this.reactToPlayerInput(this.player2);

        //Tetris input
        this.dirijirPieza(this.player1Piece);
        this.dirijirPieza(this.player2Piece);
    },

    //PLAYER MOVEMENT
    reactToPlayerInput: function(player)
    {
        //Reset acceleration
        player.body.acceleration.x = 0;
        player.body.acceleration.y = 0;
        
        //Read the input
        var rightInput = game.input.keyboard.isDown(player.rightMoveKey);
        var leftInput = game.input.keyboard.isDown(player.leftMoveKey);
        var jumpKey = game.input.keyboard.isDown(player.jumpKey);

        //Check if we will allow jump input 
        if (!player.liftedJumpKey)
        {
            if (!jumpKey)
            {
                player.liftedJumpKey = true;
            }
        }
        var jumpInputIsAllowed = player.liftedJumpKey;

        //Check for state
        var isGrounded = this.playerIsGrounded(player);
        var isGrabbingWall = this.playerIsGrabbingWall(player);
        
        //Get the push direction
        var pushDirection;
        if (leftInput && !rightInput)
        {
            pushDirection = -1;
        }
        else if (rightInput && !leftInput)
        {
            pushDirection = 1;
        }
        else
        {
            pushDirection = 0;
        }
        
        //Get the movement direction
        var movementDirection = Math.sign(player.body.velocity.x);

        //Should we apply horizontal drag?
        var doDrag;
        if (pushDirection == movementDirection) doDrag = false;
        else if (pushDirection != movementDirection)
        {
            if (movementDirection == 0) doDrag = false;
            else doDrag = true;
        }
        
        //Apply the push
        player.body.acceleration.x += pushDirection * playerMoveAcceleration * ((isGrounded) ? 1 : playerAirborneAccelFactor);

        //Apply drag
        if (doDrag)
        {
            var newHorSpeed = player.body.velocity.x - (movementDirection * (playerHorizontalDrag * ((isGrounded) ? 1 : playerAirborneDragFactor)));
            if (movementDirection == -1)
            {
                player.body.velocity.x = Math.min(newHorSpeed, 0);
            }
            else if (movementDirection == 1)
            {
                player.body.velocity.x = Math.max(newHorSpeed, 0);
            }
            else if (movementDirection == 0)
            {
                player.body.velocity.x = 0;
            }
        }

        //Jumping
        if (jumpInputIsAllowed && jumpKey)
        {
            //Should we do a walljump?
            var doWallJump = false;
            if (isGrabbingWall)
            {
                if (!isGrounded) doWallJump = true;
            }

            if (doWallJump)
            {
                var wallDirection = isGrabbingWall;
                player.body.velocity.y = -playerJumpStrength * wallJumpYComponentFactor;
                player.body.velocity.x = -wallDirection * playerJumpStrength * wallJumpYComponentFactor;
            }
            else if (isGrounded)
            {
                player.body.y -= 1;     //This ugly hack prevents the player from technically being inside the ground and thus not jumping
                player.body.velocity.y = -playerJumpStrength;
            }
            
            player.liftedJumpKey = false;
        }
    
        //Gravity
        player.body.velocity.y += gravityStrength;

        //Set animation
        if (isGrounded)
        {
            if (pushDirection == 0)
            {
                player.animations.play("idle");
                player.scale.x = Math.abs(player.scale.x);
            }
            else
            {
                player.scale.x = Math.abs(player.scale.x) * pushDirection;
                player.animations.play("walk");
            }
        }
        else
        {
            if (isGrabbingWall != 0)
            {
                player.scale.x = Math.abs(player.scale.x) * isGrabbingWall;
                player.animations.play("grabWall");
            } 
            else player.animations.play("jump");
        }
    },

    playerIsGrounded: function(player)
    {
        //Prepare everything
        player.body.moves = false;
        var originalY = player.body.y;

        //Move the player
        player.body.y += playerJumpLeeway;

        //Test for collisions
        var touchingGround = game.physics.arcade.overlap(player, this.groundPhysicsGroup)

        //Put everything in its place
        player.body.y = originalY;
        player.body.moves = true;

        //Return the result
        return touchingGround;
    },

    //Returns -1 or 1 depending on the direction. 0 if not grabbing.
    playerIsGrabbingWall: function(player)
    {
        //Prepare everything
        player.body.moves = false;
        var originalX = player.body.x;
        
        //Check left
        player.body.x -= playerWallGrabLeeway;
        var grabbingLeft = game.physics.arcade.overlap(player, this.groundPhysicsGroup);
        player.body.x = originalX;

        //Check right
        player.body.x += playerWallGrabLeeway;
        var grabbingRight = game.physics.arcade.overlap(player, this.groundPhysicsGroup);
        player.body.x = originalX;
        
        //Put everything back
        player.body.moves = true;

        if (grabbingLeft) return -1;
        else if (grabbingRight) return 1;
        else return 0;
    },

    //TETRIS CONTROL
    dirijirPieza: function(piezaTetris)
    {
        //Entrada por teclado.
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        Rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        if (!piezaTetris.frozen)
        {
            if (!enterKey.isDown) {
        
                //Compruebo si está colisionando con el suelo o con otra pieza.
                var tocando = this.piezaTocandoSuelo(piezaTetris);
                
                //Rotation
                if (!Rkey.isDown) { piezaTetris.keyR = false; }
                if(Rkey.isDown && !piezaTetris.keyR ){
                    this.rotatePiece(piezaTetris);
                    piezaTetris.keyR = true;
                }
    
                //Freezing
                if (tocando) {
                    this.freezePiece(piezaTetris);
                }
    
                //Temporizador que marca el ritmo de bajada de la pieza, cada pieza tiene su propio temporizador.
                if (piezaTetris.moveTimer >= time) {
                    this.lowerPiece(piezaTetris);
                    piezaTetris.moveTimer = 0;
                }
    
                //forzar el bajar
                if (!downKey.isDown) { piezaTetris.keydown = false; }
                if (downKey.isDown && !piezaTetris.keydown) {
                    this.lowerPiece(piezaTetris);
                    piezaTetris.keydown = true;
                    piezaTetris.moveTimer = 0;
                }
    
                if (!leftKey.isDown) { piezaTetris.keyleft = false; }
                if (leftKey.isDown && !piezaTetris.keyleft) {
                    this.movePiece(piezaTetris, -1);
                    piezaTetris.keyleft = true;
                }
    
                if (!rightKey.isDown) { piezaTetris.keyright = false; }
                if (rightKey.isDown && !piezaTetris.keyright) {
                    this.movePiece(piezaTetris, 1);
                    piezaTetris.keyright = true;
                }
                piezaTetris.moveTimer++;
            }
            else
            {
                freezePiece(piezaTetris);
            }
        }
    },

    piezaTocandoSuelo: function(piezaTetris)
    {
        for (i = 0; i < 4; i++)
        {
            var brick = piezaTetris.bricks[i];

            //Desactivo moviento para manipularla.
            brick.body.moves = false;
            
            var originalY = brick.body.y;
            
            brick.body.y += tamañoCubo;

            //Comprubo colision con el suelo.
            var tocandoSuelo = game.physics.arcade.overlap(brick, this.groundPhysicsGroup);
            
            //Compruebo colision con piezas que estén colisionando.
            if(!tocandoSuelo){
                tocandoSuelo = game.physics.arcade.overlap(brick, this.frozenPiecePhysicsGroup);
            }

            brick.body.y = originalY;
            brick.body.moves = true;

            if (tocandoSuelo) return true;
        }
        
        return false;
    },

    rotatePiece: function(piece)
    {
        for (i = 0; i < 4; i++)
        {
            this.rotateBrick(piece.bricks[i]);
        }
    },

    rotateBrick:function(piezaTetris){ //Cambia el nombre del parámetro a brick
        //code2 ahora es index
        
        switch(piezaTetris.code){

            case "L":
            //Rotación de L
                if(piezaTetris.code2==0){
                    piezaTetris.body.x=piezaTetris.body.x -(2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==1 || piezaTetris.code2==11){
                    piezaTetris.body.x=piezaTetris.body.x -tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y-tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==3 || piezaTetris.code2==9){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==4){
                    piezaTetris.body.x=piezaTetris.body.x;
                    piezaTetris.body.y=piezaTetris.body.y-(2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==5 || piezaTetris.code2==15){
                    piezaTetris.body.x=piezaTetris.body.x +tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y-tamañoCubo;
                    if(piezaTetris.code2==15){piezaTetris.code2=3;}
                    else{piezaTetris.code2+=4;}
                }else if(piezaTetris.code2==7 || piezaTetris.code2==13){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    if(piezaTetris.code2==13){piezaTetris.code2=1;}
                    else{piezaTetris.code2+=4;}
                }else if(piezaTetris.code2==8){
                    piezaTetris.body.x=piezaTetris.body.x + (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==12){
                    piezaTetris.code2=0;
                    piezaTetris.body.x=piezaTetris.body.x;
                    piezaTetris.body.y=piezaTetris.body.y+(2*tamañoCubo);
                }
            break;
        
            case "T":
                //Rotacion de T
                if(piezaTetris.code2==1 || piezaTetris.code2==10 || piezaTetris.code2==15){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y - tamañoCubo;
                    if(piezaTetris.code2==15){piezaTetris.code2=3;}
                    else{piezaTetris.code2+=4;}
                }else if(piezaTetris.code2==2 || piezaTetris.code2==7 || piezaTetris.code2==9){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==3 || piezaTetris.code2==5 || piezaTetris.code2==14){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    if(piezaTetris.code2==14){piezaTetris.code2=2;}
                    else{piezaTetris.code2+=4;}
                }else if(piezaTetris.code2==6 || piezaTetris.code2==11 || piezaTetris.code2==13){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y - tamañoCubo;
                    if(piezaTetris.code2==13){piezaTetris.code2=1;}
                    else{piezaTetris.code2+=4;}
                }
            break;

            case "Z":
                //Rotación de Z
                if(piezaTetris.code2==1 ||piezaTetris.code2==7){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y - tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==2){
                    piezaTetris.body.x=piezaTetris.body.x ;
                    piezaTetris.body.y=piezaTetris.body.y - (2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==3 || piezaTetris.code2==13){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    if(piezaTetris.code2==3){piezaTetris.code2+=4;}
                    else {piezaTetris.code2=1;}
                }else if(piezaTetris.code2==5 || piezaTetris.code2==11){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y -tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==6){
                    piezaTetris.body.x=piezaTetris.body.x + (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y ;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==9 || piezaTetris.code2==15){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    if(piezaTetris.code2==9){piezaTetris.code2+=4;}
                    else {piezaTetris.code2=3;}
                }else if(piezaTetris.code2==10){
                    piezaTetris.body.x=piezaTetris.body.x;
                    piezaTetris.body.y=piezaTetris.body.y + (2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==14){
                    piezaTetris.code2=2;
                    piezaTetris.body.x=piezaTetris.body.x - (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y ;
                }
        break;
        
        case "I":
            //Rotación de I
                if(piezaTetris.code2==0){
                    piezaTetris.body.x=piezaTetris.body.x - (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y - (2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==1 || piezaTetris.code2==11){
                    piezaTetris.body.x=piezaTetris.body.x -tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y - tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==2 || piezaTetris.code2==10 || piezaTetris.code2==5 || piezaTetris.code2==13){
                    piezaTetris.body.x=piezaTetris.body.x;
                    piezaTetris.body.y=piezaTetris.body.y;
                    if(piezaTetris.code2==13){piezaTetris.code2=1;}
                    else{piezaTetris.code2+=4}
                }else if(piezaTetris.code2==3 || piezaTetris.code2==9){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==4 || piezaTetris.code2==14){
                    piezaTetris.body.x=piezaTetris.body.x + tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y - tamañoCubo;
                    if(piezaTetris.code2==4){piezaTetris.code2+=4;}
                    else{piezaTetris.code2=2}
                }else if(piezaTetris.code2==6 || piezaTetris.code2==12){
                    piezaTetris.body.x=piezaTetris.body.x - tamañoCubo;
                    piezaTetris.body.y=piezaTetris.body.y + tamañoCubo;
                    if(piezaTetris.code2==6){piezaTetris.code2+=4;}
                    else{piezaTetris.code2=0}
                }else if(piezaTetris.code2==7){
                    piezaTetris.body.x=piezaTetris.body.x - (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y + (2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==8){
                    piezaTetris.body.x=piezaTetris.body.x + (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y + (2*tamañoCubo);
                    piezaTetris.code2+=4;
                }else if(piezaTetris.code2==15){
                    piezaTetris.code2=3;
                    piezaTetris.body.x=piezaTetris.body.x + (2*tamañoCubo);
                    piezaTetris.body.y=piezaTetris.body.y - (2*tamañoCubo);
                }
            break;
        
        }
    },

    lowerPiece:function(piezaTetris)
    {
        for (i = 0; i < 4; i++)
        {
            piezaTetris.bricks[i].body.y += tamañoCubo;
        }
    },

    movePiece: function(piezaTetris, direction)
    {
        for (i = 0; i < 4; i++)
        {
            piezaTetris.bricks[i].body.x += direction * tamañoCubo;
        }
    },

    freezePiece: function(piezaTetris)
    {
        piezaTetris.frozen = true;
        for (i = 0; i < 4; i++)
        {
            brick = piezaTetris.bricks[i];

            //Desactivo colision, movimiento, activo colision de la parte de la pieza y por tanto de la pieza completa.
            brick.body.immovable = true;
            brick.body.moves = false;
            

            this.frozenPiecesPhysicsGroup.add(brick);
            this.piecePhysicsGroup.remove(brick);
        }
    }
}