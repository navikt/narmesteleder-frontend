import type { LinemanagerSearchResponse } from "@/schemas/lineManagerSearchSchema";

export const mockLinemanagerSearchActive: LinemanagerSearchResponse = {
  linemanagers: [
    {
      orgNumber: "963890095",
      activeFrom: "2023-01-15T00:00:00Z",
      employee: {
        nationalIdentificationNumber: "26895514420",
        name: { firstName: "Kari", middleName: null, lastName: "Nordmann" },
      },
      manager: {
        nationalIdentificationNumber: "19848938755",
        name: { firstName: "Ole", middleName: "Kristian", lastName: "Hansen" },
        email: "ole.hansen@shark.no",
        mobile: "91234567",
      },
    },
    {
      orgNumber: "963890095",
      activeFrom: "2022-06-01T00:00:00Z",
      employee: {
        nationalIdentificationNumber: "12857932464",
        name: { firstName: "Ingrid", middleName: null, lastName: "Berg" },
      },
      manager: {
        nationalIdentificationNumber: "19848938755",
        name: { firstName: "Ole", middleName: "Kristian", lastName: "Hansen" },
        email: "ole.hansen@shark.no",
        mobile: "91234567",
      },
    },
  ],
  meta: {
    size: 2,
    pageSize: 50,
    hasMore: false,
    nextPageToken: null,
  },
};

export const mockLinemanagerSearchInactive: LinemanagerSearchResponse = {
  linemanagers: [
    {
      orgNumber: "963890095",
      activeFrom: "2021-03-10T00:00:00Z",
      employee: {
        nationalIdentificationNumber: "07868718054",
        name: { firstName: "Lars", middleName: null, lastName: "Johansen" },
      },
      manager: {
        nationalIdentificationNumber: "26895514420",
        name: { firstName: "Kari", middleName: null, lastName: "Nordmann" },
        email: "kari.nordmann@shark.no",
        mobile: "98765432",
      },
    },
  ],
  meta: {
    size: 1,
    pageSize: 50,
    hasMore: false,
    nextPageToken: null,
  },
};
