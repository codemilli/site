$(function () {
  $('form#debug').on('submit', function (e) {
    e.preventDefault();

    var $target = $("#target");
    var url = $target.val();

    $.ajax(url).then(function (response) {
      var $headTag = $("<head>" + response.split('<head>')[1].split('</head>')[0] + "</head>");

      console.log('response', $headTag);
      window.$headTag = $headTag;
    });
  });
});
