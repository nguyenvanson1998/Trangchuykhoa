var textUtils = {
    readmore: function (selector) {
        var expand = selector.data("expand");
        var span = $(selector.data("target"));
        var length = parseInt(span.data("length"));
        var text = span.data("text");
        if (expand == 1) {
            var expandText = selector.data("expand-text");
            selector.text(expandText);
            selector.data("expand", 0);
            span.text(text.substring(0, length) + span.data("readmore"));
            selector.data("expand", 0);
        } else {
            span.text(text);
            var collapseText = selector.data("collapse-text");
            selector.text(collapseText);
            selector.data("expand", 1);
        }
    }
}