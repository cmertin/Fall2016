/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
    // ****** TODO: PART II ******

    function Compare(first, second)
    {
      if(first.getAttribute("height") > second.getAttribute("height"))
        return -1;
      if(first.getAttribute("height") < second.getAttribute("height"))
        return 1;
      return 0;
    }
    function StaircaseData()
    {
       var d = document.querySelectorAll('[id^="ba_"]');
       //var array = Object.keys(d).map(function(key) {return d[key];});
       //array.sort(Compare);
       //console.log(d);
       for(var i = 0; i < d.length; i++)
        {
          //var tempHeight = array[i].getAttribute("height");
          d[i].setAttribute("height", (i+1) * 10);
        }
    }

    StaircaseData();
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******
    function Bar_A()
    {
      var svg = d3.select("svg g.barChart").selectAll("rect");
      var bars = svg.data(data);

      bars.exit().transition().duration(500)
                 .attr("height",0).remove();

      bars = bars.enter().append("rect").classed(".barChart",true).merge(bars);

      bars.attr("x", function(d,i) {return iScale(i+1);})
          .attr("height", 0)
          .transition()
          .duration(1000)
          .attr("height", function(d) {return aScale(d.a);});
    }

    function Bar_B()
    {
      var svg = d3.select("svg g.barChart2").selectAll("rect");
      var bars = svg.data(data);

      bars.exit().transition().duration(500)
                 .attr("height",0).remove();

      bars = bars.enter().append("rect").classed(".barChart2",true).merge(bars);

      bars.attr("x", function(d,i) {return iScale(i+1);})
          .attr("height",0)
          .transition()
          .duration(1000)
          .attr("height", function(d) {return bScale(d.b);});
    }

    // Changes the a data bar chart
    Bar_A();

    // Changes the b data bar chart
    Bar_B();

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i + 1);
        })
        .y(function (d) {
            return aScale(d.a);
        });

    function Line_A()
    {
      var linea = document.querySelectorAll('[id^="la_"]');
      var newLine = aLineGenerator(data);
      linea[0].setAttribute("d", newLine);
      //console.log(newLine);
    }

    Line_A();

    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function(d,i) {
            return iScale(i + 1);})
        .y(function (d) {
            return bScale(d.b);
        });

    function Line_B()
    {
      var lineb = document.querySelectorAll('[id^="lb_"]');
      var newLine = bLineGenerator(data);
      lineb[0].setAttribute("d", newLine);
    }

    Line_B();

    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i + 1);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });

    function Area_A()
    {
      var areaa = document.querySelectorAll('[id^="areaa_"]');
      //console.log(areaa);
      var newArea = aAreaGenerator(data);
      areaa[0].setAttribute("d", newArea);
    }

    Area_A();

    // TODO: Select and update the 'b' area chart path (create your own generator)
    var bAreaGenerator = d3.area()
        .x(function(d,i) {
            return iScale(i + 1);
        })
        .y0(0)
        .y1(function(d) {
          return bScale(d.b);
        });

    function Area_B()
    {
      var areab = document.querySelectorAll('[id^="areab_"]');
      var newArea = bAreaGenerator(data);
      areab[0].setAttribute("d", newArea);
    }

    Area_B();

    // TODO: Select and update the scatterplot points
    function Circles()
    {
      var svg = d3.select("svg g.circles_").selectAll("circle");
      var circles = svg.data(data);

      circles.exit().transition().duration(500)
             .attr("r",0).remove();

      circles = circles.enter().append("circle").classed(".circles_", true).merge(circles);

      circles.attr("cx", function(d,i) {return aScale(d.a);})
             .attr("cy", function(d,i) {return bScale(d.b);})
             .attr("r",0)
             .transition()
             .duration(1000)
             .attr("r", function() {return 5;});
    }
    Circles(data);

    d3.select("svg g.circles_").selectAll("circle")
          .on("mouseover", function() {
            d3.select(this).style('fill','gold');})
          .on("mouseout", function() {
            d3.select(this).style('fill','darkred');})
          .on("click", function() {
            var pos = "(";
            var cx = Math.round(d3.select(this).attr("cx") * 100)/100;
            var cy = Math.round(d3.select(this).attr("cy") * 100)/100;
            pos = pos.concat(cx);
            pos = pos.concat(", ");
            pos = pos.concat(cy);
            pos = pos.concat(")");
            console.log(pos);});

      d3.selectAll(".barChart rect")
          .on("mouseover", function() {
            d3.select(this).style('fill', 'gold');})
          .on("mouseout", function() {
            d3.select(this).style('fill','darkred');});

      d3.selectAll(".barChart2 rect")
          .on("mouseover", function() {
            d3.select(this).style('fill', 'gold');})
          .on("mouseout", function() {
            d3.select(this).style('fill','darkred');});
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}
