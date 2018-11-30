function createChart4(context){

    color_c4 =  d3.scale.category20c();     //builtin range of colors

    damage_cats = context.original_data.map(function(d){
        return d.Aircraft_Damage;
    }).filter((d)=>d!="");

    damage_cats = Array.from(new Set(damage_cats)); // Unique aircraft damage categories


    let margin ={top: 30, right: 30, bottom: 30, left: 40} // Adjusts padding from edge of svg frame

    // Adjust time bar height and width
    let chart4_div_j = $("#chart4");
    let chart4svg_j = $("#chart4svg");
    let width = chart4_div_j.width() // Spans the whole screen
    // let height = width/5; // Maintain an aspect ratio
    chart4svg_j.width(width); 
    let height = $("#chart3svg").height();
    chart4svg_j.height(height); 

    let chart4_width = width - margin.right - margin.left;
    let chart4_height = height - margin.top - margin.bottom;
    let chart4_left = margin.left;
    let chart4_right = margin.left+chart4_height;
    let chart4_top = margin.top;
    let chart4_bottom = margin.top+chart4_height;


    r_c4 = Math.min(Math.abs(chart4_right- chart4_left), Math.abs(chart4_top - chart4_bottom))/2; // Radius should avoid margins


    chart4_vis = d3.select("#chart4svg").append("g")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")"); // Translate group to center

    chart4_x_scale = d3.scale.ordinal()
    .domain(damage_cats)
    .rangeBands([0, chart4_width]);

    updateChart4(context);
   
}

function updateChart4(context){

    if(context.data.length == 0){
        return;
    }
    
    let data = [];

    damage_dict = {};
    damage_cats.forEach(d => {
        damage_dict[d] = 0;
    });

    let total = 0;
    context.data.forEach(d => {
        if (d.Aircraft_Damage != ""){
            damage_dict[d.Aircraft_Damage] += 1;
            total += 1;
        }
    });

    Object.keys(damage_dict).forEach(key =>{
        data.push({
            "label": key,
            "value": damage_dict[key]/total, // Percent of total accidents with this damage.
            "actual": damage_dict[key]
        });
    })

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
    .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

    console.log(pie(data))

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r_c4);

    chart4_vis.selectAll("g.slice").remove();
    var arcs = chart4_vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie(data))                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice")
                .on("mouseover", function(d) {
                    
                    return c2_tooltip.style("visibility", "visible").style("color", "#7FFF00").text(Math.round((d.data.value*100)*100)/100+ "% (" + d.data.actual+")");
                })
                .on("mousemove", function(){return c2_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                .on("mouseout", function() {return c2_tooltip.style("visibility", "hidden");});    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
            .attr("fill", function(d, i) { 
                if(d.data.label == "Destroyed"){
                    return "red"
                } else if (d.data.label == "Substantial"){
                    return "purple"
                } else {
                    return "blue"
                }
        } ) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    arcs.append("svg:text")                                     //add a label to each slice
            .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = r_c4;
            return "translate(" + arc.centroid(d) + ")" + " scale(0.7,0.7)";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("fill", "white")
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });        //get the label from our original data array


}