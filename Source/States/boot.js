var bootState = function(game) {

}

bootState.prototype = {

    preload: function() {
        //Inicializa el sistema de f�sicas
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.time.desiredFps = 60;

        game.physics.arcade.gravity.y = -250;   
    },

    create: function() {
        game.state.start("mainMenuState");
    },

    update: function() {

    }
}