/**
 * Created by dinht_000 on 10/30/2016.
 */
var contextPath = $("form").attr('action');
var renderPath = $("#rendered_view_path").val();
var dataTable, checkBox;

var StudentAction = {
    loadStudents: function () {
        $('#student-list').load(renderPath + "/list/load", function () {
            dataTable.destroy();
            initDataTable();
            initCheckBox();
        });
    },
    update: function (studentObj) {
        if (studentObj != null) {
            $.ajax({
                data: JSON.stringify(studentObj),
                type: 'POST',
                url: contextPath + "/" + studentObj.student_id,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    StudentAction.loadStudents();
                }
            });
        }
        else {
            console.log("Lỗi xảy ra StudentAction.update()")
        }
    },
    createStudent: function (studentObj) {
        if (studentObj != null) {
            $.ajax({
                data: JSON.stringify(studentObj),
                type: 'POST',
                url: contextPath,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    StudentAction.loadStudents();
                }
            });
        }
        else {
            console.log("Lỗi xảy ra StudentAction.createStudent() ")
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
                StudentAction.loadStudents();
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
                    StudentAction.loadStudents();
                }
            });
        }
    },
    getClassId: function (szClassName, storeElem) {
        $.ajax({
            type: "GET",
            url: renderPath + "/class?name=" + szClassName,
            success: function (data, status) {
                storeElem.val(data);
            }
        })
    },
    sendMail: function (ids, title, content) {
        var request = {};
        request['student_ids'] = ids;
        request['title'] = title;
        request['content'] = content;
        $.ajax({
            data: JSON.stringify(request),
            type: 'POST',
            url: contextPath + "/send-mail",
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            },
            success: function (rsp) {
                alert(rsp.message);
                StudentAction.loadStudents();
            }
        });
    },
};

var SpecAction = {
    loadSpecList: function () {
        $('#stdSpec').load(renderPath + '/spec/list');
    },
    createSpec: function (specObj) {
        if (specObj != null) {
            $.ajax({
                data: JSON.stringify(specObj),
                type: 'POST',
                url: contextPath.replace('student', 'specialization'),
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    SpecAction.loadSpecList();
                }
            });
        }
        else {
            console.log("Lỗi");
        }
    },
};

var ClassAction = {
    loadClassList: function () {
        $('#stdClass').load(renderPath + '/class/list');
    },
    createClass: function (classObj) {
        if (classObj != null) {
            $.ajax({
                data: JSON.stringify(classObj),
                type: 'POST',
                url: contextPath.replace('student', 'class'),
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    ClassAction.loadClassList();
                }
            });
        }
        else {
            console.log("Lỗi");
        }
    },
};

function initDataTable() {

    dataTable = $('#student_table').DataTable({
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
            "sInfo": "Hiện từ sinh viên thứ _START_ đến _END_ trong tổng số _TOTAL_ sinh viên",
            "sLengthMenu": "Hiện _MENU_ sinh viên"
        }
    });

    $("div.toolbar").html('<div class="pull-left">' +
        '<button class="btn btn-primary" type="button" data-toggle="modal" data-target="#mail_modal"><i class="fa fa-envelope"></i> Gửi mail</button>&nbsp&nbsp' +
        '<button id="delete_multiple" class="btn btn-danger" type="button"><i class="fa fa-trash"></i> Xóa</button>' +
        '</div>'
    );

    $("#delete_multiple").click(function() {
        var deletedIds = getSelectedIds();
        StudentAction.deleteMultiple(deletedIds);
    });

    $('#student_table tfoot th').each(function() {
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

function getSelectedIds() {
    var rows = $("#student_table > tbody tr").toArray();
    var selectedIds = [];
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[1].children[0].classList.contains("checked"))
            selectedIds.push(rows[i].children[0].value);
    }
    if (selectedIds.length == 0) {
        alert('Bạn phải chọn ít nhất một hàng');
    }
    return selectedIds;
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

$(document).ready(function () {
    /**
     * INIT ACTION WHEN PAGE LOADED
     */
    $('.crt-std-content').hide();
    initDataTable();
    initCheckBox();
    /**
     * RUN PLUGINS FOR ELEMENTS
     */

    var myDropzone1 = new Dropzone("#dropzoneForm1", {
        url: $('#dropzoneForm1').attr('action'),
        /*acceptedFiles: "application/vnd.ms-excel",*/
        paramName: "file",
        dictDefaultMessage: "<p>Thả file excel chứa thông tin sinh viên vào đây.</p>",
        autoProcessQueue: false,
        queuecomplete: function (rsp) {
            alert("upload successfully");
            StudentAction.loadStudents();
        }
    });

    var myDropzone2 = new Dropzone("#dropzoneForm2", {
        url: $('#dropzoneForm2').attr('action'),
        /*acceptedFiles: "application/vnd.ms-excel",*/
        paramName: "file",
        dictDefaultMessage: "<p>Thả file excel chứa những sinh viên được đăng ký vào đây.</p>",
        autoProcessQueue: false,
        queuecomplete: function (rsp) {
            alert("upload successfully");
            StudentAction.loadStudents();
        }
    });

    $('#dropzone-button1').on('click', function (e) {
        e.preventDefault();
        myDropzone1.processQueue();
    });

    $('#dropzone-button2').on('click', function (e) {
        e.preventDefault();
        myDropzone2.processQueue();
    });

    $('.crt-std-title-btn').on('click', function (e) {
        var iChild = $(this).children().first();
        if (iChild.hasClass("fa-plus")) {
            iChild.removeClass("fa-plus");
            iChild.addClass("fa-minus");
        }
        else if (iChild.hasClass("fa-minus")) {
            iChild.removeClass("fa-minus");
            iChild.addClass("fa-plus");
        }

        $('.crt-std-content').slideToggle(300);
    })

    /**
     * MODALS HANDLER
     */
    $('#crt-spec-btn-modal').on("click", function () {
        $('#createSpecModal').modal('show');
    });

    $('#crt-class-btn-modal').on("click", function () {
        $('#createClassModal').modal('show');
    });

    $('#student-list').on("click", ".fa-pencil", function () {
        $('#editStudentModal').modal('show');

        var rowElem = $(this).parent().parent();

        $('#stdIdEdit').val(rowElem.find(".stdId").val());
        $('#stdCodeEdit').val(rowElem.find(".stdCode").text());
        $('#stdNameEdit').val(rowElem.find(".stdName").text());
        $('#stdClassEdit').val(rowElem.find(".stdClass span").text());
        $('#stdDobEdit').val(rowElem.find(".stdDob").text());
        $('#stdSpecEdit option').filter(function () {
            return this.text == rowElem.find(".stdSpec").text()
        }).attr('selected', true);
        $('#stdThesisStatusEdit option').filter(function () {
            return this.text == rowElem.find(".stdThesisStatus").val()
        }).attr('selected', true);

        StudentAction.getClassId(rowElem.find(".stdClass span").text(), $("#stdClassEditHid"));
    });

    $('#student-list').on("click", ".fa-trash", function () {
        $('#removeConfirmModal').modal('show');

        var rowElem = $(this).parent().parent();

        $('#stdIdDel').text(rowElem.find(".stdId").val());
        $('#stdCodeDel').text(rowElem.find(".stdCode").text());
        $('#stdNameDel').text(rowElem.find(".stdName").text());
        $('#stdClassDel').text(rowElem.find(".stdClass span").text());
        $('#stdDobDel').text(rowElem.find(".stdDob").text());
        $('#stdSpecDel').text(rowElem.find(".stdSpec").text());
    });

    /**
     * ONCHANGE EVENT
     */
    $("#stdClassEdit, #stdClass").on("change", function () {
        StudentAction.getClassId($(this).val(), $("#" + $(this).attr("id") + "Hid"));
    });

    /**
     * ONCLICK AJAX ACTION
     */

    $('form#send_mail_form').on("submit", function () {
        var selectedIds = getSelectedIds();
        if (selectedIds.length == 0) return false;
        var title = $('#mail_title').val();
        var content = $('#mail_content').data('markdown').parseContent();
        StudentAction.sendMail(selectedIds, title, content);
        return false;
    });

    $('form#editForm').on("submit", function () {
        var valid = validateEditForm(this);
        if (valid == true) {
            var studentObj = getStudentObjFromEditForm();
            StudentAction.update(studentObj);
        }
        return false;
    });

    $('form#createForm').on('submit', function () {
        var valid = validateCreateForm(this);
        if (valid == true) {
            var studentObj = getStudentObjFromCreateForm();
            StudentAction.createStudent(studentObj);
        }
        return false;
    });

    $('#del-std-btn').on('click', function () {
        StudentAction.delete($("#stdIdDel").text());
    });

    $('#crt-class-btn').on('click', function () {
        var classObj = getClassObj();
        ClassAction.createClass(classObj);
    });

    $('#crt-spec-btn').on('click', function () {
        var specObj = getSpecObj();
        SpecAction.createSpec(specObj);
    });

    $('.dob-input .input-group.date').datepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
    });

    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Dữ liệu không đúng định dạng"
    );

    $('#createForm').validate({
        rules: {
            stdCode: {
                required: true,
                regex: "^[0-9]{8}$"
            },
            stdName: "required",
            stdDob: "required"
        },
        messages: {
            stdCode: {
                required: "Bạn không được để trống ô này",
                regex: "Mã sinh viên phải gồm đúng 8 chữ số"
            },
            stdName: "Bạn không được để trống ô này",
            stdDob: "Bạn không được để trống ô này"
        }
    });
});

function validateEditForm(form) {
    return true;
}

function validateCreateForm(form) {
    return $(form).valid();
}

function getSpecObj() {
    var specObj = {
        spec_id: null,
        name: $('#specNameCrt').val(),
        faculty: {id: $('#specFalcutyIdCrt').val()}
    };
    return specObj;
}

function getClassObj() {
    var classObj = {
        name: $('#classNameCrt').val(),
        faculty: {id: $('#specFalcutyIdCrt').val()}
    };
    return classObj;
}

function getStudentObjFromEditForm() {
    var studentObj = {
        student_id: $('#stdIdEdit').val(),
        code: $('#stdCodeEdit').val(),
        name: $('#stdNameEdit').val(),
        clazz: {class_id: $('#stdClassEditHid').val()},
        dob: $('#stdDobEdit').val(),
        spec: {spec_id: $('#stdSpecEdit').val()},
        regisable: $('#stdThesisStatusEdit').val()
    };
    return studentObj;
}

function getStudentObjFromCreateForm() {
    var studentObj = {
        code: $('#stdCode').val(),
        name: $('#stdName').val(),
        clazz: {class_id: $('#stdClass').val()},
        dob: $('#stdDob').val(),
        spec: {spec_id: $('#stdSpec').val()},
        regisable: $('#stdThesisStatus').val()
    };
    return studentObj;
}