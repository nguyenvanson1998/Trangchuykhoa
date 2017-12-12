

var userPage =
{
    currendId: ""
}
var priceMgr = {
    format: function (price) {
        return price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(".00", "").replace(/,/g, ".");
    }
}

var adsMgr = {
    loadAds: function () {
        var adsTop = storageMgr.read("ads-top");
        $("#place-ads-top").empty().append(adsTop);
        var adsLeft = storageMgr.read("ads-left");
        $("#place-ads-left").empty().append(adsLeft);
        var adsRight = storageMgr.read("ads-right");
        $("#place-ads-right").empty().append(adsRight);
        var adsHotNews = storageMgr.read("ads-hot-news");
        $("#place-ads-hot-news").empty().append(adsHotNews);

        AJAXFunction.CallAjaxNoLoading("get", "/admin/MgrAds", "loadads", {}, function (data) {
            if (data.success) {
                storageMgr.write("ads-top", data.data.top);
                storageMgr.write("ads-left", data.data.left);
                storageMgr.write("ads-right", data.data.right);
                storageMgr.write("ads-hot-news", data.data.hotnews);

                var adsTop = storageMgr.read("ads-top");
                $("#place-ads-top").empty().append(adsTop);
                var adsLeft = storageMgr.read("ads-left");
                $("#place-ads-left").empty().append(adsLeft);
                var adsRight = storageMgr.read("ads-right");
                $("#place-ads-right").empty().append(adsRight);
                var adsHotNews = storageMgr.read("ads-hot-news");
                $("#place-ads-hot-news").empty().append(adsHotNews);
            }
        });
    }
}

var fileMgr = {

    upload: function (fileData, showLoading, callBack, error) {
        var formData = new FormData();
        formData.append('file', fileData);
        $.ajax({
            type: 'POST',
            url: "/FileManager/Upload",
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data) {
                callBack(data);
            },
            error: function (data) {
                error(data);

            }
        });

        //if (showLoading)
        //{
        //    AJAXFunction.CallAjax("POST", "/FileManager", "Upload", formData, callBack,error,false,false);
        //}
        //else {
        //    AJAXFunction.CallAjaxNoLoading("POST", "/FileManager", "Upload", formData, callBack, error,false,false);
        //}
    },
    chooseFile: function (selector) {
        var id = selector.data("id");
        var divInput = $('.choose-file[data-id="' + id + '"]');
        divInput.click();

    },
    selectFile: function (selector) {
        var id = selector.data("id");
        var bindto = selector.data("bind-to");
        var selectoro_bindto = $(".slide-horizontal[data-id='" + bindto + "']");
        var max = selectoro_bindto.data("max");
        if (max == undefined)
            max = 0;
        var child = selectoro_bindto.find(".image-slide-post");
        if (max <= child.length && max != 0) {
            alertSmallBox("THÔNG BÁO", selectoro_bindto.data("msg-max"), "error");
            return;
        }
        for (var i = 0; i < selector[0].files.length; i++) {
            var filePath = URL.createObjectURL(selector[0].files[i]);
            var fileId = "image-slide-upload-" + filePath.substring(filePath.length - 5, filePath.length);
            var a = $('<a data-lightbox="image-1" class="image-slide-post" data-image-slide-url="" data-image-slide-url-thumbnail="">').attr("href", filePath).attr("id", fileId);
            a.append($(
                    '<label class="close" aria-label="Close">').data("id", id).append($('<span aria-hidden="true" class="model-close btn-remove-image">&times;</span></label>'))
                .click(function () {
                    var id = $(this).data("id");
                    $("input[type='file'][data-id='" + id + "']").val("");
                    slider.remove($(this));
                    return false;
                }));
            a.append($('<img alt="image" onerror="ImgError(this);" />').attr("src", filePath));
            selectoro_bindto.append(a);
            fileMgr.upload(selector[0].files[i], false, function (data) {
                if (data.success) {
                    var imageUrl = data.data[0].ImageUrl;
                    var thumbnailUrl = data.data[0].ThumbnailUrl;
                    $("#" + fileId + "").data('image-slide-url', imageUrl);
                    $("#" + fileId + "").data('image-slide-url-thumbnail', thumbnailUrl);
                } else {
                    $("#" + fileId + "").remove();
                }
            }, function (data) {
                $("#" + fileId + "").remove();
            });
        }
    },
    inputOnChange: function (selector) {
        var filetype = selector.data("file-type");
        if (filetype != undefined && selector[0].value != "") {
            var name = selector[0].value;
            var arr = filetype.split(',');
            var pass = false;
            for (var i = 0; i < arr.length; i++) {
                if (name.indexOf(arr[i]) > -1) {
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                selector[0].value = '';
                alertSmallBox("THÔNG BÁO", selector.data("file-type-message"), "error");
                return;
            }
        }
        var id = selector.data("id");
        var bindto = selector.data("bind-to");
        var selectoro_bindto = $("#" + bindto);
        for (var i = 0; i < selector[0].files.length; i++) {
            var filePath = URL.createObjectURL(selector[0].files[i]);
            selectoro_bindto.attr("src", filePath);
            selectoro_bindto.data("selected-image", true);
        }

    }
}

var pageMgr = {
    showRecentActivity: function (divListRecentPost) {
        if ($('#' + divListRecentPost).length === 0) {
            return;
        }

        AJAXFunction.CallAjaxNoLoading("Post",
            "/Post",
            "GetRecentActivity",
            { Page: 1, Size: 5 },
            function (data) {
                if (data.success) {
                    $('#' + divListRecentPost).html(data.data);
                    $('#' + divListRecentPost).parent().find(".header-list-item-recent-activity").show();
                    gaMgr.sendEventAutoCallAjax("get-recent-activity", userPage.currendId);
                }
            });
    },
    getNotificationUnreadCount: function () {
        AJAXFunction.CallAjaxNoLoading("Get",
            "/Notification",
            "GetCount",
            {},
            function (data) {
                if (data.success) {
                    gaMgr.sendEventAutoCallAjax("get-notification", userPage.currendId);
                    var countNotify = data.data;
                    $('.icon-notification-count').data('count', countNotify);
                    $('.icon-notification-count').text(countNotify);
                    if (countNotify > 0) {
                        $('.icon-notification-count').show();
                    } else {
                        $('.icon-notification-count').hide();
                    }
                    var countNotifyMessage = $('.icon-total-notification-message-count').data('count');
                    var totalNotify = countNotify + countNotifyMessage;
                    $('.icon-total-notification-count').data('count', totalNotify);
                    $('.icon-total-notification-count').text(totalNotify);
                    if (totalNotify > 0) {
                        $('.icon-total-notification-count').show();
                    } else {
                        $('.icon-total-notification-count').hide();
                    }
                } else {
                    $('.icon-notification-count').hide();
                    $('.icon-total-notification-count').hide();
                }
            });
    },
    showSlide: function (placeholder, placeslide) {
        AJAXFunction.CallAjaxNoLoading("GET", "/admin/mgrslide", "getslide/" + placeslide, {}, function (data) {
            if (data.success) {
                $("#" + placeholder).html(data.data).show();
            }
        });
    }
}

var postMgr =
    {
        showCreatePostModal: function (title) {
            AJAXFunction.CallAjax("POST", "/Post", "ShowCreatePost", { title: title }, function (data) {
                if (data.success) {
                    gaMgr.sendEventPost("post-show-create", userPage.currendId);
                    $("#modal-area").empty().append(data.data);
                    $("#modal-create-post").modal("show");
                }
            });
        },
        showEditPostModal: function (id) {
            AJAXFunction.CallAjax("POST", "/Post", "ShowEditPost", { id: id }, function (data) {
                if (data.success) {
                    gaMgr.sendEventPost("post-show-edit", id);
                    $("#modal-area").empty().append(data.data);
                    $("#modal-create-post").modal("show");
                } else {
                    alertSmallBox("THÔNG BÁO", data.message, "error");
                }

            });
        },
        actionRemovePost: function (selector, ispost) {
            var id = selector.data("id");
            confirm("Xác nhận!",ispost? "Bạn có chắc chắn xóa câu hỏi này":"Bạn có chắc chắn xóa bài viết này?", "Có", "Không", function () {
                postMgr.removePost(id);
            }, true);
        },
        removePost: function (id) {
            gaMgr.sendEventPost("post-remove", id);
            $(".dropdown-toggle[data-id='" + id + "']").modal('toggle');
            AJAXFunction.CallAjax("POST", "/Post", "/DeletePost", { postId: id }, function (data) {
                $(".modal-backdrop.in").remove();
                if (data.success) {
                    feedMgr.loadFirstPage("moi-nhat");
                    alertSmallBox("THÔNG BÁO", data.data, "success");
                } else {
                    var message = data.message;
                    if (message != "") {
                        alertSmallBox("THÔNG BÁO", message, "error");
                    } else {
                        alertSmallBox("THÔNG BÁO", data.message, "error");
                    }
                }

            });
        },
        likePost: function (selector) {
            var liked = Convert.toBoolWithAttr($(selector), "data-liked");
            var postId = $(selector).attr("data-id");

            var imgLike = $(selector).find("#imgLike");
            if (typeof imgLike === "undefined") {
                return;
            }
            $(selector).attr("data-liked", !liked);
            var likeCount = $(selector).attr("data-likecount");
            if (liked) {
                $(imgLike).attr("src", "/Resource/Image/post/unlike.svg");
                likeCount--;
                gaMgr.sendEventPost("post-unlike", postId);

            }
            else {
                $(imgLike).attr("src", "/Resource/Image/post/like.svg");
                likeCount++;
                gaMgr.sendEventPost("post-like", postId);
            }
            if (likeCount < 0)
                likeCount = 0;
            $(selector).attr("data-likecount", likeCount);
            var textLikeCount = $(selector).find("#number_like_count");
            textLikeCount.text(likeCount);

            AJAXFunction.CallAjaxNoLoading("Post", "/Post", "/LikePost", {
                "postId": postId
            }, function () { });
        },
        followPost: function (selector) {
            var follow = Convert.toBoolWithAttr($(selector), "data-follow");
            var postId = $(selector).attr("data-id");

            $(selector).attr("data-follow", !follow);
            if (follow) {
                gaMgr.sendEventPost("post-unfollow", postId);
                $(selector).text("Theo dõi");
                $(selector).removeClass("follow");
            }
            else {
                gaMgr.sendEventPost("post-follow", postId);
                $(selector).text("Bỏ theo dõi");
                $(selector).addClass("follow");
            }
            AJAXFunction.CallAjaxNoLoading("Post",
                "/Post",
                "FollowPost",
                { PostId: postId },
                function (data) {
                });
        },
        getPostCount: function () {
            AJAXFunction.CallAjaxNoLoading("GET", "/Post", "GetPostCounts", {}, function (data) {
                gaMgr.sendEventAutoCallAjax("get-post-count", "");
                try {
                    data = JSON.parse(data.data);
                    $('#icon-post-cout-question-of-day').data('count', data.NewPostCount);
                    $('#icon-post-cout-question-of-day').text(data.NewPostCount);
                    $('#icon-post-cout-question-not-assigned').data('count', data.UnclassifiedCount);
                    $('#icon-post-cout-question-not-assigned').text(data.UnclassifiedCount);
                    $('#icon-post-cout-question-assigned').data('count', data.DailyClassifiedCount);
                    $('#icon-post-cout-question-assigned').text(data.DailyClassifiedCount);
                } catch (e) {

                }
            });
        }
    }
var commentMgr =
{
    actionRemoveComment: function (selector) {
        var id = selector.data("id");
        var isSubComment = selector.data("is-subcomment");
        confirm("Xác nhận!", "Bạn có chắc chắn xóa bình luận này?", "Có", "Không", function () {

            commentMgr.removeComment(id, isSubComment);
        }, true);
    },
    removeComment: function (id, isSubComment) {
        gaMgr.sendEventPost("post-remove-comment", id);
        AJAXFunction.CallAjax("POST", "/Post", "/DeleteComment", { commentId: id, isSubcomment: isSubComment }, function (data) {
            $("body").removeClass("modal-open");
            if (data.success) {
                $(".item-comment[data-id='" + id + "']").remove();
                $(".item-sub-comment[data-id='" + id + "']").remove();
                alertSmallBox("THÔNG BÁO", "Xóa bình luận thành công", "success");
            } else {
                var message = data.message;
                if (message != "") {
                    alertSmallBox("THÔNG BÁO", message, "error");
                } else {
                    alertSmallBox("THÔNG BÁO", "Xóa bình luận không thành công", "error");
                }
            }

        });
    },
    showEditCommentBox: function (selector) {
        var commentBox = selector.data("comment");

        AJAXFunction.CallAjax("POST", "/Post", "/LoadEditCommentBox", { commentBox: commentBox }, function (data) {
            gaMgr.sendEventPost("post-show-edit-comment", commentBox);
            $("#modal-area").empty().append(data.data);
            $("#modal-edit-comment").modal("show");
        });
    },
    sendComment: function (selector) {
        var listImages = [];

        var dataId = selector.data("id");
        var content = $("textarea[data-id='" + dataId + "']").val();
        var maxLength = $("textarea[data-id='" + dataId + "']").data("max-length");
        if (maxLength != 0 && maxLength != undefined && maxLength < content.length) {
            alertSmallBox("THÔNG BÁO", "Vui lòng nhập nội dung không quá " + maxLength + " ký tự", "error");
            return;
        }
        var postId = selector.data("post-id");
        var commentId = selector.data("comment-id");
        var tempImage = $("[data-id='" + selector.data("image") + "']").find("a");


        ////Sub comment
        //if (commentId !== "") {
        tempImage.each(function (index, element) {
            if ($(this).data('image-slide-url') !== null && $(this).data('image-slide-url') !== "") {
                listImages.push({ ImageUrl: $(this).data('image-slide-url'), ThumbnailUrl: $(this).data('image-slide-url-thumbnail') });
            }
        });
        if (content.trim() == "" && listImages.length == 0) {
            alertSmallBox("THÔNG BÁO", "Vui lòng nhập nội dung bình luận", "error");
            $("textarea[data-id='" + dataId + "']").focus();
            return;
        }

        //}

        //if (listImages.length <= 0 && jQuery("textarea#" + divCommentContent).val() === "") {
        //    return;
        //}

        AJAXFunction.CallAjax("POST", "/Post", "CreateComment", {
            postId: postId,
            commentId: commentId,
            content: content,
            postAuthor: $("#view-detail-post").data("author"),
            listImages: listImages
        }, function (data) {
            if (data.success) {
                gaMgr.sendEventPost("post-send-comment", { postId: postId, commentId: commentId });

                $(".choose-file").val("");
                tempImage.remove();
                $("textarea[data-id='" + dataId + "']").val("");
                if (postId !== "") {
                    $("#list-comment-detail-post").append(data.data);
                }
                else {
                    $(".list-sub-comment[data-id='" + commentId + "']").append(data.data);
                }
                alertSmallBox("THÔNG BÁO", "Gửi bình luận thành công", "success");
            }
            else {
                alertSmallBox("THÔNG BÁO", "Gửi bình luận không thành công", "error");
            }
        });
    },
    editComment: function (selector) {

        var commentBox = selector.data("comment");

        var listImages = [];

        var dataId = selector.data("id");
        var content = $("textarea[data-id='" + dataId + "']").val();
        var postId = selector.data("post-id");
        var commentId = selector.data("comment-id");
        var tempImage = $("[data-id='" + selector.data("image") + "']").find("a");


        ////Sub comment
        //if (commentId !== "") {
        tempImage.each(function (index, element) {
            if ($(this).data('image-slide-url') !== null && $(this).data('image-slide-url') !== "") {
                listImages.push({ ImageUrl: $(this).data('image-slide-url'), ThumbnailUrl: $(this).data('image-slide-url-thumbnail') });
            }
        });
        if (content.trim() == "" && listImages.length == 0) {
            alertSmallBox("THÔNG BÁO", "Vui lòng nhập nội dung bình luận", "error");
            $("textarea[data-id='" + dataId + "']").focus();
            return;
        }

        //}

        //if (listImages.length <= 0 && jQuery("textarea#" + divCommentContent).val() === "") {
        //    return;
        //}

        AJAXFunction.CallAjax("POST", "/Post", "UpdateComment", {
            commentBox: commentBox,
            postId: postId,
            commentId: commentId,
            content: content,
            postAuthor: $("#view-detail-post").data("author"),
            listImages: listImages
        }, function (data) {

            if (data.success) {
                gaMgr.sendEventPost("post-edit-comment", { postId: postId, commentId: commentId });

                if (data.subcomment) {
                    var id = data.id;
                    $(".item-sub-comment[data-id='" + id + "']").replaceWith(data.data);
                }
                else {
                    var id = data.id;
                    $(".item-comment[data-id='" + id + "']").replaceWith(data.data);
                }
                alertSmallBox("THÔNG BÁO", "Chỉnh sửa bình luận thành công", "success");
                $("#modal-edit-comment").modal("hide");
            }
            else {
                var message = data.message;
                alertSmallBox("THÔNG BÁO", message != "" ? message : "Chỉnh sửa bình luận không thành công", "error");
            }
        });
    },
    markAsSolution: function (selector, idcommentlayout) {

        var _selector = $(selector);
        var id = _selector.data("id");
        var layout = $(".item-comment[data-id='" + id + "']");
        var hasSolution = layout.hasClass("solution");
        var message = "Bạn chỉ được chọn duy nhất một giải pháp. Bạn có muốn chọn lại không?";
        var showConfirm = false;
        gaMgr.sendEventPost("post-make-solution", id);

        if (!hasSolution) {
            if ($(".solution").length != 0) {
                message = "Bạn chỉ được chọn duy nhất một giải pháp. Bạn có muốn chọn lại không?";
                showConfirm = true;
            }
        } else {
            showConfirm = true;
            message = "Bạn có muốn bỏ chọn câu trả lời này làm giải pháp?";
        }

        confirm("Xác nhận!", message, "Có", "Không", function () {
            if (layout.hasClass("solution")) {
                //remove solution

                layout.removeClass("solution");
                $("#img_post_state").attr("src", "/Resource/Image/GiaiPhap_Mark_hide.png");
                var btn_solution = layout.find(".btn-mark-solution").attr("src", "/Resource/Image/GiaiPhap_Mark_hide.png");
                btn_solution.attr("title", "Đánh dấu bình luận này là giải pháp");
            }
            else {
                var currentSolution = $(".solution");
                var btn_solution = currentSolution.find(".btn-mark-solution").attr("src", "/Resource/Image/GiaiPhap_Mark_hide.png");
                btn_solution.attr("title", "Đánh dấu bình luận này là giải pháp");
                currentSolution.removeClass("solution");
                //mark solution
                layout.addClass("solution");
                btn_solution = layout.find(".btn-mark-solution").attr("src", "/Resource/Image/GiaiPhap_Mark.png");
                btn_solution.attr("title", "Bỏ chọn là giải pháp của bình luận này");
                $("#img_post_state").attr("src", "/Resource/Image/GiaiPhap_Mark.png");
                layout.find(".tip-has-mark-solution").text("Bạn đã chọn làm giải pháp");
            }
            var dataJson = {
                "CommentId": id
            }

            var data =
                {
                    "dataJson": JSON.stringify(dataJson)
                }
            $.ajax({
                type: "POST",
                url: "/Post/MarkSolutionPost",
                data: data,
                success: function (data) {
                    if (jQuery.parseJSON(jQuery.parseJSON(data).StatusCode) !== 200) {
                        alertSmallBox("THÔNG BÁO", jQuery.parseJSON(data).Content, "error");
                    }
                },
                error: function (err) {
                    console.log(err);
                },
                complete: function (e) {
                }
            });
        }, showConfirm);


    },
    showListComment: function (selector, divlistComment) {
        var id = selector.data("id");
        $(divlistComment + "[data-id='" + id + "']").show();
        $("textarea[data-id='" + id + "']").focus();
    },
    likeComment: function (selector) {

        var isSubComment = selector.data("is-subcomment") == "True" || selector.data("is-subcomment") == "true";

        var liked = Convert.toBoolWithAttr($(selector), "data-liked");
        var commentId = selector.attr("data-id");


        var imgLike = selector.find("#imgLike");
        if (typeof imgLike === "undefined") {
            return;
        }
        selector.attr("data-liked", !liked);
        var likeCount = selector.attr("data-likecount");
        if (liked) {
            imgLike.attr("src", "/Resource/Image/post/unlike.svg");
            likeCount--;
            if (isSubComment)
                gaMgr.sendEventPost("post-unlike-sub-comment", commentId);
            else
                gaMgr.sendEventPost("post-unlike-comment", commentId);
        }
        else {
            imgLike.attr("src", "/Resource/Image/post/like.svg");
            likeCount++;
            if (isSubComment)
                gaMgr.sendEventPost("post-like-sub-comment", commentId);
            else
                gaMgr.sendEventPost("post-like-comment", commentId);
        }
        if (likeCount < 0)
            likeCount = 0;
        selector.attr("data-likecount", likeCount);
        var textLikeCount = selector.find("#number_like_count");
        textLikeCount.text(likeCount);
        AJAXFunction.CallAjaxNoLoading("Post", "/Post", "/LikeComment", {
            "commentId": commentId,
            "isSubComment": isSubComment
        }, function () { });
    }
}

var message = {
    mailBoxForUser: function () {
        alertSmallBox("THÔNG BÁO", "Vui lòng nâng cấp tài khoản để sử dụng tính năng này", "Success");
    }
}

var feedMgr = {
    bytag: false,
    tag: "",
    loading: false,
    page: 1,
    size: 10,
    view: "new-feed",
    divResult: "",
    beginLoad: function () {
        feedMgr.loading = true;
        $("#get-post-loading").show();
    },
    endLoad: function () {
        feedMgr.loading = false;
        $("#get-post-loading").hide();
    },
    loadAjax: function (methodtype, url, methodname, data, callback) {
        var datasend = JSON.stringify(data);
        $.ajax({
            type: methodtype,
            url: url + '/' + methodname,
            data: datasend,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                feedMgr.beginLoad();
            },
            success: function (data) {
                feedMgr.endLoad();
                callback(data);
            },
            failure: function (response) {
                feedMgr.endLoad();
                if (feedMgr.page !== 1)
                    feedMgr.page--;
            },
            error: function (response) {
                feedMgr.endLoad();
                if (feedMgr.page !== 1)
                    feedMgr.page--;
            }
        });
    },
    loadFeed: function () {
        gaMgr.sendEventPost("post-load-feed", feedMgr.view);

        feedMgr.loadAjax("POST",
            "/Post",
            "RenderPartialView",
            {
                view: feedMgr.view,
                page: feedMgr.page,
                size: feedMgr.size,
                tag: feedMgr.tag,
                categoryId: feedMgr.category,
                userId: feedMgr.userId
            },
            function (data) {
                $("#get-post-loading").remove();
                if (data.success) {
                    if (data.data.trim() === "")
                        feedMgr.page--;
                    else {
                        if (feedMgr.page === 1) {
                            $('#' + feedMgr.divResult).html(data.data);
                        } else {
                            $('#' + feedMgr.divResult).append(data.data);
                        }
                    }
                } else {
                    if (feedMgr.page > 1)
                        feedMgr.page--;
                    alertSmallBox("THÔNG BÁO", data.message, "error");
                }
            });
    },
    load: function (view, divResult) {
        feedMgr.page = 1;
        feedMgr.view = view;
        feedMgr.divResult = divResult;
        feedMgr.loadFeed();

    },
    loadingProgress: $('<div id="get-post-loading" style="display:none; width:100%;">')
        .append($('<div style="margin: 0 auto; text-align:center;">')
            .append($(
                '<img src="/Resource/Image/loading2.gif" style="width: 80px;" />'))
            .append($('<p style="font-weight:bold;">').append('Đang tải'))),
    loadFirstPage: function (view, divResult, createUrl) {
        feedMgr.page = 1;
        if (divResult != undefined || feedMgr.divResult == undefined)
            feedMgr.divResult = divResult;
        if (feedMgr.divResult == undefined || feedMgr.divResult === "") {
            feedMgr.divResult = "list-post-new-feed";
        }
        $("#" + feedMgr.divResult).empty().append(this.loadingProgress);
        if (createUrl || createUrl == undefined) {
            if (view !== "tag-page") {
                window.history.replaceState({}, "Phòng Khám YKHN", "/tu-van-online/" + view);
            } else {
                window.history.replaceState({}, "Phòng Khám YKHN - Từ khóa", "/tu-khoa");
            }
        }
        feedMgr.view = view;
        feedMgr.loadFeed();
    }, loadPostByTag: function (tag) {
        window.history.replaceState({}, "Phòng Khám YKHN - Từ khóa", "/tu-khoa/" + tag);
        feedMgr.bytag = true;
        feedMgr.page = 1;
        feedMgr.divResult = 'list-post-new-feed';
        var view = 'post-list-question-by-tag';
        $("#" + feedMgr.divResult).empty().append(this.loadingProgress);
        feedMgr.tag = tag;
        feedMgr.view = view;
        feedMgr.loadFeed();

    }, loadPostByCategory: function (category) {
        window.history.replaceState({}, "Phòng Khám YKHN - Chuyên khoa", "/chuyen-khoa/" + category);
        feedMgr.page = 1;
        feedMgr.divResult = 'list-post-new-feed';
        var view = 'post-by-category';
        $("#" + feedMgr.divResult).empty().append(this.loadingProgress);
        feedMgr.category = category;
        feedMgr.view = view;
        feedMgr.loadFeed();
    }
}
var newsMgr = {
    loading: false,
    page: 1,
    size: 10,
    divResult: "",
    beginLoad: function () {
        newsMgr.loading = true;
        $("#get-post-loading").show();
    },
    endLoad: function () {
        newsMgr.loading = false;
        $("#get-post-loading").hide();
    },
    loadAjax: function (methodtype, url, methodname, data, callback) {
        var datasend = JSON.stringify(data);
        $.ajax({
            type: methodtype,
            url: url + '/' + methodname,
            data: datasend,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                newsMgr.beginLoad();
            },
            success: function (data) {
                newsMgr.endLoad();
                callback(data);
            },
            failure: function (response) {
                newsMgr.endLoad();
                if (newsMgr.page !== 1)
                    newsMgr.page--;
            },
            error: function (response) {
                newsMgr.endLoad();
                if (newsMgr.page !== 1)
                    newsMgr.page--;
            }
        });
    },
    loadFeed: function () {
        gaMgr.sendEventPost("news-load", newsMgr.view);

        newsMgr.loadAjax("POST",
            "/news",
            "LoadNews",
            {
                page: newsMgr.page,
                size: newsMgr.size
            },
            function (data) {
                $("#get-post-loading").remove();
                if (data.success) {
                    if (data.data.trim() === "")
                        newsMgr.page--;
                    else {
                        if (newsMgr.page === 1) {
                            $('#' + newsMgr.divResult).html(data.data);
                        } else {
                            $('#' + newsMgr.divResult).append(data.data);
                        }
                    }
                } else {
                    if (newsMgr.page > 1)
                        newsMgr.page--;
                    alertSmallBox("THÔNG BÁO", data.message, "error");
                }
            });
    },
    loadingProgress: $('<div id="get-post-loading" style="display:none; width:100%;">')
        .append($('<div style="margin: 0 auto; text-align:center;">')
            .append($(
                '<img src="/Resource/Image/loading2.gif" style="width: 80px;" />'))
            .append($('<p style="font-weight:bold;">').append('Đang tải'))),
    loadFirstPage: function (divResult) {
        newsMgr.page = 1;
        if (divResult != undefined || newsMgr.divResult == undefined)
            newsMgr.divResult = divResult;
        if (newsMgr.divResult == undefined || newsMgr.divResult === "") {
            newsMgr.divResult = "list-post-new-feed";
        }
        $("#" + newsMgr.divResult).empty().append(this.loadingProgress);
        newsMgr.loadFeed();
    }
}
var searchMgr = {
    lastestSearchTime: new Date(),
    showSearchBox: function () {

    },
    search: function (value, divListSuggestSearch, time) {
        divListSuggestSearch.data("time", time);
        AJAXFunction.CallAjaxNoLoading("Post", "/Post", "Search", { Page: 1, Size: 5, Keyword: value, time: time }, function (data) {
            if (data.success) {
                var time2 = data.time;
                if (time2 == divListSuggestSearch.data("time")) {
                    divListSuggestSearch.empty().append(data.data);
                    gaMgr.sendEventPost("post-search", value);
                }
            }
        });
    }
}

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

var Convert = {
    toBool: function (val) {
        if ((typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes')) || val === 1)
            return true;
        else if ((typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no')) || val === 0)
            return false;
        return null;
    },
    toBoolWithAttr(selector, attr) {
        var data = selector.attr(attr);
        return Convert.toBool(data);
    }
}

//Function delay timeout

//Function handle image load
var ImgError = function (source) {
    source.src = "/Resource/Image/default-placeholder.png";
    source.onerror = "Image";
    return true;
}


$(document).ready(function () {
    pageMgr.getNotificationUnreadCount();
});

//Function choose file show input
function chooseFile(divInputId) {
    var divInput = $('#' + divInputId);
    divInput.click();
}


////Function logout account
function Logout() {
    deleteAllCookies();
    localStorage.clear();
    location.href = "/Login/Logout";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

//Function show message upgrade account
function showMessageUpgradeaccount() {
    alertSmallBox("THÔNG BÁO", "Vui lòng nâng cấp tài khoản để sử dụng tính năng này", "error");
}

$.datepicker.regional['vi'] = {
    clearText: 'Effacer', clearStatus: '',
    closeText: 'Fermer', closeStatus: 'Fermer sans modifier',
    prevText: '&lt;Trước', prevStatus: 'Voir le mois précédent',
    nextText: 'Suiv&gt;', nextStatus: 'Voir le mois suivant',
    currentText: 'Courant', currentStatus: 'Voir le mois courant',
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    monthStatus: 'Xem tháng khác', yearStatus: 'Xem thêm một năm nữa',
    weekHeader: 'Sm', weekStatus: '',
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    dayStatus: 'Utiliser DD comme premier jour de la semaine', dateStatus: 'Choisir le DD, MM d',
    dateFormat: 'dd/mm/yyyy', firstDay: 0,
    initStatus: 'Chọn ngày', isRTL: false
};
$.datepicker.setDefaults($.datepicker.regional['vi']);