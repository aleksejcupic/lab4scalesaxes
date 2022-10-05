// lab 4 - Aleksej Cupic
d3.csv('wealth-health-2014.csv', d3.autoType).then(data => {
    renderChart(data);
});

const margin = ({top: 20, right: 20, bottom: 20, left: 20});
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function renderChart(data) {
    var svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let income = data.map(d => d.Income);
    let lifeExpectancy = data.map(d => d.LifeExpectancy);

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(income))
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(lifeExpectancy))
        .range([height, 0]);

    let keys = [...new Set(data.map(item => item.Region))];
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(keys);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s");

    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr("class", "axis x-axis")
        .call(xAxis)

    svg.append("text")
        .attr('x', width - 100)
        .attr('y', 100)
        .text("Income");

    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

    svg.append("text")
        .attr('x', 50)
        .attr('y', height - 100)
        .text("Life Expectancy")
        .attr('style', 'writing-mode: vertical-lr');
    
    var SVG = d3.select(".legend");

    var size = 20;
    SVG.selectAll("rect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 100)
        .attr("y", function(d, i) { return 100 + i * (size + 5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return colorScale(d)});

    // Add one dot in the legend for each name.
    SVG.selectAll("text")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 100 + size * 1.2)
        .attr("y", function(d,i){ return 100 + i * (size + 5) + (size / 2)})
        .style("fill", function(d){ return colorScale(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    let circles = svg
        .selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', function(d) {
            if (d.Population > 100_000_000)
                return 7;
            if (d.Population > 1_000_000)
                return 4;
            return 2;
        })
        .attr('stroke', 'black')
        .attr('opacity', 1)
        .attr('fill', d => colorScale(d.Region))
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window); // pos = [x,y]
            d3.select(".tooltip")
                .html("Country: " + d.Country + 
                    ",\nLife Expectancy: " + d.LifeExpectancy + 
                    ",\nIncome: " + d.Income + 
                    ",\nPopulation: " + d.Population + 
                    ",\nRegion: " + d.Region)
                .style("left", pos[0] + "px")
                .style("top", pos[1] + "px")
                .attr('style', 'display: block');
        })
        .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
                .attr('style', 'display: none');
        });
}