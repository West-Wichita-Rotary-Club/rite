import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { SchoolProfile } from "./SchoolProfile.jsx";
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
    },
    {
      type: "club",
      band: "gold",
      name: "Rotary Club of West Wichita",
      place: "Wichita, Kansas",
      since: "1996",
      hosted: "30+",
      desc: { en: "Founding club.", es: "Club fundador." }
    }
  ]
};

function renderAt(slug) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/schools/${slug}`]}>
        <Routes>
          <Route path="/schools/:slug" element={<SchoolProfile />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );
}

describe("SchoolProfile", () => {
  it("renders the matching entity's profile fields", async () => {
    api.getSchools.mockResolvedValue(sampleSchools);

    renderAt("school-pleasant-valley-middle-school");

    await waitFor(() => expect(screen.getByText("Pleasant Valley Middle School")).toBeInTheDocument());
    expect(screen.getByText("Wichita, Kansas")).toBeInTheDocument();
    expect(screen.getByText("Host school for ESL co-teaching.")).toBeInTheDocument();
    expect(screen.getByText("2004")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("shows the not-found note for an unknown slug", async () => {
    api.getSchools.mockResolvedValue(sampleSchools);

    renderAt("club-does-not-exist");

    await waitFor(() => expect(screen.getByText("Not found.")).toBeInTheDocument());
  });
});
