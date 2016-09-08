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
          d[i].setAttribute("height", (i+1)*10);
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
       var d = document.querySelectorAll('[id^="ba_"]');
       for(var i = 0; i < data.length; i++)
        d[i].setAttribute("height", data[i].a * 10);
    }

    function Bar_B()
    {
       var d = document.querySelectorAll('[id^="bb_"]');
       for(var i = 0; i < data.length; i++)
        d[i].setAttribute("height", data[i].b * 10);
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
    //var bLineGenerator = d3.line().x().y();

    function Line_B()
    {
      var lineb = document.querySelectorAll('[id^="lb_"]');
      console.log(lineb);
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
      console.log(areaa);
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
      var circles = document.querySelectorAll('[id^="cir_"]');

      for(var i = 0; i < data.length; i++)
        {
          circles[i].setAttribute("cx", aScale(data[i].a));
          circles[i].setAttribute("cy", bScale(data[i].b));
        }
    }

    Circles();

    // ****** TODO: PART IV ******
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
