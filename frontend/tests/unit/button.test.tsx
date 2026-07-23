import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with children text", () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument();
  });

  it("renders as disabled when isLoading is true", () => {
    const { getByRole } = render(<Button isLoading>Loading</Button>);
    expect(getByRole("button")).toBeDisabled();
  });

  it("renders as disabled when disabled prop is set", () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    expect(getByRole("button")).toBeDisabled();
  });

  it("applies destructive variant class", () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    expect(getByRole("button").className).toContain("destructive");
  });

  it("applies large size class", () => {
    const { getByRole } = render(<Button size="lg">Large</Button>);
    expect(getByRole("button").className).toContain("h-11");
  });
});
