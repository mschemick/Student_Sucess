/* Element Selector */

const currentRetentionEl = document.querySelector("#currentRetention");
const highestRetentionProgramEl = document.querySelector("#highestRetentionProgram");
const lowestRetentionProgramEl = document.querySelector("#lowestRetentionProgram");
const programsBelowRetentionEl = document.querySelector("#programsBelowRetention");
const retentionTableBodyEl = document.querySelector("#retentionTableBody");
const retentionProgramFilterEl = document.querySelector("#retentionProgramFilter");
const retentionWatchlistEl = document.querySelector("#retentionWatchlist");

const retentionTrendChartCanvas = document.querySelector("#retentionTrendChart");
const retentionProgramChartCanvas = document.querySelector("#retentionProgramChart");

programNames.forEach(program => {
    const option = document.createElement("option");
    option.value = program;
    option.textContent = program;
    retentionProgramFilterEl.appendChild(option);
});

function getRetentionData(selectedProgram) {
    if (selectedProgram === "All") {
        return retentionByTerm.map(item => item.rate);
    }

    return retentionByTerm.map(item => {
        const variation = Math.random() * 6 - 3;
        return Math.round(item.rate + variation);
    });
}

/* Kpi Cards */

const currentRetention = retentionByTerm[retentionByTerm.length - 1].rate;

const highestRetentionProgram = [...programs].sort(
  (a, b) => b.retentionRate - a.retentionRate)[0];

const lowestRetentionProgram =[...programs].sort(
    (a,b) => a.retentionRate - b.retentionRate)[0];

const programsBelowRetention = programs.filter(
    program => program.retentionRate < 70
);

currentRetentionEl.textContent = `${currentRetention}%`;
highestRetentionProgramEl.textContent = highestRetentionProgram.name;
lowestRetentionProgramEl.textContent = lowestRetentionProgram.name;
programsBelowRetentionEl.textContent = programsBelowRetention.length;

/* Retention Trend Chart */

const retentionTrendChart =
new Chart(retentionTrendChartCanvas, {
    type: "line",
    data: {
        labels: retentionByTerm.map(item => item.term),
        datasets: [
            {
                label: "Retention Rate",
                data: retentionByTerm.map(item => item.rate),
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

function updateRetentionTrendChart() {

    const selectedProgram =
        retentionProgramFilterEl.value;

    const retentionData =
        getRetentionData(
            selectedProgram
        );

    retentionTrendChart
        .data
        .datasets[0]
        .data =
        retentionData;

    retentionTrendChart.update();

    const currentRetentionValue =
        retentionData[
            retentionData.length - 1
        ];

    currentRetentionEl.textContent =
        `${currentRetentionValue}%`;

}

retentionProgramFilterEl.addEventListener(
  "change",
  updateRetentionTrendChart
);

/* Retention Program Chart */

const topRetentionPrograms = [...programs]
    .sort((a, b) => b.retentionRate - a.retentionRate)
    .slice(0, 10);

new Chart(retentionProgramChartCanvas, {
  type: "bar",
  data: {
    labels: topRetentionPrograms.map(program => program.name),
    datasets: [
      {
        label: "Retention Rate",
        data: topRetentionPrograms.map(program => program.retentionRate),
        borderWidth: 1
      }
    ]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
});

/* Render Retention Table */

const programsByRetention = [...programs].sort(
    (a, b) => b.retentionRate - a.retentionRate);

programsByRetention.forEach(program => {
    const row = document.createElement("tr");

    let status;

    if (program.retentionRate >= 80) {
      status = "Strong";
  } else if (program.retentionRate >= 70) {
    status = "Stable";
  } else {
    status = "Needs Review";
  }

    row.innerHTML = `
        <td>${program.name}</td>
        <td>${program.students.toLocaleString()}</td>
        <td>${program.retentionRate}%</td>
        <td><span class="status-badge ${status.toLowerCase().replace(" ", "-")}">${status}</span></td>
    `;

    retentionTableBodyEl.appendChild(row);
});

const watchlistPrograms = [...programs].filter(program => program.retentionRate < 70
  )
  .sort((a, b) => a.retentionRate - b.retentionRate).slice(0, 5);

  watchlistPrograms.forEach(program => {

    const item =
        document.createElement(
            "div"
        );

    item.classList.add(
        "watchlist-item"
    );

    item.innerHTML = `
    
        <span>${program.name}</span>

        <strong>${program.retentionRate}%</strong>
    `;

    retentionWatchlistEl
        .appendChild(item);

});