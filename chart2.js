abbreviation_map = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

function createChart2(context){

    c2_tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

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

   if(context.data.length == 0){
       return;
   }


    let state_to_accident_map = {};
    for(let i = 0; i < Object.values(abbreviation_map).length; i++){
        state_to_accident_map[Object.values(abbreviation_map)[i]] = 0;
    }
    context.totalCrashes = 0
    for(let i = 0; i < context.data.length; i++){
        let d = context.data[i];

        if(d.Country == "United States"){
            let location = d.Location;
            if(location != ""){
                let state = location.split(",")[1].trim().toUpperCase();
                
                let fullstate = abbreviation_map[state];
                if(fullstate != undefined){
                    if(state_to_accident_map[fullstate] != undefined){
                        state_to_accident_map[fullstate] += 1;
                        context.totalCrashes += 1;
                    } else {
                        state_to_accident_map[fullstate] = 0
                    }
                }
            }
        }
    }

    // D3 Projection
    projection = d3.geo.albersUsa()
    .translate([context.chart2width/2, context.chart2height/2])    // translate to center of screen
    .scale([600]);          // scale things down so see entire US

    // Define path generator
    let path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell path generator to use albersUsa projection

    let maxval = Object.values(state_to_accident_map).reduce((prev, l) => Math.max(prev, l), -Infinity)
    let minval = Object.values(state_to_accident_map).reduce((prev, l) => Math.min(prev, l), +Infinity)

    context.chart2svg.selectAll(".uspath").remove();
    // console.log(context.us_state_json)
    // Bind the data to the SVG and create one path per GeoJSON feature
    // console.log(state_to_accident_map);
    context.chart2svg.selectAll("path")
    .data(context.us_state_json.features)
    .enter()
    .append("path")
    .attr("class", "uspath")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) {
    let fullstate_name = d.properties.name;
    // return "rgb(213,222,217)";
    // console.log(maxval)
    if(state_to_accident_map[fullstate_name] == undefined){
        console.error(fullstate_name)
    }
    return valueToRgb(state_to_accident_map[fullstate_name], minval, maxval);
    })
    .on("mouseover", function(d) {
        let fullstate_name = d.properties.name;
        // return "rgb(213,222,217)";
        // console.log(maxval)
        if(state_to_accident_map[fullstate_name] == undefined){
            console.error(fullstate_name)
        }
        return c2_tooltip.style("visibility", "visible").style("color", "#7FFF00").text(state_to_accident_map[fullstate_name]);
    })
    .on("mousemove", function(){return c2_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function() {return c2_tooltip.style("visibility", "hidden");});;


}