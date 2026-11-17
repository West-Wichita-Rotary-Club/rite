import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { History } from "./History.jsx";
import { api } from "../api.js";

vi.mock("../api.js", () => ({
  api: {
    getTimeline: vi.fn()
  }
}));

function renderHistory() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <History />
      </MemoryRouter>
    </LanguageProvider>
  );
}

describe("History page", () => {
  it("renders milestones once the API resolves", async () => {
    api.getTimeline.mockResolvedValue({
      milestones: [
        {
          id: "t-1996",
          year: "1996",
          title: { en: "The founding", es: "La fundacion" },
          body: { en: "RITE began.", es: "RITE comenzo." }
        }
      ]
    });

    renderHistory();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("The founding")).toBeInTheDocument());
    expect(screen.getByText("1996")).toBeInTheDocument();
  });

  it("shows an error note when the API call fails", async () => {
    api.getTimeline.mockRejectedValue(new Error("network down"));

    renderHistory();

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent("network down");
  });
});
