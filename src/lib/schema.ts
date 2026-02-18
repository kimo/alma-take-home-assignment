import { z } from "zod";

export const leadFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  country: z.string().min(1, "Country is required"),
  linkedIn: z
    .string()
    .min(1, "LinkedIn / Website URL is required")
    .url("Please enter a valid URL"),
  visaInterests: z
    .array(z.string())
    .min(1, "Please select at least one visa category"),
  helpMessage: z.string().min(1, "Please tell us how we can help"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const VISA_OPTIONS = ["O-1", "EB-1A", "EB-2 NIW", "I don't know"] as const;

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bangladesh", "Belarus", "Belgium", "Bolivia",
  "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia", "Cameroon",
  "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba",
  "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Libya", "Lithuania",
  "Malaysia", "Mexico", "Moldova", "Mongolia", "Morocco", "Myanmar",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway",
  "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia",
  "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
] as const;
