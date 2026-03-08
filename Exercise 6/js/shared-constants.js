const margin = { top: 40, right: 30, bottom: 55, left: 65 };
const width = 900;
const height = 460;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Histogram
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const barColor = "#d4a017";
const binGenerator = d3.bin().value(d => +d.energyConsumption);

// Filter settings
const filters_screen = [
  { id: "all", label: "ALL", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Scatterplot
let innerChartS;
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

const tooltipWidth = 78;
const tooltipHeight = 40;

const colorScale = d3.scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);