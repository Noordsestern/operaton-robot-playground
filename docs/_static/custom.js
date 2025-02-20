function handleClickAndPress(myfunc) {
  return function (e) {
    if (e.type != "keypress" || e.keyCode == 13) {
       myfunc(e);
    }
 };
}

jQuery(function($) {

  $('a[href$=".bpmn"]').each(function(id, el) {
    var play = $('<button class="btn btn-text" title="Token simulation"><i class="fa-solid fa-play"></i></button>');
    var stop = $('<button class="btn btn-text" title="Close simulation"><i class="fa-solid fa-stop"></i></button>');
    var id = "simulation-" + Math.floor(Math.random() * (new Date().getTime()));
    var pres = window.location.search === "?pres=";
    var scrollTop = $(window).scrollTop();
    play.bind("click keypress", handleClickAndPress(function (e) {
      if (!document.getElementById(id)) {
        play.hide();
        stop.show().focus();
        if ($(el).parents("figcaption").length) {
          $(el).parents("figcaption").siblings().hide();
          if (pres) {
            $(el).parents("figure").addClass("has-djs-presentation");
            $(el).parents("figcaption").before('<div id="'+ id + '" class="djs-presentation" />');
            $(window).scrollTop($('#' + id).offset().top);
          } else {
            $(el).parents("figcaption").before('<div id="'+ id + '"/>');
          }
        } else {
          if (pres) {
            $(el).after('<div id="'+ id + '" class="djs-presentation" />');
          } else {
            $(el).after('<div id="'+ id + '"/>');
          }
        }
        scrollTop = $(window).scrollTop();
        TokenSimulation(id, $(el).attr("href"));
      }
    }));
    stop.bind("click keypress", handleClickAndPress(function (e) {
      var pres = window.location.search === "?pres=";
      if (document.getElementById(id)) {
        $('#' + id).remove();
        stop.hide();
        play.show().focus();
        if ($(el).parents("figcaption").length) {
          $(el).parents("figcaption").siblings().show();
          if (pres) {
            $(el).parents("figure").removeClass("has-djs-presentation");
            $(window).scrollTop(scrollTop);
          }
        }
      }
    }));
    stop.hide();

    if ($(el).parents("figcaption").length) {
      $(el).parents("figcaption").children().first().prepend(play).prepend(stop);
    } else {
      $(el).before(play).before(stop);
    }
  })

  $('a[href$=".form"]').each(function(id, el) {
    var play = $('<button class="btn btn-text" title="Show form"><i class="fa-solid fa-play"></i></button>');
    var stop = $('<button class="btn btn-text" title="Hide form"><i class="fa-solid fa-stop"></i></button>');
    var id = "form-js-" + Math.floor(Math.random() * (new Date().getTime()));
    var schemaUrl = $(el).attr("href");
    var dataUrl = $(el).siblings('a[href$=".json"]').hide().first().attr("href");
    play.bind("click keypress", handleClickAndPress(function (e) {
      if (!document.getElementById(id)) {
        play.hide();
        stop.show().focus();
        if ($(el).parents("figcaption").length) {
          $(el).parents("figcaption").siblings().hide();
          $(el).parents("figcaption").before('<div id="'+ id + '"/>');
        } else {
          $(el).after('<div id="'+ id + '"/>');
        }
        (async function() {
          var schema = JSON.parse(await (await (await fetch(schemaUrl)).blob()).text());
          var data = await (async function() {
            if (dataUrl) {
              try {
                return JSON.parse(await (await (await fetch(dataUrl)).blob()).text());

              } catch (e) {
                return {};
              }
            } else {
              return {};
            }
          })();
          (await FormViewer.createForm({
            container: '#' + id,
            schema: schema,
            data: data
          })).on('submit', function(e) {
            alert(JSON.stringify(e.data, null, 2));
          });
        })();
      }
    }));
    stop.bind("click keypress", handleClickAndPress(function (e) {
      if (document.getElementById(id)) {
        $('#' + id).remove();
        stop.hide();
        play.show().focus();
        if ($(el).parents("figcaption").length) {
          $(el).parents("figcaption").siblings().show();
        }
      }
    }));
    stop.hide();

    if ($(el).parents("figcaption").length) {
      $(el).parents("figcaption").children().first().prepend(play).prepend(stop);
    } else {
      $(el).before(play).before(stop);
    }
  })

  $('a[href$=".dmn"]').each(function(id, el) {
    var url = $(el).siblings('a[href$=".html"]').hide().first().attr("href");
    if (!!url) {
    var play = $('<button class="btn btn-text" title="Show decision table"><i class="fa-solid fa-play"></i></button>');
    var stop = $('<button class="btn btn-text" title="Hide decision table"><i class="fa-solid fa-stop"></i></button>');
      var id = "dmn-js-" + Math.floor(Math.random() * (new Date().getTime()));
      play.bind("click keypress", handleClickAndPress(function (e) {
        if (!document.getElementById(id)) {
          play.hide();
          stop.show().focus();
          $(el).after('<div id="'+ id + '"/>');
          (async function() {
            var html = await (await (await fetch(url)).blob()).text();
            $('#' + id).html(html);
          })();
        }
      }));
      stop.bind("click keypress", handleClickAndPress(function (e) {
        if (document.getElementById(id)) {
          $('#' + id).remove();
          stop.hide();
          play.show().focus();
        }
      }));
      stop.hide();
      $(el).before(play).before(stop);
    }
  })
});
