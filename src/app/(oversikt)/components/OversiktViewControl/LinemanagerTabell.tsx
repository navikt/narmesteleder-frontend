import { LinkBrokenIcon, PencilIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, HStack, Table, VStack } from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktSpinner } from "../OversiktSpinner";

interface LinemanagerTabellProps {
  linemanagers: LinemanagerSearchItem[];
  loading?: boolean;
  revokingKey?: string | null;
  showEditAction?: boolean;
  onRevoke: (item: LinemanagerSearchItem) => void;
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

function getRowKey(item: LinemanagerSearchItem): string {
  return `${item.orgNumber}-${item.employee.nationalIdentificationNumber}-${item.manager.nationalIdentificationNumber}`;
}

function getEditUrl(item: LinemanagerSearchItem): string {
  const params = new URLSearchParams({
    orgnr: item.orgNumber,
    employeeIdentificationNumber: item.employee.nationalIdentificationNumber,
    lastName: item.employee.name?.lastName ?? "",
    returnTo: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oversikt?orgnr=${item.orgNumber}&tab=aktiv-sykmelding`,
  });

  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}?${params}`;
}

export function LinemanagerTabell({
  linemanagers,
  loading,
  revokingKey,
  showEditAction = false,
  onRevoke,
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
          <Table.Row key={getRowKey(item)}>
            <Table.HeaderCell scope="row" style={{ whiteSpace: "nowrap" }}>
              {formatNavn(item.employee.name)}
            </Table.HeaderCell>
            <Table.DataCell style={{ whiteSpace: "nowrap" }}>
              {formatFnr(item.employee.nationalIdentificationNumber)}
            </Table.DataCell>
            <Table.DataCell style={{ whiteSpace: "nowrap" }}>
              {formatNavn(item.manager.name)}
            </Table.DataCell>
            <Table.DataCell>{formatActiveFrom(item.activeFrom)}</Table.DataCell>
            <Table.DataCell>{item.manager.email}</Table.DataCell>
            <Table.DataCell>{item.manager.mobile}</Table.DataCell>
            <Table.DataCell style={{ whiteSpace: "nowrap" }}>
              <HStack gap="space-8">
                {showEditAction && (
                  <Button
                    as="a"
                    href={getEditUrl(item)}
                    variant="tertiary"
                    size="small"
                    icon={<PencilIcon aria-hidden />}
                    disabled={!item.employee.name?.lastName}
                    aria-label={`Endre eller bytt leder for ${formatNavn(item.employee.name)}`}
                    title={
                      item.employee.name?.lastName
                        ? undefined
                        : "Kan ikke endre leder fordi etternavn mangler for ansatt"
                    }
                  />
                )}
                <Button
                  variant="tertiary-neutral"
                  data-color="danger"
                  size="small"
                  icon={<LinkBrokenIcon aria-hidden />}
                  loading={revokingKey === getRowKey(item)}
                  disabled={!item.employee.name?.lastName}
                  onClick={() => onRevoke(item)}
                  aria-label={`Bryt kobling til leder for ${formatNavn(item.employee.name)}`}
                  title={
                    item.employee.name?.lastName
                      ? undefined
                      : "Kan ikke bryte kobling fordi etternavn mangler for ansatt"
                  }
                />
              </HStack>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
