/**
 * Created by dinht_000 on 10/30/2016.
 */
var contextPath = $("form").attr('action');
var viewPath = $("#rendered_view_path").val();
var dataTable, checkBox;
var SupervisorAction = {
    loadSupervisors: function () {
        $('#supervisor-list').load(viewPath + "/list/load", function () {
            dataTable.destroy();
            initDataTable();
            initCheckBox();
        });

    },
    update: function (supervisorObj) {
        if (supervisorObj != null) {
            $.ajax({
                data: JSON.stringify(supervisorObj),
                type: 'POST',
                url: contextPath + "/" + supervisorObj.supervisor_id,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    SupervisorAction.loadSupervisors();
                }
            });
        }
        else {
            console.log("Lỗi xảy ra SupervisorAction.update()")
        }
    },
    createSupervisor: function (supervisorObj) {
        if (supervisorObj != null) {
            $.ajax({
                data: JSON.stringify(supervisorObj),
                type: 'POST',
                url: contextPath,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    SupervisorAction.loadSupervisors();
                }
            });
        }
        else {
            console.log("Lỗi xảy ra SupervisorAction.createSupervisor() ")
        }
    },
    delete: function (id) {
        $.ajax({
            url: contextPath + "/" + id,
            type: 'DELETE',
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function () {
                SupervisorAction.loadSupervisors();
            }
        });
    },
    deleteMultiple: function (ids) {
        for (var i = 0; i < ids.length; i++) {
            $.ajax({
                url: contextPath + "/" + ids[i],
                type: 'DELETE',
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                },
                success: function () {
                    SupervisorAction.loadSupervisors();
                }
            });
        }
    },
    getClassId: function (szClassName, storeElem) {
        $.ajax({
            type: "GET",
            url: contextPath + "/class?name=" + szClassName,
            success: function (data, status) {
                storeElem.val(data);
            }
        })
    }
};

var DepartAction = {
    loadDepartList: function () {
        $('#svDepart').load(viewPath + "/department/list");
    },
    createDepart: function (departObj) {
        if (departObj != null) {
            $.ajax({
                data: JSON.stringify(departObj),
                type: 'POST',
                url: contextPath.replace('supervisor', 'department'),
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    DepartAction.loadDepartList();
                }
            });
        }
        else {
            console.log("Lỗi");
        }
    },
};

function initDataTable() {
    dataTable = $('#supervisor-table').DataTable({
        ordering: false,
        aoColumnDefs: [
            {'bSortable': false, 'aTargets': [0, 6]},
        ],
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

    $("div.toolbar").html('<div class="pull-left">' +
        '<button class="btn btn-primary" type="button" data-toggle="modal" data-target="#mail_modal"><i class="fa fa-envelope"></i> Gửi mail</button>&nbsp&nbsp' +
        '<button id="delete_multiple" class="btn btn-danger" type="button"><i class="fa fa-trash"></i> Xóa</button>' +
        '</div>'
    );

    $("#delete_multiple").click(function() {
        var rows = $("#supervisor-table > tbody tr").toArray();
        var deletedIds = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].children[1].children[0].classList.contains("checked"))
                deletedIds.push(rows[i].children[0].value);
        }
        if (deletedIds.length == 0) {
            alert('Bạn phải chọn ít nhất một hàng');
        }
        SupervisorAction.deleteMultiple(deletedIds);
    });

    // filters
    $('#supervisor-table tfoot th').each(function() {
        var title = $(this).text();
        if (title !== "")
            $(this).html('<input style="width:100%" type="text"/>');
    });

    dataTable.columns().every(function() {
        var that = this;
        $('input', this.footer()).on('keyup change', function() {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
};

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

$(document).ready(function () {
    /**
     * INIT ACTION WHEN PAGE LOADED
     */
    $('.crt-sv-content').hide();
    initDataTable();
    initCheckBox();
    /**
     * RUN PLUGINS FOR ELEMENTS
     */

    var myDropzone1 = new Dropzone("#dropzoneForm1", {
        url: $('#dropzoneForm1').attr('action'),
        /*acceptedFiles: "application/vnd.ms-excel",*/
        paramName: "file",
        dictDefaultMessage: "<p>Thả file excel chứa thông tin giảng viên vào đây.</p>",
        autoProcessQueue: false,
        queuecomplete: function (rsp) {
            alert("upload successfully");
            SupervisorAction.loadSupervisors();
        }
    });

    $('#dropzone-button1').on('click', function (e) {
        e.preventDefault();
        myDropzone1.processQueue();
    });

    $('.crt-sv-title-btn').on('click', function (e) {
        console.log("asdad");
        var iChild = $(this).children().first();
        if (iChild.hasClass("fa-plus")) {
            iChild.removeClass("fa-plus");
            iChild.addClass("fa-minus");
        }
        else if (iChild.hasClass("fa-minus")) {
            iChild.removeClass("fa-minus");
            iChild.addClass("fa-plus");
        }

        $('.crt-sv-content').slideToggle(300);
    })

    /**
     * MODALS HANDLER
     */
    $('#crt-depart-btn-modal').on("click", function () {
        $('#createDepartModal').modal('show');
    });

    $('#supervisor-list').on("click", ".fa-pencil", function () {
        $('#editSupervisorModal').modal('show');

        var rowElem = $(this).parent().parent();

        $('#svIdEdit').val(rowElem.find(".svId").val());
        $('#svCodeEdit').val(rowElem.find(".svCode").text());
        console.log($('#svCodeEdit').val());
        $('#svNameEdit').val(rowElem.find(".svName").text());
        $('#svDegreeEdit').val(rowElem.find(".svDegree").text());
        $('#svEmailEdit').val(rowElem.find(".svEmail").text());
        $('#svDepartEdit option').filter(function () {
            return this.text == rowElem.find(".svDepart").text()
        }).attr('selected', true);
    });

    $('#supervisor-list').on("click", ".fa-trash", function () {
        $('#removeConfirmModal').modal('show');

        var rowElem = $(this).parent().parent();

        $('#svIdDel').val(rowElem.find(".svId").val());
        $('#svCodeDel').text(rowElem.find(".svCode").text());
        $('#svNameDel').text(rowElem.find(".svName").text());
        $('#svDegreeDel').text(rowElem.find(".svDegree").text());
        $('#svEmailDel').text(rowElem.find(".svEmail").text());
        $('#svDepartDel').text(rowElem.find(".svDepart").text());
    });
    /**
     * ONCLICK AJAX ACTION
     */
    $("#svClassEdit, #svClass").on("change", function () {
        SupervisorAction.getClassId($(this).val(), $("#" + $(this).attr("id") + "Hid"));
    });

    $('form#editForm').on("submit", function () {
        var valid = validateEditForm(this);
        if (valid == true) {
            var supervisorObj = getSupervisorObjFromEditForm();
            SupervisorAction.update(supervisorObj);
            $('#editSupervisorModal').modal('hide');
        }
        return false;
    });

    $('form#createForm').on('submit', function () {
        var valid = validateCreateForm(this);
        if (valid == true) {
            var supervisorObj = getSupervisorObjFromCreateForm();
            SupervisorAction.createSupervisor(supervisorObj);
        }
        return false;
    });

    $('#del-sv-btn').on('click', function () {
        SupervisorAction.delete($("#svIdDel").val());
    });

    $('#crt-depart-btn').on('click', function () {
        var departObj = getDepartObj();
        DepartAction.createDepart(departObj);
    });

    $('#createForm').validate({
        rules: {
            svCode: {
                required: true
            },
            svName: "required",
            svDegree: "required",
            svEmail: {
                required: true,
            }
        },
        messages: {
            svCode: "Bạn không được để trống ô này",
            svName: "Bạn không được để trống ô này",
            svDegree: "Bạn không được để trống ô này",
            svEmail: {
                required: "Bạn không được để trống ô này",
            }
        }
    });
});

function validateEditForm(form) {
    return true;
}

function validateCreateForm(form) {
    return $(form).valid();
}

function getDepartObj() {
    var departObj = {
        id: null,
        name: $('#departNameCrt').val(),
        faculty: {id: $('#departFalcutyIdCrt').val()}
    };
    return departObj;
}

function getSupervisorObjFromEditForm() {
    var supervisorObj = {
        supervisor_id: $('#svIdEdit').val(),
        user: {email: $('#svEmailEdit').val()},
        supervisor_code: $('#svCodeEdit').val(),
        name: $('#svNameEdit').val(),
        degree: $('#svDegreeEdit').val(),
        department: {id: $('#svDepartEdit').val()}
    };
    return supervisorObj;
}

function getSupervisorObjFromCreateForm() {
    var supervisorObj = {
        user: {email: $('#svEmail').val()},
        supervisor_code: $('#svCode').val(),
        name: $('#svName').val(),
        degree: $('#svDegree').val(),
        department: {id: $('#svDepart').val()},
    };
    return supervisorObj;
}