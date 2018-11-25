$( document ).ready(function() {
    console.log( "Document loaded." );


    d3.csv("aircraft_incidents.csv", function(d) {
        // Preprocess loaded data
        return preprocessData(d);
    }, function(data) {
        console.log("Aircraft data loaded.");

        // Create the time bar with a brush.
        createTimeBar(data);

    })


});

function preprocessData(d){
    d.Event_Date = new Date(d.Event_Date); // Convert event date from string to date object
    return d;
}

function createTimeBar(data){

    let margin ={top: 30, right: 30, bottom: 30, left: 30} // Adjusts padding from edge of svg frame

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
    let xDomain = Array.from(new Set(data.map((d) => d.Event_Date.getFullYear()))).sort();
    xScale.domain(xDomain);
    console.log(xDomain);
    console.log(xScale(2000));


    
     yScale = d3.scale.linear().range([0, timechart_height]);
    let yearCounts = {};
    data.forEach(d => {
        let year = d.Event_Date.getFullYear()
        if (yearCounts[year] === undefined) {
            yearCounts[year] = 1;
        } else {
            yearCounts[year] += 1;
        }
    });
    console.log(yearCounts);

    yScale.domain([0, d3.max(Object.keys(yearCounts).map((year) => yearCounts[year]))].reverse()); // Set domain to min and max values of accidents in year resolution
    yScale.nice(); // Make it nice
    // console.log(yScale(14))


    let bars = d3.select("#timebars");

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
            .selectAll("circle")
            .data(Object.keys(yearCounts))
            .enter()
            .append("rect")
            .attr("height", function(year) {
                return yearCounts[year];
            })
            .attr("width", 50)
            .attr("y", function(year){
                return yScale(yearCounts[year]);
            })




}