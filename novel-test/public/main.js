/**
 * 2017. 3. 21.
 * R & I 센터, UX Design Lab 실, CX Team 문주영.
 * @ncsoft
 */

var borderW  = 16;
var currentX = 0;
var currentP = 0;
var readerP  = 0;
var readerH  = 0;
var readerW  = 0;
var windowW  = 0;
var windowH  = 0;
var wrap     = null;

function readerSizing() {
  windowW = $("#reader__wrap").width();
  windowH = $("#reader__wrap").height();
  readerH = $("#reader__content").height();
  readerP = parseInt(readerH / windowH) + (readerH % windowH > 0.05 ? 1 : 0);
  readerW = readerP * (windowW + 16);

  console.log('readerH', readerH);
  console.log('readerW', readerW);
  console.log('readerP', readerP);
}

function nextPage() {
  if (currentX >= readerW) {
    return;
  }

  currentP += 1;
  currentX = currentP * (windowW + 16);

  $("#reader").css({
    "-webkit-transform": "translate3d(-" + currentX + "px, 0px, 0px)",
  "transform": "translate3d(-" + currentX + "px, 0px, 0px)"
  });
}

function prevPage() {
  if (currentX <= 0) {
    return;
  }

  currentP -= 1;
  currentX = currentP * (windowW + 16);

  $("#reader").css({
    "-webkit-transform": "translate3d(-" + currentX + "px, 0px, 0px)",
    "transform": "translate3d(-" + currentX + "px, 0px, 0px)"
  });
}

function onTap(e) {
  if (e.offsetX > (windowW / 2)) {
    nextPage();
  } else {
    prevPage();
  }
}

$(function () {
  $.ajax({
    method: "get",
    url: "public/test.html"
  }).then(onload);

  function onload(response) {
    window.__novel_image_loaded__ = function () {
      readerSizing();
    };

    $("#reader__content").html(response);
    readerSizing();

    $("#reader__wrap").click(onTap);
  }

  $("#btn__next").click(nextPage);
  $("#btn__prev").click(prevPage);
});
