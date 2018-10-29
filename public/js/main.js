function transferBP(p){
    $.get('/saveScore?amount=' + p, function(data) {

    });
};
function saveScore(p){
    $.get('/save_rank?score=' + p, function(data) {

    });
};