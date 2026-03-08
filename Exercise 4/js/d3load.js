d3.csv("data/excercise 2.csv", d => {
  return {
    brand: d.Brand_Reg,
    model: d.Model_No,
    power: +d.Avg_mode_power,
    screenTech: d.Screen_Tech,
    star: +d.Star2
  };
}).then(data => {
  const cleanData = data.filter(d => !isNaN(d.power));

  console.log("Loaded data:");
  console.log(cleanData);
  console.log("Length:", cleanData.length);
  console.log("Max power:", d3.max(cleanData, d => d.power));
  console.log("Min power:", d3.min(cleanData, d => d.power));
  console.log("Extent:", d3.extent(cleanData, d => d.power));

  const stats = document.getElementById("stats");
  stats.innerHTML = `
    <li><strong>Rows loaded:</strong> ${cleanData.length}</li>
    <li><strong>Maximum power:</strong> ${d3.max(cleanData, d => d.power).toFixed(2)}</li>
    <li><strong>Minimum power:</strong> ${d3.min(cleanData, d => d.power).toFixed(2)}</li>
    <li><strong>Extent:</strong> ${d3.extent(cleanData, d => d.power).map(v => v.toFixed(2)).join(" to ")}</li>
  `;
});