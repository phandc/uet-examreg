/**
 * Created by locdt on 12/11/2016.
 */
var contextPath = $("form").attr('action');
var student_home_path = $('#student_home_path').val();
var HomeAction = {
    loadThesis: function () {
        $('#thesis-content').load(contextPath.replace("/ws/revision", "/student") + "/thesis/load", function () {
            initTypeahead();
        });
    },
    getThesisStatus: function () {
        var res;
        $.ajax({
            async: false,
            type: "GET",
            url: contextPath.replace("/ws/revision", "/student/thesis/status"),
            success: function (rsp, status) {
                res = rsp.data;
            }
        });
        return res;
    },
    createThesisRevision: function (thesisRevisionObj) {
        if (thesisRevisionObj != null) {
            $.ajax({
                data: JSON.stringify(thesisRevisionObj),
                type: 'POST',
                url: contextPath,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    window.location = student_home_path;
                }
            });
        }
    },
    cancelThesis: function (id) {
        $.ajax({
            url: contextPath.replace("revision", "thesis") + "/request-cancel/" + id,
            type: 'DELETE',
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function () {
                alert("cancel success");
                window.location = student_home_path;
            }
        });
    },
    loadAllSupervisorName: function () {
        var res;
        $.ajax({
            async: false,
            type: 'POST',
            url: contextPath.replace("/ws/revision", "/student/supervisor") + "/getData",
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
            },
            success: function (json) {
                res = json.data;
            }
        });

        return res;
    }
    // createEditRequest: function() {
    //     $.ajax({
    //         async: false,
    //         type: 'POST',
    //         url: contextPath.replace("/ws/revision", "/student/edit"),
    //         beforeSend: function (xhr) {
    //             var token = $("meta[name='_csrf']").attr("content");
    //             var header = $("meta[name='_csrf_header']").attr("content");
    //             xhr.setRequestHeader(header, token);
    //             xhr.setRequestHeader("Accept", "application/json");
    //             xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
    //         },
    //         success: function (json) {
    //             console.log(json);
    //         }
    //     });
    // }
}

var initTypeahead = function () {
    var data = HomeAction.loadAllSupervisorName();

    $("#mainSupEdit, #coSupEdit").typeahead({
        minLength: 0,
        source: data,
        displayText: function (item) {
            return item.degree + " " + item.name + " - Định mức: " + item.available_thesis + ' khóa luận';
        },
        afterSelect: function (item) {
            $('#' + this.$element.context.id + "Id").val(item.id);
        }
    });
}

var initViewData = function () {
    console.log($("#thesisTitle").text());
    console.log($("#thesisDesc").text());
    $("#thesisNameEdit").val($("#thesisTitle").text());
    $("#thesisDescEdit").val($("#thesisDesc").text());
    $("#mainSupEdit").val($("#mainSup").text());
    $("#coSupEdit").val($("#coSup").text());
}

$(document).ready(function () {
    /**
     * INIT PLUGIN FUNCTION
     */
    initTypeahead();
    initViewData();
    var status = HomeAction.getThesisStatus();
    console.log(status);
    var label = $("#label-status");
    switch (status.status_id) {
        case 101 :
            label.removeClass();
            label.addClass("label");
            break;
        case 201 :
            label.removeClass();
            label.addClass("label label-success");
            $("#btn-edit").show();
            $("#btn-cancel").show();
            break;
        case 202 :
            label.removeClass();
            label.addClass("label label-success");
            break;
        case 203 :
            label.removeClass();
            label.addClass("label label-info");
            break;
        case 302 :
        case 303 :
            label.removeClass();
            label.addClass("label label-warning");
            break;
        case 401 :
        case 402 :
            label.removeClass();
            label.addClass("label label-danger");
            break;
    }
    label.text(status.name);
    /**
     * ONCHANGE EVENT
     */
    $("#btn-edit").on("click", function() {
        // if (status == 201 || status == 202)
        //     HomeAction.createEditRequest(status);

        $(".edit-form-wrapper").slideToggle(300);
    });

    $("#btn-cancel").on("click", function() {
        $("#cancelModal").modal('show');
    })

    $("#coSupEdit").on("change", function() {
        if ($(this).val() == "")
            $("#coSupEditId").val("");
    })

    /**
     * ONCLICK AJAX ACTION
     */
    $("#requestCancel").on("click", function() {
        HomeAction.cancelThesis($("#thesisId").val());
    });

    $("form#thesisEdit").on('submit', function () {
        var valid = validateEditForm(this);
        if (valid == true) {
            var thesisRevisionObj = getThesisRevisionObjFromEditForm();
            console.log(thesisRevisionObj);
            HomeAction.createThesisRevision(thesisRevisionObj);
        }
        return false;
    });

    $.validator.addMethod("sv_not_same", function(value, element) {
        return $('#mainSupEditId').val() != $('#coSupEditId').val()
    }, "Giảng viên đồng hướng dẫn không là giảng viên chính");

    $("#thesisEdit").validate({
        rules: {
            thesisName: "required",
            thesisSv: "required",
            thesisDesc: "required",
            thesisCoSv: {
                sv_not_same: true
            }
        },
        messages: {
            thesisName: "Không được để trống ô này",
            thesisSv: "Không được để trống ô này",
            thesisDesc: "Không được để trống ô này"
        }
    });
});

function validateEditForm(form) {
    return $(form).valid();
}

function getThesisRevisionObjFromEditForm() {
    var thesisRevisionObj = {
        revision: {
            revision_id: null,
            thesis: {thesis_id: $("#thesisId").val()},
            title: $("#thesisNameEdit").val(),
            description: $("#thesisDescEdit").val(),
            first_supervisor: {supervisor_id: $("#mainSupEditId").val()},
            second_supervisor: $("#coSupEditId").val() == "" ? null : {supervisor_id: $("#coSupEditId").val()}
        },
        status: {status_id: 302}
    };
    console.log(thesisRevisionObj);
    return thesisRevisionObj;
}