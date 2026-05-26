/* element selection */
const currentEnrollmentEl = document.querySelector("#currentEnrollment");
const enrollmentGrowthEl = document.querySelector("#enrollmentGrowth");
const largestEnrollmentProgramEl = document.querySelector("#largestEnrollmentProgram");
const lowEnrollmentProgramsEl = document.querySelector("#lowEnrollmentPrograms");
const enrollmentTableBodyEl = document.querySelector("#enrollmentTableBody");
const enrollmentProgramFilterEl = document.querySelector("#enrollmentProgramFilter")

const enrollmentTrendChartCanvas = document.querySelector("#enrollmentTrendChart");
const enrollmentChangeChartCanvas = document.querySelector("#enrollmentChangeChart");

const latestEnrollmentChangeEl = document.querySelector("#latestEnrollmentChange");
const largestEnrollmentGainEl = document.querySelector("#largestEnrollmentGain");
const largestEnrollmentDropEl = document.querySelector("#largestEnrollmentDrop");

/* filtering dropdown */

programNames.forEach(program => {
    const option = document.createElement("option");
    option.value = program;
    option.textContent = program;
    enrollmentProgramFilterEl.appendChild(option);
});

function getEnrollmentData(selectedProgram) {
    if (selectedProgram === "all") {
        return enrollmentByTerm.map(item => item.students);
    }

    return enrollmentByTerm.map(item => {
        const base = item.students;

        const programFactor = 0.05 + Math.random() * 0.1;
        return Math.round(base * programFactor);
    });
}


/* kpi cards */

const currentEnrollment = enrollmentByTerm[enrollmentByTerm.length - 1].students;
const previousFallEnrollment = enrollmentByTerm[4].students;

const enrollmentGrowth =
    ((currentEnrollment - previousFallEnrollment) / previousFallEnrollment) * 100;

const largestProgram = [...programs].sort((a, b) => b.students - a.students)[0];

const lowEnrollmentProgram = programs.filter(program => program.students < 100);

currentEnrollmentEl.textContent = currentEnrollment.toLocaleString();
enrollmentGrowthEl.textContent = `${enrollmentGrowth.toFixed(1)}%`;
largestEnrollmentProgramEl.textContent = largestProgram.name;
lowEnrollmentProgramsEl.textContent = lowEnrollmentProgram.length;

/* Enrollment trend Charts */

const enrollmentTrendChart =
new Chart(enrollmentTrendChartCanvas, {
    type: "line",
    data: {
        labels: enrollmentByTerm.map(item => item.term),
        datasets: [
            {
                label: "Students",
                data: enrollmentByTerm.map(item => item.students),
                tension: 0.1,
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
        }
    }
});

/* Program Enrollment Chart */

function getEnrollmentChangeData(enrollmentData) {
    return enrollmentData.map(
        (value, index) => {
            if (index === 0) {
            return 0;
            }
            return (
                value - enrollmentData[index - 1]
            );
        }
    );
}

/* 2nd chart */

const enrollmentChangeData =
    getEnrollmentChangeData(
        enrollmentByTerm.map(item => item.students)
    );

const enrollmentChangeChart = 
new Chart(enrollmentChangeChartCanvas, {
    type: "bar",
    data: {
        labels: enrollmentByTerm.map(item => item.term),
        datasets: [
            {
                label: "Enrollment Change",
                data: enrollmentChangeData,
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
        }
    }
});

const latestChange =
    enrollmentChangeData[
        enrollmentChangeData.length - 1
    ];

const largestGain =
    Math.max(
        ...enrollmentChangeData
    );

const largestDrop =
    Math.min(
        ...enrollmentChangeData
    );

latestEnrollmentChangeEl.textContent =
    latestChange > 0
        ? `+${latestChange}`
        : latestChange;

largestEnrollmentGainEl.textContent =
    `+${largestGain}`;

largestEnrollmentDropEl.textContent =
    largestDrop;

function updateEnrollmentDashboard() {
    const selectedProgram = enrollmentProgramFilterEl.value;
    const enrollmentData = getEnrollmentData(selectedProgram)
    const changeData = getEnrollmentChangeData(enrollmentData);
    const currentEnrollmentValue = enrollmentData[enrollmentData.length - 1];
    const previousEnrollmentValue = enrollmentData[enrollmentData.length - 2];
    const growthRate = ((currentEnrollmentValue - previousEnrollmentValue) /
        previousEnrollmentValue) * 100;
    currentEnrollmentEl.textContent = currentEnrollmentValue.toLocaleString();
    enrollmentGrowthEl.textContent = `${growthRate.toFixed(1)}%`;

    if (selectedProgram === "all") {
        largestEnrollmentProgramEl.textContent = largestProgram.name;
        lowEnrollmentProgramsEl.textContent = lowEnrollmentProgram.length;}   
    else {
        largestEnrollmentProgramEl.textContent = selectedProgram;
        lowEnrollmentProgramsEl.textContent = currentEnrollmentValue < 100 ? 1 : 0;
    }
    enrollmentTrendChart.data.datasets[0].data = enrollmentData;
    enrollmentTrendChart.update();
    enrollmentChangeChart.data.datasets[0].data = changeData;
    enrollmentChangeChart.update();
}



/* Render Enrollment Table */

const programsByEnrollment = [...programs].sort(
    (a, b) => b.students - a.students
);

programsByEnrollment.forEach(program => {
    const row = document.createElement("tr");

    let demandStatus;
    
    if (program.students >= 80) {
        demandStatus = "High Demand";
    }
    else if (program.students >= 60) {
        demandStatus = "Stable";
    }
    else {
        demandStatus = "Low Enrollment";
    }

    row.innerHTML = `
        <td>${program.name}</td>
        <td>${program.students.toLocaleString()}</td>
        <td>${program.retentionRate}%</td>
        <td><span class="demand-badge ${demandStatus.toLowerCase().replace(" ", "-")}">${demandStatus}</span></td>
        `;

        enrollmentTableBodyEl.appendChild(row)
});

enrollmentProgramFilterEl.addEventListener("change", updateEnrollmentDashboard);
