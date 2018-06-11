   var snackbarContainer = document.querySelector('#show-notywrap');
   var shButtom = $('#sh-input');
   var api__sh = "https://www.googleapis.com/youtube/v3/search";
   var api__list = "https://www.googleapis.com/youtube/v3/playlistItems";
   var api__key = "AIzaSyD-RErq2rwmWf-b2M3OJCTcF9VurRhR9Uo";
   var api__fields = "items/id/videoId,items/snippet/title,items/snippet/thumbnails";
   var api__listop = "PLFgquLnL59alcyTM2lkWJU34KtfPXQDaX";

   var proxylist = ['aHR0cDovL3Byb3h5LmhhY2tlcnlvdS5jb20vP3JlcVVybD1odHRwczovL2Rvd255dG1wMy5jb20mcGFyYW1zW3RvbXAzXT0='];
   var currentProxy = atob(proxylist[Math.floor(Math.random() * proxylist.length)]);

   $(function() {

       top__tracks();

       shButtom.on('keypress', function(e) {
           var a = e.keyCode ? e.keyCode : e.which,
               t = $(e.target).val();
           13 == a && sm__handler(t);
       });

   });


   var events__gen = function() {

       var playBtn = document.querySelectorAll('.btn-js-play');
       var addBtn = document.querySelectorAll('.btn-js-add');
       var dlBtn = document.querySelectorAll('.btn-js-dl');
       var notyBtn = document.querySelectorAll('.btn-js-noty');
       /** Notify method **/
       $.each(notyBtn, function(i, v) {
           v.addEventListener("click", function(e) {
               e.preventDefault();
               var data = { message: $(this).data('action') + '..."' + $(this).parents().eq(0).find('.name-track').text() + '"', timeout: 2000 }
               snackbarContainer.MaterialSnackbar.showSnackbar(data);
           });

       });
       /** Play method **/
       $.each(playBtn, function(i, v) {
           v.addEventListener("click", function(e) {
               e.preventDefault();
               playTrack($(this).parents().eq(0).data('track'), $(this));
           });
       });
       /** Add list method **/
       $.each(addBtn, function(i, v) {
           v.addEventListener("click", function(e) {
               e.preventDefault();
               addTrack($(this).parents().eq(0).data('track'), $(this));
           });
       });
       /** Download method **/
       $.each(dlBtn, function(i, v) {
           v.addEventListener("click", function(e) {
               e.preventDefault();
               dlTrack($(this).parents().eq(0).data('track'));
           });
       });


   }





   var dlTrack = function(id) {
           $.ajax({
               url: currentProxy + id,
               success: function(res) {
                   var uridl = decodeURI(res.url);
                   location.href = uridl + '?referer=songet';
               }
           })
       },
       playTrack = function(id, item) {
           xhr__handler(id, currentProxy, item, 'play');
       },
       addTrack = function(id, item) {
           xhr__handler(id, currentProxy, item, 'add');
       },
       // Manage fns on audio player
       sp__handler = function(type, itext, datauri) {
           var nameThis = $(itext).parents().eq(0).find('.name-track').text();
           var __item_play = [
               { 'icon': iconImage, 'title': nameThis, 'file': datauri }
           ];
           switch (type) {
               case "play":
                   AP.destroy();
                   AP.init({
                       playList: __item_play
                   });
                   break;
               case "add":
                   AP.init();
                   AP.update(__item_play);
                   break;
           }
       },
       // Manage state control enable/disable
       ea__handler = function(el, elactive) {
           $(el).is(':checked') ? elactive.show().fadeIn() : elactive.hide().fadeOut();
       },
       // Manage ajax request
       xhr__handler = function(id, proxy, item, type) {
           var params = id | proxy | item | type;
           if (params !== null | params != undefined | params != '') {
               $.ajax({
                   url: proxy + id,
                   beforeSend: function() {
                       var data = { message: $(item).data('action') + '..."' + $(item).parents().eq(0).find('.name-track').text() }
                       snackbarContainer.MaterialSnackbar.showSnackbar(data);
                   },
                   success: function(res) {
                       var uridl = decodeURI(res.url);
                       sp__handler(type, item, uridl);
                   }
               })
           }

       },
       // fn search & render music api
       sm__handler = function(qq) {
           var a = "";
           $.ajax({
               url: api__sh,
               data: {
                   part: "snippet",
                   key: api__key,
                   maxResults: "20",
                   order: "relevance",
                   fields: api__fields,
                   q: qq + ", audio"
               },
               beforeSend: function() {
                   $(".list-result").html('<div class="mdl-spinner mdl-js-spinner is-active"></div>');
                   componentHandler.upgradeDom();
               },
               dataType: "json",
               success: function(e) {
                   $.each(e.items, function(e, t) {
                       if ($(t.id).length) {
                           a += '<div class="mdl-list__item" data-track="' + t.id.videoId + '">' +
                               '<a class="mdl-list__item-primary-content btn-js-play" href="#" data-action="Cargando...">' +
                               '<i class="material-icons mdl-list__item-avatar">album</i>' +
                               '<span class="name-track">' + filterWords(t.snippet.title) + '</span></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-play" data-action="Cargando..." title="Reproducir solo" href="#">' +
                               '<i class="material-icons">play_arrow</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-add btn-js-noty" data-action="Se a&ntilde;adi&oacute; a la lista" href="#">' +
                               '<i class="material-icons">queue</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-dl btn-js-noty" data-action="Downloading track..." href="#" download>' +
                               '<i class="material-icons">file_download</i></a></div>';
                       }
                   }), $(".list-result").html(''), $(".list-result").html(a);
                   componentHandler.upgradeDom();
                   events__gen();
               }
           })
       },
       top__tracks = function() {
           var a = "";
           $.ajax({
               url: api__list,
               data: {
                   part: "snippet",
                   key: api__key,
                   maxResults: "10",
                   playlistId: api__listop
               },
               beforeSend: function() {
                   $(".list-top").html('<div class="mdl-spinner mdl-js-spinner is-active"></div>');
                   componentHandler.upgradeDom();
               },
               dataType: "json",
               success: function(e) {
                   $.each(e.items, function(e, t) {
                       if ($(t.snippet).length) {
                           a += '<div class="mdl-list__item" data-track="' + t.snippet.resourceId.videoId + '">' +
                               '<a class="mdl-list__item-primary-content btn-js-play" href="#" data-action="Cargando...">' +
                               '<i class="material-icons sp--1-right">album</i>' +
                               '<span class="name-track" title="'+filterWords(t.snippet.title)+'">' + filterWords(t.snippet.title) + '</span></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-play" data-action="Cargando..." title="Reproducir solo" href="#">' +
                               '<i class="material-icons">play_arrow</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-add btn-js-noty" data-action="Se a&ntilde;adi&oacute; a la lista" href="#">' +
                               '<i class="material-icons">queue</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-dl btn-js-noty" data-action="Downloading track..." href="#" download>' +
                               '<i class="material-icons">file_download</i></a></div>';
                       }
                   }), $(".list-top").html(''), $(".list-top").html(a);
                   componentHandler.upgradeDom();
                   events__gen();
               }
           })
       },
       // Trim titles song
       filterWords = function(e) {
           var a = /mp3|official|video|new|cover|audio|music|oficial|hq|lyric|([([\]/)|])/gi;
           return e.replace(a, function(e) {
               return e.replace(/./g, "")
           })
       };