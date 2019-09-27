function resizeContent(w, h, flag) {
    let content = document.getElementById("content");

    let pw = document.documentElement.clientWidth;
    let ph = document.documentElement.clientHeight;
    let cw = w || content.offsetWidth;
    let ch = h || content.offsetHeight;
    let wp = pw / cw;
    let hp = ph / ch;

    let zoom = 1;
    if (flag) {
        zoom = hp;
        content.style.setProperty('margin-top', -((ch - ch * zoom) / 2) + "px");
        content.style.setProperty('margin-left', ((pw - cw * zoom) / 2) - ((cw - cw * zoom) / 2) + "px");
    } else {
        if (wp < hp) {
            zoom = wp;
            content.style.setProperty('margin-left', -((cw - cw * zoom) / 2) + "px");
            content.style.setProperty('margin-top', ((ph - ch * zoom) / 2) - ((ch - ch * zoom) / 2) + "px");
        } else {
            zoom = hp;
            content.style.setProperty('margin-top', -((ch - ch * zoom) / 2) + "px");
            content.style.setProperty('margin-left', ((pw - cw * zoom) / 2) - ((cw - cw * zoom) / 2) + "px");
        }
    }

    content.style.setProperty('top', "0px");
    content.style.setProperty('left', "0px");
    content.style.setProperty('transform', "scale(" + zoom + ")");
    $(content).data("zoom", zoom);
}
window.onresize = function () {
    resizeContent();
};
window.onload = function () {
    setTimeout(function () {
        $(".bg").fadeOut();
    }, 1000);
};
resizeContent();