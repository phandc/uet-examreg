var accepted_thesis_export_path;
var protected_thesis_export_path;
var update_thesis_path;
var render_path;
var dataTable;


$(function() {
    accepted_thesis_export_path = $('#accepted_thesis_export_path').val();
    protected_thesis_export_path = $('#protected_thesis_export_path').val();
    update_thesis_path = $('#update_thesis_path').val();
    render_path = $('#render_path').val();

    initDataTable();
    initCheckBox();
});

function loadTheses() {
    $('#thesis-list').load(render_path + "/list", function () {
        dataTable.destroy();
        initDataTable();
        initCheckBox();
    });
}

function initDataTable() {
    dataTable = $("#thesis-table").DataTable({
        ordering: false,
        dom: '<"toolbar">frtip',
        "columns": [
            { "width": "2%" },
            { "width": "15%" },
            { "width": "15%" },
            { "width": "15%" },
            { "width": "10%" },
            { "width": "5%" },
        ],
        "oLanguage": {
            "sSearch": "Tìm kiếm:",
            "oPaginate": {
                "sFirst": "Trang đầu",
                "sNext": "Sau",
                "sPrevious": "Trước",
                "sLast": "Trang cuối"
            },
            "sInfo": "Hiện từ khóa luận thứ _START_ đến _END_ trong tổng số _TOTAL_ khóa luận",
            "sLengthMenu": "Hiện _MENU_ khóa luận"
        }
    });

    // filters
    $('#thesis-table tfoot th').each(function() {
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

    $("div.toolbar").html('<div class="pull-left">' +
        '<button class="btn btn-success" type="button" id="accepted_thesis_btn"><i class="fa fa-file-word-o"></i> Xuất danh sách đề tài</button>&nbsp&nbsp' +
        '<button class="btn btn-success" type="button" id="protected_thesis_btn"><i class="fa fa-file-word-o"></i> Xuất danh sách bảo vệ</button>&nbsp&nbsp' +
        '<select class="form-control" id="status_select">' +
            '<option value="101">Chờ giảng viên đồng ý</option>' +
            '<option value="201">Được duyệt thực hiện</option>' +
            '<option value="202">Được duyệt bảo vệ</option>' +
            '<option value="203">Đã hoàn thành</option>' +
            '<option value="302">Đang yêu cầu sửa</option>' +
            '<option value="303">Đang yêu cầu hủy</option>' +
            '<option value="401">Giảng viên từ chối hướng dẫn</option>' +
            '<option value="402">Đã hủy</option>' +
        '</select>&nbsp&nbsp' +
        '<button class="btn btn-primary" type="button" id="change_status_btn"></i> Đổi trạng thái</button>&nbsp&nbsp' +
        '</div>'
    );

    $("#accepted_thesis_btn").click(function() {
        $.ajax({
            url: accepted_thesis_export_path,
            type: "GET",
            success: function() {
                window.location = accepted_thesis_export_path;
            }
        });
    });

    $("#protected_thesis_btn").click(function() {
        $.ajax({
            url: protected_thesis_export_path,
            type: "GET",
            success: function() {
                window.location = protected_thesis_export_path;
            }
        });
    });

    $("#change_status_btn").click(function() {
        var selectedIds = getSelectedIds();
        if (selectedIds.length == 0) return false;
        var status_id = $('#status_select').val();
        var thesis = {
            status: {status_id: status_id}
        };

        selectedIds.forEach(function(item, index, arr) {
            $.ajax({
                data: JSON.stringify(thesis),
                type: 'POST',
                url: update_thesis_path + '/' + item,
                beforeSend: function (xhr) {
                    var token = $("meta[name='_csrf']").attr("content");
                    var header = $("meta[name='_csrf_header']").attr("content");
                    xhr.setRequestHeader(header, token);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                },
                success: function (rsp) {
                    alert(rsp.message);
                    loadTheses();
                }
            });
        });

    });
}

function getSelectedIds() {
    var rows = $("#thesis-table > tbody tr").toArray();
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
