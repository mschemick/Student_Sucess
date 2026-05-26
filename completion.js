const overallCompletionEl = document.querySelector("#overallCompletion");
const highestCompletionProgramEl = document.querySelector("#highestCompletionProgram");
const lowestCompletionProgramEl = document.querySelector("#lowestCompletionProgram");
const programsBelowCompletionEl = document.querySelector("#programsBelowCompletion");
const completionTableBodyEl = document.querySelector("#completionTableBody");
const completionProgramFilterEl = document.querySelector("#completionProgramFilter");
const completionWatchlistEl = document.querySelector("#completionWatchlist");

const completionTrendChartCanvas = document.querySelector("#completionTrendChart");
const completionProgramChartCanvas = document.querySelector("#completionProgramChart");

/* Simulation completion data */

const completionPrograms = programs.map(program => {
  const completionRate = Math.round(35 + Math.random() * 35);

  return {
    ...program,
    completionRate
  };
});

/* Dropdown */

programNames.forEach(program => {
    const option = 
        document.createElement("option");
    option.value = program;
    option.textContent = program;

    completionProgramFilterEl.appendChild(option);
});

/* Kpi Cards */

const overallCompletion =
    completionPrograms.reduce(
        (sum, program) => sum + program.completionRate,
        0
    ) / completionPrograms.length;
    
const highestCompletionProgram = [...completionPrograms].sort(
    (a, b) => b.completionRate - a.completionRate)[0];

const lowestCompletionProgram = [...completionPrograms].sort(
    (a, b) => a.completionRate - b.completionRate)[0];

const programsBelowCompletion = completionPrograms.filter(
    programs => programs.completionRate < 40
);

overallCompletionEl.textContent = `${overallCompletion.toFixed(1)}%`;
highestCompletionProgramEl.textContent = highestCompletionProgram.name;
lowestCompletionProgramEl.textContent = lowestCompletionProgram.name;
programsBelowCompletionEl.textContent = programsBelowCompletion.length;

/* Simulate completion trend data */

const completionTrend = retentionByTerm.map(item => {
  return {
    term: item.term,
    rate: Math.round(item.rate - 25 + Math.random() * 8)
  };
});

/* Chart interaction */

function getCompletionData(selectedProgram) {
    if (selectedProgram === "All") {
        return completionTrend.map(
            item => item.rate
        );
    }
    return completionTrend.map(item => {
        const variation = 
            Math.random() * 8 - 4;
        return Math.round(item.rate + variation); 
    });
}

/* Charts */

const completionTrendChart =
new Chart(completionTrendChartCanvas, {
    type: "line",
    data: {
        labels: completionTrend.map(item => item.term),
        datasets: [
            {
                label: "Completion Rate",
                data: completionTrend.map(item => item.rate),
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

const topCompletionPrograms = [...completionPrograms]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 10);


new Chart(completionProgramChartCanvas, {
    type: "bar",
    data: {
        labels: topCompletionPrograms.map(program => program.name),
        datasets: [
            {
                label: "Completion Rate",
                data: topCompletionPrograms.map(program => program.completionRate),
                borderWidth: 2,
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
                beginAtZero: false
            }
        }
    }
});

function updateCompletionTrendChart() {
    const selectedProgram = 
        completionProgramFilterEl.value;
    const completionData = 
        getCompletionData(selectedProgram);
    completionTrendChart 
        .data
        .datasets[0]
        .data =
        completionData;
    completionTrendChart.update();

    const currentCompletionValue =
        completionData[
            completionData.length - 1
        ];

    overallCompletionEl.textContent =
        `${currentCompletionValue}%`;
}

completionProgramFilterEl.addEventListener("change", updateCompletionTrendChart);

/* Render Completion Table */

const programsByCompletion = [...completionPrograms].sort(
    (a, b) => b.completionRate - a.completionRate);

programsByCompletion.forEach(program => {
    const row = document.createElement("tr");

    let status;

    if (program.completionRate >= 80) {
      status = "Strong";
  } else if (program.completionRate >= 60) {
    status = "Stable";
  } else {
    status = "Needs Review";
  }

    row.innerHTML = `
        <td>${program.name}</td>
        <td>${program.students.toLocaleString()}</td>
        <td>${program.completionRate}%</td>
        <td><span class="status-badge ${status.toLowerCase().replace(" ", "-")}">${status}</span></td>
    `;

    completionTableBodyEl.appendChild(row);
});

const watchlistPrograms = [...completionPrograms]
    .filter(program => program.completionRate < 70)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 5);

watchlistPrograms.forEach(program => {
    const item = document.createElement("div");

    item.classList.add("watchlist-item");

    item.innerHTML = `
        <span>${program.name}</span>
        <strong>${program.completionRate}%</strong>
    `;

    completionWatchlistEl.appendChild(item);
});
