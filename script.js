// lab 4 - Aleksej Cupic
d3.csv('wealth-health-2014.csv', d3.autoType).then(data => {
    renderChart(data);
});

const margin = ({top: 20, right: 20, bottom: 20, left: 30});
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function renderChart(data) {
    // set size and placement of graph
    var svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // data used for axes
    let income = data.map(d => d.Income);
    let lifeExpectancy = data.map(d => d.LifeExpectancy);

    // scales
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(income))
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(lifeExpectancy))
        .range([height, 0]);

    // keys for legend
    let keys = ["East Asia & Pacific", 
                "South Asia", 
                "America",
                "Sub-Saharan Africa", 
                "Europe & Central Asia",
                "Middle East & North Africa"];
    
    // color scale
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(keys);

    // x axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(5, "s"));

    // y axis 
    const yAxis = d3.axisLeft()
        .scale(yScale);
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

    // axis labels
    svg.append("text")
        .attr('x', width - 50)
        .attr('y', 450)
        .text("Income");

    svg.append("text")
        .attr('x', 10)
        .attr('y', 0)
        .text("Life Expectancy")
        .attr('style', 'writing-mode: vertical-lr');

    // circles
    let circles = svg
        .selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', function(d) {
            if (d.Population > 1_000_000_000)
                return 20;
            if (d.Population > 100_000_000)
                return 10;
            if (d.Population > 1_000_000)
                return 5;
            return 2;
        })
        .attr('stroke', 'black')
        .attr("style", "opacity: 0.7")
        .attr('opacity', 1)
        .attr('fill', d => colorScale(d.Region))
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window); // pos = [x,y]

            let tooltipText = "Country: " + d.Country + 
            "<br />Life Expectancy: " + d.LifeExpectancy + 
            "<br />ncome: " + d.Income + 
            "<br />Population: " + d.Population + 
            "<br />Region: " + d.Region + "";

            d3.select(".tooltip")
                .style("position", "fixed")
                .html(tooltipText)
                .attr('style', 'display: block')
                .style("left", pos[0] + "px")
                .style("top", pos[1] + "px")
                .style("fill", "black");
          })
        .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
                .attr('style', 'display: none');
          });

    // legend
    var size = 20;
    svg.select(".legend");
    svg.selectAll("rect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 370)
        .attr("y", function(d, i) { return 250 + i * (size + 5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return colorScale(d)});
    
    svg.selectAll("myLabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 370 + size * 1.2)
        .attr("y", function(d, i) { return 250 + i * (size + 5) + (size / 2)})
        .attr("style", "font-size: 18")
        .style("fill", "black")
        .text(function(d){ return d; })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
}