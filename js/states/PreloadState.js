var PreloadState = {
    preload: function() {
        // show logo and progress bar
        game.preloadLogo = game.add.image(game.world.width/2, game.world.height/2-100, 'preload', 'logo');
        game.preloadLogo.anchor.setTo(0.5);
        
        game.preloadBar = game.add.sprite(game.world.width/2, game.world.height/2+100, 'preload', 'progress');
        game.preloadBar.x -= game.preloadBar.width/2;
        game.load.setPreloadSprite(game.preloadBar);
        
        // load assets 
        
        game.load.image('background', 'Asset/FlappyBG.png');
        game.load.image('ground', 'Asset/ground.png');
        game.load.image('pipe', 'Asset/pipe.png');
        game.load.image('taptostart', 'Asset/TapToStart.png');
      

        // load audio
      
          game.load.audio('sndOst', 'assets/audio/ost.mp3');
          game.load.audio('flap', 'Asset/flap.mp3');
          game.load.audio('hit', 'Asset/hit.mp3');
          game.load.audio('point', 'Asset/point.mp3');
    },
    
    create: function() {

        var bg = game.add.sprite(window.innerWidth.centerX, window.innerHeight.centerY, 'background');

        game.audio.addMusic('sndOst');
        game.audio.playMusic('sndOst');
        
    }
};