var cellCount = 0;
var table;
var deletedCells = [];
var editedCells  = [];
var newCells = [];
//var 

var modalSuccessTemplate = "<div class='modal modal-success fade'>"+
              "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                  "<div class='modal-header'>"+
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                    "<h4 class='modal-title'>Success</h4>"+
                  "</div>"+
                  "<div class='modal-body'>"+
                    "<p id='modal-success-message'></p>"+
                  "</div>"+
                  "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-outline' data-dismiss='modal'>Ok</button>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>";
    
var modalWarningTemplate = "<div class='modal modal-warning fade'>"+
              "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                  "<div class='modal-header'>"+
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                    "<h4 class='modal-title'>Opppss...</h4>"+
                  "</div>"+
                  "<div class='modal-body'>"+
                    "<p id='modal-warning-message'></p>"+
                  "</div>"+
                  "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-outline' data-dismiss='modal'>Ok</button>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>";
    
var modalDangerWarningTemplate =  "<div class='modal modal-danger fade'>"+
              "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                  "<div class='modal-header'>"+
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                    "<h4 class='modal-title'>Error!</h4>"+
                  "</div>"+
                  "<div class='modal-body'>"+
                    "<p id='modal-error-message'></p>"+
                  "</div>"+
                  "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-outline pull-left' data-dismiss='modal'>Close</button>"+
                    "<button type='button' class='btn btn-outline'>Save changes</button>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>";
    
var confirmationModal ="<div class='modal modal-info fade'>"+
              "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                  "<div class='modal-header'>"+
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                    "<h4 class='modal-title'>Confirmation</h4>"+
                  "</div>"+
                  "<div class='modal-body'>"+
                    "<p class='confirmation-message'></p>"+
                  "</div>"+
                  "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-outline' data-dismiss='modal'>No</button>"+
                    "<button type='button' class='btn btn-outline btn-yes'>Yes</button>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>";

$("#create").click( function(evt){
    evt.preventDefault();
    createSite();
});

$(".add_cell").click(function(evt){
   evt.preventDefault();
    addCell();
});

$("#cancel_site").click(function(evt){
   evt.preventDefault();
   $(".modal-info").find(".confirmation-message").html("Are you sure?");
   $(".modal-info").modal("show");
   $(".modal-info").find(".btn-yes").click(function(evt){
        evt.preventDefault();
        $(".modal-info").modal('hide');
        $("#create_modal").modal("hide");
        resetAddedCellCount();
        resetSiteForm();
   });   
});

$(".added_cell").click(function(evt){
   $("#added_cell_modal").modal("show"); 
});


$("form#cell_form").bind("submit",function(evt){
    var form = $(this);
    var cell_index = $(this).find("#cell_index").val();
    var cell_name = $(this).find("#cell_name").val();
    var ne  = $(this).find("#ne").val();
    var frequency = $(this).find("#frequency").val();
    
    if( cell_index.length <= 0 || cell_name.length <= 0 || frequency.length <= 0 ){
        alert("please fill all field");    
        return false;
    }
    
    var cell = {
        cellIndex : cell_index,
        cellName : cell_name,
        ne : ne,
        frequency : frequency
    };
    
    addCellRow( cell );
    
    cellCount = $("#added_cell_table > tbody > tr").length;
    $(".total_cell").html(cellCount);
    $("#cell_modal").modal("hide");
    resetCellForm();
    return false;

});

$("form#site_form").bind("submit",function(evt){
    var form = $(this);
    var sitename = form.find("#sitename").val();
    var siteid = form.find("#siteid").val();
    var address = form.find("#address").val();
    var sitegroup = form.find("#sitegroup").val();
    var latitude = form.find("#latitude").val();
        latitude = parseFloat(latitude);
    var longitude = form.find("#longitude").val();
        longitude = parseFloat(longitude);
        
    var cells = parseAddedCellTable();
    
    jQuery.ajax({
       contentType: 'application/json',
       url : form.attr('action'),
       method : "POST",
       data : JSON.stringify({ 'site' : {"siteId" : siteid,"siteName" : sitename, "address" : address, "site_group" : sitegroup, "latitude" : latitude, "longitude" : longitude},'cells' : cells }),
       dataType : "json",
       success : function(response){
           if( response.status !== undefined ){
               
               if( response.status ){
                   $(".modal-success").find("#modal-success-message").html( response.message );
                   $(".modal-success").modal( "show" );
                   $("#create_modal").modal("hide");
                   resetSiteForm();
                   table.ajax.reload();
               }else{
                   $(".modal-warning").find("#modal-warning-message").html( response.message );
                   $(".modal-warning").modal("show");
               }
               
           }else{
                $(".modal-danger").find("#modal-error-message").html( "Opps :(" );
                $(".modal-danger").modal("show");
           }
       }
    });
    
    return false;
    
});

function resetCellForm(){
    var cell_index = $("#cell_index");
    var cell_name = $("#cell_name");
    var ne  =$("#ne").val();
    var frequency = $("#frequency");
    
    cell_index.val("");
    cell_name.val("");
    frequency.val("");
}

function resetSiteForm(){
    $("form#site_form").find("input[type=text], textarea").val("");
}

function resetAddedCellCount(){
    cellCount = 0;
    $(".total_cell").html(cellCount);
    $("#added_cell_table > tbody").html("");
}

function addCellRow(cell){
    var table = $("#added_cell_table > tbody");
    var row_length = $("#added_cell_table > tbody > tr").length;
    
    var row = "<tr class='new_cell'>"+
                    "<td>"+(row_length+1)+"</td>"+
                     "<td>"+cell.cellIndex+"</td>"+
                     "<td>"+cell.cellName+"</td>"+
                     "<td>"+cell.ne+cell.frequency+"</td>"+
                     "<td><button class='btn btn-danger btn-xs delete-cell' type='button'><i class='fa fa-trash'></i></button></td>"+
               "</tr>"; 
               
    table.append(row);
}

$(document).on('click','button.delete-cell',function(evt){
    evt.preventDefault();
    if( confirm("Do you want to delete this cell ?") ){
        $(this).closest('tr').slideUp('slow');
        $(this).closest('tr').remove();
    }
});

$("#upload").click(function(evt){
    evt.preventDefault();
   $("#upload_modal").modal("show"); 
});

$(document).on('click','button.edit-cell',function(evt){
   evt.preventDefault();
   var row = $(this).closest('tr');
   var cellIndex = row.find("td:eq(1)").html();
   var cellName = row.find("td:eq(2)").html();
   var frequency = row.find("td:eq(3)").html();
   var freq_numb;
   if( frequency.contains( "LTE" ) ){
       $("select#ne_edit").val("LTE");
       freq_numb = frequency.replace("LTE","");
   }
   else if(frequency.contains( "UMTS" )){
       $("select#ne_edit").val("UMTS");
       freq_numb = frequency.replace("UMTS","");
   }else{
       $("select#ne_edit").val("GSM");
       freq_numb = frequency.replace("GSM","");
   }

   $("#cell_index_edit").val(cellIndex);
   $("#cell_name_edit").val( cellName );
   $("#cell_id_edit").val(row.data('id'));
   $("#frequency_edit").val( freq_numb );
   $("#cell_edit_modal").modal("show");
   
});


$("form#cell_edit_form").bind("submit",function(evt){
     evt.preventDefault();
     var cell_index = $(this).find("#cell_index_edit").val();
     var cell_name = $(this).find("#cell_name_edit").val();
     var ne  = $(this).find("#ne_edit").val();
     var frequency = $(this).find("#frequency_edit").val();

     if( cell_index.length <= 0 || cell_name.length <= 0 || frequency.length <= 0 ){
         alert("please fill all field");    
         return false;
     }
     
     var row = $("#"+$("#cell_id_edit").val());

     row.find("td:eq(1)").html(cell_index);
     row.find("td:eq(2)").html(cell_name);
     row.find("td:eq(3)").html( ne+frequency );

     cellCount = $("#added_cell_table > tbody > tr").length;
     $(".total_cell").html(cellCount);
     $("#cell_modal").modal("hide");
     resetCellForm();
    $("#cell_edit_modal").modal("hide"); 
    return false;

 });
 
 
 var uploadOptions = {
     beforeSubmit : function(){
         $(".loading-wrapper").fadeIn();
     },
     success : function(){
         $(".loading-wrapper").fadeOut();
         $("#upload_modal").modal("hide");
         table.ajax.reload();
     }
 };
 
 $("form#upload_site").ajaxForm( uploadOptions );



$("#close_create_modal").click(function(evt){
   evt.preventDefault();
   $(".modal-info").find(".confirmation-message").html("Are you sure?");
   $(".modal-info").modal("show");
   $(".modal-info").find(".btn-yes").click(function(evt){
        evt.preventDefault();
        $(".modal-info").modal('hide');
        $("#create_modal").modal("hide");
        resetSiteForm();
   });
});

$("#close_cell_modal").click(function(evt){
   evt.preventDefault();
    if( confirm("Are you sure ?") ){
       $("#cell_modal").modal("hide");
    }
});

$("#close-added-cell-modal").click(function(evt){
   evt.preventDefault();
   cellCount = $("#added_cell_table > tbody > tr").length;
   $(".total_cell").html(cellCount);
   $("#added_cell_modal").modal("hide");
});

$(document).on('click','.detail',function(evt){
   evt.preventDefault();
   $(".loading-wrapper").fadeIn();
   var url = $(this).attr('href');
   $.get(url,function(response){
       if( response === undefined ){
           $(".modal-danger").modal('show');
       }
       else{
           var site = response.site;
           var cells = response.cells;
           
           $("#detail_siteid").html( site.siteId );
           $("#detail_sitename").html( site.siteName );
           $("#detail_address").html( site.address );
           $("#detail_group").html( site.site_group );
           $("#detail_longitude").html( site.longitude );
           $("#detail_latitude").html( site.latitude );
           $(".total_cells").html( cells.length );
           
           var table = $("#site_cell_table > tbody");
           $.each(cells,function(i,cell){
                var row = "<tr>"+
                        "<td>"+(i+1)+"</td>"+
                         "<td>"+cell.cellIndex+"</td>"+
                         "<td>"+cell.cellName+"</td>"+
                         "<td>"+cell.frequency+"</td>"+
                   "</tr>"; 
               
                table.append(row);               
           });
           
           
           
           $("#detail_modal").modal('show');
       }
       $(".loading-wrapper").fadeOut("fast");
   },"json");
   
});

$(document).on("click",".edit",function(evt){
   evt.preventDefault();
   var url = $(this).attr("href");
   $("#added_cell_table > tbody").html("");
   $(".loading-wrapper").fadeIn();
   $.get(url,function(response){
      if( response === undefined ){
            $(".modal-danger").find("#modal-error-message").html( "Opps :(" );
            $(".modal-danger").modal("show");          
      }else{
          var site = response.site;
          var cells = response.cells;
          
          $("#siteid_edit").val( site.siteId );
          $("#sitename_edit").val( site.siteName );
          $("#address_edit").val( site.address );
          $(".loading-wrapper").fadeOut();
          $("select#sitegroup_edit[value="+site.site_group+"]:selected");
          $("#latitude_edit").val( site.latitude );
          $("#longitude_edit").val( site.longitude );
          
           var table = $("#added_cell_table > tbody");
           $.each(cells,function(i,cell){
                var row = "<tr class='old_cell' id='"+cell.id+"' data-id='"+cell.id+"'>"+
                        "<td>"+(i+1)+"</td>"+
                         "<td>"+cell.cellIndex+"</td>"+
                         "<td>"+cell.cellName+"</td>"+
                         "<td>"+cell.frequency+"</td>"+
                         "<td><button class='btn btn-danger btn-xs delete-cell' type='button'><i class='fa fa-trash'></i></button> "+
                              "<button class='btn btn-primary btn-xs edit-cell' type='button'><i class='fa fa-edit'></i></button></td>"+
                   "</tr>"; 
               
                table.append(row);               
           });    
           
            cellCount = $("#added_cell_table > tbody > tr").length;
            $(".total_cell").html(cellCount);
          
          $("#edit_modal").modal("show");
          
      }
   });
   
});

$(document).on("click",".delete-site",function(evt){
   evt.preventDefault();
   var url = $(this).attr("href");
   $(".modal-info").find(".confirmation-message").html("Are you sure?");
   $(".modal-info").modal("show");
   $(".modal-info").find(".btn-yes").click(function(evt){
        evt.preventDefault();
        $(".loading-wrapper").fadeIn();
        $.get(url,function(response){
            if( response === undefined ){
                $(".modal-danger").modal("show");
            }
            else{
                $(".modal-info").modal("hide");
                $(".modal-success").find("#modal-success-message").html( response.message );
                $(".modal-success").modal("show");
                table.ajax.reload();
            }
        },"json");
        $(".loading-wrapper").fadeOut();
   });
});

$(document).on("click","#see_cell",function(evt){
    evt.preventDefault();
    $("#site_cell_modal").modal("show");
});


function parseAddedCellTable(){
    
    var cells = [];
    $("table#added_cell_table > tbody tr").each(function(){
        var _cellIndex  = $(this).find('td:eq(1)').html();
        var _cellName   = $(this).find('td:eq(2)').html();
        var _frequency  = $(this).find('td:eq(3)').html();
        
        var cell = {
            cellIndex : _cellIndex,
            cellName  : _cellName,
            frequency : _frequency
        };
        
        cells.push( cell );
        
    });   
    
    return cells;
}

function createSite(){
    $("#added_cell_table > tbody ").html("");
    $(".total_cell").html(0);
    $("#create_modal").modal({backdrop:'static',keyboard:false});
}

function addCell(){
    $("#cell_modal").modal({backdrop:'static',keyboard:false});
}

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
          {"data":"siteId"},
          {"data":"siteName"},
          {"data":"address"},
          {"data":"site_group"},
          {"data":"latitude"},
          {"data":"longitude"},
          {"data":"action","orderable":false,"searchable":false}
      ]
    });   
}

function init(){
    $("body").append(modalSuccessTemplate);
    $("body").append(modalWarningTemplate);
    $("body").append(modalDangerWarningTemplate);
    $("body").append(confirmationModal);
}
