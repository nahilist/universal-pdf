import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";

describe("Utility Functions", () => {
  it("merges class names correctly using cn helper", () => {
    const result = cn("bg-red-500", "text-white", { "opacity-50": true, "hidden": false });
    expect(result).toContain("bg-red-500");
    expect(result).toContain("text-white");
    expect(result).toContain("opacity-50");
    expect(result).not.toContain("hidden");
  });

  it("exports valid design tokens", () => {
    expect(designTokens).toBeDefined();
    expect(designTokens.colors).toBeDefined();
  });
});
