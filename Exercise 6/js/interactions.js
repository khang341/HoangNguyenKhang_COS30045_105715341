function populateFilters(data) {
  d3.select("#filters")
    .selectAll("button.filter")
    .data(filters_screen)
    .join("button")
    .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
    .text(d => d.label)
    .on("click", (event, d) => {
      if (!d.isActive) {
        filters_screen.forEach(f => {
          f.isActive = (f.id === d.id);
        });

        d3.selectAll("#filters .filter")
          .classed("active", f => f.isActive);

        updateHistogram(d.id, data);
      }
    });
}

function updateHistogram(filterId, data) {
  const filtered = (filterId === "all")
    ? data
    : data.filter(d => d.screenTech === filterId);

  const updatedBins = binGenerator(filtered);

  const minX = updatedBins[0]?.x0 ?? 0;
  const maxX = updatedBins.length ? updatedBins[updatedBins.length - 1].x1 : 1;
  const maxLen = updatedBins.length ? d3.max(updatedBins, d => d.length) : 1;

  xScale.domain([minX, maxX]);
  yScale.domain([0, maxLen]).nice();

  bottomAxisG
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .call(d3.axisBottom(xScale));

  leftAxisG
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .call(d3.axisLeft(yScale).ticks(8));

  bars = innerChart.selectAll("rect")
    .data(updatedBins, d => `${d.x0}-${d.x1}`);

  bars.join(
    enter => enter.append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x0) + 1.5)
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 3))
      .attr("y", yScale(0))
      .attr("height", 0)
      .attr("fill", barColor)
      .call(enter => enter.transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length))
      ),
    update => update.call(update => update.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("x", d => xScale(d.x0) + 1.5)
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 3))
      .attr("y", d => yScale(d.length))
      .attr("height", d => innerHeight - yScale(d.length))
    ),
    exit => exit.call(exit => exit.transition()
      .duration(400)
      .ease(d3.easeCubicInOut)
      .attr("y", yScale(0))
      .attr("height", 0)
      .remove()
    )
  );
}

// Tooltip
function createTooltip() {
  const tooltip = innerChartS.append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

  tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 8)
    .attr("ry", 8);

  tooltip.append("text")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2 + 1)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text("");

  window._tooltipSel = tooltip;
}

function handleMouseEvents() {
  innerChartS.selectAll("circle")
    .on("mouseenter", (event, d) => {
      _tooltipSel.select("text").text(`${d.screenSize}"`);

      const cx = +event.target.getAttribute("cx");
      const cy = +event.target.getAttribute("cy");

      const tx = cx - tooltipWidth / 2;
      const ty = cy - tooltipHeight - 8;

      _tooltipSel
        .attr("transform", `translate(${tx},${ty})`)
        .transition()
        .duration(120)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      _tooltipSel
        .transition()
        .duration(250)
        .style("opacity", 0)
        .on("end", () => _tooltipSel.attr("transform", "translate(-9999,-9999)"));
    });
}