var page = 1;
var current_page = 1;
var total_page = 0;
var is_ajax_fire = 0;

manageData();

/* manage data list */
function manageData() {
   $.ajax({
      dataType: 'json',
      url: url,
      data: {page:page}
    }).done(function(data){

       total_page = data.total % 5;
       current_page = page;

       $('#pagination').twbsPagination({
            totalPages: total_page,
            visiblePages: current_page,
            onPageClick: function (event, pageL) {

                page = pageL;

                if(is_ajax_fire != 0){
                   getPageData();
                }
            }
        });

        manageRow(data.data);

        is_ajax_fire = 1;

   });
}

/* Get Page Data*/
function getPageData() {

    $.ajax({
       dataType: 'json',
       url: url,
       data: {page:page}
	}).done(function(data){

       manageRow(data.data);

    });

}

/* Add new user table row */
function manageRow(data) {

    var	rows = '';

    $.each( data, function( key, value ) {

        rows = rows + '<tr>';
        rows = rows + '<td>'+value.name+'</td>';
        rows = rows + '<td>'+value.description+'</td>';
        rows = rows + '<td data-id="'+value.id+'">';
        rows = rows + '<button data-toggle="modal" data-target="#edit-user" class="btn btn-primary edit-user">Edit</button> ';
        rows = rows + '<button class="btn btn-danger remove-user">Delete</button>';
        rows = rows + '</td>';
        rows = rows + '</tr>';

    });

    $("tbody").html(rows);

}

/* Create new user */
$(".crud-submit").click(function(e){

    e.preventDefault();

    var form_action = $("#create-user").find("form").attr("action");
    var name = $("#create-user").find("input[name='name']").val();
    var description = $("#create-user").find("textarea[name='description']").val();

    $.ajax({
        dataType: 'json',
        type:'POST',
        url: form_action,
        data:{name:name, description:description}
    }).done(function(data){

        getPageData();
        $(".modal").modal('hide');
        toastr.success('User Created Successfully.', 'Success Alert', {timeOut: 5000});

    });

});

/* Remove User */
$("body").on("click",".remove-user",function(){

    var id = $(this).parent("td").data('id');
    var c_obj = $(this).parents("tr");

    $.ajax({
        dataType: 'json',
        type:'delete',
        url: url + '/delete/' + id,
    }).done(function(data){

        c_obj.remove();
        toastr.success('User Deleted Successfully.', 'Success Alert', {timeOut: 5000});
        getPageData();

    });

});

/* Edit User */
$("body").on("click",".edit-user",function(){

    var id = $(this).parent("td").data('id');
    var name = $(this).parent("td").prev("td").prev("td").text();
    var description = $(this).parent("td").prev("td").text();

    $("#edit-user").find("input[name='name']").val(name);
    $("#edit-user").find("textarea[name='description']").val(description);
    $("#edit-user").find("form").attr("action",url + '/update/' + id);

});

/* Updated new User */
$(".crud-submit-edit").click(function(e){

    e.preventDefault();

    var form_action = $("#edit-user").find("form").attr("action");
    var name = $("#edit-user").find("input[name='name']").val();
    var description = $("#edit-user").find("textarea[name='description']").val();

    $.ajax({
        dataType: 'json',
        type:'POST',
        url: form_action,
        data:{name:name, description:description}
    }).done(function(data){

        getPageData();
        $(".modal").modal('hide');
        toastr.success('User Updated Successfully.', 'Success Alert', {timeOut: 5000});

    });

});