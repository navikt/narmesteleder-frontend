import { describe, expect, it } from "vitest";
import { linemanagerSearchResponseSchema } from "./lineManagerSearchSchema";

describe("linemanagerSearchResponseSchema", () => {
  it("maps the backend relation ID to the UI relation identifier", () => {
    const result = linemanagerSearchResponseSchema.parse({
      linemanagers: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          orgNumber: "963890095",
          activeFrom: "2023-01-15T00:00:00Z",
          employee: {
            nationalIdentificationNumber: "26895514420",
            name: {
              firstName: "Kari",
              middleName: null,
              lastName: "Nordmann",
            },
          },
          manager: {
            nationalIdentificationNumber: "19848938755",
            name: {
              firstName: "Ole",
              middleName: null,
              lastName: "Hansen",
            },
            email: "ole.hansen@shark.no",
            mobile: "91234567",
          },
        },
      ],
      meta: {
        size: 1,
        pageSize: 50,
        hasMore: false,
        nextPageToken: null,
      },
    });

    expect(result.linemanagers[0]?.linemanagerId).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
  });
});
