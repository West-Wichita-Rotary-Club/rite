import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { Alumni } from "./Alumni.jsx";
import { api } from "../api.js";

vi.mock("../api.js", () => ({
  api: {
    getAlumni: vi.fn()
  }
}));

const sampleAlumni = {
  countries: {
    usa: { label: { en: "United States", es: "Estados Unidos" } },
    panama: { label: { en: "Panama", es: "Panama" } }
  },
  functions: {
    leader: { label: { en: "Leaders", es: "Lideres" } },
    teacher: { label: { en: "Teachers", es: "Docentes" } }
  },
  profiles: [
    {
      id: "armida-hight",
      name: "Armida Hight",
      country: "usa",
      place: { en: "Wichita", es: "Wichita" },
      summary: { en: "Co-founder", es: "Cofundadora" },
      participation: [{ role: "leader", years: [1996] }]
    },
    {
      id: "a-panama-teacher",
      name: "Maria Camarena",
      country: "panama",
      place: { en: "Panama City", es: "Ciudad de Panama" },
      summary: { en: "Exchange teacher", es: "Docente de intercambio" },
      participation: [{ role: "teacher", years: [2010] }]
    }
  ]
};

describe("Alumni directory", () => {
  it("renders every profile and filters by country", async () => {
    api.getAlumni.mockResolvedValue(sampleAlumni);

    render(
      <LanguageProvider>
        <MemoryRouter>
          <Alumni />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => expect(screen.getByText("Armida Hight")).toBeInTheDocument());
    expect(screen.getByText("Maria Camarena")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Panama"));

    expect(screen.queryByText("Armida Hight")).not.toBeInTheDocument();
    expect(screen.getByText("Maria Camarena")).toBeInTheDocument();
  });

  it("shows the empty-results note when filters match nobody", async () => {
    api.getAlumni.mockResolvedValue(sampleAlumni);

    render(
      <LanguageProvider>
        <MemoryRouter>
          <Alumni />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => expect(screen.getByText("Armida Hight")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Teachers"));
    fireEvent.click(screen.getByText("United States"));

    expect(screen.getByText(/No profiles match/i)).toBeInTheDocument();
  });
});
