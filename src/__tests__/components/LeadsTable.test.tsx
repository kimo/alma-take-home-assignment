import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "antd";
import { makeStore } from "@/lib/redux/store";
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

function renderWithProviders(ui: React.ReactElement) {
  const store = makeStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App>{ui}</App>
      </QueryClientProvider>
    </Provider>
  );
}

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
    renderWithProviders(<LeadsTable />);
    expect(screen.getByText("Leads")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    renderWithProviders(<LeadsTable />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders the status filter dropdown", () => {
    renderWithProviders(<LeadsTable />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("fetches leads on mount", () => {
    renderWithProviders(<LeadsTable />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/leads?")
    );
  });

  it("renders lead names after fetch", async () => {
    renderWithProviders(<LeadsTable />);

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
    renderWithProviders(<LeadsTable />);

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
    renderWithProviders(<LeadsTable />);

    await waitFor(() => {
      // Button appears in both mobile and desktop views
      const buttons = screen.getAllByText("Mark as Reached Out");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders country for each lead", async () => {
    renderWithProviders(<LeadsTable />);

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
    renderWithProviders(<LeadsTable />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=13")
    );
  });
});
