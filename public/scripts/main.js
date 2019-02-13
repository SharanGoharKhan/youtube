/* ===========================================================
 * jquery-simple-text-rotator.js v1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * A very simple and light weight jQuery plugin that 
 * allows you to rotate multiple text without changing 
 * the layout
 * https://github.com/peachananr/simple-text-rotator
 *
 * ========================================================== */
var isIntervalInProgress = false;
!function($){
  
    var defaults = {
          animation: "flip",
          separator: ",",
          speed: 2000
      };
      
      $.fx.step.textShadowBlur = function(fx) {
      $(fx.elem).prop('textShadowBlur', fx.now).css({textShadow: '0 0 ' + Math.floor(fx.now) + 'px black'});
    };
      
    $.fn.textrotator = function(options){
      var settings = $.extend({}, defaults, options);
      isIntervalInProgress = true;
      return this.each(function(){
  
        var el = $(this)
        var array = ["Copy","Copied!"];
     
        el.text(array[0]);
        
        // animation option
        var rotate = function() {
          switch (settings.animation) { 
            case 'flip':
              if(el.find(".back").length > 0) {
                el.html(el.find(".back").html())
              }
            
              var initial = el.text()
              var index = $.inArray(initial, array)
              if((index + 1) == array.length) index = -1
              
              if(index == 0){
                console.log("hide it")
                $('#clipboard-icon').hide()
              }
              else{
                $('#clipboard-icon').show(250)
              }

              el.html("");
              $("<span class='front'>" + initial + "</span>").appendTo(el);
              $("<span class='back'>" + array[index + 1] + "</span>").appendTo(el);
              el.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip").show().css({
                "-webkit-transform": " rotateY(-180deg)",
                "-moz-transform": " rotateY(-180deg)",
                "-o-transform": " rotateY(-180deg)",
                "transform": " rotateY(-180deg)"
              })
              clearInterval(interval_id)
              interval_id = setInterval(rotate, settings.speed );



              if(index == -1)
              {
                clearInterval(interval_id)
                isIntervalInProgress = false
              }
              console.log(isIntervalInProgress)
            break;
            
     
           
          }
        };
        var interval_id = setInterval(rotate, 0 );
      });
    }
    
  }(window.jQuery);
  
  
  