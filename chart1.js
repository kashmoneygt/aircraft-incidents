var phases = ["Standing", "Taxi", "Takeoff", "Climb", "Cruise", "Descent", "Approach", "Landing"];
let totalIncidents = 0;
let phaseCounts = {};

function createChart1(context) {
    // console.log('chart 1');

    let chart1_j = $("#chart1");
    let chart1svg_j = $("#chart1svg");
    let width = chart1_j.width();
    let height = width/2; // Maintain an aspect ratio
    chart1svg_j.width(width); 
    chart1svg_j.height(height + 20); 

    let chart1svg = d3.select("#chart1svg")
        .attr("height", height + 20);

    let numPhases = 8;
    let startPosX = 30;
    let startPosY = height - 75;
    let planeSpacingX = width / 8;
    let planeSpacingY = height / 5;

    // console.log(startPosX) // 30
    // console.log(startPosY) // 202.5
    // console.log(planeSpacingX) // 69.375
    // console.log(planeSpacingY) // 55.5
    // console.log(width) //555
    // console.log(height) //277.5

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var x = d3.scale.ordinal()
        .domain(phases)
        .rangePoints([startPosX, startPosX + planeSpacingX * (numPhases - 1)]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var axis = chart1svg.append('g')
        .attr('class', 'x axis')
        .attr("transform", "translate(0," + (height - 25) + ")")
        .call(xAxis);

    // text label for the x axis
    chart1svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + 15) + ")")
        .style("text-anchor", "middle")
        .text("Phase of Flight");

    // text label for the y axis
    chart1svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (height / 2) + 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Incidents");

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "rotate("+ 90 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[0])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[0].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + planeSpacingX + "," + (-1 * planeSpacingX) + ") rotate("+ 90 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[1])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[1].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY -= planeSpacingY;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + (0) + "," + (-2 * planeSpacingY) + ") rotate("+ 45 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[2])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[2].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY -= planeSpacingY;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + (-20) + "," + (-3 * planeSpacingY) + ") rotate("+ 45 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[3])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[3].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY -= planeSpacingY;
    
    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";    
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + (startPosX / 3) + "," + (-7.5 * planeSpacingY) + ") rotate("+ 90 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[4])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[4].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY -= planeSpacingY;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + (startPosX + planeSpacingY) + "," + (-9 * planeSpacingY) + ") rotate("+ 135 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[5])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[5].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY += planeSpacingY;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" + (startPosX / 3 * 4) + "," + (-8.5 * planeSpacingY) + ") rotate("+ 135 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[6])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[6].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    startPosX += planeSpacingX;
    startPosY += planeSpacingY;

    var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
    var group = chart1svg.append("g")
    .attr("transform", "translate(" +  (startPosX / 3 * 2.15) + "," + (-8.75 * planeSpacingY) + ") rotate("+ 90 +","+30+","+(height - 50)+")");
    group.append("path")
        .attr("id", "plane" + phases[7])
        .attr("class", "plane")
        .attr("d", planeAttr)
        .on("mouseover", function() {return tooltip.style("visibility", "visible").text(phaseCounts[phases[7].toUpperCase()]);})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function() {return tooltip.style("visibility", "hidden");});

    var data = context.data;

    data.forEach(d => {
        let phase = d.Broad_Phase_of_Flight;
        if (phases.includes(phase.toProperCase())) {
            if (phaseCounts[phase] === undefined) {
                phaseCounts[phase] = 1;
            } else {
                phaseCounts[phase] += 1;
            }
        }
    });

    for (key in phaseCounts) {
        totalIncidents += phaseCounts[key];
    }
        
    var totalText = chart1svg
        .append("text")
        .attr("id", "totalIncidentText")
        .attr("x", 2)
        .attr("y", 13)
        .text("Total Incidents: " + totalIncidents);

    let maxval = Object.values(phaseCounts).reduce((prev, l) => Math.max(prev, l), -Infinity)
    let minval = Object.values(phaseCounts).reduce((prev, l) => Math.min(prev, l), +Infinity)
    
    for (var phase in phaseCounts) {
        var phaseId = "#plane" + phase.toProperCase();
        var rgb = valueToRgb(phaseCounts[phase], minval, maxval);

        d3.select(phaseId)
            .attr("fill", rgb);
    }
}


// Function that will be called when selected data is updated
function updateChart1(context) {
    // console.log('update chart 1');

    var data = context.data;

    let tempPhaseCounts = {};

    data.forEach(d => {
        let phase = d.Broad_Phase_of_Flight;
        if (phases.includes(phase.toProperCase())) {
            if (tempPhaseCounts[phase] === undefined) {
                tempPhaseCounts[phase] = 1;
            } else {
                tempPhaseCounts[phase] += 1;
            }
        }
    });

    let tempTotalIncidents = 0;
    for (key in tempPhaseCounts) {
        tempTotalIncidents += tempPhaseCounts[key];
    }

    if (tempTotalIncidents != 0) {
        totalIncidents = tempTotalIncidents;
        phaseCounts = tempPhaseCounts;
    }

    d3.select("#totalIncidentText").text("Total Incidents: " + totalIncidents);

    let maxval = Object.values(phaseCounts).reduce((prev, l) => Math.max(prev, l), -Infinity)
    let minval = Object.values(phaseCounts).reduce((prev, l) => Math.min(prev, l), +Infinity)
    
    for (var phase in phaseCounts) {
        var phaseId = "#plane" + phase.toProperCase();
        var rgb = valueToRgb(phaseCounts[phase], minval, maxval);

        d3.select(phaseId)
            .attr("fill", rgb);
    }
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
