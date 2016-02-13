var table;

$(document).on( "click" , ".edit", function(evt){
    evt.preventDefault();
    $("#user-edit-modal").modal("show");
});

$(document).on( "click" , ".detail", function(evt){
   evt.preventDefault();
   $("#user-detail-modal").modal("show");
});

$(document).on("click","#create",function(evt){
    evt.preventDefault();
    $("#user-create-modal").modal("show");
});


function initDataTable(url,id){
    table = $(id).DataTable({
      "pagination": true,
      "processing": true,
      "serverSide": true,
      "ajax": {
          "url" : url,
          "type" : "POST",
          "contentType" : "application/json",
          "data" : function(data){
              return JSON.stringify(data);
          }
      },
      "columns" : [
          {"data":"fullname"},
          {"data":"username"},
          {"data":"email"},
          {"data":"phone"},
          {"data":"role"},
          {"data":"action","orderable":false,"searchable":false}
      ]
    });   
}

function init(){

}
