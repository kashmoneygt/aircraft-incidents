var injuries = ["Uninjured", "Serious Injuries", "Fatal Injuries"];
let globalCircleMax = 0;
let injuriesCount = {"Total_Fatal_Injuries": 0, "Total_Serious_Injuries": 0, "Total_Uninjured": 0};
let normalizedInjuries = {};
let totalInjuries = 0;

function createChart3(context) {
    // console.log('chart 3');

    let chart3_j = $("#chart3");
    let chart3svg_j = $("#chart3svg");
    let width = chart3_j.width();
    let height = width/3; // Maintain an aspect ratio
    chart3svg_j.width(width); 
    chart3svg_j.height(height); 

    let chart3svg = d3.select("#chart3svg");

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

    data.forEach(d => {
        if (isNumeric(d.Total_Fatal_Injuries)) injuriesCount["Total_Fatal_Injuries"] += parseInt(d.Total_Fatal_Injuries);
        if (isNumeric(d.Total_Serious_Injuries)) injuriesCount["Total_Serious_Injuries"] += parseInt(d.Total_Serious_Injuries);
        if (isNumeric(d.Total_Uninjured)) injuriesCount["Total_Uninjured"] += parseInt(d.Total_Uninjured);
    });

    for (injury in injuriesCount) {
        totalInjuries += injuriesCount[injury];
    }

    var circleMax = height / 2 - 35;
    globalCircleMax = circleMax;
    for (injury in injuriesCount) {
        normalizedInjuries[injury] = injuriesCount[injury] * circleMax / totalInjuries;
    }

    var totalText = chart3svg
        .append("text")
        .attr("id", "totalText")
        .attr("x", 2)
        .attr("y", 13)
        .text("Total Uninjured: " + totalInjuries);

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    let circle1 = chart3svg.append("circle")
        .attr("id", "circle1")
        .attr("r", normalizedInjuries["Total_Uninjured"])
        .attr("cx", width / 4)
        .attr("cy", height / 2)
        .attr("fill", "steelblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 4)
        .on("mouseover", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) + 10
            });
            return tooltip.style("visibility", "visible").text(injuriesCount["Total_Uninjured"]);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) - 10
            });
            return tooltip.style("visibility", "hidden");
        });

    let circle2 = chart3svg.append("circle")
        .attr("id", "circle2")
        .attr("r", normalizedInjuries["Total_Serious_Injuries"])
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "purple")
        .attr("stroke", "purple")
        .attr("stroke-width", 4)
        .on("mouseover", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) + 10
            });
            return tooltip.style("visibility", "visible").text(injuriesCount["Total_Serious_Injuries"]);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) - 10
            });
            return tooltip.style("visibility", "hidden");
        });

    let circle3 = chart3svg.append("circle")
        .attr("id", "circle3")
        .attr("r", normalizedInjuries["Total_Fatal_Injuries"])
        .attr("cx", 3 * width / 4)
        .attr("cy", height / 2)
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .on("mouseover", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) + 10
            });
            return tooltip.style("visibility", "visible").text(injuriesCount["Total_Fatal_Injuries"]);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {
            d3.select(this).attr({
                r: parseFloat(d3.select(this).attr("r")) - 10
            });
            return tooltip.style("visibility", "hidden");
        });
}

// Function that will be called when selected data is updated
function updateChart3(context) {
    // console.log('update chart 3');

    var data = context.data;

    let tempInjuriesCount = {"Total_Fatal_Injuries": 0, "Total_Serious_Injuries": 0, "Total_Uninjured": 0};

    data.forEach(d => {
        if (isNumeric(d.Total_Fatal_Injuries)) tempInjuriesCount["Total_Fatal_Injuries"] += parseInt(d.Total_Fatal_Injuries);
        if (isNumeric(d.Total_Serious_Injuries)) tempInjuriesCount["Total_Serious_Injuries"] += parseInt(d.Total_Serious_Injuries);
        if (isNumeric(d.Total_Uninjured)) tempInjuriesCount["Total_Uninjured"] += parseInt(d.Total_Uninjured);
    });

    let tempTotalInjuries = 0;
    for (injury in tempInjuriesCount) {
        tempTotalInjuries += tempInjuriesCount[injury];
    }

    if (tempTotalInjuries != 0) {
        injuriesCount = tempInjuriesCount;
        totalInjuries = tempTotalInjuries;
    }

    var circleMax = globalCircleMax;    
    for (injury in injuriesCount) {
        normalizedInjuries[injury] = injuriesCount[injury] * circleMax / totalInjuries;
    }

    d3.select("#totalText").text("Total Injuries: " + totalInjuries);

    d3.select("#circle1").attr("r", normalizedInjuries["Total_Uninjured"])
    d3.select("#circle2").attr("r", normalizedInjuries["Total_Serious_Injuries"])
    d3.select("#circle3").attr("r", normalizedInjuries["Total_Fatal_Injuries"])
}

function isNumeric(value) {
    return !isNaN(value) && value != '';
}
