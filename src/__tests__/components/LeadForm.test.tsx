import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LeadForm from "@/components/LeadForm";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// Mock fetch for form config (LeadForm fetches /api/form-config on mount)
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      properties: {
        country: {
          enum: ["United States", "Canada", "Mexico"],
        },
      },
    }),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("LeadForm", () => {
  it("renders all form sections", () => {
    renderWithProviders(<LeadForm />);

    expect(
      screen.getByText("Want to understand your visa options?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Visa categories of interest?")
    ).toBeInTheDocument();
    expect(screen.getByText("How can we help you?")).toBeInTheDocument();
  });

  it("renders all required input fields", () => {
    renderWithProviders(<LeadForm />);

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("LinkedIn / Personal Website URL")
    ).toBeInTheDocument();
  });

  it("renders visa category checkboxes", () => {
    renderWithProviders(<LeadForm />);

    expect(screen.getByText("O-1")).toBeInTheDocument();
    expect(screen.getByText("EB-1A")).toBeInTheDocument();
    expect(screen.getByText("EB-2 NIW")).toBeInTheDocument();
    expect(screen.getByText("I don't know")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders(<LeadForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders the resume upload area", () => {
    renderWithProviders(<LeadForm />);

    expect(
      screen.getByText("Upload your resume / CV")
    ).toBeInTheDocument();
    expect(
      screen.getByText("PDF, DOC, or DOCX files only")
    ).toBeInTheDocument();
  });

  it("renders the help message textarea with placeholder", () => {
    renderWithProviders(<LeadForm />);

    const textarea = screen.getByPlaceholderText(
      /What is your current status/i
    );
    expect(textarea).toBeInTheDocument();
  });

  it("renders the country selector", () => {
    renderWithProviders(<LeadForm />);

    // Ant Design Select renders with role combobox
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });
});
