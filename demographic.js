/* element selection */
const demoTotalStudentsEl = document.querySelector("#demoTotalStudents");
const averageAgeEl = document.querySelector("#averageAge");
const fullTimePercentEl = document.querySelector("#fullTimePercent");
const outOfCountyPercentEl = document.querySelector("#outOfCountyPercent");
const demographicsProgramFilterEl = document.querySelector("#demographicsProgramFilter");

const demographicsTableBodyEl = document.querySelector("#demographicsTableBody");

const ageGroupChartCanvas = document.querySelector("#ageGroupChart");
const genderChartCanvas = document.querySelector("#genderChart");
const enrollmentStatusChartCanvas = document.querySelector("#enrollmentStatusChart");
const countyChartCanvas = document.querySelector("#countyChart");

/* demographic generated data */
const counties = [
  "Warren",
  "Hunterdon",
  "Morris",
  "Sussex",
  "Somerset",
  "Middlesex",
  "Union",
  "Essex",
  "Passaic",
  "Bergen"
];

const genders = ["Female", "Male"];

const demographicStudents = students.map(student => {
const age = Math.floor(Math.random() * 35) + 18;
const enrollmentLoad = Math.random() > 0.35 ? "Full-Time" : "Part-Time";
const county = counties[Math.floor(Math.random() * counties.length)];
const gender = genders[Math.floor(Math.random() * genders.length)];

  return {
    ...student,
    age,
    enrollmentLoad,
    county,
    gender
  };
});

/* Populate filter bar */

programNames.forEach(program => {
  const option = document.createElement("option");

  option.value = program;
  option.textContent = program;

  demographicsProgramFilterEl.appendChild(option);
});

function getFilteredStudents() {
  const selectedProgram =
    demographicsProgramFilterEl.value;
  if(selectedProgram === "All") {
    return demographicStudents;
  }

  return demographicStudents.filter(
    student =>
      student.program === selectedProgram
  );
}

function updateDemographicKpis() {
  const filteredStudents =
    getFilteredStudents();
  const totalStudents =
    filteredStudents.length;
  const averageAge =
    filteredStudents.reduce
      ((sum, student) =>
        sum + student.age, 0) / totalStudents;
  const fullTimeStudents =
    filteredStudents.filter(
      student =>
        student.enrollmentLoad === "Full-Time"
    );
  const outOfCountyStudents =
    filteredStudents.filter(
      student =>
        student.county !== "Warren"
    );

  demoTotalStudentsEl.textContent = totalStudents.toLocaleString();
  averageAgeEl.textContent = averageAge.toFixed(1);
  fullTimePercentEl.textContent = `${(fullTimeStudents.length / totalStudents * 100).toFixed(1)}%`;
  outOfCountyPercentEl.textContent = `${(outOfCountyStudents.length / totalStudents * 100).toFixed(1)}%`;
}

function updateDemographicCharts() {
  const filteredStudents =
    getFilteredStudents();
  const genderCounts =
    countByCategory(filteredStudents, "gender");
  const enrollmentCounts =
    countByCategory(filteredStudents, "enrollmentLoad");
  const countyCounts =
    countByCategory(filteredStudents, "county");
  const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45+": 0
  };
  filteredStudents.forEach(student => {
    if (student.age <= 24) {
      ageGroups["18-24"]++;
    }
    else if (student.age <= 34) {
      ageGroups["25-34"]++;
    }
    else if (student.age <= 44) {
      ageGroups["35-44"]++;
    }
    else {
      ageGroups["45+"]++;
    }
  });

  genderChart.data.labels =
    Object.keys(genderCounts);

  genderChart.data.datasets[0].data =
    Object.values(genderCounts);

  genderChart.update();

  ageGroupChart.data.datasets[0].data =
    Object.values(ageGroups);

  ageGroupChart.update();

  enrollmentStatusChart.data.labels =
    Object.keys(enrollmentCounts);

  enrollmentStatusChart.data.datasets[0].data =
    Object.values(enrollmentCounts);

  enrollmentStatusChart.update();

  countyChart.data.labels =
    Object.keys(countyCounts);

  countyChart.data.datasets[0].data =
    Object.values(countyCounts);

  countyChart.update();
}




/* Kpi Cards */

const totalStudents = demographicStudents.length;

const averageAge =
    demographicStudents.reduce((sum,student) => sum + student.age, 0) / demographicStudents.length;

const fullTimeStudents = demographicStudents.filter(
    student => student.enrollmentLoad === "Full-Time"
);

const outOfCountyStudents = demographicStudents.filter(
    student => student.county !== "Warren" 
);

demoTotalStudentsEl.textContent = totalStudents.toLocaleString();
averageAgeEl.textContent = averageAge.toFixed(1);
fullTimePercentEl.textContent = `${((fullTimeStudents.length / totalStudents) * 100).toFixed(1)}%`;
outOfCountyPercentEl.textContent = `${((outOfCountyStudents.length / totalStudents) * 100).toFixed(1)}%`;

/* Count by categgory function */

function countByCategory(data, key) {
  return data.reduce((counts, item) => {
    const value = item[key];

    counts[value] = (counts[value] || 0) + 1;

    return counts;
  }, {});
}

/* Charts - gender chart */

const genderCounts = countByCategory(
  demographicStudents,
  "gender"
);

const genderChart =
new Chart(genderChartCanvas, {
  type: "doughnut",
  data: {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        data: Object.values(genderCounts),
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

/* Charts - age distribution chart */

const ageGroups = {
  "18-24": 0,
  "25-34": 0,
  "35-44": 0,
  "45+": 0
};

demographicStudents.forEach(student => {
  if (student.age <= 24) {
    ageGroups["18-24"]++;}
  else if (student.age <= 34) {
    ageGroups["25-34"]++;}
  else if (student.age <= 44) {
    ageGroups["35-44"]++;}
  else {
    ageGroups["45+"]++;
  }
});

const ageGroupChart =
new Chart(ageGroupChartCanvas, {
  type: "bar",
  data: {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: "Students",
        data: Object.values(ageGroups),
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

/* charts - enrollment chart */

const enrollmentStatusCounts = countByCategory(
  demographicStudents,
  "enrollmentLoad"
);

const enrollmentStatusChart =
new Chart(enrollmentStatusChartCanvas, {
  type: "doughnut",
  data: {
    labels: Object.keys(enrollmentStatusCounts),
    datasets: [
      {
        data: Object.values(enrollmentStatusCounts),
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

/* Charts - Geographic Chart */

const countyCounts = countByCategory(
  demographicStudents,
  "county"
);

const countyChart =
new Chart(countyChartCanvas, {
  type: "bar",
  data: {
    labels: Object.keys(countyCounts),
    datasets: [
      {
        label: "Students",
        data: Object.values(countyCounts),
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

/* Charts - Map Chart */

const countyCoordinates = {
  Warren: [40.8531, -74.8291],
  Hunterdon: [40.5666, -74.9209],
  Morris: [40.8336, -74.5463],
  Sussex: [41.1287, -74.6869],
  Somerset: [40.5666, -74.6167],
  Middlesex: [40.4111, -74.3587],
  Union: [40.6595, -74.2884],
  Essex: [40.7879, -74.2462],
  Passaic: [41.0334, -74.3000],
  Bergen: [40.9263, -74.0770]
};

const studentMap = L.map("studentMap").setView([40.7, -74.6], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(studentMap);

const maxCountyCount = Math.max(...Object.values(countyCounts));

const heatData = Object.entries(countyCounts)
.map(([county, count]) => {
  const coordinates = countyCoordinates[county];

  if (!coordinates) return null;

  const normalized = count / maxCountyCount;
  const intensity = Math.pow(normalized, 0.01);;

  return [
    coordinates[0],
    coordinates[1],
    intensity
  ];
})
.filter(item => item !== null);

let heatLayer = L.heatLayer(heatData, {
  radius: 45,
  blur: 35,
  maxZoom: 10
}).addTo(studentMap);

function updateDemographicHeatmap() {
  const filteredStudents =
    getFilteredStudents();
  
  const countyCounts =
    countByCategory(
      filteredStudents, "county"
    );

  const maxCountyCount =
    Math.max(
      ...Object.values(countyCounts)
    );

  const heatData =
    Object.entries(countyCounts)

    .map(([county, count]) => {
      const coordinates =
        countyCoordinates[county];
      if (!coordinates) {
        return null;
      }

      const normalized =
        count / maxCountyCount;
      
      const intensity =
        Math.pow(
          normalized,
          0.01
        );

      return [
        coordinates[0],
        coordinates[1],
        intensity
      ];
    })

    .filter(
      item =>
        item !== null
    );

  studentMap.removeLayer(
    heatLayer
  );

  heatLayer =
    L.heatLayer(
      heatData,
      {
        radius: 45,
        blur: 35,
        maxZoom: 10
      }
    ).addTo(
      studentMap
    );
}

/* Summary Table */

function calculatePercent(count) {
  return ((count / totalStudents) * 100). toFixed(1);
}

function addSummaryRows(category, dataObject) {
  Object.entries(dataObject).forEach(([group, count]) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${category}</td>
      <td>${group}</td>
      <td>${count.toLocaleString()}</td>
      <td>${calculatePercent(count)}%</td>      
    `;

    demographicsTableBodyEl.appendChild(row);
  });
}

function updateDemographicTable() {
  const filteredStudents =
    getFilteredStudents();
  
    demographicsTableBodyEl.innerHTML = "";

    const genderCounts =
      countByCategory(
        filteredStudents, "gender"
      );

    const enrollmentCounts = 
      countByCategory(
        filteredStudents, "enrollmentLoad"
      );
    
    const countyCounts =
      countByCategory(
        filteredStudents, "county"
      );
    
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45+": 0
    };

    filteredStudents.forEach(student => {
      if (student.age <= 24) {
        ageGroups["18-24"]++;}
      else if (student.age <= 34) {
        ageGroups["25-34"]++;}
      else if (student.age <= 44) {
        ageGroups["35-44"]++;}
      else {
        ageGroups["45+"]++;
      }
  });

  addSummaryRows(
    "Gender", genderCounts
  );
  addSummaryRows(
    "Enrollment Status", enrollmentCounts
  );
  addSummaryRows(
    "County", countyCounts
  );
  addSummaryRows(
    "Age Group", ageGroups
  );
}

demographicsProgramFilterEl.addEventListener(
    "change",
    () => {
        updateDemographicKpis();
        updateDemographicCharts();
        updateDemographicTable();
        updateDemographicHeatmap();
    }
);

updateDemographicKpis();
updateDemographicCharts();
updateDemographicTable();
updateDemographicHeatmap();