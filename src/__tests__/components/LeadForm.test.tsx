import { render, screen } from "@testing-library/react";
import LeadForm from "@/components/LeadForm";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LeadForm", () => {
  it("renders all form sections", () => {
    render(<LeadForm />);

    expect(
      screen.getByText("Want to understand your visa options?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Visa categories of interest?")
    ).toBeInTheDocument();
    expect(screen.getByText("How can we help you?")).toBeInTheDocument();
  });

  it("renders all required input fields", () => {
    render(<LeadForm />);

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("LinkedIn / Personal Website URL")
    ).toBeInTheDocument();
  });

  it("renders visa category checkboxes", () => {
    render(<LeadForm />);

    expect(screen.getByText("O-1")).toBeInTheDocument();
    expect(screen.getByText("EB-1A")).toBeInTheDocument();
    expect(screen.getByText("EB-2 NIW")).toBeInTheDocument();
    expect(screen.getByText("I don't know")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LeadForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders the resume upload area", () => {
    render(<LeadForm />);

    expect(
      screen.getByText("Upload your resume / CV")
    ).toBeInTheDocument();
    expect(
      screen.getByText("PDF, DOC, or DOCX files only")
    ).toBeInTheDocument();
  });

  it("renders the help message textarea with placeholder", () => {
    render(<LeadForm />);

    const textarea = screen.getByPlaceholderText(
      /What is your current status/i
    );
    expect(textarea).toBeInTheDocument();
  });

  it("renders the country selector", () => {
    render(<LeadForm />);

    // Ant Design Select renders with role combobox
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });
});
