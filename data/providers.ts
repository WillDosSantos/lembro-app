import { Provider } from "@/types/aftercare";

export const PROVIDERS: Provider[] = [
  {
    id: "prov_ambrose_flowers",
    name: "Ambrose Floral Co.",
    logoUrl: "/images/providers/ambrose-floral.png",
    website: "https://ambrosefloral.example",
    email: "hello@ambrosefloral.example",
    categories: ["floral"],
    serviceAreas: ["Boise, ID", "Meridian, ID", "Eagle, ID"],
    tier: "featured",
    isActive: true,
    blurb: "Compassionate, on-time floral designs for services and celebrations of life.",
  },
  {
    id: "prov_kind_mortuary",
    name: "Kind Path Mortuary",
    website: "https://kindpath.example",
    phone: "208-555-4021",
    categories: ["mortuary"],
    serviceAreas: ["state:ID"],
    tier: "premium",
    isActive: true,
    blurb: "24/7 arrangements with transparent pricing and coordination support.",
  },
  {
    id: "prov_program_prints",
    name: "Program Prints",
    website: "https://programprints.example",
    categories: ["printing", "celebration_design"],
    serviceAreas: ["nationwide"],
    tier: "free",
    isActive: true,
    blurb: "Fast memorial programs, photo boards, guest books.",
  },
];
