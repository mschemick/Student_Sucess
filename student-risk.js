const highRiskStudentsEl = document.querySelector("#highRiskStudents");
const mediumRiskStudentsEl = document.querySelector("#mediumRiskStudents");
const averageGpaEl = document.querySelector("#averageGpa");
const belowTwoGpaEl = document.querySelector("#belowTwoGpa");
const riskStudentTableBodyEl = document.querySelector("#riskStudentTableBody");

const riskDistributionChartCanvas = document.querySelector("#riskDistributionChart");
const riskProgramChartCanvas = document.querySelector("#riskProgramChart");

/* Kpi Cards */

const highRiskStudents = students.filter(
    student => student.riskLevel === "High"
);

const mediumRiskStudents = students.filter(
    student => student.riskLevel === "Medium"
);

const belowTwoGpaStudents = students.filter(
    student => student.gpa < 2.0
);

const averageGpa =
    students.reduce((sum, student) => sum + student.gpa, 0) /
    students.length;

highRiskStudentsEl.textContent = highRiskStudents.length.toLocaleString();
mediumRiskStudentsEl.textContent = mediumRiskStudents.length.toLocaleString();
averageGpaEl.textContent = averageGpa.toFixed(2);
belowTwoGpaEl.textContent = belowTwoGpaStudents.length.toLocaleString();

/* Charts */

new Chart(riskDistributionChartCanvas, {
    type: "doughnut",
    data: {
        labels: ["High Rrisk", "Medium Risk", "Low Risk"],
        datasets: [
            {
                data: [
                    students.filter(student => student.riskLevel === "High").length,
                    students.filter(student => student.riskLevel === "Medium").length,
                    students.filter(student => student.riskLevel === "Low").length,
                ],
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

const riskPrograms = programNames.map(program => {
    const highRiskCount = students.filter(
        student =>
            student.program === program &&
            student.riskLevel === "High").length;

    return {
        program,
        highRiskCount
    };
});

const topRiskPrograms = [...riskPrograms]
.sort((a, b) => b.highRiskCount - a.highRiskCount)
.slice(0, 10);

new Chart(riskProgramChartCanvas, {
  type: "bar",
  data: {
    labels: topRiskPrograms.map(item => item.program),
    datasets: [
      {
        label: "High Risk Students",
        data: topRiskPrograms.map(item => item.highRiskCount),
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
  }
});

/* Render at-risk table */

highRiskStudents.slice(0, 25).forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.program}</td>
        <td>${student.gpa}</td>
        <td>${student.creditCompleted}</td>
        <td>
            <spam class="risk high">${student.riskLevel}</spam>
        </td>    
    `;

    riskStudentTableBodyEl.appendChild(row);
});