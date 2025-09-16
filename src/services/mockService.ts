import type {
  DashboardData,
  DiagnosticQuestion,
  Lead,
  PartnerProfile,
} from "../types";

// Mock data storage
let mockQuestions: DiagnosticQuestion[] = [
  {
    id: "1",
    question: "How would you rate your overall health?",
    category: "General Health",
    logic: "Scale",
    options: ["1", "2", "3", "4", "5"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Do you have any chronic conditions?",
    category: "General Health",
    logic: "Multiple Choice",
    options: ["Diabetes", "Hypertension", "Heart Disease", "None"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockPartners: PartnerProfile[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0123",
    address: "123 Medical Center Dr, City, State 12345",
    bio: "Board-certified cardiologist with 15 years of experience.",
    status: "active",
    experience: 15,
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    email: "michael.chen@example.com",
    phone: "+1-555-0124",
    address: "456 Brain Institute Ave, City, State 12345",
    bio: "Specialist in neurological disorders and brain health.",
    status: "active",
    experience: 12,
    rating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    contact: "john.doe@email.com",
    source: "Website",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    contact: "+1-555-9876",
    source: "Referral",
    status: "contacted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bob Wilson",
    contact: "bob.wilson@email.com",
    source: "Social Media",
    status: "converted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockService = {
  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    return {
      totalLeads: mockLeads.length,
      activePartners: mockPartners.filter((p) => p.status === "active").length,
      totalQuestions: mockQuestions.length,
      conversionRate: Math.round(
        (mockLeads.filter((l) => l.status === "converted").length /
          mockLeads.length) *
          100
      ),
      chartData: [10, 20, 15, 25, 30, 35, 28, 40, 45, 50],
    };
  },

  // Questions
  async getDiagnosticQuestions(): Promise<DiagnosticQuestion[]> {
    return [...mockQuestions];
  },

  async createDiagnosticQuestion(
    data: Partial<DiagnosticQuestion>
  ): Promise<DiagnosticQuestion> {
    const newQuestion: DiagnosticQuestion = {
      id: generateId(),
      question: data.question || "",
      category: data.category || "",
      logic: data.logic || "",
      options: data.options || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockQuestions.push(newQuestion);
    return newQuestion;
  },

  async updateDiagnosticQuestion(
    id: string,
    data: Partial<DiagnosticQuestion>
  ): Promise<DiagnosticQuestion> {
    const index = mockQuestions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error("Question not found");

    mockQuestions[index] = {
      ...mockQuestions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockQuestions[index];
  },

  async deleteDiagnosticQuestion(id: string): Promise<void> {
    mockQuestions = mockQuestions.filter((q) => q.id !== id);
  },

  // Partners
  async getPartnerProfiles(): Promise<PartnerProfile[]> {
    return [...mockPartners];
  },

  async createPartnerProfile(
    data: Partial<PartnerProfile>
  ): Promise<PartnerProfile> {
    const newPartner: PartnerProfile = {
      id: generateId(),
      name: data.name || "",
      specialty: data.specialty || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      bio: data.bio || "",
      status: data.status || "active",
      experience: data.experience || 0,
      rating: data.rating || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPartners.push(newPartner);
    return newPartner;
  },

  async updatePartnerProfile(
    id: string,
    data: Partial<PartnerProfile>
  ): Promise<PartnerProfile> {
    const index = mockPartners.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Partner not found");

    mockPartners[index] = {
      ...mockPartners[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockPartners[index];
  },

  async deletePartnerProfile(id: string): Promise<void> {
    mockPartners = mockPartners.filter((p) => p.id !== id);
  },

  // Leads
  async getLeads(): Promise<Lead[]> {
    return [...mockLeads];
  },

  async updateLeadStatus(id: string, status: string): Promise<Lead> {
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Lead not found");

    mockLeads[index] = {
      ...mockLeads[index],
      status: status as Lead["status"],
      updatedAt: new Date().toISOString(),
    };
    return mockLeads[index];
  },
};
