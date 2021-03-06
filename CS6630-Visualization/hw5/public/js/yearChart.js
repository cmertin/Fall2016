/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    var self = this;

    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.circleRadius = 7;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 80;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;

    //Domain definition for global color scale
    var colorDomain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var colorRange = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(colorDomain).range(colorRange);

    self.yearScale = d3.scaleLinear()
                       .domain([0, self.electionWinners.length])
                       .range([self.margin.left, self.svgWidth]);

    // ******* TODO: PART I *******
    var svg = d3.select("#year-chart").select("svg");


    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    svg.selectAll("line").data([0]).enter().append("line")
                         .attr("y1", self.svgHeight/2)
                         .attr("x1", 0)
                         .attr("y2", self.svgHeight/2)
                         .attr("x2", self.svgWidth)
                         .classed("lineChart", true);

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    svg.selectAll("circle").data(self.electionWinners).enter().append("circle")
                                  .attr("cx", function(d,i) {return self.yearScale(i);})
                                  .attr("cy", self.svgHeight/2).attr("r", self.circleRadius)
                                  .attr("class", function(d) {return YearChart.prototype.chooseClass(d.PARTY);});

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    svg.selectAll("text").data(self.electionWinners).enter().append("text")
                         .attr("class", "yeartext")
                         .text(function(d) {return d.YEAR})
                         .attr("x", function(d,i) {return self.yearScale(i);})
                         .attr("y", self.svgHeight/2 + 30);

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    svg.selectAll("circle").on("click", function(d,i) {
      var oldSelect = svg.selectAll("circle").classed("selected", false);
      d3.select(this).classed("selected", true);
      var electionFile = "data/Year_Timeline_" + d.YEAR + ".csv";
      d3.csv(electionFile, function (error, electionResult) {
          self.electoralVoteChart.update(electionResult, self.colorScale);
          self.votePercentageChart.update(electionResult, self.colorScale);
          self.tileChart.update(electionResult, self.colorScale);
      });
    })
    .on("mouseover", function(d,i) {
      d3.select(this).classed("highlighted", true);
    })
    .on("mouseout", function(d,i){
      var oldSelect = svg.selectAll("circle").classed("highlighted", false);
    });

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
};
