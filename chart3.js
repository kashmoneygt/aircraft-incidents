var injuries = ["Uninjured", "Serious Injuries", "Fatal Injuries"];

function createChart3(context) {
    console.log('chart 3');

    let chart3_j = $("#chart3");
    let chart3svg_j = $("#chart3svg");
    let width = chart3_j.width();
    let height = width/3; // Maintain an aspect ratio
    chart3svg_j.width(width); 
    chart3svg_j.height(height); 

    let chart3svg = d3.select("#chart3svg");

    console.log(width);
    console.log(height);

    var x = d3.scale.ordinal()
        .domain(injuries)
        .rangePoints([width / 4, 3 * width / 4]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    chart3svg.append('g')
        .attr('class', 'x axis')
        .attr("transform", "translate(0," + (height - 25) + ")")
        .call(xAxis);

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

    let normalizedInjuries = {};
    var circleMax = height / 2 - 30;
    for (injury in injuriesCount) {
        normalizedInjuries[injury] = injuriesCount[injury] * circleMax / totalInjuries;
    }

    let circle1 = chart3svg.append("circle")
        .attr("r", normalizedInjuries["Total_Uninjured"])
        .attr("cx", width / 4)
        .attr("cy", height / 2)
        .attr("fill", "green")
        .attr("stroke", "green")
        .attr("stroke-width", 3)
        .on("mouseover", function handleMouseOver(d, i) {
            d3.select(this).attr({
                r: this.r + 10
            });
            chart3svg.append("text").attr({
                id: "hello",  // Create an id for text so we can select it later for removing on mouseout
                x: function() { return 0; },
                y: function() { return 0; }
            })
            .text(function() {
                return "Total Uninjured: " + injuriesCount["Total_Uninjured"];  // Value of the text
            });
        });

    let circle2 = chart3svg.append("circle")
        .attr("r", normalizedInjuries["Total_Serious_Injuries"])
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "orange")
        .attr("stroke", "orange")
        .attr("stroke-width", 3);

    let circle3 = chart3svg.append("circle")
        .attr("r", normalizedInjuries["Total_Fatal_Injuries"])
        .attr("cx", 3 * width / 4)
        .attr("cy", height / 2)
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 3);

    

}


// Function that will be called when selected data is updated
function updateChart3(context) {
    console.log('update chart 3');

    var data = context.data;

}

function isNumeric(value) {
    return !isNaN(value) && value != '';
}
