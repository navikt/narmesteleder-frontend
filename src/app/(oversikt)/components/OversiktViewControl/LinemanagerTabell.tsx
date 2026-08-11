import { BodyShort, Table, VStack } from "@navikt/ds-react";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktSpinner } from "../OversiktSpinner";

interface LinemanagerTabellProps {
  linemanagers: LinemanagerSearchItem[];
  loading?: boolean;
}

function formatNavn(name: LinemanagerSearchItem["employee"]["name"]): string {
  if (!name) return "—";
  return joinNonEmpty([name.firstName, name.middleName, name.lastName]);
}

function formatActiveFrom(dateTime: string): string {
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("nb-NO");
}

export function LinemanagerTabell({
  linemanagers,
  loading,
}: LinemanagerTabellProps) {
  if (loading) {
    return (
      <OversiktSpinner data-testid={UiSelector.LinemanagerLasterSpinner} />
    );
  }

  if (linemanagers.length === 0) {
    return (
      <VStack
        align="center"
        gap="space-12"
        paddingBlock="space-40"
        data-testid={UiSelector.LinemanagerTomState}
      >
        <BodyShort>Ingen ansatte å vise her.</BodyShort>
      </VStack>
    );
  }

  return (
    <Table zebraStripes data-testid={UiSelector.LinemanagerTabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">F.nr på ansatt</Table.HeaderCell>
          <Table.HeaderCell scope="col">Navn på leder</Table.HeaderCell>
          <Table.HeaderCell scope="col">
            Når leder ble meldt inn
          </Table.HeaderCell>
          <Table.HeaderCell scope="col">E-post leder</Table.HeaderCell>
          <Table.HeaderCell scope="col">Telefonnummer leder</Table.HeaderCell>
          <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {linemanagers.map((item) => (
          <Table.Row
            key={`${item.orgNumber}-${item.employee.nationalIdentificationNumber}-${item.manager.nationalIdentificationNumber}`}
          >
            <Table.HeaderCell scope="row">
              {formatNavn(item.employee.name)}
            </Table.HeaderCell>
            <Table.DataCell>
              {formatFnr(item.employee.nationalIdentificationNumber)}
            </Table.DataCell>
            <Table.DataCell>{formatNavn(item.manager.name)}</Table.DataCell>
            <Table.DataCell>{formatActiveFrom(item.activeFrom)}</Table.DataCell>
            <Table.DataCell>{item.manager.email}</Table.DataCell>
            <Table.DataCell>{item.manager.mobile}</Table.DataCell>
            <Table.DataCell>—</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
