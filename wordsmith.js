/* 
 * Wordsmith v1.01
 * getwordsmith.co
 *
 * Copyright (c) Rich Hollis, Jess Eddy 2012
 * Available under the BSD and MIT licenses: http://getwordsmith.co/license/
 *
 */
(function($) {
     var $question, lastSelection, settings;
     var appName = "wordsmith";
     var wordSymbol = "{word}";
     var lookupImage;
     var wordsmithSelectorClick = false;

     $.fn[appName] = function(options) {

          settings = $.extend({
               'maxWordLength': 18,
               'popupWidth': 600,
               'popupHeight': 400,
               'lookupImage': "http://getwordsmith.co/images/Question_Mark.png",
               'lookupMessage': "Lookup definition",
               'lookupUrl': "http://define.getwordsmith.co/" + wordSymbol
          }, options);

          $(document).on("mouseup", function(event) {
               mouseUpBody();
          });
          $(document).scroll(function(event) {
               mouseUpBody();
          });
          this.on("mouseup", function(event) {
               mouseUp(event)
          });
          this.on("mousedown", function(event) {
               mouseDown(event);
          });

          lookupImage = new Image();
          lookupImage.src = settings.lookupImage;
     };

     function trim(str) {
          return str.replace(/^\s+|\s+$/g, "");
     }

     function clearSelection() {
          if (window.getSelection) {
               if (window.getSelection().empty) { // Chrome
                    window.getSelection().empty();
               } else if (window.getSelection().removeAllRanges) { // Firefox
                    window.getSelection().removeAllRanges();
               }
          } else if (document.selection) { // IE?
               document.selection.empty();
          }
     }

     function getSelected() {
          var t = '';
          if (window.getSelection) {
               t = window.getSelection();
          } else if (document.getSelection) {
               t = document.getSelection();
          } else if (document.selection) {
               t = document.selection.createRange().text;
          }
          return t;
     }

     function mouseUpBody() {
          if (!wordsmithSelectorClick) {
               remove();
          }
          wordsmithSelectorClick = false;
     }

     function remove() {
          if ($question) $question.remove();
          lastSelection = $question = null;
     }

     function mouseDown(event) {
          clearSelection();
          remove();
          wordsmithSelectorClick = true; // mouse event originated inside a wordsmith selector
     }

     function mouseUp(event) {
          var sel = getSelected();
          var text = trim(sel.toString()).toLowerCase();

          if (text.length == 0 || text.length >= settings.maxWordLength) {
               remove();
               event.preventDefault();
               return false;
          }

          if (text.length > 0) {

               var range = sel.getRangeAt(0);
               var $span = $('<span/>');

               var newRange = document.createRange();
               newRange.setStart(sel.focusNode, range.endOffset);
               newRange.insertNode($span[0]); // using 'range' here instead of newRange unselects or causes flicker on chrome/webkit

               var x = $span.offset().left;
               var y = $span.offset().top;
               var scrollTop = $(window).scrollTop();

               if (lastSelection) {
                    if (lastSelection.x == x && lastSelection.y == y) {
                         $span.remove();
                         event.preventDefault();
                         return false;
                    }
               }

               remove();

               var style = "margin: 0; padding: 0; position: fixed" + "; width: " + lookupImage.width + "; height: " + lookupImage.height;
               $question = $('<div id="' + appName + '-question" style="' + style + '"><a href="#" id="' + appName + '-lookup" title="' + settings.lookupMessage + '"><img src="' + settings.lookupImage + '"/></a></div>');

               lastSelection = {
                    sel: sel,
                    x: x,
                    y: y
               };

               $span.parent().append($question[0]);

               // prevent us from being removed by BODY mouseup
               $('#' + appName + '-lookup').on("mousedown", function(event) {
                    wordsmithSelectorClick = true;
                    event.preventDefault();
                    return false;
               });

               $question.css({
                    left: x - (lookupImage.width / 1.5),
                    top: y - (lookupImage.height / 1.5) - scrollTop
               });
               $span.remove();

               var $lookup = $('#' + appName + '-lookup');
               $lookup.click(function(e) {
                    var lookupUrl = settings.lookupUrl.replace(wordSymbol, text);
                    var left = (screen.width - settings.popupWidth) / 2;
                    var top = (screen.height - settings.popupHeight) / 2;
                    window.open(lookupUrl, appName, "width=" + settings.popupWidth + ",height=" + settings.popupHeight + ",left=" + left + ",top=" + top + ",location=1" + ",scrollbars=1");
                    e.preventDefault();
                    return false;
               });

               event.preventDefault();
               return false;
          }
     }
})(jQuery);

