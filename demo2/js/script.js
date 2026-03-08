// ----------------------
// Page navigation
// ----------------------
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  const navItems = document.querySelectorAll(".nav-links li");

  pages.forEach(p => p.classList.add("hidden"));
  navItems.forEach(i => i.classList.remove("active"));

  const page = document.getElementById(pageId);
  if (page) page.classList.remove("hidden");

  const nav = document.getElementById("nav-" + pageId);
  if (nav) nav.classList.add("active");

  // If user goes to TV page, draw chart once
  if (pageId === "tv") {
    loadAndDrawChart();
  }
}

// default page
showPage("home");

let chartDrawn = false;

function loadAndDrawChart() {
  if (chartDrawn) return;

  const status = document.getElementById("chart-status");
  if (status) status.textContent = "Loading chart data...";

  // IMPORTANT: make sure this path exists in your repo
  // Put your CSV in: data/tv.csv
  d3.csv("data/tv.csv").then(raw => {
    // Try to detect columns safely
    const cleaned = raw.map(d => {
      const brand = d.Brand_Reg || d.Brand || d.brand || "Unknown";
      const powerStr = d.Avg_mode_power || d.Power || d.power || d.Power_Consumption;
      const power = Number(powerStr);

      return { brand, power };
    }).filter(d => !Number.isNaN(d.power));

    if (cleaned.length === 0) {
      if (status) status.textContent = "No valid power values found in the CSV.";
      return;
    }

    // take a small sample so chart stays readable
    const sample = cleaned.slice(0, 20);

    drawBarChart(sample);
    chartDrawn = true;

    if (status) status.textContent = "Chart loaded. Showing first 20 models with valid power values.";
  }).catch(err => {
    console.error(err);
    if (status) status.textContent = "Could not load data/tv.csv. Check the file path and file name.";
  });
}

// ----------------------
// D3 bar chart
// ----------------------
function drawBarChart(data) {
  const svg = d3.select("#tv-chart");
  svg.selectAll("*").remove(); // clear old drawing

  const width = 900;
  const height = 520;

  const margin = { top: 30, right: 30, bottom: 50, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // x: power
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.power)])
    .nice()
    .range([0, innerWidth]);

  // y: index (we will label with brand)
  const y = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, innerHeight])
    .padding(0.12);

  // axes
  g.append("g")
    .call(d3.axisLeft(y).tickFormat(i => data[i].brand))
    .selectAll("text")
    .style("font-size", "12px");

  g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x));

  // x axis label
  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Power use (watts)");

  // bars
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => y(i))
    .attr("width", d => x(d.power))
    .attr("height", y.bandwidth())
    .attr("rx", 6);

  // value labels
  g.selectAll(".value")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "value")
    .attr("x", d => x(d.power) + 6)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2 + 4)
    .style("font-size", "12px")
    .text(d => `${d.power} W`);
}
