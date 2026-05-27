/* Kpi cards */

const totalStudentsEl = document.querySelector("#totalStudents");
const retentionRateEl = document.querySelector("#retentionRate");
const completionRateEl = document.querySelector("#completionRate");
const atRiskStudentsEl = document.querySelector("#atRiskStudents");
const atRiskTableBody = document.querySelector("#atRiskTableBody");
const programFilter = document.querySelector("#programFilter");
const programList = document.querySelector("#programList");


programNames.forEach(program => {
    const option = document.createElement("option");
    option.value = program;
    option.textContent = program;
    programFilter.appendChild(option);
});

function getEnrollmentData(selectedProgram) {
    if (selectedProgram === "All") {
        return enrollmentByTerm.map(item => item.students);
    }

    return enrollmentByTerm.map(item => {
        const base = item.students;

        const programFactor = 0.05 + Math.random() * 0.1;
        return Math.round(base * programFactor);
    });
}

function getRetentionData(selectedProgram) {
    if (selectedProgram === "All") {
        return retentionByTerm.map(item => item.rate);
    }

    return retentionByTerm.map(item => {
        const variation = Math.random() * 5 - 2;
        return Math.round(item.rate + variation);
    });
}

/* Importing Charts for Enrollment and Retention */

const enrollmentChartCanvas = document.querySelector("#enrollmentChart");
const retentionChartCanvas = document.querySelector("#retentionChart");

const enrollmentChart = new Chart(enrollmentChartCanvas, {
    type: "line",
    data: {
        labels: enrollmentByTerm.map(item => item.term),
        datasets: [
            {
                label: "Students Enrolled",
                data: enrollmentByTerm.map(item => item.students),
                tension: 0.3,
                borderWidth: 1,
                pointRadius: 4,
                fill: false
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
        layout: {
            padding: 10
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

const retentionChart = new Chart(retentionChartCanvas, {
  type: "bar",
  data: {
    labels: retentionByTerm.map(item => item.term),
    datasets: [
      {
        label: "Retention Rate",
        data: retentionByTerm.map(item => item.rate),
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
    layout: {
        padding: 10
    },
    scales: {
        y: {
            beginAtZero: true
            }
        }
    }
});

function renderProgramSnapshot() {
    programList.innerHTML = "";

    const topPrograms = [...programs]
        .sort((a, b) => b.retentionRate - a.retentionRate)
        .slice(0, 5)

        topPrograms.forEach(program => {
            const programItem = document.createElement("div");
            programItem.classList.add("program-item");

            programItem.innerHTML = `
                <div>
                    <h4>${program.name}</h4>
                    <p>${program.students.toLocaleString()} students</p>
                </div>
                <strong>${program.retentionRate}%</strong>
            `;

            programList.appendChild(programItem);
        });
}


function updateDashboard(selectedProgram = "All") {
  const filteredStudents =
    selectedProgram === "All"
      ? students
      : students.filter(student => student.program === selectedProgram);

  const totalStudents = filteredStudents.length;

  const highRiskStudents = filteredStudents.filter(
    student => student.riskLevel === "High"
  );

let latestRetention;
let completionRate;

if (selectedProgram === "All") {
  latestRetention = retentionByTerm[retentionByTerm.length - 1].rate;
  completionRate = 42.6;
} else {
  const selectedProgramData = programs.find(
    program => program.name === selectedProgram
  );

  latestRetention = selectedProgramData.retentionRate;

  completionRate = Math.round(
    selectedProgramData.retentionRate - 25 + Math.random() * 8
  );
}

  totalStudentsEl.textContent = totalStudents.toLocaleString();
  retentionRateEl.textContent = `${latestRetention}%`;
  completionRateEl.textContent = `${completionRate}%`;
  atRiskStudentsEl.textContent = highRiskStudents.length.toLocaleString();

  atRiskTableBody.innerHTML = "";

  highRiskStudents.slice(0, 6).forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.program}</td>
      <td>${student.gpa}</td>
      <td><span class="risk high">${student.riskLevel}</span></td>
    `;

    atRiskTableBody.appendChild(row);
  });

/* Update Enrollment Chart */

enrollmentChart.data.datasets[0].data =
    getEnrollmentData(selectedProgram);

enrollmentChart.update();

/* Update Retention Chart */

retentionChart.data.datasets[0].data =
    getRetentionData(selectedProgram);

retentionChart.update();
}

programFilter.addEventListener("change", () => {
    updateDashboard(programFilter.value);
});

renderProgramSnapshot();
updateDashboard();