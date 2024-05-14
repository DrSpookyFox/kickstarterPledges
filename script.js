document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      drawTreemap(data);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });

  function drawTreemap(data) {
    const width = 800;
    const height = 500;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const tooltip = d3.select("#tooltip");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const treemap = d3.treemap().size([width, height]).padding(1).round(true);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    treemap(root);

    const areaScale = d3
      .scaleLinear()
      .domain([0, d3.max(root.leaves(), (d) => d.value)])
      .range([0, width * height]);

    const cells = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    cells
      .append("rect")
      .attr("class", "tile")
      .attr("fill", (d) => colorScale(d.data.category))
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr(
        "width",
        (d) => Math.sqrt(d.data.value / (height / width)) * (d.x1 - d.x0)
      )
      .attr(
        "height",
        (d) => Math.sqrt(d.data.value / (width / height)) * (d.y1 - d.y0)
      );

    cells
      .on("mouseover", function (event, d) {
        tooltip
          .html(
            `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: $${d.data.value}`
          )
          .attr("data-value", d.data.value)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px")
          .style("display", "block");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    cells
      .append("foreignObject")
      .attr("x", 5)
      .attr("y", 15)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .append("xhtml:div")
      .style("font-size", "10px")
      .style("color", "black")
      .style("word-wrap", "break-word")
      .html((d) => d.data.name);

    const legend = d3.select("#legend");
    const categories = [...new Set(data.children.map((d) => d.name))];
        console.log(categories);
    const legendItems = legend
      .selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, i) => `translate(${(i % 2) * 200},${Math.floor(i / 2) * 20})`
      );

    legendItems
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", "10px")
      .attr("height", "10px")
      .attr("fill", (d) => colorScale(d));

    legendItems
      .append("text")
      .attr("class", "legend-item-label")
      .attr("x", 20)
      .attr("y", 9)
      .text((d) => d);
   
  }
});
