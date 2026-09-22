// Background Music Controller for Pavilion
function getMusicBtn() {
    return document.getElementById('mc-play') || document.getElementById('mc_play');
}

var userManuallyStopped = false;

function play_music(e) {
    var mc = getMusicBtn();
    var audio = mc ? mc.querySelector('audio') : null;
    if (!audio) {
        audio = document.getElementById('musicfx');
    }
    if (mc && audio) {
        if (mc.classList.contains('on')) {
            audio.pause();
            mc.classList.remove('on');
            mc.classList.add('stop');
            userManuallyStopped = true;
        } else {
            userManuallyStopped = false;
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    mc.classList.remove('stop');
                    mc.classList.add('on');
                }).catch(function(err) {
                    console.log('Audio playback prevented:', err);
                });
            } else {
                mc.classList.remove('stop');
                mc.classList.add('on');
            }
        }
    }
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
}

function just_play() {
    if (userManuallyStopped) return;
    var mc = getMusicBtn();
    var audio = mc ? mc.querySelector('audio') : null;
    if (!audio) {
        audio = document.getElementById('musicfx');
    }
    if (mc && audio) {
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                mc.classList.remove('stop');
                mc.classList.add('on');
            }).catch(function() {
                mc.classList.remove('on');
                mc.classList.add('stop');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var mc = getMusicBtn();
    if (mc) {
        mc.addEventListener('click', function(e) {
            play_music(e);
        });
        mc.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                play_music(e);
            }
        });
    }

    // Attempt direct autoplay
    setTimeout(function() {
        just_play();
    }, 400);

    // Modern Browser Autoplay Policy compliance:
    // If the browser blocks direct unmuted autoplay on initial load,
    // trigger playback upon the user's very first interaction anywhere on the document.
    function unlockAudioOnInteraction() {
        var audio = (mc && mc.querySelector('audio')) || document.getElementById('musicfx');
        if (audio && audio.paused && !userManuallyStopped) {
            just_play();
        }
        ['click', 'touchstart', 'keydown', 'wheel'].forEach(function(evt) {
            document.removeEventListener(evt, unlockAudioOnInteraction);
        });
    }

    ['click', 'touchstart', 'keydown', 'wheel'].forEach(function(evt) {
        document.addEventListener(evt, unlockAudioOnInteraction, { once: true, passive: true });
    });
});

