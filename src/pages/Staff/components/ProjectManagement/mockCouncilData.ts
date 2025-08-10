import { Council } from "./detailViewTypes";

export const mockCouncils: Council[] = [
  {
    id: "council-001",
    name: "AI & Machine Learning Research Council",
    description: "Specialized council for artificial intelligence and machine learning projects",
    chairperson: "Prof. Dr. Sarah Chen",
    members: [
      {
        id: "member-001",
        name: "Prof. Dr. Sarah Chen",
        role: "Chairperson",
        department: "Computer Science",
        expertise: ["Machine Learning", "Deep Learning", "Neural Networks"]
      },
      {
        id: "member-002",
        name: "Dr. Michael Rodriguez",
        role: "Senior Member",
        department: "Data Science",
        expertise: ["Natural Language Processing", "Computer Vision", "AI Ethics"]
      },
      {
        id: "member-003",
        name: "Prof. Lisa Wang",
        role: "Member",
        department: "Mathematics",
        expertise: ["Statistical Learning", "Optimization", "Algorithm Design"]
      },
      {
        id: "member-004",
        name: "Dr. James Thompson",
        role: "Member",
        department: "Software Engineering",
        expertise: ["MLOps", "Distributed Systems", "Cloud Computing"]
      }
    ],
    specialization: ["Artificial Intelligence", "Machine Learning", "Data Science", "Computer Vision"],
    status: "active",
    createdAt: "2024-01-15",
    maxProjects: 8,
    currentProjects: 3
  },
  {
    id: "council-002",
    name: "Healthcare Technology Council",
    description: "Council focused on medical technology and healthcare innovation projects",
    chairperson: "Prof. Dr. Emily Johnson",
    members: [
      {
        id: "member-005",
        name: "Prof. Dr. Emily Johnson",
        role: "Chairperson",
        department: "Biomedical Engineering",
        expertise: ["Medical Devices", "Biomedical Imaging", "Healthcare IT"]
      },
      {
        id: "member-006",
        name: "Dr. Robert Kim",
        role: "Senior Member",
        department: "Medicine",
        expertise: ["Clinical Research", "Digital Health", "Telemedicine"]
      },
      {
        id: "member-007",
        name: "Dr. Maria Garcia",
        role: "Member",
        department: "Pharmacy",
        expertise: ["Drug Discovery", "Pharmaceutical Technology", "Bioinformatics"]
      },
      {
        id: "member-008",
        name: "Prof. David Lee",
        role: "Member",
        department: "Public Health",
        expertise: ["Health Informatics", "Epidemiology", "Health Policy"]
      }
    ],
    specialization: ["Healthcare Technology", "Medical Devices", "Digital Health", "Biomedical Engineering"],
    status: "active",
    createdAt: "2024-02-01",
    maxProjects: 6,
    currentProjects: 2
  },
  {
    id: "council-003",
    name: "Software Engineering & Web Development Council",
    description: "Council for software development, web applications, and system architecture projects",
    chairperson: "Prof. Dr. Alex Martinez",
    members: [
      {
        id: "member-009",
        name: "Prof. Dr. Alex Martinez",
        role: "Chairperson",
        department: "Software Engineering",
        expertise: ["Software Architecture", "Web Development", "DevOps"]
      },
      {
        id: "member-010",
        name: "Dr. Jennifer Brown",
        role: "Senior Member",
        department: "Computer Science",
        expertise: ["Full-Stack Development", "Database Systems", "API Design"]
      },
      {
        id: "member-011",
        name: "Dr. Kevin Zhang",
        role: "Member",
        department: "Information Systems",
        expertise: ["System Integration", "Microservices", "Cloud Architecture"]
      },
      {
        id: "member-012",
        name: "Prof. Amanda Wilson",
        role: "Member",
        department: "Human-Computer Interaction",
        expertise: ["UI/UX Design", "User Research", "Accessibility"]
      }
    ],
    specialization: ["Software Engineering", "Web Development", "System Architecture", "User Experience"],
    status: "active",
    createdAt: "2024-01-20",
    maxProjects: 10,
    currentProjects: 5
  },
  {
    id: "council-004",
    name: "IoT & Embedded Systems Council",
    description: "Specialized council for Internet of Things and embedded systems projects",
    chairperson: "Prof. Dr. Thomas Anderson",
    members: [
      {
        id: "member-013",
        name: "Prof. Dr. Thomas Anderson",
        role: "Chairperson",
        department: "Electrical Engineering",
        expertise: ["Embedded Systems", "IoT Architecture", "Sensor Networks"]
      },
      {
        id: "member-014",
        name: "Dr. Rachel Green",
        role: "Senior Member",
        department: "Computer Engineering",
        expertise: ["Microcontrollers", "Real-time Systems", "Hardware Design"]
      },
      {
        id: "member-015",
        name: "Dr. Mark Davis",
        role: "Member",
        department: "Telecommunications",
        expertise: ["Wireless Communication", "Network Protocols", "Edge Computing"]
      }
    ],
    specialization: ["Internet of Things", "Embedded Systems", "Sensor Networks", "Edge Computing"],
    status: "active",
    createdAt: "2024-02-10",
    maxProjects: 5,
    currentProjects: 1
  },
  {
    id: "council-005",
    name: "Cybersecurity & Information Security Council",
    description: "Council dedicated to cybersecurity, information security, and privacy projects",
    chairperson: "Prof. Dr. Sandra Miller",
    members: [
      {
        id: "member-016",
        name: "Prof. Dr. Sandra Miller",
        role: "Chairperson",
        department: "Cybersecurity",
        expertise: ["Network Security", "Cryptography", "Security Architecture"]
      },
      {
        id: "member-017",
        name: "Dr. Christopher Taylor",
        role: "Senior Member",
        department: "Information Security",
        expertise: ["Penetration Testing", "Incident Response", "Security Auditing"]
      },
      {
        id: "member-018",
        name: "Dr. Nicole White",
        role: "Member",
        department: "Computer Science",
        expertise: ["Privacy Engineering", "Blockchain Security", "Secure Coding"]
      }
    ],
    specialization: ["Cybersecurity", "Information Security", "Privacy", "Cryptography"],
    status: "active",
    createdAt: "2024-01-25",
    maxProjects: 7,
    currentProjects: 4
  },
  {
    id: "council-006",
    name: "Mobile & Game Development Council",
    description: "Council for mobile applications and game development projects",
    chairperson: "Prof. Dr. Ryan Clark",
    members: [
      {
        id: "member-019",
        name: "Prof. Dr. Ryan Clark",
        role: "Chairperson",
        department: "Game Development",
        expertise: ["Game Design", "Mobile Development", "Unity/Unreal Engine"]
      },
      {
        id: "member-020",
        name: "Dr. Jessica Adams",
        role: "Senior Member",
        department: "Mobile Computing",
        expertise: ["iOS Development", "Android Development", "Cross-platform Development"]
      },
      {
        id: "member-021",
        name: "Dr. Brian Johnson",
        role: "Member",
        department: "Computer Graphics",
        expertise: ["3D Graphics", "Animation", "Virtual Reality"]
      }
    ],
    specialization: ["Mobile Development", "Game Development", "Computer Graphics", "Virtual Reality"],
    status: "active",
    createdAt: "2024-02-05",
    maxProjects: 6,
    currentProjects: 2
  }
];
