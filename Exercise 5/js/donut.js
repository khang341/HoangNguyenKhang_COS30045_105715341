(function () {
  const selector = "#donut";
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d => ({
    screenTech: d.Screen_Tech,
    energy: +d["Mean(Labelled energy consumption (kWh/year))"]
  })).then(data => {
    const cleanData = data.filter(d => !isNaN(d.energy));
    sharedColor.domain(cleanData.map(d => d.screenTech));
    buildLegend("#donut-legend", cleanData.map(d => d.screenTech), sharedColor);

    drawDonut(cleanData);
    new ResizeObserver(() => drawDonut(cleanData)).observe(document.querySelector(selector));
  });

  function drawDonut(data) {
    d3.select(selector).selectAll("*").remove();

    const { width, height, innerWidth, innerHeight } = containerSize(selector, margin);

    const svg = d3.select(selector)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(innerWidth, innerHeight) / 2;
    const innerRadius = radius * 0.55;

    const pie = d3.pie()
      .value(d => d.energy)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const labelArc = d3.arc()
      .innerRadius((innerRadius + radius) / 2)
      .outerRadius((innerRadius + radius) / 2);

    const total = d3.sum(data, d => d.energy);

    g.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => sharedColor(d.data.screenTech))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mousemove", (event, d) => {
        tooltip.show(
          `<strong>${d.data.screenTech}</strong><br>${d.data.energy.toFixed(2)} kWh/year`,
          event.clientX,
          event.clientY
        );
      })
      .on("mouseout", tooltip.hide);

    g.selectAll(".slice-label")
      .data(pie(data))
      .join("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", "#333")
      .text(d => `${Math.round((d.data.energy / total) * 100)}%`);
  }
})();