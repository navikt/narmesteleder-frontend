import {
  EnvelopeClosedIcon,
  LinkBrokenIcon,
  MenuElipsisVerticalIcon,
  PersonPencilIcon,
  PhoneIcon,
} from "@navikt/aksel-icons";
import {
  ActionMenu,
  BodyShort,
  Button,
  Hide,
  HStack,
  Show,
  Table,
  VStack,
} from "@navikt/ds-react";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktSpinner } from "../OversiktSpinner";

interface LinemanagerTabellProps {
  linemanagers: LinemanagerSearchItem[];
  orgNumber: string;
  hasActiveSickLeave: boolean;
  loading?: boolean;
  revokingKey?: string | null;
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
  return item.linemanagerId;
}

export function getEditLinemanagerHref(
  linemanagerId: string,
  orgNumber: string,
): string {
  const params = new URLSearchParams({
    returnTo: `/oversikt?orgnr=${orgNumber}&tab=aktiv-sykmelding`,
  });
  return `/endre/${linemanagerId}?${params}`;
}

export function canChangeLinemanager(hasActiveSickLeave: boolean): boolean {
  return hasActiveSickLeave;
}

function PersonSummary({
  name,
  nationalIdentificationNumber,
  showNationalIdentificationNumber = true,
}: {
  name: LinemanagerSearchItem["employee"]["name"];
  nationalIdentificationNumber: string;
  showNationalIdentificationNumber?: boolean;
}) {
  return (
    <VStack gap="space-4">
      <BodyShort>{formatNavn(name)}</BodyShort>
      {showNationalIdentificationNumber && (
        <BodyShort size="small">
          {formatFnr(nationalIdentificationNumber)}
        </BodyShort>
      )}
    </VStack>
  );
}

function LinemanagerActionMenu({
  item,
  orgNumber,
  hasActiveSickLeave,
  revokingKey,
  onRevoke,
}: {
  item: LinemanagerSearchItem;
  orgNumber: string;
  hasActiveSickLeave: boolean;
  revokingKey?: string | null;
  onRevoke: (item: LinemanagerSearchItem) => void;
}) {
  const employeeName = formatNavn(item.employee.name);
  const actionLabel = `Handlinger for ${employeeName}`;

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          aria-label={actionLabel}
          title={actionLabel}
          data-color="neutral"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
          size="small"
          variant="tertiary"
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content align="end">
        {canChangeLinemanager(hasActiveSickLeave) && (
          <ActionMenu.Item
            as="a"
            href={getEditLinemanagerHref(item.linemanagerId, orgNumber)}
            icon={<PersonPencilIcon aria-hidden />}
          >
            Endre nærmeste leder
          </ActionMenu.Item>
        )}
        <ActionMenu.Item
          variant="danger"
          icon={<LinkBrokenIcon aria-hidden />}
          disabled={!item.employee.name?.lastName}
          onSelect={() => onRevoke(item)}
          aria-description={
            item.employee.name?.lastName
              ? undefined
              : "Kan ikke fjerne nærmeste leder fordi etternavn mangler for ansatt"
          }
        >
          {revokingKey === getRowKey(item)
            ? "Fjerner nærmeste leder"
            : "Fjern nærmeste leder"}
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  );
}

function MobileDetails({ item }: { item: LinemanagerSearchItem }) {
  return (
    <VStack gap="space-12" paddingBlock="space-8">
      <VStack gap="space-4">
        <BodyShort weight="semibold">Fødselsnummer for ansatt</BodyShort>
        <BodyShort>
          {formatFnr(item.employee.nationalIdentificationNumber)}
        </BodyShort>
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">
          Fødselsnummer for nærmeste leder
        </BodyShort>
        <BodyShort>
          {formatFnr(item.manager.nationalIdentificationNumber)}
        </BodyShort>
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">Kontaktinformasjon</BodyShort>
        <HStack gap="space-16" wrap>
          <HStack gap="space-4" align="center">
            <EnvelopeClosedIcon aria-hidden />
            <BodyShort>{item.manager.email}</BodyShort>
          </HStack>
          <HStack gap="space-4" align="center">
            <PhoneIcon aria-hidden />
            <BodyShort>{item.manager.mobile}</BodyShort>
          </HStack>
        </HStack>
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">Leder siden</BodyShort>
        <BodyShort>{formatActiveFrom(item.activeFrom)}</BodyShort>
      </VStack>
    </VStack>
  );
}

export function LinemanagerTabell({
  linemanagers,
  orgNumber,
  hasActiveSickLeave,
  loading,
  revokingKey,
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
    <VStack data-testid={UiSelector.LinemanagerTabell}>
      <Show below="md" asChild>
        <Table size="small" zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">
                <BodyShort as="span" visuallyHidden>
                  Vis detaljer
                </BodyShort>
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">Ansatt</Table.HeaderCell>
              <Table.HeaderCell scope="col">Nærmeste leder</Table.HeaderCell>
              <Table.HeaderCell scope="col">
                <BodyShort as="span" visuallyHidden>
                  Handling
                </BodyShort>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {linemanagers.map((item) => (
              <Table.ExpandableRow
                key={getRowKey(item)}
                content={<MobileDetails item={item} />}
              >
                <Table.HeaderCell scope="row">
                  <PersonSummary
                    name={item.employee.name}
                    nationalIdentificationNumber={
                      item.employee.nationalIdentificationNumber
                    }
                    showNationalIdentificationNumber={false}
                  />
                </Table.HeaderCell>
                <Table.DataCell>
                  <PersonSummary
                    name={item.manager.name}
                    nationalIdentificationNumber={
                      item.manager.nationalIdentificationNumber
                    }
                    showNationalIdentificationNumber={false}
                  />
                </Table.DataCell>
                <Table.DataCell align="right">
                  <LinemanagerActionMenu
                    item={item}
                    orgNumber={orgNumber}
                    hasActiveSickLeave={hasActiveSickLeave}
                    revokingKey={revokingKey}
                    onRevoke={onRevoke}
                  />
                </Table.DataCell>
              </Table.ExpandableRow>
            ))}
          </Table.Body>
        </Table>
      </Show>

      <Hide below="md" asChild>
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Ansatt</Table.HeaderCell>
              <Table.HeaderCell scope="col">Nærmeste leder</Table.HeaderCell>
              <Table.HeaderCell scope="col">
                Kontaktinformasjon
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">Leder siden</Table.HeaderCell>
              <Table.HeaderCell scope="col">Handling</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {linemanagers.map((item) => (
              <Table.Row key={getRowKey(item)}>
                <Table.HeaderCell scope="row">
                  <PersonSummary
                    name={item.employee.name}
                    nationalIdentificationNumber={
                      item.employee.nationalIdentificationNumber
                    }
                  />
                </Table.HeaderCell>
                <Table.DataCell>
                  <PersonSummary
                    name={item.manager.name}
                    nationalIdentificationNumber={
                      item.manager.nationalIdentificationNumber
                    }
                  />
                </Table.DataCell>
                <Table.DataCell>
                  <VStack gap="space-4">
                    <HStack gap="space-4" align="center">
                      <EnvelopeClosedIcon aria-hidden />
                      <BodyShort>{item.manager.email}</BodyShort>
                    </HStack>
                    <HStack gap="space-4" align="center">
                      <PhoneIcon aria-hidden />
                      <BodyShort size="small">{item.manager.mobile}</BodyShort>
                    </HStack>
                  </VStack>
                </Table.DataCell>
                <Table.DataCell>
                  {formatActiveFrom(item.activeFrom)}
                </Table.DataCell>
                <Table.DataCell>
                  <LinemanagerActionMenu
                    item={item}
                    orgNumber={orgNumber}
                    hasActiveSickLeave={hasActiveSickLeave}
                    revokingKey={revokingKey}
                    onRevoke={onRevoke}
                  />
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Hide>
    </VStack>
  );
}
