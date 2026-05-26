/* Generate programs */
const programNames = [
  "Business Administration", "Nursing", "Computer Science", "Liberal Arts",
  "Psychology", "Criminal Justice", "Biology", "Accounting",
  "Marketing", "Education", "Engineering", "Health Sciences",
  "Communications", "Sociology", "Political Science", "Mathematics",
  "Chemistry", "Physics", "Graphic Design", "Cybersecurity",
  "Information Systems", "Economics", "Philosophy", "History",
  "English", "Hospitality Management", "Finance", "Entrepreneurship",
  "Public Health", "Environmental Science", "Art", "Music",
  "Theater", "Sports Management", "Human Resources", "Supply Chain",
  "Data Analytics", "Web Development", "AI & Machine Learning", "Game Design"
];

/* Generate Students */
let students = [];

function getRandomGPA() {
  return (Math.random() * (4.0 - 1.8) + 1.8).toFixed(2);
}

function getRandomCredits() {
  return Math.floor(Math.random() * 60) + 6;
}

function determineRisk(gpa, credits) {
  if (gpa < 2.3 || credits < 15) return "High";
  if (gpa < 2.8) return "Medium";
  return "Low";
}

for (let i = 1; i <= 2845; i++) {
  const program = programNames[Math.floor(Math.random() * programNames.length)];
  const gpa = parseFloat(getRandomGPA());
  const credits = getRandomCredits();

  students.push({
    id: 1000 + i,
    name: `Student ${i}`,
    program,
    gpa,
    creditsCompleted: credits,
    enrollmentStatus: "Enrolled",
    riskLevel: determineRisk(gpa, credits)
  });
}

/* Generate proggram summaries */
let programs = programNames.map(program => {
  const programStudents = students.filter(s => s.program === program);

  const retentionBase = 65 + Math.random() * 15;

  return {
    name: program,
    students: programStudents.length,
    retentionRate: Math.round(retentionBase)
  };
});

/* Enrollment through fall 2025 */
let enrollmentByTerm = [
  { term: "Fall 2022", students: 2485 },
  { term: "Spring 2023", students: 2550 },
  { term: "Fall 2023", students: 2710 },
  { term: "Spring 2024", students: 2780 },
  { term: "Fall 2024", students: 2825 },
  { term: "Spring 2025", students: 2800 },
  { term: "Fall 2025", students: 2845 }
];

/* Retention trends */
let retentionByTerm = [
  { term: "Fall 2022", rate: 69 },
  { term: "Fall 2023", rate: 71 },
  { term: "Fall 2024", rate: 73 },
  { term: "Fall 2025", rate: 74.2 }
];

const savedAppData =
    localStorage.getItem(
        "studentSuccessData"
    );

if (savedAppData) {
    const parsedData =
        JSON.parse(savedAppData);
    students =
        parsedData.students;
    programs =
        parsedData.programs;
    enrollmentByTerm =
        parsedData.enrollmentByTerm;
    retentionByTerm =
        parsedData.retentionByTerm;
}
else {
    const appData = {
        students,
        programs,
        enrollmentByTerm,
        retentionByTerm
    };

    localStorage.setItem(
        "studentSuccessData",
        JSON.stringify(appData)
    );

}