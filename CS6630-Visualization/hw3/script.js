// Global var for FIFA world cup data
var allWorldCupData;


/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {

    var margin = {top: 50, right: 10, left: 60, bottom: 50};
    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    var width = svgBounds.width - margin.right - margin.left;
    var height = svgBounds.height - margin.top;


    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes
    allWorldCupData.sort(function(a,b) {return a.year - b.year;});
    var minY = d3.min(allWorldCupData, function(d) {return d[selectedDimension];});
    var maxY = d3.max(allWorldCupData, function(d) {return d[selectedDimension];});

    var x = d3.scaleBand().rangeRound([margin.left, width + margin.left + margin.right])
                          .paddingInner(0.05)
                          .domain(allWorldCupData.map(function(d) {return d.year;}));

    var y = d3.scaleLinear().range([height, margin.bottom])
                            .domain([0, maxY]);

    // Create colorScale
    var colorScale = d3.scaleLinear()
                // notice the three interpolation points
                .domain([minY, maxY])
               // each color matches to an interpolation point
                .range(["DodgerBlue", "darkblue"]);

    // Create the axes (hint: use #xAxis and #yAxis)
    var xAxis = d3.axisBottom(x);
    svg = d3.selectAll("#xAxis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis)
                          .selectAll("text")
                              .attr("dy", "-.3em")
                              .attr("dx", "-.6em")
                              .attr("transform", "rotate(-90)")
                              .attr("text-anchor", "end");

    var yAxis = d3.axisLeft(y);
    svg = d3.selectAll("#yAxis")
                          .attr("transform", "translate(" + margin.left + ",0)")
                          .transition().duration(1000)
                          .call(yAxis);

    // Create the bars (hint: use #bars)
    svg = d3.select("#barChart").selectAll("rect");
    var bars = svg.data(allWorldCupData);
    bars.exit().remove();
    bars = bars.enter().append("rect").merge(bars).transition().duration(1000);

    bars.style("fill", function(d) {return colorScale(d[selectedDimension])})
        .attr("x", function(d) {return x(d.year);})
        .attr("width", x.bandwidth())
        .attr("y", function(d) {return y(d[selectedDimension]);})
        .attr("height", function(d) {return height - y(d[selectedDimension]);});

    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.

    d3.selectAll("#barChart rect")
    //    .on("mouseover", function() {
    //      d3.select(this).style("fill", 'darkred');})
        .on("click", function() {
          svg = d3.select("#barChart").selectAll("rect");
          var bars = svg.data(allWorldCupData);
          bars.exit().remove();
          bars = bars.enter().append("rect").merge(bars);

          bars.style("fill", function(d) {return colorScale(d[selectedDimension])})
              .attr("x", function(d) {return x(d.year);})
              .attr("width", x.bandwidth())
              .attr("y", function(d) {return y(d[selectedDimension]);})
              .attr("height", function(d) {return height - y(d[selectedDimension]);});

          d3.select(this).style('fill', '#d20a11');
          var temp = d3.select(this).attr("x");
          var index = -1;
          for(var i = 0; i < allWorldCupData.length; i++)
          {
            var tempScale = x(allWorldCupData[i].year);
            if(tempScale == temp)
              index = i;
          }
          updateInfo(index);
          updateMap(index);});
    //    .on("mouseout", function() {
    //      d3.select(this).style('fill',function(d) {return colorScale(d[selectedDimension]);});});

}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.
    var selected = document.getElementById("dataset").value;
    //console.log(selected);
    updateBarChart(selected);
}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    // Changes the edition name
    document.getElementById("edition").innerHTML = allWorldCupData[oneWorldCup].EDITION;

    document.getElementById("host").innerHTML = allWorldCupData[oneWorldCup].host;

    document.getElementById("winner").innerHTML = allWorldCupData[oneWorldCup].winner;

    document.getElementById("silver").innerHTML = allWorldCupData[oneWorldCup].runner_up;

    var teams = allWorldCupData[oneWorldCup].TEAM_NAMES;
    teams = teams.split(',');
    teams.sort();

    var list = "<ul>\n";
    for(var i = 0; i < teams.length; i++)
        {
          list = list + "  <li>" + teams[i] + "</li>\n";
        }
    list = list + "</ul>\n";

    document.getElementById("teams").innerHTML = list;
}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);
    var path = d3.geoPath().projection(projection);
    var graticule = d3.geoGraticule();
    var svg = d3.selectAll("g#map");
    var g = svg.append("g");


    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)

    var countries = topojson.feature(world, world.objects.countries);
    g.selectAll("path")
     .data(countries.features)
     .enter()
     .append("path")
     .attr("class", "countries")
     .attr("id", function(d) {return d.id;})
     .attr("d", path);

    g.append("path")
     .datum(graticule)
     .attr("class", "grat")
     .attr("d", path);
}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART V*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

    var teams = d3.select("#map").selectAll(".team").attr("class", "countries");
    var host = d3.select("#map").selectAll(".host").attr("class", "countries");
    d3.select("#win_circ").remove();
    d3.select("#run_circ").remove();
}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.

    var host = allWorldCupData[worldcupData].host_country_code;
    var teams = allWorldCupData[worldcupData].TEAM_LIST;
    teams = teams.split(',');

    for(var i = 0; i < teams.length; i++)
      document.getElementById(teams[i]).setAttribute("class", "team");

    document.getElementById(host).setAttribute("class", "host");

    var win = [allWorldCupData[worldcupData].WIN_LON, allWorldCupData[worldcupData].WIN_LAT];
    var run = [allWorldCupData[worldcupData].RUP_LON, allWorldCupData[worldcupData].RUP_LAT];

    var svg = d3.select("#points").selectAll("circ")
                                .data([1])
                                .enter()
                                .append("circle")
                                    .attr("cx", function(d) {return projection(win)[0];})
                                    .attr("cy", function(d) {return projection(win)[1];})
                                    .attr("r", 8)
                                    .attr("id", "win_circ")
                                    .attr("class", "gold");
    svg = d3.select("#points").selectAll("circ")
                               .data([1])
                               .enter()
                               .append("circle")
                                    .attr("cx", function(d) {return projection(run)[0];})
                                    .attr("cy", function(d) {return projection(run)[1];})
                                    .attr("r", 8)
                                    .attr("id", "run_circ")
                                    .attr("class", "silver");

}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');

    //console.log(allWorldCupData[1]);
});
