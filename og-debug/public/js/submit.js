$(function () {
  var ogMetaList = ['og:type', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:title', 'og:description', 'fb:app_id'];
  var metaTags   = [];
  var domList    = [];
  var url        = "";
  var imageUrl   = "";
  var ogUrl      = "";

  $('form#debug').on('submit', function (e) {
    e.preventDefault();

    var $target = $("#target");
    var $iframe = $('#iframe');

    url         = $target.val();

    $.ajax({
      method  : 'get',
      url     : url
    }).then(function (response) {
      $("#hidden__div").append($.parseHTML(response));

      var metas = $("#hidden__div").find("meta") || [];

      $.each(metas, function(idx) {
        var meta    = metas[idx];
        var name    = meta.name;
        var content = meta.content;

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
        domList.push("<tr> <td class='result__body--title'>"+meta.name+"</td> <td class='result__body--content'>"+meta.content+"</td> </tr>");
      });

      console.log('domList', domList);

      $.each(domList, function (idx) {
        var dom = domList[idx];
        $(".result__content tbody").append(dom);
        console.log('dom', dom);
      });
    });
  });
});
