import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

test("renders Header component", () => {
  render(<Header />);
  expect(screen.getByText(/favorites/i)).toBeInTheDocument();
});
