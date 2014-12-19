$(document).ready(function() {
   /* var p = jl("<p />").text("test").result();
    jl("p").style('color', 'blue').before("<p>Before</p>").after("<p>After 2</p>");
    jl("#test").style('color', 'red').style('fontWeight', 'bold').after(p);

    /*
    //select by position (1 based)
    jl("ul li:nth-of-type(1)").remove();
    */

    /*
    Filter out .ignore 
    jl('div:not(.ignore)');
    */

    /*
    Select multiple elements
    jl('div,ul,li');
    */

    /*
    Find children of myParent
    jl('#myParent > [ng-click]');
    */

    //var kids = jl(".list").children().result();
    
    
    
    var res = jl("#test").hasClass('chris').result();
    console.log(res);
    
    
    
    // $(".find-example").addClass("appending-class, woot").removeClass('woot').find("li").addClass('added classes to found elements').removeClass('added, found');
   /* $("#test").addClass('bri,chris').removeClass('chris');//.hasClass('chris').result();
    
    $(".another-test").on('click',function(){
        console.log("i'm working!");
    });
    //$(".another-test").click();
    $("#test").click(function(){
        console.log('iclickedonchris');
    });
    $("#myInput").focus();
    setTimeout(function(){
        $("#myInput").blur();
    },2000)
    
    $(".another-test").trigger('click', function(){
        console.log('clicked foo!');
    });*/
    //$("#test").hover(function(){console.log('thou has hovered');}, function(){console.log('thou has left');});

    //$("#myInput").keyup(function(){console.log('bro keyup dude')}).keydown(function(){console.log('sista we got a keydown!')});

    /*var res = $("#test").text().result();
    console.log(res);*/

    //var test = $(".dynamic").val('dyna').change();

});
