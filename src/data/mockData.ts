// ============================================================
// MOCK DATA for Intelligent Resource & Skill Mapping System
// ============================================================

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  level: SkillLevel;
  proficiency: number; // 0-100
  yearsExp: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  fileUrl?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  status: "Completed" | "Ongoing" | "Upcoming";
  rating?: number;
  startDate: string;
  endDate?: string;
  skillsUsed: string[];
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  experience: number; // years
  availability: "Available" | "Busy" | "On Leave";
  workload: number; // 0-100
  performanceRating: number; // 1-5
  totalProjects: number;
  skillUtilization: number; // 0-100
  skills: Skill[];
  certifications: Certification[];
  projects: ProjectEntry[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Completed" | "Ongoing" | "Upcoming";
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  deadline: string;
  startDate: string;
  requiredSkills: { name: string; level: SkillLevel }[];
  assignedEmployees: string[]; // employee IDs
  managerRatings: { empId: string; rating: number; comment: string }[];
}

export interface MatchResult {
  employeeId: string;
  matchScore: number;
  skillMatchPct: number;
  availability: "Available" | "Busy" | "On Leave";
  workload: number;
  skillUtilization: number;
}

// -------- EMPLOYEES --------
export const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Alex Johnson",
    department: "Engineering",
    experience: 5,
    availability: "Available",
    workload: 30,
    performanceRating: 4.7,
    totalProjects: 12,
    skillUtilization: 82,
    skills: [
      { name: "React", level: "Expert", proficiency: 92, yearsExp: 4 },
      { name: "TypeScript", level: "Advanced", proficiency: 85, yearsExp: 3 },
      { name: "Node.js", level: "Intermediate", proficiency: 65, yearsExp: 2 },
      { name: "Python", level: "Intermediate", proficiency: 60, yearsExp: 2 },
      { name: "AWS", level: "Beginner", proficiency: 40, yearsExp: 1 },
    ],
    certifications: [
      { id: "C1", name: "AWS Cloud Practitioner", issuer: "Amazon", date: "2023-04-10", expiry: "2026-04-10" },
      { id: "C2", name: "React Advanced Developer", issuer: "Meta", date: "2022-08-15", expiry: "2025-08-15" },
    ],
    projects: [
      { id: "P1", name: "Customer Portal Redesign", role: "Lead Developer", status: "Completed", rating: 4.8, startDate: "2023-01-01", endDate: "2023-06-30", skillsUsed: ["React", "TypeScript"] },
      { id: "P2", name: "Analytics Dashboard", role: "Frontend Lead", status: "Completed", rating: 4.6, startDate: "2023-07-01", endDate: "2023-12-31", skillsUsed: ["React", "TypeScript", "Node.js"] },
      { id: "P3", name: "AI Integration Platform", role: "Developer", status: "Ongoing", startDate: "2024-01-15", skillsUsed: ["Python", "React"] },
    ],
  },
  {
    id: "EMP002",
    name: "Priya Patel",
    department: "Data Science",
    experience: 6,
    availability: "Available",
    workload: 45,
    performanceRating: 4.9,
    totalProjects: 15,
    skillUtilization: 91,
    skills: [
      { name: "Python", level: "Expert", proficiency: 95, yearsExp: 6 },
      { name: "Machine Learning", level: "Expert", proficiency: 93, yearsExp: 5 },
      { name: "TensorFlow", level: "Advanced", proficiency: 82, yearsExp: 3 },
      { name: "SQL", level: "Advanced", proficiency: 80, yearsExp: 5 },
      { name: "React", level: "Beginner", proficiency: 38, yearsExp: 1 },
    ],
    certifications: [
      { id: "C3", name: "Google Professional ML Engineer", issuer: "Google", date: "2023-02-20", expiry: "2026-02-20" },
      { id: "C4", name: "TensorFlow Developer Certificate", issuer: "TensorFlow", date: "2022-11-05", expiry: "2025-11-05" },
    ],
    projects: [
      { id: "P4", name: "Fraud Detection Model", role: "ML Engineer", status: "Completed", rating: 5.0, startDate: "2023-03-01", endDate: "2023-09-30", skillsUsed: ["Python", "Machine Learning", "TensorFlow"] },
      { id: "P5", name: "Customer Churn Prediction", role: "Data Scientist", status: "Completed", rating: 4.8, startDate: "2023-10-01", endDate: "2024-03-31", skillsUsed: ["Python", "ML", "SQL"] },
      { id: "P3", name: "AI Integration Platform", role: "ML Lead", status: "Ongoing", startDate: "2024-01-15", skillsUsed: ["Python", "TensorFlow"] },
    ],
  },
  {
    id: "EMP003",
    name: "Marcus Chen",
    department: "Engineering",
    experience: 4,
    availability: "Busy",
    workload: 80,
    performanceRating: 4.2,
    totalProjects: 9,
    skillUtilization: 75,
    skills: [
      { name: "Java", level: "Expert", proficiency: 90, yearsExp: 4 },
      { name: "Spring Boot", level: "Advanced", proficiency: 84, yearsExp: 3 },
      { name: "Kubernetes", level: "Intermediate", proficiency: 68, yearsExp: 2 },
      { name: "Docker", level: "Advanced", proficiency: 80, yearsExp: 3 },
      { name: "SQL", level: "Intermediate", proficiency: 65, yearsExp: 3 },
    ],
    certifications: [
      { id: "C5", name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2023-05-10", expiry: "2026-05-10" },
    ],
    projects: [
      { id: "P6", name: "Microservices Migration", role: "Backend Lead", status: "Completed", rating: 4.3, startDate: "2022-06-01", endDate: "2023-02-28", skillsUsed: ["Java", "Spring Boot", "Kubernetes"] },
      { id: "P7", name: "Real-Time Inventory System", role: "Lead Developer", status: "Ongoing", startDate: "2024-02-01", skillsUsed: ["Java", "Docker"] },
    ],
  },
  {
    id: "EMP004",
    name: "Sarah Williams",
    department: "Design & Engineering",
    experience: 7,
    availability: "Available",
    workload: 20,
    performanceRating: 4.6,
    totalProjects: 18,
    skillUtilization: 88,
    skills: [
      { name: "React", level: "Expert", proficiency: 94, yearsExp: 5 },
      { name: "TypeScript", level: "Expert", proficiency: 91, yearsExp: 5 },
      { name: "Node.js", level: "Advanced", proficiency: 83, yearsExp: 4 },
      { name: "GraphQL", level: "Advanced", proficiency: 78, yearsExp: 3 },
      { name: "AWS", level: "Intermediate", proficiency: 64, yearsExp: 2 },
    ],
    certifications: [
      { id: "C6", name: "AWS Solutions Architect", issuer: "Amazon", date: "2023-07-15", expiry: "2026-07-15" },
      { id: "C7", name: "GraphQL Professional", issuer: "Apollo", date: "2022-03-20", expiry: "2025-03-20" },
    ],
    projects: [
      { id: "P8", name: "E-Commerce Platform v3", role: "Full-Stack Lead", status: "Completed", rating: 4.7, startDate: "2023-01-15", endDate: "2023-08-15", skillsUsed: ["React", "Node.js", "GraphQL"] },
      { id: "P9", name: "Internal Tools Portal", role: "Tech Lead", status: "Completed", rating: 4.5, startDate: "2023-09-01", endDate: "2024-01-31", skillsUsed: ["React", "TypeScript"] },
    ],
  },
  {
    id: "EMP005",
    name: "James Rodriguez",
    department: "DevOps",
    experience: 8,
    availability: "On Leave",
    workload: 0,
    performanceRating: 4.4,
    totalProjects: 20,
    skillUtilization: 70,
    skills: [
      { name: "AWS", level: "Expert", proficiency: 95, yearsExp: 7 },
      { name: "Terraform", level: "Expert", proficiency: 92, yearsExp: 5 },
      { name: "Kubernetes", level: "Expert", proficiency: 90, yearsExp: 5 },
      { name: "Docker", level: "Expert", proficiency: 91, yearsExp: 6 },
      { name: "Python", level: "Intermediate", proficiency: 60, yearsExp: 3 },
    ],
    certifications: [
      { id: "C8", name: "AWS DevOps Professional", issuer: "Amazon", date: "2022-10-01", expiry: "2025-10-01" },
      { id: "C9", name: "HashiCorp Terraform Associate", issuer: "HashiCorp", date: "2023-01-15", expiry: "2026-01-15" },
    ],
    projects: [
      { id: "P10", name: "Cloud Infrastructure Modernization", role: "DevOps Lead", status: "Completed", rating: 4.5, startDate: "2022-03-01", endDate: "2022-12-31", skillsUsed: ["AWS", "Terraform", "Kubernetes"] },
      { id: "P11", name: "CI/CD Pipeline Overhaul", role: "Infrastructure Lead", status: "Completed", rating: 4.3, startDate: "2023-01-01", endDate: "2023-06-30", skillsUsed: ["Docker", "Kubernetes", "Terraform"] },
    ],
  },
];

// -------- PROJECTS --------
export const projects: Project[] = [
  {
    id: "P001",
    name: "AI Integration Platform",
    description: "Build an intelligent API gateway integrating multiple AI/ML models for enterprise use.",
    status: "Ongoing",
    priority: "High",
    category: "AI/ML",
    deadline: "2024-08-31",
    startDate: "2024-01-15",
    requiredSkills: [{ name: "Python", level: "Advanced" }, { name: "React", level: "Intermediate" }],
    assignedEmployees: ["EMP001", "EMP002"],
    managerRatings: [],
  },
  {
    id: "P002",
    name: "Real-Time Inventory System",
    description: "Microservices-based inventory management with real-time tracking and analytics.",
    status: "Ongoing",
    priority: "Critical",
    category: "Enterprise Software",
    deadline: "2024-07-15",
    startDate: "2024-02-01",
    requiredSkills: [{ name: "Java", level: "Advanced" }, { name: "Docker", level: "Intermediate" }],
    assignedEmployees: ["EMP003"],
    managerRatings: [],
  },
  {
    id: "P003",
    name: "Customer Portal Redesign",
    description: "Complete UI/UX overhaul of customer portal with modern React architecture.",
    status: "Completed",
    priority: "Medium",
    category: "Web Application",
    deadline: "2023-06-30",
    startDate: "2023-01-01",
    requiredSkills: [{ name: "React", level: "Expert" }, { name: "TypeScript", level: "Advanced" }],
    assignedEmployees: ["EMP001"],
    managerRatings: [{ empId: "EMP001", rating: 4.8, comment: "Exceptional frontend work." }],
  },
  {
    id: "P004",
    name: "Cloud Infrastructure v2",
    description: "Next-generation cloud infrastructure with full Kubernetes orchestration.",
    status: "Upcoming",
    priority: "High",
    category: "Infrastructure",
    deadline: "2024-12-31",
    startDate: "2024-09-01",
    requiredSkills: [{ name: "AWS", level: "Expert" }, { name: "Kubernetes", level: "Expert" }, { name: "Terraform", level: "Advanced" }],
    assignedEmployees: [],
    managerRatings: [],
  },
  {
    id: "P005",
    name: "Fraud Detection Enhancement",
    description: "Improving existing fraud detection models with advanced ML techniques.",
    status: "Completed",
    priority: "Critical",
    category: "AI/ML",
    deadline: "2023-09-30",
    startDate: "2023-03-01",
    requiredSkills: [{ name: "Machine Learning", level: "Expert" }, { name: "Python", level: "Expert" }],
    assignedEmployees: ["EMP002"],
    managerRatings: [{ empId: "EMP002", rating: 5.0, comment: "Outstanding model performance." }],
  },
];

// -------- COMPUTE MATCH RESULTS --------
export function computeMatchResults(requiredSkills: { name: string; level: SkillLevel }[]): MatchResult[] {
  const levelWeight: Record<SkillLevel, number> = {
    Beginner: 25,
    Intermediate: 50,
    Advanced: 75,
    Expert: 100,
  };

  return employees
    .map((emp) => {
      let totalRequired = 0;
      let totalMatched = 0;

      requiredSkills.forEach((req) => {
        const reqWeight = levelWeight[req.level];
        totalRequired += reqWeight;
        const empSkill = emp.skills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
        if (empSkill) {
          const empWeight = levelWeight[empSkill.level];
          totalMatched += Math.min(empWeight, reqWeight);
        }
      });

      const skillMatchPct = totalRequired > 0 ? Math.round((totalMatched / totalRequired) * 100) : 0;
      const availabilityBonus = emp.availability === "Available" ? 20 : emp.availability === "Busy" ? 5 : 0;
      const workloadPenalty = Math.round(emp.workload * 0.3);
      const matchScore = Math.min(100, Math.round(skillMatchPct * 0.6 + availabilityBonus + (100 - workloadPenalty) * 0.2));

      return {
        employeeId: emp.id,
        matchScore,
        skillMatchPct,
        availability: emp.availability,
        workload: emp.workload,
        skillUtilization: emp.skillUtilization,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}
