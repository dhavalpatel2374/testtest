var GameState = {
   
    
    preload: function()
    {
        game.load.image('background', 'Asset/FlappyBG.png');
        game.load.image('ground', 'Asset/ground.png');
        game.load.image('pipe', 'Asset/pipe.png');
        
        game.load.spritesheet('bird', 'Asset/bird.png', 42, 30, 3);
        game.load.image('taptostart', 'Asset/TapToStart.png');
        game.load.audio('flap', 'Asset/flap.mp3');
        game.load.audio('hit', 'Asset/hit.mp3');
        game.load.audio('point', 'Asset/point.mp3');
        
    },
    create: function () {
        // sound hook
        game.hitPlaying = false;
        
        // create sounds instence
        
        jumpSound = game.add.audio('flap');
        scoreSound = game.add.audio('point');
        deathSound = game.add.audio('hit');
        
        
        // add background
        bg = game.add.sprite(window.innerWidth.centerX, window.innerHeight.centerY, 'background');
        
        
        
        
        // Enable Box2D physics
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.gravity.y = 2000;
        
        
        
        //add pipe group
        pipes = game.add.group();
        //colider group
        colider = game.add.group();

        // create the bird sprite
        bird = game.add.sprite(game.world.centerX-100, game.world.centerY-100, 'bird');
        bird.anchor.setTo(0.5, 0.5); 
        
        // create the flap animation
        bird.animations.add('flap', [0, 1, 2], 10, true);
        
        // play the flap animation
        bird.animations.play('flap'); 
        
        // create ground
        ground = game.add.sprite(game.world.centerX, game.world.height-50, 'ground');
        game.physics.box2d.enable(ground); 
        ground.body.static = true;
        game.physics.arcade.enable(ground);
        ground.body.immovable = true;
        
        
        // add the score text
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        
        //tap to start
        tapBTN = game.add.button(game.world.width/3.5 , game.world.height/2, 'taptostart', function(){
            // add a timer to spawn pipes every 2 seconds
            pipeTimer =  game.time.events.loop(2000, spawnPipe, this);
            tapBTN.x=-1000;
            game.input.onDown.add(jump, this);
            IsGameStart=true;
            onGameStart();
        }, this, 1, 0, 1);
        
        
        
        
    },
    
    update: function() {
        if(IsGameStart==true)
        {
            // check for collisions between the bird and the pipes
            game.physics.arcade.overlap(bird, pipes, gameOver, null, this);

            //check for collisions between the bird and the colider for score
            if (IsScored && checkOverlap(bird, colid)) {
                IsScored=false;

                if (bird.x < colid.x) { 
                    // Counter_score++;
                   scoreUpdate();
                }
                
            }
            
            // rotate the bird depending on its velocity
            if (bird.body.velocity.y < 0) {
                bird.angle = -30;
            } else if (bird.body.velocity.y > 400) {
                bird.angle = 90;
            } else {
                bird.angle = bird.body.velocity.y / 10;
            }
            
            // check if the bird is out of bounds
            if (bird.y < 0 || bird.y > game.world.height) {
                gameOver();
            }
        }
    }   
};

function onGameStart() {
    // start physics arcad for bird
    game.physics.enable(bird, Phaser.Physics.ARCADE);
    bird.body.gravity.y = 1000;
    
    jump();
}

function jump() {
    //jump bird while alive 
    if (bird.alive) {
        bird.body.velocity.y = -350;
        jumpSound.play();
    }
    
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function scoreUpdate() {
    //jump bird while alive 
    if (bird.alive) {
         score++;
         scoreText.text = 'Score: ' + score;
         scoreSound.play();
     }
}

function gameOver() {
    // stop the game when bird dead
    if (bird.alive) {
        bird.alive = false;
        game.time.events.remove(pipeTimer);
        deathSound.play();
        pipes.forEach(function(pipe) {
            pipe.body.velocity.x = 0;
        });
        //send score to server
        sendScore(score); 
    }

}

function spawnPipe() {
    
    // get a random y position for the pipes
    var gap = random_range(560,760);
    // var position = Math.floor(Math.random() * (game.world.height - gap - 100)) + 75;
    var position = random_range(95,600);
    
    
    // add the top pipe
    var topPipe = game.add.sprite(game.world.width+200, position - 480, 'pipe');
    topPipe.anchor.setTo(0.5, 0.5);
    topPipe.scale.y = -1;
    pipes.add(topPipe);
    
    // add the bottom pipe
    var bottomPipe = game.add.sprite(game.world.width+200, position + gap, 'pipe');
    bottomPipe.anchor.setTo(0.5, 0.5);
    pipes.add(bottomPipe);

     // add the colider rect
    colid = game.add.sprite(game.world.width+250, 480, 'pipe');
    colid.anchor.setTo(0.5, 0.5);
    colid.alpha=0.001;
    colider.add(colid);
    IsScored=true;
    
    // enable physics for the pipes
    game.physics.enable([topPipe, bottomPipe, colid], Phaser.Physics.ARCADE);
    
    // make the pipes move to the left
    topPipe.body.velocity.x = -300 * (1 + score/20);
    bottomPipe.body.velocity.x = -300 * (1 + score/20);
    colid.body.velocity.x = -300 * (1 + score/20);
    
    // remove the pipes when they are out of bounds
    if (topPipe.x<-200 ||bottomPipe.x<-200 ||colid.x<-200) 
    {
        topPipe.checkWorldBounds = true;
        topPipe.outOfBoundsKill = true;
        
        bottomPipe.checkWorldBounds = true;
        bottomPipe.outOfBoundsKill = true;

        colid.checkWorldBounds = true;
        colid.outOfBoundsKill = true;
       
       
        
    }
    
}

    // Create a function to encrypt the data using a secret key
    function encryptData(data, secretKey) {
        const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
        return cipherText.toString();
    }
    
    //send Score to server
    function sendScore(score) {
        document.querySelector('#lose').style.display = 'block';
        endGameScoreText.textContent = 'Submitting score...';
        
        const xhr = new XMLHttpRequest();
        const url = 'https://flap-tp.api.bassamseif.com/scores';
        xhr.open('POST', url);
        xhr.responseType = 'json'
        
        
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 201) {
                endGameScoreText.textContent = `Score has been submitted!`;
                console.log('Score sent successfully!');
            } else if(xhr.status === 400){
                endGameScoreText.textContent = ` ${xhr.response.message}`;
                
                console.error('Failed to send score: ' + xhr.response);
            }
            else
            {
                endGameScoreText.textContent = `Error submitting scores`;
            }
        };
        xhr.onerror = function() {
            console.error('Failed to send score: Network Error');
        };
        
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        
        const data = {
            token: token,
            score: +score,
            name: name,
            phone: +phone,
          };
        // const encryptedData = encryptData(data, "ojb13o3");

        // xhr.send(JSON.stringify({ d: encryptedData }));
        xhr.send(JSON.stringify({data}));
    }
 