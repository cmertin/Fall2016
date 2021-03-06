/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;

/* Global Variable to hold double click parameters for labels */
var dblClick = [0, 0, 0, 0, 0, 0];

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

var RankReversed = {
    7: "Winner",
    6: "Runner-Up",
    5: 'Third Place',
    4: 'Fourth Place',
    3: 'Semi Finals',
    2: 'Quarter Finals',
    1: 'Round of Sixteen',
    0: 'Group'
};



//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

/*
d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
})
*/

// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// Adapted examples from
// http://stackoverflow.com/questions/34804507/d3-js-nesting-and-rollup-at-same-time
d3.csv("data/fifa-matches.csv", function (error, csvData)
{
    console.log("Implemented \"Hacker Version\"")
    teamData = d3.nest().key(function(d) {return d.Team;})
                 .rollup(function(children) {
                 return{
                      "Wins": d3.sum(children, function(d) {return d.Wins;}),
                      "Losses": d3.sum(children, function(d) {return d.Losses;}),
                      "Goals Made": d3.sum(children, function(d) {return d["Goals Made"];}),
                      "Goals Conceded": d3.sum(children, function(d) {return d["Goals Conceded"];}),
                      "Delta Goals": d3.sum(children, function(d) {return d["Delta Goals"];}),
                      "TotalGames": children.length,
                      "Result": {"label":RankReversed[d3.max(children, function(d){return rank[d.Result];})],
                                "ranking": d3.max(children, function(d){return rank[d.Result];})},
                      "type":"aggregate",
                      "games": d3.nest().key(function(subChild) {return subChild.Opponent;})
                                 .rollup(function(subChild) {
                                   return{
                                    "Wins": [],
                                    "Losses": [],
                                    "TotalGames": [],
                                    "Goals Made": d3.sum(subChild, function(d) {return d["Goals Made"];}),
                                    "Goals Conceded": d3.sum(subChild, function(d) {return d["Goals Conceded"];}),
                                    "Delta Goals": d3.sum(subChild, function(d) {return d["Delta Goals"];}),
                                    "Result": {"label": RankReversed[d3.max(subChild, function(d){return rank[d.Result];})],
                                               "ranking": d3.max(subChild, function(d){return rank[d.Result];})},
                                    "type":"game",
                                    "Opponent": d3.max(subChild, function(d){return d.Team}),
                                  }}).entries(children)
                 }}).entries(csvData);
      createTable();
      updateTable();
});
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
               .attr("transform", "translate(0" + "," + (cellBuffer + 2) + ")")
               .call(xAxis);

tableElements = teamData;
// ******* TODO: PART V *******
d3.select("#matchTable").select("tr").selectAll("th, td").on("click", function(d,i){
                        collapseList();
                        //console.log(tableElements[0]);
                        if(dblClick[i] == 0)
                        {
                          for(var ind = 0; ind < dblClick.length; ind++)
                          {
                            dblClick[ind] = 0;
                          }
                          dblClick[i] = 1;
                          // sort ascending
                          if(i == 0)
                            tableElements.sort(function(a,b) {return d3.ascending(a.key, b.key);});
                          else if(i == 1)
                            tableElements.sort(function(a,b) {return d3.ascending(a.value["Delta Goals"], b.value["Delta Goals"]);});
                          else if(i == 2)
                            tableElements.sort(function(a,b) {return d3.ascending(rank[a.value.Result.label], rank[b.value.Result.label]);});
                          else if(i == 3)
                            tableElements.sort(function(a,b) {return d3.ascending(a.value.Wins, b.value.Wins);});
                          else if(i == 4)
                            tableElements.sort(function(a,b) {return d3.ascending(a.value.Losses, b.value.Losses);});
                          else
                            tableElements.sort(function(a,b) {return d3.ascending(a.value.TotalGames, b.value.TotalGames);});
                        }
                        else
                        {
                          for(var ind = 0; ind < dblClick.length; ind++)
                          {
                            dblClick[ind] = 0;
                          }
                          // sort descending
                          if(i == 0)
                            tableElements.sort(function(a,b) {return d3.descending(a.key, b.key);});
                          else if(i == 1)
                            tableElements.sort(function(a,b) {return d3.descending(a.value["Delta Goals"], b.value["Delta Goals"]);});
                          else if(i == 2)
                            tableElements.sort(function(a,b) {return d3.descending(rank[a.value.Result.label], rank[b.value.Result.label]);});
                          else if(i == 3)
                            tableElements.sort(function(a,b) {return d3.descending(a.value.Wins, b.value.Wins);});
                          else if(i == 4)
                            tableElements.sort(function(a,b) {return d3.descending(a.value.Losses, b.value.Losses);});
                          else
                            tableElements.sort(function(a,b) {return d3.descending(a.value.TotalGames, b.value.TotalGames);});
                        }
                        updateTable();});
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
  //console.log(element.key);
  var name = {type:gameType, vis:"text", value:element.key};
  var delta_val = element.value["Goals Made"] - element.value["Goals Conceded"];
  var goals = {delta:delta_val, scored_on:element.value["Goals Conceded"], goals:element.value["Goals Made"]};
  var goalsTuple = {type:gameType, vis:"goals", value:goals};
  var result = {type:gameType, vis:"text", value:element.value.Result.label};
  var wins = {type:gameType, vis:"bars", value:element.value.Wins};
  var losses = {type:gameType, vis:"bars", value:element.value.Losses};
  var totalGames = {type:gameType, vis:"bars", value:element.value.TotalGames};
  return [name, goalsTuple, result, wins, losses, totalGames];
}

d3.select("tbody").selectAll("tr").remove();
var tblRow = d3.select("tbody").selectAll("tr").data(tableElements).enter().append("tr").classed("tr",true);
var tblCol = tblRow.selectAll("td").data(function(d) {return ElementData(d);}).enter().append("td");

textCol = tblCol.filter(function(d) {return d.vis == "text"});
barsCol = tblCol.filter(function(d) {return d.vis == "bars"});
goalsCol = tblCol.filter(function(d) {return d.vis == "goals"});

var minGames = 0;
var maxGames = d3.max(teamData, function(d) {return d.value.TotalGames;});
var colorScale = d3.scaleLinear()
                   .domain([minGames, maxGames])
                   .range(["LightSeaGreen", "SeaGreen"]);
gameScale = gameScale.domain([minGames, maxGames]);

//console.log(textCol);

firstCol = textCol.filter(function(d,i) {return i == 0;});
secondCol = textCol.filter(function(d,i) {return i == 1;});
firstCol = firstCol.style("float", "right").attr("class", function(d) {return d.type;})
                   .style("border-left", "solid 0px #000").text(function(d) {return d.value});
secondCol = secondCol.text(function(d) {return d.value});
//textCol = textCol.text(function(d) {return d.value});
barsCol = barsCol.filter(function(d,i) {return d.type != "game";}).append("svg").attr("height", cellHeight + cellBuffer).attr("width", cellWidth);
                 //attr("transform", "translate(-5,0)");

barsCol.append("rect").style("fill", function(d) {return colorScale(d.value);})
                 .attr("height", barHeight).attr("width",function(d) {return gameScale(d.value);})
                 .style("opacity", function(d){return d.value/maxGames});
barsCol.append("text")
                    .attr("y", (barHeight/2) + cellBuffer/3)
                    .attr("x", function(d) {return gameScale(d.value) - cellBuffer/1.75;})
                    .classed("label", true)
                    .text(function(d) {return d.value;});

function barColor(d)
{
  if(d < 0)
  {
    return "red";
  }
  else if(d > 0)
  {
    return "blue";
  }
  else
  {
    return "white";
  }
}

goalsCol = goalsCol.append("svg").attr("height", cellHeight).attr("width", 2 * cellWidth);

goalsCol.append("rect").classed("goalBar", true).style("fill", function(d) {return barColor(d.value.delta);})
        .attr("x", function(d) {return goalScale(d3.min([d.value.goals, d.value.scored_on]));})
        .attr("height", function(d) {if(d.type != "game") {return 10;} else{return 5;}})
        .attr("y", function(d) {if(d.type != "game") {return cellHeight/4;} else{return cellHeight/2.5;}})
        .attr("width", function(d) {return goalScale(Math.abs(d.value.goals - d.value.scored_on)) - cellBuffer;});

goalsCol.append("circle").classed("goalCircle", true)
        .style("fill", function(d) {if(d.type != "game"){if(d.value.delta !== 0) {return "blue";} else {return "grey";}} else{return "white";}    })
        .style("stroke", function(d) {if(d.type == "game"){if(d.value.delta != 0){return "blue";} else{return "grey";}}})
        .attr("cx", function(d) {return goalScale(d.value.goals);}).attr("cy", cellHeight/2);

goalsCol.append("circle").classed("goalCircle", true)
        .style("fill", function(d) {if(d.type != "game"){if(d.value.delta !== 0) {return "red";} else {return "grey";}} else{return "white";}    })
        .style("stroke", function(d) {if(d.type == "game"){if(d.value.delta != 0){return "red";} else{return "grey";}}})
        .attr("cx", function(d) {return goalScale(d.value.scored_on);}).attr("cy", cellHeight/2);

d3.select("tbody").selectAll("tr").on("click", function(d,i){updateList(i);});
d3.select("tbody").selectAll("tr").on("mouseover", function(d,i){updateTree(d);});
d3.select("tbody").selectAll("tr").on("mouseleave", function(d,i){clearTree()});
}

/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******
    tableElements = tableElements.filter(function(d) {return d.value.type != "game";});
    updateTable();
}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******
    if(tableElements[i].value.type != "game")
    {
      games_list = tableElements[i].value.games;
      //console.log(games_list);
      if(i != tableElements.length-1 && tableElements[i+1].value.type == "game")
      {
        tableElements.splice(i+1, games_list.length);
      }
      else
      {
        for(var ind = 0; ind < games_list.length; ind++)
        {
          if(games_list[ind].key[0] != "x")
          {
            games_list[ind].key = "x" + games_list[ind].key;
          }
        }
        for(var ind = games_list.length-1; ind >= 0; ind--)
        {
          tableElements.splice(i+1, 0, games_list[ind]);
        }
      }
      updateTable();
    }
}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    tree_svg_x = 350
    tree_svg_y = 900
    tree_padding = 50
    text_dy = 4
    // ******* TODO: PART VI *******
    var root = d3.stratify()
                 .id(function(d) { return d.id; })
                 .parentId(function(d) {if(d.ParentGame != '') {return treeData[d.ParentGame].id; }})
                 (treeData);

    // Adapted the following code code from
    // http://stackoverflow.com/questions/38440928/how-do-i-create-a-tree-layout-using-json-data-in-d3-v4-without-stratify
    var tree = d3.tree().size([tree_svg_y - tree_padding, tree_svg_x - tree_padding]);

    tree(root);

    var tree = d3.selectAll(".view").select("#tree").attr("transform", "translate(" + (2 * tree_padding) + ", 0)");

    var link = tree.selectAll(".link").data(root.descendants().slice(1))
                   .enter()
                   .append("path")
                   .classed("link", true)
                   .attr("d", function(d)
                                {return ("M" + d.y + "," + d.x + "C" + ((d.y + d.parent.y)/2) + "," + d.x
                                + " " + ((d.y + d.parent.y)/2) + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x);});

    var node = tree.selectAll(".node").data(root.descendants()).enter()
                   .append("g").attr("class", function(d) {if(d.data.Wins == 1) {return "winner";}})
                   .classed("node", true).attr("transform", function(d) {return "translate(" + d.y + "," + d.x + ")";});

    node.append("circle").classed("treeCircle", true);

    node.append("text").classed("treeLabel", true).attr("dy", text_dy).style("text-anchor", function(d) {if(d.height == 0){return "start";} else{return "end";}})
        .text(function(d) {return d.data.Team}).attr("x", function(d) {if(d.height == 0){return 15;}else{return -15;}});
};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******
    if(row.value.type == "aggregate")
    {
      var paths = d3.selectAll(".link").filter(function(d,i) {return d.data.Team == row.key;})
                                       .filter(function(d,i) {return d.data.Wins == 1});
      paths = paths.classed("selected", true);

      var circ = d3.selectAll(".treeCircle").filter(function(d,i) {return d.data.Team == row.key;});
                                        //.filter(function(d,i) {return d.data.Wins == 1});
      circ = circ.classed("selected", true);

      var label = d3.selectAll(".treeLabel").filter(function(d,i) {return d.data.Team == row.key;});
                                        //.filter(function(d,i) {return d.data.Wins == 1});
      label = label.classed("selectedLabel", true);
    }
    else
    {
      var team = row.key.slice(1);
      var opponent = row.value.Opponent;
      var paths = d3.selectAll(".link").filter(function(d,i) {return d.data.Team == team})
                                       .filter(function(d,i) {return d.data.Opponent == opponent});
      paths = paths.classed("selected", true);
      paths = d3.selectAll(".link").filter(function(d,i) {return d.data.Team == opponent})
                                   .filter(function(d,i) {return d.data.Opponent == team});
      paths = paths.classed("selected", true);

      var circ = d3.selectAll(".node circle").filter(function(d,i) {return d.data.Team == team})
                                      .filter(function(d,i) {return d.data.Opponent == opponent});
      circ = circ.classed("selected", true);

      circ = d3.selectAll(".node circle").filter(function(d,i) {return d.data.Team == opponent})
                                         .filter(function(d,i) {return d.data.Opponent == team});

      circ = circ.classed("selected", true);

      var label = d3.selectAll(".treeLabel").filter(function(d,i) {return d.data.Team == team;})
                                            .filter(function(d,i) {return d.data.Opponent == opponent});
                                        //.filter(function(d,i) {return d.data.Wins == 1});
      label = label.classed("selectedLabel", true);

      var label = d3.selectAll(".treeLabel").filter(function(d,i) {return d.data.Team == opponent;})
                                            .filter(function(d,i) {return d.data.Opponent == team});

      label = label.classed("selectedLabel", true);
    }
}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******
    var paths = d3.selectAll("path.selected");
    paths = paths.attr("class", "link");

    var circ = d3.selectAll("circle.selected");
    circ = circ.attr("class", "treeCircle");

    var text = d3.selectAll("text.selectedLabel");
    text = text.attr("class", "treeLabel");
}
