$(function () {
  var ogMetaList = ['og:type', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:title', 'og:description', 'fb:app_id'];

  $('form#debug').on('submit', function (e) {
    e.preventDefault();

    $(".result").show();
    var $target    = $("#target");
    var $iframe    = $("#iframe");
    var url        = $target.val();
    var metaTags   = [];
    var imageUrl   = "";
    var ogUrl      = "";

    $("#hidden__div").html("");
    $(".result__content tbody").html("");

    $.ajax({
      method  : 'get',
      url     : url
    }).then(function (response) {
      $("#hidden__div").append($.parseHTML(response));

      var metas = $("#hidden__div").find("meta") || [];

      $.each(metas, function(idx) {
        var meta    = $(metas[idx]);
        var name    = meta.attr("property");
        var content = meta.attr("content");

        if (name && ogMetaList.indexOf(name) > -1) {
          var obj         = {};
          obj.name        = name;
          obj.content     = content;
          metaTags.push(obj);

          if (name === "og:image") {
            imageUrl = content;
          }
          if (name === "og:url") {
            ogUrl = content;
          }
        }
      });

      $.each(metaTags, function (idx) {
        var meta = metaTags[idx];
        var dom  = "<tr> <td class='result__body--title'>"+meta.name+"</td> <td class='result__body--content'>"+meta.content+"</td> </tr>";
        $(".result__properties tbody").append(dom);
      });
    });
  });
});
