jl(document).ready(function() {
    var p = jl("<p />").text("test").result();
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

    var kids = jl(".list").children().result();
    console.log(kids);
});
