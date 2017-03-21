/**
 * 2017. 3. 21.
 * R & I 센터, UX Design Lab 실, CX Team 문주영.
 * @ncsoft
 */

var currentX = 0;
var currentP = 0;
var readerP  = 0;
var readerH  = 0;
var readerW  = 0;

function readerSizing() {
  readerH = $("#reader__content").height();
  readerP = parseInt(readerH / 667) + 1;
  readerW = readerP * 391;

  console.log('readerH', readerH);
  console.log('readerW', readerW);
  console.log('readerP', readerP);
}

function nextPage() {
  if (currentX >= readerW) {
    return;
  }

  currentP += 1;
  currentX = currentP * 391;

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
  currentX = currentP * 391;

  $("#reader").css({
    "-webkit-transform": "translate3d(-" + currentX + "px, 0px, 0px)",
    "transform": "translate3d(-" + currentX + "px, 0px, 0px)"
  });
}

window.__novel_image_loaded__ = function () {
  readerSizing();
};

$(function () {
  $.ajax({
    method: "get",
    url: "public/test.html"
  }).then(onload);

  function onload(response) {
    $("#reader__content").html(response);
    readerSizing();
  }

  $("#btn__next").click(nextPage);
  $("#btn__prev").click(prevPage);
  $("#reader__wrap").click(function (e) {
    if (e.offsetX > 177) {
      nextPage();
    } else {
      prevPage();
    }
  });
});
