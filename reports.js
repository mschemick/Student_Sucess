const reportTotalStudentsEl = document.querySelector("#reportTotalStudents");
const reportRetentionEl = document.querySelector("#reportRetention");
const reportCompletionEl = document.querySelector("#reportCompletion");
const reportHighRiskEl = document.querySelector("#reportHighRisk");
const reportTableBodyEl = document.querySelector("#reportTableBody");

const reportEnrollmentChartCanvas = document.querySelector("#reportEnrollmentChart");
const reportRetentionChartCanvas = document.querySelector("#reportRetentionChart");

/* Kpi Cards */

const totalStudents = students.length;

const currentRetention = retentionByTerm[retentionByTerm.length - 1].rate;

const estimatedCompletion =
    programs.reduce((sum, program) => sum + program.retentionRate, 0 ) / programs.length - 25;

const highRiskStudents = students.filter(
    student => student.riskLevel === "High"
);

reportTotalStudentsEl.textContent = totalStudents.toLocaleString();
reportRetentionEl.textContent = `${currentRetention}%`;
reportCompletionEl.textContent = `${estimatedCompletion.toFixed(1)}%`;
reportHighRiskEl.textContent = highRiskStudents.length.toLocaleString(); 

/* Charts */

new Chart(reportEnrollmentChartCanvas, {
    type: "line",
    data: {
        labels: enrollmentByTerm.map(item => item.term),
        datasets: [
            {
                label: "Enrollment",
                data: enrollmentByTerm.map(item => item.students),
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 3
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

const fullTiimePercent = 64.0;

const highRiskPercent =
(highRiskStudents.length / totalStudents) * 100;

new Chart(reportRetentionChartCanvas, {
    type: "bar",
    data: {
        labels: [
            "Retention",
            "Completion",
            "Full-Time",
            "High-Risk"
        ],
        datasets: [
            {
                label: "Percent",
                data: [
                    currentRetention,
                    estimatedCompletion,
                    fullTiimePercent,
                    highRiskPercent
                ],
                borderWidth: 1,
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
                beginAtZero: true,
                max: 100
            }
        }
    }
});

const reportRows = [
  {
    area: "Enrollment",
    metric: `${totalStudents.toLocaleString()} Students`,
    status: "Stable",
    trend: "▲ Increasing"
  },

  {
    area: "Retention",
    metric: `${currentRetention}%`,
    status: "Positive",
    trend: "▲ Improving"
  },

  {
    area: "Completion",
    metric: `${estimatedCompletion.toFixed(1)}%`,
    status: "Monitoring",
    trend: "▼ Slight Decline"
  },

  {
    area: "Student Risk",
    metric: `${highRiskStudents.length} High Risk`,
    status: "Attention Needed",
    trend: "▲ Increasing"
  },

  {
    area: "Demographics",
    metric: `${totalStudents.toLocaleString()} Active Students`,
    status: "Balanced",
    trend: "▬ Stable"
  }
];

/* Table data */

reportRows.forEach(report => {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${report.area}</td>
    <td>${report.metric}</td>
    <td>${report.status}</td>
    <td>${report.trend}</td>
    `;

    reportTableBodyEl.appendChild(row);
});