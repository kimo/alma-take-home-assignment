import { render, screen, waitFor } from "@testing-library/react";
import LeadsTable from "@/components/LeadsTable";

// Mock fetch globally
const mockLeadsResponse = {
  leads: [
    {
      id: "1",
      firstName: "Jorge",
      lastName: "Ruiz",
      email: "jorge@example.com",
      country: "Mexico",
      linkedIn: "https://linkedin.com/in/jorge",
      visaInterests: ["O-1"],
      resumePath: "/uploads/resume.pdf",
      resumeFileName: "resume.pdf",
      helpMessage: "Help me",
      status: "PENDING",
      submittedAt: "2024-02-02T14:45:00.000Z",
    },
    {
      id: "2",
      firstName: "Anand",
      lastName: "Jain",
      email: "anand@example.com",
      country: "India",
      linkedIn: "https://linkedin.com/in/anand",
      visaInterests: ["EB-1A"],
      resumePath: null,
      resumeFileName: null,
      helpMessage: "Need guidance",
      status: "REACHED_OUT",
      submittedAt: "2024-02-01T10:00:00.000Z",
    },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockLeadsResponse,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("LeadsTable", () => {
  it("renders the page title", () => {
    render(<LeadsTable />);
    expect(screen.getByText("Leads")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<LeadsTable />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders the status filter dropdown", () => {
    render(<LeadsTable />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("fetches leads on mount", () => {
    render(<LeadsTable />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/leads?")
    );
  });

  it("renders lead names after fetch", async () => {
    render(<LeadsTable />);

    // Both mobile card view and desktop table render, so names appear twice
    await waitFor(() => {
      const jorgeElements = screen.getAllByText("Jorge Ruiz");
      expect(jorgeElements.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      const anandElements = screen.getAllByText("Anand Jain");
      expect(anandElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders status badges with correct text", async () => {
    render(<LeadsTable />);

    await waitFor(() => {
      const pendingBadges = screen.getAllByText("Pending");
      expect(pendingBadges.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      // "Reached Out" appears as status badge and action indicator
      const reachedOutElements = screen.getAllByText("Reached Out");
      expect(reachedOutElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders action button for PENDING leads", async () => {
    render(<LeadsTable />);

    await waitFor(() => {
      // Button appears in both mobile and desktop views
      const buttons = screen.getAllByText("Mark as Reached Out");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders country for each lead", async () => {
    render(<LeadsTable />);

    // Country appears in both mobile card view and desktop table
    await waitFor(() => {
      const mexicoElements = screen.getAllByText("Mexico");
      expect(mexicoElements.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      const indiaElements = screen.getAllByText("India");
      expect(indiaElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("includes pagination params in fetch", () => {
    render(<LeadsTable />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=13")
    );
  });
});
