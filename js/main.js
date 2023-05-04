var game = (function() {
    var gameWidth = 640;
    var gameHeight = 960;
    var name = null;
    var phone = null;
    var IsGameStart = false;
    var IsScored = false;
    
    var config = {
      type: Phaser.FIT,
      width: gameWidth,
      height: gameHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 500 },
          debug: false
        }
      }
    };
    
    var pipes, player, endGameScoreText, flapSound, hitSound, PointSound, background, tapBTN;
    var scoreText;
    var startButton;
    
    var nameInput = document.querySelector('#name');
    var phoneInput = document.querySelector('#phone');
    var endGameScoreText = document.querySelector('#score-text');
    var startButton = document.querySelector('#start-button');
  
    startButton.addEventListener('click', function () {
      name = nameInput.value;
      phone = phoneInput.value;
      if (name && phone) {
        startGame();
      } else {
        alert('Please enter your name and phone number.');
      }
    });
    
    function startGame() {
      document.querySelector('.menu').style.display = 'none';
      game.state.start('GameState');
    }
    
    function init() {
      game.state.add('BootState', BootState);
      game.state.add('PreloadState', PreloadState);
      game.state.add('GameState', GameState);
      game.state.start('BootState'); 
    }
    
    return {
      init: init
    };
  })();
  
  game.init();
  