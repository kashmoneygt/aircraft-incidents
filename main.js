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

    let xScale = d3.scale.linear().range([0, timechart_width]);
    xScale.domain(data.map((d) => d.Event_Date.getFullYear()));


    let timechart_height = height - margin.top - margin.bottom
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


    let bars = d3.select("#timebars");

    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    bars.append('g')
            .attr('class', 'y axis')
            .attr('transform', function(d, i){
                let translate = [margin.left, margin.top];
                return "translate("+ translate +")";
            })
            // Call is a special method that lets us invoke a function
            // (called 'yAxis' in this case) which creates the actual
            // yAxis using D3.
            .call(yAxis);



}