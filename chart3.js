function createChart3(context) {
    console.log('chart 3');

    let chart3_j = $("#chart3");
    let chart3svg_j = $("#chart3svg");
    let width = chart3_j.width();
    let height = width/3; // Maintain an aspect ratio
    chart3svg_j.width(width); 
    chart3svg_j.height(height); 

    let chart3svg = d3.select("#chart3svg");

    let image = chart3svg.append("svg:image")
    .attr("xlink:href", "briefcase.jpg")
    .attr("id", "briefcase")
    .attr("width", width)
    .attr("height", height);

    console.log(width);
    console.log(height);

    var data = context.data;

    let injuriesCount = {"Total_Fatal_Injuries": 0, "Total_Serious_Injuries": 0, "Total_Uninjured": 0};

    data.forEach(d => {
        if (isNumeric(d.Total_Fatal_Injuries)) injuriesCount["Total_Fatal_Injuries"] += parseInt(d.Total_Fatal_Injuries);
        if (isNumeric(d.Total_Serious_Injuries)) injuriesCount["Total_Serious_Injuries"] += parseInt(d.Total_Serious_Injuries);
        if (isNumeric(d.Total_Uninjured)) injuriesCount["Total_Uninjured"] += parseInt(d.Total_Uninjured);
    });

    let totalInjuries = 0;
    for (injury in injuriesCount) {
        totalInjuries += injuriesCount[injury];
    }
    
    console.log(injuriesCount);
    console.log(totalInjuries);
    console.log(image);

    let image_j = $("#briefcase");
    console.log(image_j.offset());

    console.log(chart3_j.offset());

    var chart3Offset = chart3_j.offset();
    var imageOffset = image_j.offset();
    // var rect1StartX = imageOffset.left - chart3Offset.left;
    // var rect1StartY = imageOffset.top - chart3Offset.top; 
    var rectStartX = 135;
    var rectStartY = 30;
    var rectHeight = 115;

    var briefCaseTotal = 183; // 185 pixels - 2 for spacing
    for (injury in injuriesCount) {
        injuriesCount[injury] = injuriesCount[injury] * briefCaseTotal / totalInjuries;
    }

    console.log(rectStartX);
    console.log(rectStartY);

    let rect1 = chart3svg.append("rect")
        .attr("width", injuriesCount["Total_Uninjured"])
        .attr("height", rectHeight)
        .attr("x", rectStartX)
        .attr("y", rectStartY)
        .attr("fill", "blue");

    let rect2 = chart3svg.append("rect")
        .attr("width", injuriesCount["Total_Serious_Injuries"])
        .attr("height", rectHeight)
        .attr("x", rectStartX + 1 + parseInt(rect1.attr("width")))
        .attr("y", rectStartY)
        .attr("fill", "green");

    let rect3 = chart3svg.append("rect")
        .attr("width", injuriesCount["Total_Fatal_Injuries"])
        .attr("height", rectHeight)
        .attr("x", rectStartX + 2 + parseInt(rect1.attr("width")) + parseInt(rect2.attr("width")))
        .attr("y", rectStartY)
        .attr("fill", "red");



}


// Function that will be called when selected data is updated
function updateChart3(context) {
    console.log('update chart 3');

    var data = context.data;

}

function isNumeric(value) {
    return !isNaN(value) && value != '';
}
