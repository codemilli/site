$(function () {
  var ogMetaList = ['og:type', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:title', 'og:description', 'fb:app_id'];
  var metaTags   = [];

  $('form#debug').on('submit', function (e) {
    e.preventDefault();

    var $target = $("#target");
    var $iframe = $('#iframe');
    var url     = $target.val();

    $iframe.attr('src', url);
    $iframe.load(function () {
      var metas;

      try {
        metas = $iframe.contents().find('meta');
      } catch (e) {
        console.log('e', e);
      }

      $.each(metas, function (idx) {
        var meta    = metas[idx];
        var name    = meta.name;
        var content = meta.content;

        if (name && ogMetaList.indexOf(name) > -1) {
          var obj         = {};
          obj.name        = name;
          obj.content     = content;
          metaTags.push(obj);
        }
      });


      console.log('ogMetaMap', metaTags);
    });
  });
});
