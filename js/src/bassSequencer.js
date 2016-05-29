(function() {
    var bassSequencerStep = 1;
    var isMuted = true;

    Tetrez.sequencers = {};

    Tetrez.sequencers.bass = {
        init: function(speed) {
            return setInterval(function() {
                if (isMuted) return;

                switch (bassSequencerStep) {
                    case 2:
                        createjs.Sound.play("bass2");
                    break;

                    case 4:
                        createjs.Sound.play("bass3");
                    break;

                    case 6:
                        createjs.Sound.play("bass3");
                    break;

                    case 20:
                        createjs.Sound.play("bass3");
                    break;

                    case 22:
                        createjs.Sound.play("bass3");
                    break;

                    case 34:
                        createjs.Sound.play("bass2");
                    break;

                    case 36:
                        createjs.Sound.play("bass3");
                    break;

                    case 38:
                        createjs.Sound.play("bass3");
                    break;

                    case 52:
                        createjs.Sound.play("bass3");
                    break;

                    case 54:
                        createjs.Sound.play("bass3");
                    break;

                    case 58:
                        createjs.Sound.play("bass1");
                    break;

                    case 59:
                        createjs.Sound.play("bass4");
                    break;

                    case 61:
                        createjs.Sound.play("bass4");
                    break;

                    case 64:
                        createjs.Sound.play("bass1");
                    break;
                }

                if (bassSequencerStep === 64) {
                    bassSequencerStep = 1;
                } else {
                    ++bassSequencerStep;
                }
            }, speed);
        },

        unmute: function() {
            isMuted = false;
        }
    };
}());