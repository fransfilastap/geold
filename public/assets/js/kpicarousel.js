/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){ 
    
    var totalLength = 0;
    
    $.each($("kpi-item"),function(i,v){
       totalLength += v.outerWidth(); 
    });
    
    console.log(totalLength);
    
    $(".right-scroll").click(function(evt){
            evt.preventDefault();
            //get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '  
            var item_width = $('ul.carousel-list li').outerWidth();  
  
            //calculate the new left indent of the unordered list  
            var left_indent = parseInt($('ul.carousel-list').css('left')) - item_width;  
  
            //make the sliding effect using jquery's anumate function '  
            $('ul.carousel-list').animate({'left' : left_indent},{queue:false, duration:500},function(){  
  
                //get the first list item and put it after the last list item (that's how the infinite effects is made) '  
                $('ul.carousel-list li:last').after($('ul.carousel-list li:first'));  
  
                //and get the left indent to the default -210px  
                $('ul.carousel-list').css({'left' : '-210px'});  
            }); 
    });
    
   //when user clicks the image for sliding left  
    $('.left-scroll').click(function(evt){  

        evt.preventDefault();
        
        var item_width = $('ul.carousel-list li').outerWidth();  

        /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */  
        var left_indent = parseInt($('ul.carousel-list').css('left')) + item_width;  

        $('ul.carousel-list').animate({'left' : left_indent},{queue:false, duration:500},function(){  

        /* when sliding to left we are moving the last item before the first item */  
        $('ul.carousel-list li:first').before($('ul.carousel-list li:last'));  

        /* and again, when we make that change we are setting the left indent of our unordered list to the default -210px */  
        $('ul.carousel-list').css({'left' : '-210px'});  
        });  

    });
    
});
