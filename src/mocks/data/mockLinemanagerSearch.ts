import type { LinemanagerSearchResponse } from "@/schemas/lineManagerSearchSchema";

export const mockLinemanagerIds = {
  activeKari: "11111111-1111-4111-8111-111111111111",
  activeIngrid: "22222222-2222-4222-8222-222222222222",
  inactiveLars: "33333333-3333-4333-8333-333333333333",
};

export const mockLinemanagerSearchActive: LinemanagerSearchResponse = {
  linemanagers: [
    {
      linemanagerId: mockLinemanagerIds.activeKari,
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
      linemanagerId: mockLinemanagerIds.activeIngrid,
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
      linemanagerId: mockLinemanagerIds.inactiveLars,
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
