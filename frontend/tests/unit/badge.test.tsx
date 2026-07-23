import { render } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with children text", () => {
    const { getByText } = render(<Badge>Active</Badge>);
    expect(getByText("Active")).toBeInTheDocument();
  });

  it("applies default variant class", () => {
    const { getByText } = render(<Badge>Default</Badge>);
    expect(getByText("Default").className).toContain("inline-flex");
  });

  it("applies success variant class", () => {
    const { getByText } = render(<Badge variant="success">Success</Badge>);
    const el = getByText("Success");
    expect(el.className).toContain("success");
  });
});
