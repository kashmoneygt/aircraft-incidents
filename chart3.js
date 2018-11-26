function createChart3(context) {
    console.log('chart 3');

    let chart3_j = $("#chart3");
    let chart3svg_j = $("#chart3svg");
    let width = chart3_j.width();
    let height = width/3; // Maintain an aspect ratio
    chart3svg_j.width(width); 
    chart3svg_j.height(height); 

    let chart3svg = d3.select("#chart3svg");

    


    var data = context.data;

    
}


// Function that will be called when selected data is updated
function updateChart3(context) {
    console.log('update chart 3');

    var data = context.data;

}
