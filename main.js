$( document ).ready(function() {
    console.log( "Document loaded." );

    context = {
        startYear: -Infinity,
        endYear: +Infinity,
        data: undefined,
        original_data: undefined
    }


    d3.csv("aircraft_incidents.csv", function(d) {
        // Preprocess loaded data
        return preprocessData(d);
    }, function(data) {
        console.log("Aircraft data loaded.");

        // Create the time bar with a brush.
        context.data = data;
        context.original_data = data;
        createTimeBar(data);
        createChart1(context);
        createChart2(context);
        createChart3(context);
        

    })


});

// Updates all linked charts dependant on the time bar
function updateVis(context){
    // console.log("Context before", context)
    context.data = context.original_data.filter(function(d) {
        return d.Event_Date.getFullYear() >= context.startYear && d.Event_Date.getFullYear() <= context.endYear;
    });
    // console.log("Context after", context);
    updateChart1(context); // Update the first chart. Pass in current context
    updateChart2(context);
    updateChart3(context);
}

function preprocessData(d){
    d.Event_Date = new Date(d.Event_Date); // Convert event date from string to date object
    return d;
}

function createTimeBar(data){

    let margin ={top: 30, right: 30, bottom: 30, left: 40} // Adjusts padding from edge of svg frame

    // Adjust time bar height and width
    let timebar_div_j = $("#timebar");
    let timebarsvg_j = $("#timebarsvg");
    let width = timebar_div_j.width() // Spans the whole screen
    let height = width/5; // Maintain an aspect ratio
    timebarsvg_j.width(width); 
    timebarsvg_j.height(height); 

    let timechart_width = width - margin.right - margin.left;
    let timechart_height = height - margin.top - margin.bottom
    let timechart_left = margin.left;
    let timechart_right = margin.left+timechart_height;
    let timechart_top = margin.top;
    let timechart_bottom = margin.top+timechart_height;

    let xScale = d3.scale.ordinal().rangeBands([0, timechart_width]);
    xDomain = Array.from(new Set(data.map((d) => d.Event_Date.getFullYear()))).sort();
    xScale.domain(xDomain);


    
    let yScale = d3.scale.linear().range([0, timechart_height]);
    let yearCounts = {};
    data.forEach(d => {
        let year = d.Event_Date.getFullYear()
        if (yearCounts[year] === undefined) {
            yearCounts[year] = 1;
        } else {
            yearCounts[year] += 1;
        }
    });
    // console.log(yearCounts);

    yScale.domain([0, d3.max(Object.keys(yearCounts).map((year) => yearCounts[year]))].reverse()); // Set domain to min and max values of accidents in year resolution
    yScale.nice(); // Make it nice
    // console.log(yScale(14))


    bars = d3.select("#timebars");

    

    let yAxis = d3.svg.axis().scale(yScale).orient('left');
    bars.append('g')
            .attr('class', 'y_axis')
            .attr('transform', function(d, i){
                let translate = [timechart_left, timechart_top];
                return "translate("+ translate +")";
            })
            // Call is a special method that lets us invoke a function
            // (called 'yAxis' in this case) which creates the actual
            // yAxis using D3.
            .call(yAxis);

    let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    bars.append('g')
            .attr('class', 'x_axis')
            .attr('transform', function(d, i){
                let translate = [timechart_left, timechart_bottom];
                return "translate("+ translate +")";
            })
            // Call is a special method that lets us invoke a function
            // (called 'yAxis' in this case) which creates the actual
            // yAxis using D3.
            .call(xAxis);




    bars.append('g')
            .attr('id', 'timebar_bars')
            .attr('transform', function(d,i){
                let translate = [timechart_left, timechart_top];
                return "translate("+ translate +")";
            })
            .selectAll()
            .data(Object.keys(yearCounts))
            .enter()
            .append("rect")
            .attr("height", function(year) {
                return timechart_height - yScale(yearCounts[year]);
            })
            .attr("width", function(year){
                let years = Object.keys(yearCounts);
                return xScale(years[1]) - xScale(years[0]); // Widths are distances between consecutive bars
            })
            .attr("y", function(year){
                return yScale(yearCounts[year]);
            })
            .attr("x", function(year) {
                return xScale(year)
            })
            .attr("class", "timebar");
        

    // define brush and limit its size
    brush = d3.svg.brush().extent([[timechart_left, timechart_bottom],[timechart_right, timechart_top]]);

    // 1D brush
    brushX = xScale

    brush.x(brushX)

    brush
    .on("brushstart", brushstart)   // when mousedown&dragging starts 
    .on("brush", brushing)          // when dragging
    .on("brushend", brushend);      // when mouseup
    

    // 3. bind brush to DOM
    bars.append("g")
    .attr("class", "brush")
    .call(brush)
    .attr('transform', function(d,i){
        let translate = [timechart_left, timechart_top];
        return "translate("+ translate +")";
    })
    .selectAll("rect")
    .attr("y", 0)
    .attr("height", timechart_height);



}

function brushstart(){
    // Reset ranges
    context.startYear = Infinity;
    context.endYear = -Infinity;
}

function brushing(){
    let e = brush.extent();         // coordinates of brushed area: 

    bars.selectAll('rect').classed("brushed", function(year) {
        let yearStartX = brushX(year); // Start X coord of year bar in question
        let yearEndX = yearStartX + brushX(xDomain[1]);
        let yearMidX = (yearStartX+yearEndX)/2; // End X of year bar in question
        let toBrush = (e[0] <= yearStartX && e[1] >= yearMidX) || (e[0] <= yearMidX && e[1] >= yearEndX); // Brush if majority of area is within extent
        
        if(toBrush){
            context.startYear = Math.min(context.startYear, year);
            context.endYear = Math.max(context.endYear, year);
        }
        return toBrush;
    });

    updateVis(context); // Update all visualizations

    

}

function brushend(){


}

function valueToRgb(value, minValue, maxValue) {

    let inter = d3.interpolateRgb(d3.rgb(255,0,0), d3.rgb(0,0,255)); // Interpolator between red and green
    

    // Map min and max to [0,1] linearly
    // Two point formula: x1 = minValue, x2 = maxValue, y1 = 0, y2 = 1, x = value, y = ?
    let minmax_linear = ((1 - 0)/(maxValue - minValue))*(value - maxValue) + 1;

    // console.log("minvalue", minValue)
    // console.log("maxval", maxValue)
    // console.log("value", value)
    // console.log("linear", minmax_linear)
    return inter(minmax_linear); 
    // console.log(minmax_linear)
    // // Two point formula: x1 = -255, x2 = 255, y1 = 0, y2 = 1, x = ?, y = minmax_linear
    // let rgb_linear = 255*2*minmax_linear - 255
    // // let rgb_linear = (255*2)*minmax_linear - 255;
    // // var linear = value / maxValue * (255 * 2) - 255;
    // if (rgb_linear >= 0){
    //     return "rgb("+rgb_linear+", 0, 0)";
    // } 
    // return "rgb(0, 0, " + Math.abs(rgb_linear) + ")";
}
