(function ($) {
    var $question, lastSelection, settings;
    var host = "http://lookup.getwordsmith.co/";
    var appName = "wordsmith";

    $.fn[appName] = function (options) {

        settings = $.extend({
            'paddingTop': 6,
            'maxLength': 18,
            'width': 600,
            'height': 400,
            'lookupMessage': "Lookup Word",
            'lookupImage': host + "images/Question_Mark.png",
            'lookupUrl': host + "definition/" + text,
            'className': "wordsmith"
        }, options);

        this.bind("mouseup", mouseup).addClass(settings.className);
        $(document).bind("mouseup", bodyMouseup);
    };

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, "");
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

    function bodyMouseup() {
        if (!$(this).hasClass(settings.className)) {
            remove();
        }
    }

    function remove() {
        if ($question) $question.remove();
        lastSelection = $question = null;
    }

    function mouseup(event) {
        var sel = getSelected();
        var text = trim(sel.toString()).toLowerCase();

        if (text.length == 0 || text.length >= settings.maxLength) {
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

            if (lastSelection) {
                if (lastSelection.x == x && lastSelection.y == y) {
                    $span.remove();
                    event.preventDefault();
                    return false;
                }
            }

            remove();
            $question = $('<div id="' + appName + '-question"><a href="#" id="' + appName + '-lookup" title="' + settings.lookupMessage + '"><img src="' + settings.lookupImage + '"/></a></div>');

            lastSelection = {
                sel: sel,
                x: x,
                y: y
            };

            $span.parent().append($question[0]);

            $question.css({
                left: x - $question.width(),
                top: y - ($question.height() - settings.paddingTop)
            });
            $span.remove();

            var $lookup = $('#' + appName + '-lookup');
            $lookup.click(function (e) {
                var left = (screen.width - settings.width) / 2;
                var top = (screen.height - settings.height) / 2;
                window.open(settings.lookupUrl, appName, "width=" + settings.width + ",height=" + settings.height + ",left=" + left + ",top=" + top + ",location=1" + ",scrollbars=1");
                e.preventDefault();
                return false;
            });

            event.preventDefault();
            return false;
        }
    }

})(jQuery);
