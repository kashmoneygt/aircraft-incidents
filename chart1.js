var phases = ["Standing", "Taxi", "Takeoff", "Climb", "Cruise", "Descent", "Approach", "Landing"];

function createChart1(context) {
    console.log('chart 1');

    let chart1_j = $("#chart1");
    let chart1svg_j = $("#chart1svg");
    let width = chart1_j.width();
    let height = width/3; // Maintain an aspect ratio
    chart1svg_j.width(width); 
    chart1svg_j.height(height); 

    let chart1svg = d3.select("#chart1svg");

    let numPhases = 8;
    let startPosX = 30;
    let startPosY = height - 75;
    let planeSpacingX = width / 8;
    let planeSpacingY = height / 6;

    var x = d3.scale.ordinal()
        .domain(phases)
        .rangePoints([startPosX, startPosX + planeSpacingX * (numPhases - 1)]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    chart1svg.append('g')
        .attr('class', 'x axis')
        .attr("transform", "translate(0," + (height - 25) + ")")
        .call(xAxis);

    for (var i = 1; i <= numPhases; i++) {

        if (i >= 3 && i <= 5) {
            startPosY -= planeSpacingY;
        } else if (i >= 6) {
            startPosY += planeSpacingY;
        }

        var planeAttr = "m" + startPosX + "," + startPosY + ",c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z";
        startPosX += planeSpacingX;

        chart1svg.append("path")
            .attr("id", "plane" + phases[i - 1])
            .attr("class", "plane")
            .attr("d", planeAttr);

    }

    var data = context.data;

    let phaseCounts = {};
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

    let totalCrashes = 0;
    for (phase in phaseCounts) {
        totalCrashes += phaseCounts[phase];
    }

    for (var phase in phaseCounts) {
        var phaseId = "#plane" + phase.toProperCase();
        var rgb = valueToRgb(phaseCounts[phase], totalCrashes);

        d3.select(phaseId)
            .attr("fill", rgb);
    }
}


// Function that will be called when selected data is updated
function updateChart1(context) {
    console.log('update chart 1');

    var data = context.data;

    let phaseCounts = {};
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

    let totalCrashes = 0;
    for (phase in phaseCounts) {
        totalCrashes += phaseCounts[phase];
    }

    for (var phase in phaseCounts) {
        var phaseId = "#plane" + phase.toProperCase();
        var rgb = valueToRgb(phaseCounts[phase], totalCrashes);

        d3.select(phaseId)
            .attr("fill", rgb);
    }

    // console.log(phaseCounts);
    // console.log(totalCrashes);
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
