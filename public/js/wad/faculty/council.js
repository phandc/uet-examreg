/**
 * Created by dinht_000 on 12/10/2016.
 */
var contextPath = $("form").attr('action'),
renderPath = contextPath.replace("ws", "faculty"),
reviewerTable, thesisTable, checkBox,
councilFormValidate = false, addReviewerValidate = false,
councilId;

var export_council_path = $('#export_council_path').val();

var CouncilAction = {
    loadCouncils: function () {
        $('#councils-wrapper').load(renderPath + "/list/load", function () {
            thesisTable.destroy();
            reviewerTable.destroy();
            initThesisTable();
            initReviewerTable();
            initCheckBox();
            initTypeahead();
            initCouncilTypeahead();
        });
    },
    loadCouncilTable: function (id) {
        $("#reviewer-list-"+id).load(renderPath + "/reviewer/load?id=" + id, function () {
            reviewerTable.destroy();
            initReviewerTable();
            initCheckBox();
        });
    },
    loadCouncil: function (councilId) {
        $('#reviewer-list-' + councilId).load(renderPath + "/load?id=" + councilId, function () {
            reviewerTable.destroy();
            initReviewerTable();
            initCheckBox();
        });
    },
    createCouncil: function (obj) {
        if (obj != null) {
            $.ajax({
                data: JSON.stringify(obj),
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
                    CouncilAction.loadCouncils();
                }
            });
        }
    },
    loadAllSupervisorName: function () {
        var res;
        $.ajax({
            async: false,
            type: 'POST',
            url: contextPath.replace("/ws/council", "/student/supervisor") + "/getData",
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
    },
    loadSupervisorNameByCouncilId: function (id) {
        var res;
        $.ajax({
            async: false,
            type: 'GET',
            url: renderPath + "/supervisor/getData?id=" + id,
            success: function (rsp, status) {
                res = rsp.data;
            }
        });
        return res;
    },
    isSupervisorInCouncil: function (id) {
        var res;
        $.ajax({
            async: false,
            type: "GET",
            url: renderPath + "/supervisor?id=" + id,
            success: function (data, status) {
                console.log(res);
                res = data;
            }
        });
        return res;
    },
    addSupervisorToCouncil: function(obj) {
        if (obj != null) {
            $.ajax({
                data: JSON.stringify(obj),
                type: 'POST',
                url: renderPath + "/supervisor",
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    CouncilAction.loadCouncils();
                }
            });
        }
    },
    deleteCouncil: function (id) {
        $.ajax({
            url: contextPath + "/" + id,
            type: 'DELETE',
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function () {
                CouncilAction.loadCouncils();
            }
        });
    },
    deleteReviewerFromCouncil: function (id) {
        $.ajax({
            url: contextPath + "/supervisor/" + id,
            type: 'DELETE',
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function (res) {
                CouncilAction.loadCouncils();
            }
        });
    }
};

var StudentAction = {
    loadStudentInfo: function(elem, code) {
        $.ajax({
            async: false,
            type: "GET",
            url: renderPath + "/student/info?code=" + code,
            success: function (resp, status) {
                if (resp.data != null) {
                    $("#stdId" + councilId).val(resp.data.student_id);
                    $("#stdName" + councilId).val(resp.data.name);
                    $("#stdDob" + councilId).val(resp.data.dob_as_string);
                    $("#stdSpec" + councilId).val(resp.data.spec.name);
                }
            }
        });
    }
};

var ThesisAction = {
    loadThesisTable: function (councilId) {
        $('#thesis-list-' + councilId).load(renderPath + "/thesis/load?id=" + councilId, function () {
            thesisTable.destroy();
            initThesisTable();
            initCheckBox();
        });
    },
    loadThesisInfo: function(elem, id) {
        $.ajax({
            async: false,
            type: "GET",
            url: renderPath + "/thesis/info?std-id=" + id,
            success: function (resp, status) {
                if (resp.data != null) {
                    $("#thesisName" + councilId).val(resp.data.title);
                    $("#thesisId" + councilId).val(resp.data.thesis_id);
                    $("#thesisSup" + councilId).val(resp.data.first_supervisor.degree + " " + resp.data.first_supervisor.name);
                    $("#thesisSupId" + councilId).val(resp.data.first_supervisor.id);

                    if (resp.data.second_supervisor != null) {
                        $("#thesisCoSup" + councilId).val(resp.data.second_supervisor.degree + " " + resp.data.second_supervisor.name);
                        $("#thesisCoSupId" + councilId).val(resp.data.second_supervisor.id);
                    }
                }
            }
        });
    },
    addThesisToCouncil: function (obj) {
        if (obj != null) {
            $.ajax({
                data: JSON.stringify(obj),
                type: 'POST',
                url: contextPath + "/thesis",
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    CouncilAction.loadCouncils();
                }
            });
        }
    }
}

function initReviewerTable() {
    reviewerTable = $('.reviewer_table').DataTable({
        ordering: false,
        // columns: [
        //     { "width": "5%" },
        //     { "width": "40%" },
        //     { "width": "45%" },
        //     { "width": "10%" }
        // ],
        pageLength: 25,
        responsive: true,
        dom: '<"toolbar">frtip',
        oLanguage: {
            "sSearch": "Tìm kiếm:",
            "oPaginate": {
                "sFirst": "Trang đầu",
                "sNext": "Sau",
                "sPrevious": "Trước",
                "sLast": "Trang cuối"
            },
            "sInfo": "Hiện từ giảng viên thứ _START_ đến _END_ trong tổng số _TOTAL_ giảng viên",
            "sLengthMenu": "Hiện _MENU_ giảng viên"
        }
    });
}

function initThesisTable() {
    thesisTable = $('.thesis_table').DataTable({
        ordering: false,
        pageLength: 25,
        responsive: true,
        dom: '<"toolbar">frtip',
        oLanguage: {
            "sSearch": "Tìm kiếm:",
            "oPaginate": {
                "sFirst": "Trang đầu",
                "sNext": "Sau",
                "sPrevious": "Trước",
                "sLast": "Trang cuối"
            },
            "sInfo": "Hiện từ đề tài thứ _START_ đến _END_ trong tổng số _TOTAL_ đề tài",
            "sLengthMenu": "Hiện _MENU_ đề tài"
        }
    });
}

function initCheckBox() {
    checkBox = $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $("[name='cbox-total']").on('ifChecked', function() {
        $('input').iCheck('check');
    });

    $("[name='cbox-total']").on('ifUnchecked', function() {
        $('input').iCheck('uncheck');
    });
}

var initCouncilTypeahead = function () {
    $(".firstReviewer, .secondReviewer").each(function() {
        var tempCouncilId = $(this).closest(".council-content").find(".council-id").val();
        var councilData = CouncilAction.loadSupervisorNameByCouncilId(tempCouncilId);

        $(this).typeahead({
            minLength: 0,
            source: councilData,
            displayText: function (item) {
                return item.degree + " " + item.name;
            },
            afterSelect: function (item) {
                var dom = this.$element[0],
                    className = dom.className.split(" "),
                    jClass = "", jHiddenClass = "",
                    jId = dom.id == "" ? "" : "#" + dom.id;

                if (jId != "") {
                    jHiddenClass = jId + "Id";
                }
                else {
                    jHiddenClass = "." + className[0] + "Id";
                }

                for (var i = 0; i < className.length; i++) {
                    jClass += "." + className[i];
                }
                if (jHiddenClass == ".firstReviewerId" || jHiddenClass == ".secondReviewerId") {
                    jHiddenClass = jHiddenClass.replace(".", "#");
                    jHiddenClass += councilId;
                }

                (this.$element).siblings(jHiddenClass).val(item.id);
            }
        });
    });
}

var initTypeahead = function () {
    var data = CouncilAction.loadAllSupervisorName();
    $("#president, #secretary, .reviewer, .addReviewer").typeahead({
        minLength: 0,
        source: data,
        displayText: function (item) {
            return item.degree + " " + item.name;
        },
        afterSelect: function (item) {
            var dom = this.$element[0],
                className = dom.className.split(" "),
                jClass = "", jHiddenClass = "",
                jId = dom.id == "" ? "" : "#" + dom.id;

            if (jId != "") {
                jHiddenClass = jId + "Id";
            }
            else {
                jHiddenClass = "." + className[0] + "Id";
            }

            for (var i = 0; i < className.length; i++) {
                jClass += "." + className[i];
            }
            if (jHiddenClass == ".firstReviewerId" || jHiddenClass == ".secondReviewerId") {
                jHiddenClass = jHiddenClass.replace(".", "#");
                jHiddenClass += councilId;
            }

            console.log(jHiddenClass);
            (this.$element).siblings(jHiddenClass).val(item.id);
        }
    });
};

$(document).ready(function() {
    /**
     * INIT FUNCTION
     */
    initCheckBox();
    initThesisTable();
    initReviewerTable();
    initTypeahead();
    initCouncilTypeahead();
    /**
     * ONCLICK FUNCTION
     */
    $(document).on('click', '.crt-council-title-btn', function (e) {
        var iChild = $(this).children().first();
        if (iChild.hasClass("fa-plus")) {
            iChild.removeClass("fa-plus");
            iChild.addClass("fa-minus");
        }
        else if (iChild.hasClass("fa-minus")) {
            iChild.removeClass("fa-minus");
            iChild.addClass("fa-plus");
        }

        $('.crt-council-content').slideToggle(300);
    });

    $(document).on('click', '.add-thesis-title-btn', function() {
        var iChild = $(this).children().first();
        if (iChild.hasClass("fa-plus")) {
            iChild.removeClass("fa-plus");
            iChild.addClass("fa-minus");
        }
        else if (iChild.hasClass("fa-minus")) {
            iChild.removeClass("fa-minus");
            iChild.addClass("fa-plus");
        }

        $('.add-thesis-content').slideToggle(300);
    });

    $(document).on("click", ".crt-reviewer-title-btn", function() {
        var iChild = $(this).children().first();
        if (iChild.hasClass("fa-plus")) {
            iChild.removeClass("fa-plus");
            iChild.addClass("fa-minus");
        }
        else if (iChild.hasClass("fa-minus")) {
            iChild.removeClass("fa-minus");
            iChild.addClass("fa-plus");
        }

        $('.add-reviewer-content').slideToggle(300);
    });

    $(document).on('click', ".add-reviewer-btn", function(){
        var html = "<div class='row'>" +
                        "<div class='form-group col-md-12'>" +
                            "<label for='reviewerName'>Cán bộ phản biện:</label>" +
                            "<div>" +
                                "<input class='reviewer form-control' name='reviewerName'" +
                                    "placeholder='Nhập tên giảng viên' type='text'" +
                                    "autocomplete='false'>" +
                                "<input type='hidden' class='reviewerId'>" +
                            "</div>" +
                        "</div>" +
                    "</div>";
        console.log("asdasd");
        $(".add-reviewer").before(html);
        initTypeahead();
    });

    $("#councils-wrapper").on("click", ".fa-trash", function() {
        var rowElem = $(this).parent().parent();
        $("#reviewerIdDel").val(rowElem.find(".reviewerId").val());

        $("#removeConfirmReviewerModal").modal('show');
    });

    $(".council-content").on("click", function() {
        councilId = $(this).find(".council-id").val();
        console.log(councilId);
    });

    $("#councils-wrapper").on("click", ".delete-council", function() {
        councilId = $(this).closest(".council-content").find(".council-id").val();
        $("#councilIdDel").val(councilId);
        $("#removeConfirmCouncilModal").modal("show");
    })
    /**
     * ONCHANGE FUNCTION
     */
    $(document).on("change", ".stdCode", function() {
        councilId = $(this).closest(".council-content").find(".council-id").val();
        StudentAction.loadStudentInfo(this, $(this).val());
        ThesisAction.loadThesisInfo(this, $(this).closest(".row").find("#stdId" + councilId).val());
    });

    $(document).on("change", ".addReviewer", function() {
        var idElem = $(this).closest(".row").find(".addReviewerId");
        if ($(this).val() == "") idElem.val("");

        var val = idElem.val();
        var labelMes = $(this).siblings("#addReviewer-message-" + councilId);
        var isInCouncil = (val == undefined || val == "" || val == null) ? false : CouncilAction.isSupervisorInCouncil(idElem.val());
        var jParent = $(this).closest(".form-group");

        if ((val == undefined || val == "" || val == null) && isInCouncil == false) {
            console.log("adasda");
            addReviewerValidate = false;
            labelMes.text("Tên giảng viên không hợp lệ.")
            labelMes.removeClass();
            labelMes.addClass("error");

            if (jParent.hasClass("has-success") || !jParent.hasClass("has-error")) {
                console.log("adasdafjeij");
                jParent.removeClass("has-success");
                jParent.addClass("has-error");
            }
        }
        if (val != undefined && val != "" && val != null) {
            if (isInCouncil == true) {
                console.log("here")
                addReviewerValidate = false;
                labelMes.text("Giảng viên đã ở trong hội đồng.")
                labelMes.removeClass();
                labelMes.addClass("error");

                if (jParent.hasClass("has-success") || !jParent.hasClass("has-error")) {
                    jParent.removeClass("has-success");
                    jParent.addClass("has-error");
                }
            }
            else {
                councilFormValidate = true;
                labelMes.text("");
                var jParent = $(this).closest(".form-group");
                if (jParent.hasClass("has-error") || !jParent.hasClass("has-success")) {
                    jParent.removeClass("has-error");
                    jParent.addClass("has-success");
                }
            }
        }


    });

    $("#president").on("change", function() {
        if ($(this).val() == "") {
            $("#presidentId").val("");
        }
        else {
            var isInCouncil = CouncilAction.isSupervisorInCouncil($("#presidentId").val());
            if (isInCouncil == true) {
                councilFormValidate = false;
                var jParent = $(this).closest(".form-group");
                if (jParent.hasClass("has-success") || !jParent.hasClass("has-error")) {
                    jParent.removeClass("has-success");
                    jParent.addClass("has-error");
                }
            }
            else {
                councilFormValidate = true;
                var jParent = $(this).closest(".form-group");
                if (jParent.hasClass("has-error") || !jParent.hasClass("has-success")) {
                    jParent.removeClass("has-error");
                    jParent.addClass("has-success");
                }
            }
        }
    })

    /**
     * AJAX FUNCTION
     */
    $("form#createForm").on("submit", function() {
        if (councilFormValidate == true) {
            var obj = getNewCouncilObj();
            console.log(obj);
            CouncilAction.createCouncil(obj);
        }
        return false;
    });

    $(document).on("click", "#del-reviewer-btn", function() {
        CouncilAction.deleteReviewerFromCouncil($("#reviewerIdDel").val());
    });

    $(document).on("click", ".add-thesis-btn", function() {
        var obj = getThesisObj();
        ThesisAction.addThesisToCouncil(obj);
    });

    $(document).on("click", ".add-reviewer-accept-btn", function () {
        var obj = getNewReviewerObj($(this))
        CouncilAction.addSupervisorToCouncil(obj);
    });

    $(document).on("click", "#del-council-btn", function() {
        CouncilAction.deleteCouncil($("#councilIdDel").val());
    })

    $("#council_export_btn").click(function() {
        $.ajax({
            url: export_council_path,
            type: "GET",
            success: function() {
                window.location = export_council_path;
            }
        });
    });
});

function getNewCouncilObj() {
    var reviewerList = [];

    $(".reviewerId").each(function() {
        console.log("Found!");
        var reviewerObj = {
            supervisor_id: $(this).val(),
            user: null,
            supervisor_code: null,
            name: null,
            degree: null,
            department: null,
        };
        reviewerList.push(reviewerObj);
    });

    console.log("length: " + reviewerList.length);

    var obj = {
        council_id: null,
        council_name: $('#councilName').val(),
        location: $('#location').val(),
        president: {supervisor_id: $("#presidentId").val()},
        secretary: {supervisor_id: $("#secretaryId").val()},
        reviewer: reviewerList
    };
    console.log(JSON.stringify(obj));
    return obj;
};

function getThesisObj() {
    var thesisObj = {
        thesis_id: $("#thesisId" + councilId).val(),
        first_reviewer: {supervisor_id: $("#firstReviewerId" + councilId).val()},
    };
    if ($("#secondReviewerId" + councilId).val() != '') {
        thesisObj['second_reviewer'] = {supervisor_id: $("#secondReviewerId" + councilId).val()};
    }
    return thesisObj;
}

function getNewReviewerObj(elem) {
    var obj = {
        supervisor_id : elem.closest(".row").find(".addReviewerId").val(),
        council: {council_id: councilId}
    }
    console.log(obj);
    return obj;
}