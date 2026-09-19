// JavaScript Document

function play_music(e){
    var mc = document.getElementById('mc_play');
    var audio = mc ? mc.querySelector('audio') : null;
    if (mc && audio) {
        if (mc.classList.contains('on')){
            audio.pause();
            mc.className = 'stop';
        } else {
            audio.play().catch(function(){});
            mc.className = 'on';
        }
    }
    var filter = document.getElementById('music_play_filter');
    if (filter) filter.style.display = 'none';
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
}

function just_play(id){
    var mc = document.getElementById('mc_play');
    var audio = mc ? mc.querySelector('audio') : null;
    if (mc && audio) {
        audio.play().catch(function(){});
        mc.className = 'on';
    }
    var filter = document.getElementById('music_play_filter');
    if (filter && typeof id !== 'undefined'){
        filter.style.display = 'none';
    }
}

function is_weixn(){
    return false;
}

var play_filter = document.getElementById('music_play_filter');
if (play_filter) {
    ['click', 'touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'mousemove'].forEach(function(evt){
        play_filter.addEventListener(evt, function(){
            just_play(1);
        });
    });
}

window.onload = function(){
    if (!is_weixn()){
        just_play();
    }
};

