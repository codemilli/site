$(function () {
  var ogMetaList = ['og:type', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:title', 'og:description', 'fb:app_id'];

  $('form#debug').on('submit', function (e) {
    e.preventDefault();

    var $target = $("#target");
    var $iframe = $('#iframe');
    var url     = $target.val();

    $iframe.attr('src', url);
    $iframe.load(function () {
      var metas = $iframe.contents().find('meta');

      $.each(metas, function (idx) {
        var meta    = metas[idx];
        var name    = meta.name;
        var content = meta.content;

        console.log('meta', name, content);
      });
    });
  });
});
