/**
 * Created by locdt on 12/11/2016.
 */
var contextPath = $("form").attr('action');
var student_home_path = $('#student_home_path').val();

var RegistryAction = {
    createThesis: function (thesisObj) {
        if (thesisObj != null) {
            $.ajax({
                data: JSON.stringify(thesisObj),
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
    loadAllSupervisorName: function () {
        var res;
        $.ajax({
            async: false,
            type: 'POST',
            url: contextPath.replace("/ws/thesis", "/student/supervisor") + "/getData",
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
}

var initTypeahead = function () {
    var data = RegistryAction.loadAllSupervisorName();

    $("#thesisSv, #thesisCoSv").typeahead({
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

$(document).ready(function () {
    /**
     * INIT PLUGIN FUNCTION
     */
    initTypeahead();

    /**
     * ONCHANGE EVENT
     */
    $(".student-input").on("change", ".thesis-std", function () {
        RegistryAction.getStudentByCode($(this));
    });

    $("#thesisCoSv").on("change", function() {
        if ($(this).val() == "")
            $("#thesisCoSvId").val("");
    })

    /**
     * ONCLICK AJAX ACTION
     */
    $("form#thesisRegistry").on('submit', function () {
        var valid = validateRegistryForm(this);
        if (valid == true) {
            var thesisObj = getThesisObjFromRegistryForm();
            RegistryAction.createThesis(thesisObj);
        }
        return false;
    });

    $.validator.addMethod("sv_not_same", function(value, element) {
        return $('#thesisSvId').val() != $('#thesisCoSvId').val()
    }, "Giảng viên đồng hướng dẫn không là giảng viên chính");

    $("#thesisRegistry").validate({
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

function validateRegistryForm(form) {
    return $(form).valid();
}

function getThesisObjFromRegistryForm() {
    var thesisObj = {
        thesis_id: null,
        title: $("#thesisName").val(),
        description: $("#thesisDesc").val(),
        status: {status_id: 101},
        student: {student_id: $("#thesisStdId").val()},
        mainSupervisor: {supervisor_id: $("#thesisSvId").val()},
        coSupervisor: $("#thesisCoSvId").val() == "" ? null : {supervisor_id: $("#thesisCoSvId").val()},
        english_type: $("#englishType").val()
    }
    // console.log(thesisObj);
    return thesisObj;
}