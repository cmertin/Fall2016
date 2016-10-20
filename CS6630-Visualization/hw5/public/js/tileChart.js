/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 50;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)");

    self.svg = divTileChart.append("svg")
                           .attr("width",self.svgWidth)
                           .attr("height",self.svgHeight)
                           .attr("transform", "translate(" + self.margin.left + ",0)")
                           .style("bgcolor","green");

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+" ("+row.percentage+")" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return +d["Space"];
                            }) + 1;

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return +d["Row"];
                        }) + 1;

    var rowScale = d3.scaleLinear().rangeRound([0,self.svgHeight]).domain([0,self.maxRows]);
    var colScale = d3.scaleLinear().rangeRound([0,self.svgWidth]).domain([0,self.maxColumns]);
    var blockWidth = rowScale(1) - rowScale(0);
    var blockHeight = colScale(1) - colScale(0);

    var repData = {"nominee": electionResult[0].R_Nominee_prop, "votecount": electionResult[0].R_Votes, "percentage":electionResult[0].R_PopularPercentage, "party":"R"};
    var demData = {"nominee": electionResult[0].D_Nominee_prop, "votecount": electionResult[0].D_Votes, "percentage":electionResult[0].D_PopularPercentage, "party":"D"};
    var indData = {"nominee": electionResult[0].I_Nominee_prop, "votecount": electionResult[0].I_Votes, "percentage":electionResult[0].I_PopularPercentage, "party":"I"};

    if(parseInt(indData.percentage) > 0)
    {
      var results = [indData, demData, repData];
    }
    else
    {
      var results = [demData, repData];
    }

    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,3*blockHeight];
        })
        .html(function(d) {
            tooltip_data = {"state":d.State,
                            "winner":d.State_Winner,
                            "electoralVotes":d.Total_EV,
                            "result":results};
            var tooltip_html = TileChart.prototype.tooltip_render(tooltip_data);
            return tooltip_html;
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile")
        .classed("legendtext", true);

    var legendQuantile = d3.legendColor()
        .shapeWidth(self.svgWidth/12.5)
        .cells(10)
        .orient("horizontal")
        .scale(colorScale);



    var legend = d3.select(".legendQuantile");
    legend.selectAll("#legendCells").exit().remove();
    legend.call(legendQuantile);
    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    var tileSelect = d3.select("#tiles").select("svg");

    tileSelect.call(tip);

    tileSelect.selectAll("rect").remove();
    tileSelect.selectAll("text").remove();

    var tiles = tileSelect.selectAll("rect")
                                       .data(electionResult).enter().append("rect")
                                       .on("mouseover", tip.show)
                                       .on("mouseout", tip.hide)
                                       .attr("x", function(d) {return colScale(+d.Space)})
                                       .attr("y", function(d) {return rowScale(+d.Row)})
                                       .classed("tile", true)
                                       .transition().duration(1000)
                                       .attr("width", blockHeight)
                                       .attr("height", blockWidth)
                                       .attr("fill", function(d) {
                                         if(d.State_Winner == "I")
                                         {return "#45AD6A";}
                                         else
                                         {
                                           return colorScale(d.RD_Difference);
                                         }});

    var text = tileSelect.selectAll("text").data(electionResult).enter();

    text.append("text")
        .classed("tilestext", true)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .text(function(d) {return d.Abbreviation})
        .transition().duration(1000)
        .attr("x", function(d) {return colScale(+d.Space) + blockHeight/2})
        .attr("y", function(d) {return rowScale(+d.Row) + blockWidth/2});

    text.append("text")
        .classed("tilestext", true)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .text(function(d) {return d.Total_EV})
        .transition().duration(1000)
        .attr("x", function(d) {return colScale(+d.Space) + blockHeight/2})
        .attr("y", function(d) {return rowScale(+d.Row) + blockWidth/2 + 12.5});


    //text.append("text").classed("tilestext",true)

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
