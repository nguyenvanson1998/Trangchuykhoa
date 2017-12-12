(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-84650910-12', 'auto');

var gaMgr =
{
    viewPage: function (pageName) {
        ga("set", "page", pageName);
        ga("set", "location", location.href);
        ga('send', 'pageview');
    },
    openAds: function (data, url) {
        gaMgr.sendEvent('ads', 'click', JSON.stringify(data));
        window.open(url);

    },
    sendEvent: function (cat, action, eventName) {
        ga('send', {
            hitType: 'event',
            eventCategory: cat,
            eventAction: action,
            eventLabel: eventName
        });
    },
    sendEventPost(action, eventName) {
        var eventParam= {
            userId: userPage.currendId,
            label: eventName
        }
        gaMgr.sendEvent('post', action, eventParam);
    },
    sendEventAutoCallAjax(action, eventName) {
        var eventParam = {
            userId: userPage.currendId,
            label: eventName
        }
        gaMgr.sendEvent('autocall', action, eventParam);
    },
    sendEventBooking(action, eventName) {
        var eventParam = {
            userId: userPage.currendId,
            label: eventName
        }
        gaMgr.sendEvent('booking', action, eventParam);
    }
}