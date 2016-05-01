(function() {
    var bassSequencerInterval;
    var bassSequencerStep = 1;
    var isInitted = false;
    var isMuted = true;

    Tetrez.sequencers = {};

    Tetrez.sequencers.bass = {
        init: function() {
            if (isInitted) return;
            isInitted = true;

            bassSequencerInterval = setInterval(function() {
                if (isMuted) return;

                switch (bassSequencerStep) {
                    case 1:
                    break;

                    case 2:
                        createjs.Sound.play("bass2");
                    break;

                    case 3:
                    break;

                    case 4:
                        createjs.Sound.play("bass3");
                    break;

                    case 5:
                    break;

                    case 6:
                        createjs.Sound.play("bass3");
                    break;

                    case 7:
                    break;

                    case 8:
                    break;

                    case 9:
                    break;

                    case 10:
                    break;

                    case 11:
                    break;

                    case 12:
                    break;

                    case 13:
                    break;

                    case 14:
                    break;

                    case 15:
                    break;

                    case 16:
                    break;

                    case 17:
                    break;

                    case 18:
                    break;

                    case 19:
                    break;

                    case 20:
                        createjs.Sound.play("bass3");
                    break;

                    case 21:
                    break;

                    case 22:
                        createjs.Sound.play("bass3");
                    break;

                    case 23:
                    break;

                    case 24:
                    break;

                    case 25:
                    break;

                    case 26:
                        createjs.Sound.play("bass1");
                    break;

                    case 27:
                        createjs.Sound.play("bass4");
                    break;

                    case 28:
                    break;

                    case 29:
                        createjs.Sound.play("bass4");
                    break;

                    case 30:
                    break;

                    case 31:
                    break;

                    case 32:
                        createjs.Sound.play("bass1");
                    break;
                }

                if (bassSequencerStep === 32) {
                    bassSequencerStep = 1;
                } else {
                    ++bassSequencerStep;
                }
            }, Tetrez.config.initSpeed / 4);
        },

        unmute: function() {
            isMuted = false;
        }
    };
}());