import {
  FormMetadata,
  FormStatus,
  MOCK_FORMS,
  FORM_TYPES,
  FormType,
} from "./constants";
import { UserRole } from "@/contexts/AuthContext";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions for form management
export class FormAPI {
  private static forms: FormMetadata[] = [...MOCK_FORMS];

  // Get all forms for a user based on their role
  static async getForms(userRole: UserRole): Promise<FormMetadata[]> {
    await delay(500);

    return this.forms.filter((form) => {
      const formType = FORM_TYPES[form.formType];
      return (
        formType.roles.includes(userRole) &&
        formType.workflow.canView(form.status, userRole)
      );
    });
  }

  // Get forms with filtering and sorting
  static async getFormsFiltered(
    userRole: UserRole,
    filters?: {
      formType?: string;
      status?: FormStatus;
      dateFrom?: string;
      dateTo?: string;
      projectId?: string;
    },
    sortBy?: "lastUpdated" | "submissionDate" | "formType" | "status",
    sortOrder?: "asc" | "desc"
  ): Promise<FormMetadata[]> {
    await delay(500);

    let filteredForms = await this.getForms(userRole);

    // Apply filters
    if (filters) {
      if (filters.formType) {
        filteredForms = filteredForms.filter(
          (form) => form.formType === filters.formType
        );
      }
      if (filters.status) {
        filteredForms = filteredForms.filter(
          (form) => form.status === filters.status
        );
      }
      if (filters.dateFrom) {
        filteredForms = filteredForms.filter(
          (form) => form.lastUpdated >= filters.dateFrom!
        );
      }
      if (filters.dateTo) {
        filteredForms = filteredForms.filter(
          (form) => form.lastUpdated <= filters.dateTo!
        );
      }
      if (filters.projectId) {
        filteredForms = filteredForms.filter(
          (form) => form.projectId === filters.projectId
        );
      }
    }

    // Apply sorting
    if (sortBy) {
      filteredForms.sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        switch (sortBy) {
          case "lastUpdated":
            aValue = a.lastUpdated;
            bValue = b.lastUpdated;
            break;
          case "submissionDate":
            aValue = a.submissionDate;
            bValue = b.submissionDate;
            break;
          case "formType":
            aValue = a.formType;
            bValue = b.formType;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
        }

        if (!aValue && !bValue) return 0;
        if (!aValue) return 1;
        if (!bValue) return -1;

        const comparison = aValue.localeCompare(bValue);
        return sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return filteredForms;
  }

  // Get a single form by ID
  static async getForm(
    id: string,
    userRole: UserRole
  ): Promise<FormMetadata | null> {
    await delay(300);

    const form = this.forms.find((f) => f.id === id);
    if (!form) return null;

    const formType = FORM_TYPES[form.formType];
    if (!formType.workflow.canView(form.status, userRole)) {
      throw new Error("Unauthorized to view this form");
    }

    return form;
  }

  // Create a new form
  static async createForm(
    formType: string,
    userRole: UserRole,
    userName: string,
    initialData?: Partial<FormMetadata>
  ): Promise<FormMetadata> {
    await delay(800);

    const formTypeConfig = FORM_TYPES[formType];
    if (!formTypeConfig.roles.includes(userRole)) {
      throw new Error("Unauthorized to create this form type");
    }

    const newForm: FormMetadata = {
      id: `form-${Date.now()}`,
      formType: formType as FormType,
      title: `${formTypeConfig.title} ${formType}`,
      status: FormStatus.DRAFT,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: userRole,
      lastUpdatedByName: userName,
      createdBy: userRole,
      createdByName: userName,
      content: "",
      editHistory: [
        {
          id: `edit-${Date.now()}`,
          timestamp: new Date().toISOString().split("T")[0],
          updatedBy: userRole,
          updatedByName: userName,
          action: "created",
        },
      ],
      ...initialData,
    };

    this.forms.push(newForm);
    return newForm;
  }

  // Update a form
  static async updateForm(
    id: string,
    userRole: UserRole,
    userName: string,
    updates: Partial<FormMetadata>
  ): Promise<FormMetadata> {
    await delay(600);

    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Form not found");
    }

    const form = this.forms[formIndex];
    const formType = FORM_TYPES[form.formType];

    if (!formType.workflow.canEdit(form.status, userRole, form.lastUpdatedBy)) {
      throw new Error("Unauthorized to edit this form");
    }

    // Update form
    const updatedForm: FormMetadata = {
      ...form,
      ...updates,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: userRole,
      lastUpdatedByName: userName,
      editHistory: [
        ...(form.editHistory || []),
        {
          id: `edit-${Date.now()}`,
          timestamp: new Date().toISOString().split("T")[0],
          updatedBy: userRole,
          updatedByName: userName,
          action: "updated",
        },
      ],
    };

    this.forms[formIndex] = updatedForm;
    return updatedForm;
  }

  // Submit a form (change status)
  static async submitForm(
    id: string,
    userRole: UserRole,
    userName: string
  ): Promise<FormMetadata> {
    await delay(800);

    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Form not found");
    }

    const form = this.forms[formIndex];
    const formType = FORM_TYPES[form.formType];

    const nextStatus = formType.workflow.nextStatus(form.status, userRole);

    const updatedForm: FormMetadata = {
      ...form,
      status: nextStatus,
      submissionDate:
        nextStatus === FormStatus.SUBMITTED
          ? new Date().toISOString().split("T")[0]
          : form.submissionDate,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: userRole,
      lastUpdatedByName: userName,
      editHistory: [
        ...(form.editHistory || []),
        {
          id: `edit-${Date.now()}`,
          timestamp: new Date().toISOString().split("T")[0],
          updatedBy: userRole,
          updatedByName: userName,
          action: nextStatus === FormStatus.SUBMITTED ? "submitted" : "updated",
        },
      ],
    };

    this.forms[formIndex] = updatedForm;
    return updatedForm;
  }

  // Finalize a form (only for BM5 workflow)
  static async finalizeForm(
    id: string,
    userRole: UserRole,
    userName: string
  ): Promise<FormMetadata> {
    await delay(600);

    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Form not found");
    }

    const form = this.forms[formIndex];

    if (form.formType !== "BM5" || userRole !== UserRole.STAFF) {
      throw new Error("Only staff can finalize BM5 forms");
    }

    const updatedForm: FormMetadata = {
      ...form,
      status: FormStatus.FINALIZED,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: userRole,
      lastUpdatedByName: userName,
      editHistory: [
        ...(form.editHistory || []),
        {
          id: `edit-${Date.now()}`,
          timestamp: new Date().toISOString().split("T")[0],
          updatedBy: userRole,
          updatedByName: userName,
          action: "finalized",
        },
      ],
    };

    this.forms[formIndex] = updatedForm;
    return updatedForm;
  }

  // Delete a form (only drafts)
  static async deleteForm(id: string, userRole: UserRole): Promise<void> {
    await delay(400);

    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Form not found");
    }

    const form = this.forms[formIndex];

    if (form.status !== FormStatus.DRAFT) {
      throw new Error("Only draft forms can be deleted");
    }

    if (form.createdBy !== userRole) {
      throw new Error("Only the creator can delete this form");
    }

    this.forms.splice(formIndex, 1);
  }

  // Get forms grouped by month/year for timeline view
  static async getFormsGroupedByDate(
    userRole: UserRole
  ): Promise<Record<string, FormMetadata[]>> {
    const forms = await this.getForms(userRole);

    return forms.reduce((groups, form) => {
      const date = new Date(form.lastUpdated);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(form);

      return groups;
    }, {} as Record<string, FormMetadata[]>);
  }

  // Get forms grouped by type
  static async getFormsGroupedByType(
    userRole: UserRole
  ): Promise<Record<string, FormMetadata[]>> {
    const forms = await this.getForms(userRole);

    return forms.reduce((groups, form) => {
      if (!groups[form.formType]) {
        groups[form.formType] = [];
      }
      groups[form.formType].push(form);

      return groups;
    }, {} as Record<string, FormMetadata[]>);
  }
}
