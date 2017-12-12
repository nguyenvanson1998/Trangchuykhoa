var ckeditor = null;
var CKEditorSetup = {
    Show: function (idtextarea) {
        CKEDITOR.replace(idtextarea, {
            height: '300px', startupFocus: true,
            toolbar: [
                ['Bold', 'Italic', 'Underline', 'Strike'],
                ['Subscript', 'Superscript'],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],	// Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
                ['Undo', 'Redo'],
                ['Cut', 'Copy', 'Paste'], ["base64image", "uploadfile", "embed", "autoembed","autolink"],
               ["NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote"],[ "Link", "Table", "HorizontalRule", "Smiley", "SpecialChar"],			// Defines toolbar group without name.
                ["Font", "FontSize", "TextColor", "BGColor", "Maximize", 'Preview', 'VideoDetector']																			// Line break - next group will be placed in new line.
            ],
            embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
            //        toolbar: [
            //['Bold', 'Italic', 'Underline', 'Strike'],
            //['Subscript', 'Superscript'],
            //["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],	// Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
            //['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'Templates'],
            //['Undo', 'Redo'], ["NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote"], ["uploadfile", "Link", "Image", "Table", "HorizontalRule", "Smiley", "SpecialChar"],			// Defines toolbar group without name.
            //["Styles", "Format", "Font", "FontSize", "TextColor", "BGColor", "-", "Maximize", 'Preview']																			// Line break - next group will be placed in new line.
            //    ]
        });
        ckeditor = CKEDITOR.instances[idtextarea];
    },
    GetData: function (idtextarea) {
        return CKEDITOR.instances[idtextarea].getData();
    },
    SetData: function (idtextarea, value) {
        return CKEDITOR.instances[idtextarea].setData(value);
    },
    ClearData: function (idtextarea) {
        return CKEDITOR.instances[idtextarea].setData("");
    }


}

var storageMgr = {
    write: function (key, data) {
        if (typeof (Storage) !== "undefined")
            localStorage.setItem(key, data);
    },
    read: function (key) {
        if (typeof (Storage) !== "undefined")
            return localStorage.getItem(key);
    }
}
var cookieMgr = {
    write: function (cname, cvalue, exdays) {
        //var d = new Date();
        //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        //var expires = "expires=" + d.toUTCString();
        //document.cookie = cname + "=" + cvalue + "; " + expires;
        $.cookie(cname, cvalue, { expires: exdays });
    },

    read: function (cname) {
        return $.cookie(cname);
        //var name = cname + "=";
        //var ca = document.cookie.split(';');
        //for (var i = 0; i < ca.length; i++) {
        //    var c = ca[i];
        //    while (c.charAt(0) == ' ') c = c.substring(1);
        //    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        //}
        //return "";
    }
}

var common = {
    getTotalPage: function (numberinpage, totalitem) {
        var temp = totalitem / numberinpage;
        var _totalpage = Math.round(temp);
        var totalpage = (temp > _totalpage) ? _totalpage + 1 : _totalpage;
        return totalpage;
    },
    endWith: function (a, b) {
        var index = a.lastIndexOf(b);
        if (index != -1 && (index + b.length) == a.length)
            return true;
        return false;
    },
    isNumeric: function (input) {
        return (input - 0) == input && ('' + input).replace(/^\s+|\s+$/g, "").length > 0;
    },
    isValidDate: function (d) {
        var timestamp = Date.parse(d)
        return !isNaN(timestamp);
    },
    isValidDate: function (d, isDDMMYYYY) {
        re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        if (d != '') {
            if (regs = d.match(re)) {
                if (isDDMMYYYY) {
                    if (regs[2] < 1 || regs[2] > 12) {
                        return false;
                    }
                    if (regs[1] < 1 || regs[1] > 31) {
                        return false;
                    }
                    if (regs[2] == 2 && regs[1] > 29) {
                        return false;
                    }
                } else {
                    if (regs[1] < 1 || regs[1] > 12) {
                        return false;
                    }
                    if (regs[2] < 1 || regs[2] > 31) {
                        return false;
                    }
                    if (regs[1] == 2 && regs[2] > 29) {
                        return false;
                    }
                }
                if (regs[3] < 1902 || regs[3] > (new Date()).getFullYear()) {
                    return false;
                }
                return true;
            }
            return false;
        }
        else
            return false;
    },
    existFunction: function (func) {
        if (typeof func != "undefined" && typeof func === 'function') {
            return true;
        }
        return false;
    },
    createSpanNumber: function (number, _class) {
        var span = $('<span class="badge bg-color-greenLight pull-right inbox-badge">');
        span.text(number);
        span.addClass(_class);
        return span;
    },
    createLabelStyle: function (_class, text) {
        var label = $('<span class="label" style="padding:0px !important; text-align:center; color: white; font-weight: bold; margin: 0px;">').addClass(_class).text(text);
        return label;
    },
    createLabelStyleSuccess: function (text) {
        return Common.CreateLabelStyle("label-success", text);
    },
    createLabelStyleInfo: function (text) {
        return Common.CreateLabelStyle("label-info", text);
    },
    createLabelStyleWarning: function (text) {
        return Common.CreateLabelStyle("label-warning", text);
    },
    createLabelStyleDanger: function (text) {
        return Common.CreateLabelStyle("label-danger", text);
    },
    createLabelStylePrimary: function (text) {
        return Common.CreateLabelStyle("label-primary", text);
    },
    createLabelBadge: function (_class, text) {
        var label = $('<span class="badge" style="padding:5px !important; text-align:center;color: white;font-weight: bold; margin: 0px;">').addClass(_class).text(text);
        return label;
    },
    createLabelBadgeSuccess: function (text) {
        return Common.CreateLabelBadge("bg-color-greenLight", text);
    },
    cCreateLabelBadgeInfo: function (text) {
        return Common.CreateLabelBadge("bg-color-blueLight", text);
    },
    createLabelBadgeWarning: function (text) {
        return Common.CreateLabelBadge("bg-color-orange", text);
    },
    createLabelBadgeDanger: function (text) {
        return Common.CreateLabelBadge("bg-color-red", text);
    },
    createLabelBadgePrimary: function (text) {
        return Common.CreateLabelBadge("bg-color-darken", text);
    },
    createSwitch: function (text, checked, textON, textOFF, funClick) {
        var label = $("<label class='toggle' style='display: inline;'>");
        var input = $('<input type="checkbox" name="checkbox-toggle">');
        if (checked)
            input.attr("checked", "checked");
        input.click(function () {
            if (common.existFunction(funClick))
                funClick(this);
        });
        var i = $('<i style="margin-top: -3px;">').attr('data-swchon-text', textON).attr('data-swchoff-text', textOFF);
        label.append(input).append(i).append(text);
        return label;
    },
    htmlEncode: function (value) {
        return $('<div/>').text(value).html().replace(/ /g, '%20');
    },
    getQueryStringHash: function (name) {
        name = name.toLowerCase();
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash.toLowerCase());
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    getQueryStringHref: function (name) {
        name = name.toLowerCase();
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href.toLowerCase());
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
};

var AJAXFunction = {
    ShowModal: function (placeholder, target) {
        $('#' + placeholder).removeData();
        $("body").addClass("loading");
        $('#' + placeholder).load(target, function () {
            $("body").removeClass("loading");
            $('#' + placeholder).modal("show");
        });
    },

    CallAjaxNoLoading: function (methodtype, url, methodname, data, callback, callbackError) {
        var datasend = JSON.stringify(data);
        $.ajax({
            type: methodtype,
            url: url + '/' + methodname,
            data: datasend,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.status_code === 406) {
                    Logout();
                    return;
                }
                if (common.existFunction(callback))
                    setTimeout(function () { callback(data); });
            },
            error: function (data) {
                if (common.existFunction(callbackError))
                    callbackError(data);
            },
            failure: function (response) {
                Common.Erroroccur();
            },
            async: true
        });
    },
    CallAjax: function (methodtype, url, methodname, data, callback, callbackError) {

        var datasend = JSON.stringify(data);
        $.ajax({
            type: methodtype,
            url: url + '/' + methodname,
            data: datasend,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $("body").addClass("loading");
            },
            success: function (data) {
                if (data.status_code === 410) {
                    Logout();
                    return;
                }
                setTimeout(function () {
                    if (common.existFunction(callback))
                        callback(data);
                });
                setTimeout(function () {
                    $("body").removeClass("loading");
                }, 1000);
            },
            error: function (data) {
                $("body").removeClass("loading");
                if (common.existFunction(callbackError))
                    callbackError(data);
            },

            failure: function (response) {
                Common.Erroroccur();
            },
            async: true
        });
    },

    CreateLinkPage: function (text, page, isCurrentPage, disabled, funclick) {
        var li = $('<li>');
        var a = $('<a href="javascript:void(0);">').append(text);
        li.append(a);
        a.attr('gotopage', page);
        if (!isCurrentPage) {
            a.click(function () {
                funclick($(this).attr('gotopage'));
            });
        }
        else {
            li.addClass("active");
        }
        if (disabled)
            li.addClass("disabled");
        return li;
    },
    CreatePaging: function (divpaging, curentpage, totalpage, funclick) {
        divpaging.empty();
        //if (totalpage > 1)
        {
            var ul = $('<ul class="pagination">');
            divpaging.append(ul);
            var i;
            curentpage = parseInt(curentpage);
            ul.append(AJAXFunction.CreateLinkPage($('<i class="fa fa-arrow-left">'), 1, false, curentpage <= 1, funclick));

            var temp = curentpage - 3 - (totalpage - curentpage > 3 ? 0 : (3 - (totalpage - curentpage)));
            if (temp < 1)
                temp = 1;
            for (i = temp; i <= temp + 6; i++) {
                if (i > totalpage) break;
                if (i >= 1) {
                    ul.append(AJAXFunction.CreateLinkPage(i, i, i == curentpage, false, funclick));
                }
            }
            ul.append(AJAXFunction.CreateLinkPage('<i class="fa fa-arrow-right"></i>', totalpage, false, curentpage >= totalpage, funclick));
        }
    },

    LoadUrl: function (url, showdata) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'html',
            cache: true,
            success: function (data) {
                if (common.existFunction(showdata))
                    showdata(data);
            },
            async: true
            //async:false = Code paused. (Other code waiting for this to finish.)
            //async:true = Code continued. (Nothing gets paused. Other code is not waiting.)
        });

        //console.log("ajax request sent");
    }
};

Array.prototype.contains = function (k) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === k) {
            return true;
        }
    }
    return false;
}


jQuery.validator.addMethod("positiveInteger", function (value, element, params) {
    return isPositiveInteger(value);
}), jQuery.validator.format('You must input a positive integer');


function confirmOKCancel(title, message, titlebuttonOK, titlebuttonCancel, callbackOK, callbackCancel) {
    var confirmModal = $('<div id="dialog_simple" style="margin-top: 20px; line-height: 25px;">');
    confirmModal.attr('title', title)
    confirmModal.append($('<p>').append(message));

    confirmModal.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        buttons: [{
            html: titlebuttonOK,
            width: 100,
            "class": "btn btn-primary",
            click: function () {
                if (common.existFunction(callbackOK))
                    callbackOK();
                $(this).dialog("close");
            }
        }, {
            html: titlebuttonCancel,
            width: 100,
            "class": "btn btn-default",
            click: function () {
                if (common.existFunction(callbackCancel))
                    callbackCancel();
                $(this).dialog("close");
            }
        }]
    });

    confirmModal.dialog('open');

}


function confirm(title, message, titlebuttonOK, titlebuttonCancel, callback, showModal) {
    if (showModal == undefined) {
        showModal = false;
    }
    if (!showModal) {
        callback();
        return;
    }
    confirmOKCancel(title, message, titlebuttonOK, titlebuttonCancel, callback);
}
function dialogbox(title, message, closefunction) {
    var confirmModal = $('<div id="dialog_simple" style="margin-top: 20px; line-height: 25px;">');
    confirmModal.attr('title', title)
    confirmModal.append($('<p>').append(message));

    confirmModal.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        buttons: [{
            html: "Đóng",
            width: 100,
            "class": "btn btn-primary",
            click: function () {
                $(this).dialog("close");
                if (common.existFunction(closefunction))
                    closefunction();
            }
        }]
    });

    confirmModal.dialog('open');
}

function alertBigBox(title, mes, typealert, timeout) {
    typealert = (typealert + "").toLowerCase();
    var color = "#296191";
    var icon = "fa-thumbs-up";
    switch (typealert) {
        case "success":
            color = "#8ac38b";
            icon = "fa-thumbs-up";
            break;
        case "info":
            color = "#9cb4c5";
            icon = "fa-info-circle";
            break;
        case "error":
            color = "#c26565";
            icon = "fa-times";
            break;
    }

    $.bigBox({
        title: title,
        content: mes,
        color: color,
        timeout: timeout,
        icon: "fa " + icon + " swing animated"
    });

}

function alertSmallBox(title, mes, typealert) {
    typealert = (typealert + "").toLowerCase();
    var color = "#296191";
    var icon = "fa-thumbs-up";
    switch (typealert) {
        case "success":
            color = "#8ac38b";
            icon = "fa-thumbs-up";
            break;
        case "info":
            color = "#9cb4c5";
            icon = "fa-info-circle";
            break;
        case "error":
            color = "#c26565";
            icon = "fa-times";
            break;
    }


    $.smallBox({
        title: title,
        content: (mes != "" ? "<i class='fa fa-clock-o'></i>" : "") + " <i>" + mes + "</i>",
        color: color,
        iconSmall: "fa " + icon + " bounce animated",
        timeout: 4000
    });
}
$(".btn").mouseup(function () {
    $(this).blur();
});

