function createChart2(context){
    //Width and height of map
    context.chart2width = $("#chart1").width();
    context.chart2height = $("#chart1svg").height();
    

            


    context.chart2svg = d3.select("#chart2svg")
                .attr("width", context.chart2width)
                .attr("height", context.chart2height);

            

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", function(json) {

        context.us_state_json = json;
        
        updateChart2(context);
        

            
    });
}

function updateChart2(context){

    // D3 Projection
    let projection = d3.geo.albersUsa()
                    .translate([context.chart2width/2, context.chart2height/2])    // translate to center of screen
                    .scale([600]);          // scale things down so see entire US

    // Define path generator
    let path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                .projection(projection);  // tell path generator to use albersUsa projection
    
    console.log(context.us_state_json)
    // Bind the data to the SVG and create one path per GeoJSON feature
    context.chart2svg.selectAll("path")
    .data(context.us_state_json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) {
        // console.log(d)
        return "rgb(213,222,217)";
    });

    // console.log(context.data)
    // context.chart2svg.selectAll("circle")
    //     .data(context.data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d){
    //         if(d.Country == "United States" && !isNaN(parseFloat(d.Longitude))){
    //             console.log(d);
    //             d.Longitude = parseFloat(d.Longitude);
    //             d.Latitude = parseFloat(d.Latitude);
    //             return projection([d.Longitude, d.Latitude])[0]
    //         }
    //     })
    //     .attr("cy", function(d){
    //         if(d.Country == "United States" && !isNaN(parseFloat(d.Longitude))){
    //             return projection([d.Longitude, d.Latitude])[1]
    //         }
    //     })
    //     .attr("r", 2)
    //     .style("fill", "black")
}