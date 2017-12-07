
/**
 * 带文件上传的ajax表单提交
 * @param {Object} form
 * @param {Object} callback
 */
function iframeCallback(form, callback) {
    var $form = $(form), $iframe = $("#callbackframe");
    if ($iframe.size() == 0) {
        $iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
    }
    if (!form.ajax) {
        $form.append('<input type="hidden" name="ajax" value="1" />');
    }
    form.target = "callbackframe";
    _iframeResponse($iframe[0], callback || DWZ.ajaxDone);
}
function _iframeResponse(iframe, callback) {
    var $iframe = $(iframe), $document = $(document);
    $document.trigger("ajaxStart");
    $iframe.bind("load", function (event) {
        $iframe.unbind("load");
        $document.trigger("ajaxStop");
        if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
			iframe.src == "javascript:'<html></html>';") { // For FF, IE
            return;
        }
        var doc = iframe.contentDocument || iframe.document;
        // fixing Opera 9.26,10.00
        if (doc.readyState && doc.readyState != 'complete') return;
        // fixing Opera 9.64
        if (doc.body && doc.body.innerHTML == "false") return;

        var response;

        if (doc.XMLDocument) {
            // response is a xml document Internet Explorer property
            response = doc.XMLDocument;
        } else if (doc.body) {
            try {
                response = $iframe.contents().find("body").text();
                response = jQuery.parseJSON(response);
            } catch (e) { // response is html document or plain text
                response = doc.body.innerHTML;
            }
        } else {
            // response is a xml document
            response = doc;
        }
        callback(response);
    });
}
function AjaxReplace(form, rel, callback) {
    var $form = $(form);
    if (rel) {
        var _callback = callback;
        if (!$.isFunction(callback)) _callback = eval('(' + callback + ')');
        var $box = $("#" + rel);
        $box.ajaxReplace({
            type: "POST", url: $form.attr("action"), data: $form.serializeArray(), callback: function () {
                if (_callback) _callback;
            }
        });
    }
    return false;
}
(function ($) {
    $.fn.extend({
        ajaxReplace: function (op) {
            var $this = $(this);
            $.ajax({
                type: op.type || 'GET',
                url: op.url,
                data: op.data,
                cache: false,
                success: function (response) {
                    var json = vk.jsonEval(response);
                    if (op.loadmore) { $this.append(response); } else
                        $this.html(response);
                    if ($.isFunction(op.callback)) op.callback(response);
                    else if ($.type(op.callback) == "string") eval(op.callback);
                },
                error: function (data) {
                    op.callback(data);
                },
                statusCode: {
                    503: function (xhr, ajaxOptions, thrownError) {
                        //layer.msg("服务器当前负载过大或者正在维护!" || thrownError);
                    }
                }
            });
        }
    });

    var vk = {

        jsonEval: function (data) {
            try {
                if ($.type(data) == 'string')
                    return eval('(' + data + ')');
                else return data;
            } catch (e) {
                return {};
            }
        },
    }

})(jQuery)
