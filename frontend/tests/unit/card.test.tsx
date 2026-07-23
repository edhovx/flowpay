import { render } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

describe("Card", () => {
  it("renders card with content", () => {
    const { getByText } = render(
      <Card>
        <CardContent>Card body</CardContent>
      </Card>
    );
    expect(getByText("Card body")).toBeInTheDocument();
  });

  it("renders card with header and title", () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(getByText("My Title")).toBeInTheDocument();
  });

  it("renders card with footer", () => {
    const { getByText } = render(
      <Card>
        <CardFooter>Footer text</CardFooter>
      </Card>
    );
    expect(getByText("Footer text")).toBeInTheDocument();
  });
});
