/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};



//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
})


// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, csvData) {
//
//    // ******* TODO: PART I *******
//
//
// });
// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

// ******* TODO: PART II *******
var maxGoals = d3.max(teamData, function(d) {return d.value[goalsMadeHeader];});
goalScale = goalScale.domain([0, maxGoals]);

var xAxis = d3.axisTop(goalScale);
var goalsX = d3.select("#goalHeader")
               .append("svg").attr("width", cellWidth * 2)
               .attr("height", cellHeight).append("g")
               .attr("transform", "translate(0," + (cellBuffer+2) + ")")
               .call(xAxis);

tableElements = teamData;
// ******* TODO: PART V *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******
function ElementData(element)
{
  var gameType = element.value.type;
  var name = {type:gameType, vis:"text", value:element.key};
  var goals = {delta:element.value["Delta Goals"], scored_on:element.value["Goals Conceded"], goals:element.value["Goals Made"]};
  var goalsTuple = {type:gameType, vis:"goals", value:goals};
  var result = {type:gameType, vis:"text", value:element.value.Result.label};
  var wins = {type:gameType, vis:"bars", value:element.value.Wins};
  var losses = {type:gameType, vis:"bars", value:element.value.Losses};
  var totalGames = {type:gameType, vis:"bars", value:element.value.TotalGames};
  return [name, goalsTuple, result, wins, losses, totalGames];
}


/*
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;
*/
var tblRow = d3.select("tbody").selectAll("tr").data(tableElements).enter().append("tr").classed("tr",true);
var tblCol = tblRow.selectAll("td").data(function(d) {return ElementData(d);}).enter().append("td");

textCol = tblCol.filter(function(d) {return d.vis == "text"});
barsCol = tblCol.filter(function(d) {return d.vis == "bars"});
goalsCol = tblCol.filter(function(d) {return d.vis == "goals"});
console.log(textCol);
console.log(teamData);
var minGames = 0;
var maxGames = d3.max(teamData, function(d) {return d.value.TotalGames;});
var colorScale = d3.scaleLinear()
                   .domain([minGames, maxGames])
                   .range(["DodgerBlue", "darkblue"]);
gameScale = gameScale.domain([minGames, maxGames]);


textCol = textCol.text(function(d) {return d.value});
barsCol = barsCol.append("svg").attr("height", cellHeight).attr("width", cellWidth);

barsCol.append("rect").style("fill", function(d) {return colorScale(d.value);})
                 .attr("height", barHeight).attr("width",function(d) {return gameScale(d.value);})
                 .style("opacity", function(d){return d.value/maxGames});
barsCol.append("text")
                    .attr("y", (barHeight/2) + cellBuffer/3)
                    .attr("x", function(d) {return gameScale(d.value) - cellBuffer/1.75;})
                    .classed("label", true)
                    .text(function(d) {return d.value;});

console.log(goalsCol);
function barColor(d)
{
  if(d < 0)
    return "red";
  else
  {
    return "blue";
  }
}

goalsCol = goalsCol.append("svg").attr("height", cellHeight).attr("width", 130);

goalsCol.append("rect").classed("goalBar", true).style("fill", function(d) {return barColor(d.value.delta);})
        .attr("x", function(d) {return goalScale(d3.min([d.value.goals, d.value.scored_on]));})
        .attr("height", 10).attr("y", cellHeight/4)
        .attr("width", function(d) {return goalScale(Math.abs(d.value.goals - d.value.scored_on));});

goalsCol.append("circle").classed("goalCircle", true).style("fill", "blue")
        .attr("cx", function(d) {return goalScale(d.value.goals)}).attr("cy", cellHeight/2);

goalsCol.append("circle").classed("goalCircle", true).style("fill", "red")
        .attr("cx", function(d) {return goalScale(d.value.scored_on);}).attr("cy", cellHeight/2);




/*
var svg = d3.select("#points").selectAll("circ")
                            .data([1])
                            .enter()
                            .append("circle")
                                .attr("cx", function(d) {return projection(win)[0];})
                                .attr("cy", function(d) {return projection(win)[1];})
                                .attr("r", 8)
                                .attr("id", "win_circ")
                                .attr("class", "gold");
*/

};


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******


};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}
