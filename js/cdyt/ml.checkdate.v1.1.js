Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [
        (dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm, this.getFullYear()
    ].join('/');
};

Date.prototype.getAge = function () {
    var date = new Date();
    if (date.getFullYear() < this.getFullYear())
        return 0;
    if (date.getFullYear() === this.getFullYear())
        return 1;
    return  date.getFullYear() - this.getFullYear();
};

(function ($) {

    jQuery.fn.extend({
        checkDate: function (o) {
            var selector = this.filter("input");
            var callback, maxdate, mindate;
            if (o != undefined) {
                callback = o.callback;
                maxdate = o.maxdate;
                mindate = o.minDate;
            }
            selector.on("blur", function () {
                fixDate($(this), callback, maxdate, mindate);
            });
            return this;
        }
    });

    jQuery.fn.extend({
        checkdate: jQuery.fn.checkDate
    });

})(jQuery);

function checkLeapYear(_day, _month, _year) {
    day = parseInt(_day);
    month = parseInt(_month);
    year = parseInt(_year);
    if ((year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
        if (month == 2 && month > 29)
            return false;
        return true;
    } else {
        if (month == 2 && day > 28)
            return false;
    }
    return true;
}


function fixDate(selector, callback, max_Date, min_Date) {
    try {
        if (selector.val().trim() === "")
            return;
        var text = selector.val().trim();
        var _date = new Date(text);
        var invalid = true;
        if (_date == "Invalid Date" || text.length <= 10) {
            var year = new Date().getFullYear();
            var date = "";
            if (text.length === 4) {
                selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + year);
                return fixDate(selector, callback, max_Date, min_Date);
            } else if (text.length === 5) {
                selector.val(text[0] + text[1] + "/" + text[3] + text[4] + "/" + year);
                return fixDate(selector, callback, max_Date, min_Date);
            } else
                if (text.length === 6) {
                    var year = new Date().getFullYear();
                    if (parseInt(year.toString().substr(-2)) < parseInt(text[4] + text[5])) {
                        selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + (parseInt(year.toString().substr(0, 2)) - 1) + text[4] + text[5]);
                        return fixDate(selector, callback, max_Date, min_Date);
                    } else {
                        selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + year.toString().substr(0, 2) + text[4] + text[5]);
                        return fixDate(selector, callback, max_Date, min_Date);
                    }
                } else
                    if (text.length === 8) {
                        if (text.indexOf("/") != -1) {
                            selector.val(text.replace(/\//g, ''));
                            return fixDate(selector, callback, max_Date, min_Date);
                        } else {
                            selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" +
                                text[4] +
                                text[5] +
                                text[6] +
                                text[7]);

                            return fixDate(selector, callback, max_Date, min_Date);
                        }
                    } else
                        if (text.length === 10) {
                            invalid = checkLeapYear(text[0] +
                                text[1],
                                text[3] +
                                text[4],
                                text[6] +
                                text[7] +
                                text[8] +
                                text[9]);

                            date = text[3] +
                                text[4] +
                                "/" +
                                text[0] +
                                text[1] +
                                "/" +
                                text[6] +
                                text[7] +
                                text[8] +
                                text[9];
                        }
                        else
                            if (text.length === 7) {
                                date = "";
                            }

                            else {
                                var temp = text.split("/");
                                selector.val(temp[0][0] + temp[0][1] + "/" + temp[1][0] + temp[1][1] + "/" +
                                    temp[2][0] +
                                    temp[2][1] +
                                    temp[2][2] +
                                    temp[2][3]);
                                return fixDate(selector, callback, max_Date, min_Date);
                            }

            var _date = new Date(date);
            if (_date == "Invalid Date" || !invalid) {
                selector.val("");
                alertSmallBox("THÔNG BÁO", "Vui lòng nhập đúng định dạng ngày", "error");
            } else {
                if (min_Date != undefined && _date < min_Date) {
                    selector.val("");
                    alertSmallBox("THÔNG BÁO", "Vui lòng nhập ngày lớn hơn " + min_Date.ddmmyyyy(), "error");
                    return;
                }
                if (max_Date != undefined && _date > max_Date) {
                    selector.val("");
                    alertSmallBox("THÔNG BÁO", "Vui lòng nhập ngày nhỏ hơn " + max_Date.ddmmyyyy(), "error");
                    return;
                }
                selector.val(_date.ddmmyyyy());
                if (callback != undefined)
                    callback();
            }
        } else {
            if (min_Date != undefined && _date < min_Date) {
                selector.val("");
                alertSmallBox("THÔNG BÁO", "Vui lòng nhập ngày lớn hơn " + min_Date.ddmmyyyy(), "error");
                return;
            }
            if (max_Date != undefined && _date > max_Date) {
                selector.val("");
                alertSmallBox("THÔNG BÁO", "Vui lòng nhập ngày nhỏ hơn " + max_Date.ddmmyyyy(), "error");
                return;
            }
            selector.val(_date.ddmmyyyy());
            if (callback != undefined)
                callback();
        }
    } catch (e) {
        selector.val("");
        alertSmallBox("THÔNG BÁO", "Vui lòng nhập đúng định dạng ngày ", "error");
    }
}