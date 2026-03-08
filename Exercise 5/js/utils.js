const tooltip = (() => {
  const el = document.createElement("div");
  el.className = "tooltip hidden";
  document.body.appendChild(el);

  return {
    show(html, x, y) {
      el.innerHTML = html;
      el.style.left = `${x + 12}px`;
      el.style.top = `${y + 12}px`;
      el.classList.remove("hidden");
    },
    hide() {
      el.classList.add("hidden");
    }
  };
})();

function containerSize(selector, margin) {
  const node = document.querySelector(selector);
  const width = node.clientWidth || 600;
  const height = node.clientHeight || 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { width, height, innerWidth, innerHeight };
}

const sharedColor = d3.scaleOrdinal()
  .range(["#2c7fb8", "#f28e2b", "#59a14f", "#e15759", "#8e63ce"]);

function buildLegend(containerSelector, domain, color) {
  const root = d3.select(containerSelector);
  root.selectAll("*").remove();

  const items = root.selectAll(".item")
    .data(domain)
    .enter()
    .append("div")
    .attr("class", "item");

  items.append("span")
    .attr("class", "swatch")
    .style("background-color", d => color(d));

  items.append("span")
    .text(d => d);
}