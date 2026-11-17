import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, localize, useLanguage } from "./i18n.jsx";

describe("localize", () => {
  it("picks the requested language", () => {
    expect(localize({ en: "Hello", es: "Hola" }, "es")).toBe("Hola");
  });

  it("falls back to english when the language is missing", () => {
    expect(localize({ en: "Hello" }, "es")).toBe("Hello");
  });

  it("passes through non-localized values", () => {
    expect(localize("1996", "es")).toBe("1996");
  });
});

function Probe() {
  const { t, lang, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="nav-home">{t("nav.home")}</span>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang("es")}>switch</button>
    </div>
  );
}

describe("LanguageProvider", () => {
  it("defaults to English and switches to Spanish", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    expect(screen.getByTestId("nav-home")).toHaveTextContent("Home");
    expect(screen.getByTestId("lang")).toHaveTextContent("en");

    fireEvent.click(screen.getByText("switch"));

    expect(screen.getByTestId("nav-home")).toHaveTextContent("Inicio");
    expect(screen.getByTestId("lang")).toHaveTextContent("es");
  });
});
