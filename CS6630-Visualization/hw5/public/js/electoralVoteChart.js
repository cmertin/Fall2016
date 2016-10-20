/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;
    console.log(self.svgWidth);

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    var barHeight = 25;

    var evScale = d3.scaleLinear().range([0, self.svgWidth])
                                  .domain([0, d3.sum(electionResult, function(d) {return d.Total_EV})]);

    var indStates = electionResult.filter(function(d) {return d.State_Winner == "I";});
    var demStates = electionResult.filter(function(d) {return d.State_Winner == "D";});
    var repStates = electionResult.filter(function(d) {return d.State_Winner == "R";});

    indStates = indStates.sort(function(a,b) {return d3.descending(+a.RD_Difference, +b.RD_Difference)});
    demStates = demStates.sort(function(a,b) {return d3.ascending(+a.RD_Difference, +b.RD_Difference)});
    repStates = repStates.sort(function(a,b) {return d3.ascending(+a.RD_Difference, +b.RD_Difference)});

    //console.log(electionResult);

    if(indStates.length > 0)
    {
      var evResult = indStates.concat(demStates);
      evResult = evResult.concat(repStates);
    }
    else
    {
      var evResult = demStates.concat(repStates);
    }

    var evChart = d3.select("#electoral-vote").select("svg");

    evChart.selectAll("rect").remove();
    evChart.selectAll("text").remove();
    evChart.selectAll("line").remove();

    var bars = evChart.selectAll('rect').data(evResult).enter()
                      .append('rect')
                      .attr("fill", function(d) {
                      if(d.State_Winner == "I")
                      {return "#45AD6A";}
                      else {return colorScale(d.RD_Difference);}})
                      .attr("y", self.svgHeight/2)
                      .attr("height", barHeight)
                      .classed("votesPercentage", true).transition().duration(1000)
                      .attr("x", function (d,i) {return evScale(d3.sum(evResult.slice(0,i), function(d) {return d.Total_EV}))})
                      .attr('width', function (d) {return evScale(d.Total_EV)});


      var line = evChart.selectAll("line").data([0]).enter().append("line").classed("midLine", true).transition().duration(1000)
                        .attr("y1", self.svgHeight/2 + barHeight + 10)
                        .attr("x1", evScale(270))
                        .attr("y2", self.svgHeight/2 - 10)
                        .attr("x2", evScale(270));

      var text = evChart.selectAll("text").data([0]).enter().append("text").classed("electoralVotesNote", true)
                        .transition().duration(1000)
                        .attr("y", self.svgHeight/2 - 15)
                        .attr("x", evScale(270))
                        .text("Electoral Votes (270 to win)");

      if(indStates.length > 0)
      {
        evVal = d3.sum(indStates, function(d) {return d.Total_EV});
        evChart.append("text")
                      .classed("independent", true)
                      .classed("electoralVoteText", true)
                      .transition().duration(1000)
                      .attr("y", self.svgHeight/2 - 5)
                      .attr("x", 0)
                      .text(evVal);
      }
        evVal = d3.sum(demStates, function(d) {return d.Total_EV});
        evChart.append("text")
                      .classed("democrat", true)
                      .classed("electoralVoteText", true)
                      .transition().duration(1000)
                      .attr("y", self.svgHeight/2 - 5)
                      .attr("x", evScale(d3.sum(indStates, function(d) {return d.Total_EV})))
                      .text(evVal);

        evVal = d3.sum(repStates, function(d) {return d.Total_EV});
        evChart.append("text")
                      .classed("republican", true)
                      .classed("electoralVoteText", true)
                      .transition().duration(1000)
                      .attr("y", self.svgHeight/2 - 5)
                      .attr("x", evScale(d3.sum(electionResult, function(d) {return d.Total_EV})))
                      .text(evVal);

    //.attr('fill', function (d) {return colorScale(d.RD_Difference)})

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
