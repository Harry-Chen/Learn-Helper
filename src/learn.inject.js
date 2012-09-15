window.NN_showImage = function(num, k) {
    for (var i = 1; i <= num; ++i) {
        var obj = document.getElementById("ImageTab" + i);
        if (i != k) {
            obj.style.background = 'url("/images/new/Y_bg_no.gif")';
        } else {
            obj.style.background = 'url("/images/new/Y_bg_on.gif")';
        }
    }
};
