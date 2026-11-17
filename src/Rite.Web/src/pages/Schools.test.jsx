import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { Schools } from "./Schools.jsx";
import { api } from "../api.js";

vi.mock("../api.js", () => ({
  api: {
    getSchools: vi.fn()
  }
}));

const sampleSchools = {
  schools: [
    {
      type: "school",
      band: "azure",
      name: "Pleasant Valley Middle School",
      place: "Wichita, Kansas",
      since: "2004",
      hosted: "11",
      desc: { en: "Host school for ESL co-teaching.", es: "Escuela anfitriona para ESL." }
    }
  ]
};

describe("Schools", () => {
  it("links each card to its profile page", async () => {
    api.getSchools.mockResolvedValue(sampleSchools);

    render(
      <LanguageProvider>
        <MemoryRouter>
          <Schools />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => expect(screen.getByText("Pleasant Valley Middle School")).toBeInTheDocument());

    const link = screen.getByText("View profile").closest("a");
    expect(link).toHaveAttribute("href", "/schools/school-pleasant-valley-middle-school");
  });
});
