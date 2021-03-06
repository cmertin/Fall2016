/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+" ("+row.percentage+")" + "</li>"
    });
    text += "</ul>";

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    function parsePercentage(val)
    {
      var temp = val.slice(0, -1);
      return parseFloat(temp);
    }

    var barHeight = 25;

    var repData = {"nominee": electionResult[0].R_Nominee_prop, "votecount": electionResult[0].R_Votes, "percentage":electionResult[0].R_PopularPercentage, "party":"R"};
    var demData = {"nominee": electionResult[0].D_Nominee_prop, "votecount": electionResult[0].D_Votes, "percentage":electionResult[0].D_PopularPercentage, "party":"D"}
    var indData = {"nominee": electionResult[0].I_Nominee_prop, "votecount": electionResult[0].I_Votes, "percentage":electionResult[0].I_PopularPercentage, "party":"I"}

    if(parseInt(indData.percentage) > 0)
    {
        var tooltip_data = {"result":[demData, repData, indData]};
        var data = [indData, demData, repData];
    }
    else
    {
        var tooltip_data = {"result":[demData, repData]};
        var data = [demData, repData];
    }
    var percentageScale = d3.scaleLinear().range([0, self.svgWidth])
                                          .domain([0,100]);

    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            var tooltip_html = VotePercentageChart.prototype.tooltip_render(tooltip_data);
            return tooltip_html;
        });



    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    var popChart = d3.select("#votes-percentage").select("svg");

    popChart.call(tip);

    popChart.selectAll("rect").remove();
    popChart.selectAll("text").remove();
    popChart.selectAll("line").remove();

    var bars = popChart.selectAll("rect").data(data).enter().append("rect")
                      .attr("y", self.svgHeight/2)
                      .attr("height", barHeight)
                      .attr("class", function(d){
                        if(d.party == "I")
                        {return "independent";}
                        else if(d.party == "D")
                        {return "democrat";}
                        else
                        {return "republican";}
                      })
                      .on("mouseover", tip.show)
                      .on("mouseout", tip.hide)
                      .transition().duration(1000)
                      .attr("x", function(d,i){
                        if(i > 0)
                        {
                          var pre_percentage = 0;
                          for(j = 0; j < i; ++j)
                            {
                              pre_percentage = pre_percentage + parsePercentage(data[j].percentage);
                            }

                          return percentageScale(pre_percentage);
                        }
                        else
                        {
                          return 0;
                        }
                      })
                      .attr("width", function(d) {
                                      return percentageScale(parsePercentage(d.percentage));});

      var line = popChart.append("line").classed("midLine", true)
                        .transition().duration(1000)
                        .attr("y1", self.svgHeight/2 + barHeight + 10)
                        .attr("x1", percentageScale(50))
                        .attr("y2", self.svgHeight/2 - 10)
                        .attr("x2", percentageScale(50));

      var texts = popChart.selectAll("text");

      popChart.append("text")
              .classed("votesPercentageNote", true)
              .attr("id", "percentNote")
              .transition().duration(1000)
              .attr("x", percentageScale(50))
              .attr("y", self.svgHeight/2 - 15)
              .text("Popular Vote (50%)");

      if(parseInt(indData.percentage) > 0)
      {
        texts = texts.data(data).enter();

        texts.append("text")
             .style("text-anchor", function(d) {if(d.party == "I"){return "start"} else{return "middle"}})
             .attr("class", function(d) {return VotePercentageChart.prototype.chooseClass(d.party)})
             .text(function(d) {return d.nominee})
             .transition().duration(1000)
             .attr("y", self.svgHeight/5)
             .attr("x", function(d,i){
               if(i == 0)
               {return 0;}
               else
               {
                 var total = 0;
                 for(var j = 0; j < i; j++)
                 {
                    total = total + parsePercentage(data[j].percentage);
                 }
                 total = total + parsePercentage(d.percentage)/2;
                 return percentageScale(total);
               }});

         texts.append("text")
              .attr("class", function(d) {if(d.party == "I" && parsePercentage(d.percentage) < 4){return VotePercentageChart.prototype.chooseClass(d.party)}})
              .attr("fill", "white")
              .attr("text-anchor", function(d,i) {
                if(i == 1 || i == 0)
                {return "start";}
                else
                {return "end";}
              })
              .transition().duration(1000)
              .attr("x", function(d,i){
                if(i == 0)
                {if(parsePercentage(d.percentage) < 4){return 0;}else{return 5;}}
                else if(i == 1)
                {
                  return percentageScale(parsePercentage(data[0].percentage)) + 5;
                }
                else
                {
                  var total = 0;
                  for(var j = 0; j < i; j++)
                  {
                     total = total + parsePercentage(data[j].percentage);
                  }
                  total = total + parsePercentage(d.percentage);
                  return percentageScale(total) - 5;
                }})
              .attr("y",
                        function(d){
                        if(d.party == "I" && parsePercentage(d.percentage) < 4)
                        {return self.svgHeight/2 - 5;}
                        else
                        {return self.svgHeight/2 + barHeight/1.4}
                      })
              .text(function(d) {return d.percentage});
      }
      else
      {
        texts = texts.data(data).enter();

        texts.append("text")
             .attr("y", self.svgHeight/5)
             .style("text-anchor", function(d) {if(d.party == "I"){return "start"} else{return "middle"}})
             .attr("class", function(d) {return VotePercentageChart.prototype.chooseClass(d.party)})
             .text(function(d) {return d.nominee})
             .transition().duration(1000)
             .attr("x", function(d,i){
                 var total = 0;
                 for(var j = 0; j < i; j++)
                 {
                    total = total + parsePercentage(data[j].percentage);
                 }
                 total = total + parsePercentage(d.percentage)/2;
                 return percentageScale(total);
               });

        texts.append("text")
            //.attr("class", function(d) {return VotePercentageChart.prototype.chooseClass(d.party)})
            .attr("fill", "white")
            .attr("text-anchor", function(d,i) {
              if(i == 0)
              {return "start";}
              else
              {return "end";}
            })
            .transition().duration(1000)
            .attr("x", function(d,i){
              if(i == 0)
              {
                return 5;
              }
              else
              {
                var total = 0;
                for(var j = 0; j < i; j++)
                {
                   total = total + parsePercentage(data[j].percentage);
                }
                total = total + parsePercentage(d.percentage);
                return percentageScale(total) - 5;
              }})
            .attr("y", self.svgHeight/2 + barHeight/1.4)
            .text(function(d) {return d.percentage});
      }
};
