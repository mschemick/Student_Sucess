/* Dom Selection */

const totalProgramsEl = document.querySelector("#totalPrograms");
const largestProgramEl = document.querySelector("#largestProgram");
const averageRetentionEl = document.querySelector("#averageRetention");
const lowRetentionProgramsEl = document.querySelector("#lowRetentionPrograms");
const programTableBodyEl = document.querySelector("#programTableBody");
const topRetentionListEl = document.querySelector("#topRetentionList");
const programRetentionChartCanvas = document.querySelector("#programRetentionChart");
const programEnrollmentChartCanvas = document.querySelector("#programEnrollmentChart");
const programHealthChartCanvas = document.querySelector("#programHealthChart");
const programWatchlistEl = document.querySelector("#programWatchlist");

/* Kpi calculations */

const totalPrograms = programs.length;

const largestProgram = [...programs].sort((a, b) => b.students - a.students)[0];

const averageRetention =
    programs.reduce((sum, program) => sum + program.retentionRate, 0) /
    programs.length;

const lowRetentionPrograms = programs.filter(
    program => program.retentionRate < 70
);

/* update Kpi Cards */

totalProgramsEl.textContent = totalPrograms;
largestProgramEl.textContent = largestProgram.name;
averageRetentionEl.textContent = `${averageRetention.toFixed(1)}%`;
lowRetentionProgramsEl.textContent = lowRetentionPrograms.length;


/* create the two charts */

const topRetentionForChart = [...programs]
    .sort((a, b) => b.retentionRate - a.retentionRate)
    .slice(0, 10);

new Chart(programRetentionChartCanvas, {
    type: "bar",
    data: {
        labels: topRetentionForChart.map(program => program.name),
        datasets: [
            {
                label: "Retention Rate",
                data: topRetentionForChart.map(program => program.retentionRate),
                borderWidth: 1
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
                beginAtZero: true
            }
        }
    }
});

const topEnrollmentForChart = [...programs]
  .sort((a, b) => b.students - a.students)
  .slice(0, 10);

new Chart(programEnrollmentChartCanvas, {
  type: "bar",
  data: {
    labels: topEnrollmentForChart.map(program => program.name),
    datasets: [
      {
        label: "Students",
        data: topEnrollmentForChart.map(program => program.students),
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
    }
  }
});

const strongProgramsCountEl =
document.querySelector("#strongProgramsCount");
const stableProgramsCountEl =
document.querySelector("#stableProgramsCount");
const reviewProgramsCountEl =
document.querySelector("#reviewProgramsCount");

const programHealthCounts = {
    Strong: programs.filter(program => program.retentionRate >= 80).length,
    Stable: programs.filter(program => program.retentionRate >=70 && program.retentionRate < 80).length,
    "Needs Review": programs.filter(program => program.retentionRate < 70).length
};

strongProgramsCountEl.textContent = programHealthCounts.Strong;
stableProgramsCountEl.textContent = programHealthCounts.Stable;
reviewProgramsCountEl.textContent = programHealthCounts["Needs Review"];

new Chart(programHealthChartCanvas, {
    type: "doughnut",
    data: {
        labels: Object.keys(programHealthCounts),
        datasets: [
            {
                data: Object.values(programHealthCounts),
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});

/* watch list */

const watchlistPrograms = [...programs].filter(program => program.retentionRate < 70)
    .sort((a, b) => a.retentionRate - b.retentionRate)
    .slice(0, 5);
    
watchlistPrograms.forEach(program => {
    const item = document.createElement("div");
    item.classList.add("watchlist-item");
    item.innerHTML = `
        <span> ${program.name}</span>
        <strong> ${program.retentionRate}%</strong>
    `;

    programWatchlistEl.appendChild(item);
});

/* Render Program Table */

const programsByEnrollment =[...programs].sort(
    (a, b) => b.students - a.students
);

programsByEnrollment.forEach(program => {
    const row = document.createElement("tr");

    let status;
    if (program.retentionRate >= 80) {
        status = "Strong";
    }
    else if (program.retentionRate >= 70) {
        status = "Stable";
    }
    else {
        status = "Needs Review"
    }

    row.innerHTML = `
        <td>${program.name}</td>
        <td>${program.students.toLocaleString()}</td>
        <td>${program.retentionRate}%</td>
        <td>
            <span class="status-badge ${status.toLowerCase().replace(" ", "-")}"> ${status}</span>
        </td>
        `;

    programTableBodyEl.appendChild(row);
});

/* Render Top Retention List */

const topRetentionPrograms = [...programs]
    .sort((a, b) => b.retentionRate - a.retentionRate)
    .slice(0, 5);

topRetentionPrograms.forEach(program => {
    const programItem = document.createElement("div");
    programItem.classList.add("program-item");

    programItem.innerHTML = `
        <div>
            <h4>${program.name}</h4>
            <p>${program.students.toLocaleString()} students</p>
        </div>
        <strong>${program.retentionRate}%</strong>
    `;

    topRetentionListEl.appendChild(programItem);
});