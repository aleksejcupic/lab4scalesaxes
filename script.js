// lab 4 - Aleksej Cupic
d3.csv('wealth-health-2014.csv', d3.autoType).then(data => {
    var wealthHealthData = data;
    renderChart(wealthHealthData);
});

// Country,LifeExpectancy,Income,Population,Region

const margin = ({top: 20, right: 20, bottom: 20, left: 20});
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function renderChart(data) {
    var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
        .scaleLinear()
        .domain([d3.extent(data.Income)])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([d3.extent(data.LifeExpectancy)])
        .range([0, height]);

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis);

    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis);

    console.log(xScale(incomeMax));

    let circles = d3
    .selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr('cx', d => xScale(d.Income))
    .attr('cy', d => yScale(d.LifeExpectancy))
    .attr('r', 5)
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .attr('fill', function(d) {
        switch(d.Region) {
            case 'East Asia & Pacific':
                return 'blue';
            case 'South Asia':
                return 'orange';
            case 'America':
                return 'red';
            case 'Sub-Saharan Africa':
                return 'cyan';
            case 'Europe & Central Asia':
                return 'green';
            case 'Middle East & North Africa':
                return 'yellow';
            default:
              return 'black';
          }
    });
}