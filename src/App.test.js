import { render, screen, cleanup } from "@testing-library/react";
import App from "./App";
beforeEach(() => {
  window.matchMedia = jest
    .fn()
    .mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  window.scrollTo = jest.fn();
  global.fetch = jest
    .fn()
    .mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => ({ posts: [] }),
    });
});
afterEach(cleanup);
test("the home page exposes studio navigation and game discovery", async () => {
  window.location.hash = "#/";
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /Small team.*Big imagination.*Games for all/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Explore our games/i }),
  ).toHaveAttribute("href", "#/games");
  expect(
    await screen.findByText("Our next chapter is on its way."),
  ).toBeInTheDocument();
});
test("the games route includes every project from the brief", () => {
  window.location.hash = "#/games";
  render(<App />);
  for (const name of [
    "TimeSplit",
    "Truth Dealer",
    "GTC Sandbox VR",
    "Puff’s Adventure",
  ])
    expect(screen.getByRole("heading", { name })).toBeInTheDocument();
});
