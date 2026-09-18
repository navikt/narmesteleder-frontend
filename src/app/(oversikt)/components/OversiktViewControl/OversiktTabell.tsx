import {
  EnvelopeClosedIcon,
  LinkBrokenIcon,
  MenuElipsisVerticalIcon,
  PersonPencilIcon,
  PersonPlusIcon,
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
import type { ReactNode } from "react";
import { publicEnv } from "@/env-variables/publicEnv";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktSpinner } from "../OversiktSpinner";

interface MissingLinemanagerTableProps {
  variant: "missing-linemanager";
  requirements: RequirementsListItem[];
  orgNumber: string;
  loading?: boolean;
}

interface LinemanagerTableProps {
  variant: "linemanager";
  linemanagers: LinemanagerSearchItem[];
  orgNumber: string;
  hasActiveSickLeave: boolean;
  loading?: boolean;
  revokingKey?: string | null;
  onRevoke: (item: LinemanagerSearchItem) => void;
}

type OversiktTabellProps = MissingLinemanagerTableProps | LinemanagerTableProps;

interface OverviewRow {
  key: string;
  employeeName: string;
  employeeIdentificationNumber: string;
  managerName: string;
  managerIdentificationNumber: string | null;
  managerEmail: string | null;
  managerMobile: string | null;
  activeFrom: string | null;
  action: ReactNode;
}

export const ADD_LINEMANAGER_LABEL = "Legg til nærmeste leder";

export function getAddLinemanagerHref(
  requirementId: string,
  orgNumber: string,
): string {
  const returnTo = `/oversikt?orgnr=${orgNumber}&tab=mangler-leder`;
  const params = new URLSearchParams({ returnTo });
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${requirementId}?${params}`;
}

export function getEditLinemanagerHref(
  linemanagerId: string,
  orgNumber: string,
): string {
  const params = new URLSearchParams({
    returnTo: `/oversikt?orgnr=${orgNumber}&tab=aktiv-sykmelding`,
  });
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/endre/${linemanagerId}?${params}`;
}

function formatName(
  name: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
  } | null,
): string {
  if (!name) return "—";
  return joinNonEmpty([name.firstName, name.middleName, name.lastName]);
}

function formatActiveFrom(dateTime: string | null): string {
  if (!dateTime) return "—";
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("nb-NO");
}

function MissingLinemanagerActionMenu({
  requirement,
  orgNumber,
}: {
  requirement: RequirementsListItem;
  orgNumber: string;
}) {
  const employeeName = formatName(requirement.name);
  const actionLabel = `Handlinger for ${employeeName}`;

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          aria-label={actionLabel}
          title={actionLabel}
          data-color="neutral"
          variant="tertiary"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content align="end">
        <ActionMenu.Item
          as="a"
          href={getAddLinemanagerHref(requirement.id, orgNumber)}
          icon={<PersonPlusIcon aria-hidden />}
        >
          {ADD_LINEMANAGER_LABEL}
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
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
  const employeeName = formatName(item.employee.name);
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
        {hasActiveSickLeave && (
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
          {revokingKey === item.linemanagerId
            ? "Fjerner nærmeste leder"
            : "Fjern nærmeste leder"}
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  );
}

function PersonSummary({
  name,
  nationalIdentificationNumber,
  showNationalIdentificationNumber = true,
}: {
  name: string;
  nationalIdentificationNumber: string | null;
  showNationalIdentificationNumber?: boolean;
}) {
  return (
    <VStack gap="space-4">
      <BodyShort>{name}</BodyShort>
      {showNationalIdentificationNumber && nationalIdentificationNumber && (
        <BodyShort size="small">
          {formatFnr(nationalIdentificationNumber)}
        </BodyShort>
      )}
    </VStack>
  );
}

function ContactDetails({ row }: { row: OverviewRow }) {
  if (!row.managerEmail && !row.managerMobile) {
    return <BodyShort>—</BodyShort>;
  }

  return (
    <VStack gap="space-4">
      {row.managerEmail && (
        <HStack gap="space-4" align="center">
          <EnvelopeClosedIcon aria-hidden />
          <BodyShort>{row.managerEmail}</BodyShort>
        </HStack>
      )}
      {row.managerMobile && (
        <HStack gap="space-4" align="center">
          <PhoneIcon aria-hidden />
          <BodyShort size="small">{row.managerMobile}</BodyShort>
        </HStack>
      )}
    </VStack>
  );
}

function MobileDetails({ row }: { row: OverviewRow }) {
  return (
    <VStack gap="space-12" paddingBlock="space-8">
      <VStack gap="space-4">
        <BodyShort weight="semibold">Fødselsnummer for ansatt</BodyShort>
        <BodyShort>{formatFnr(row.employeeIdentificationNumber)}</BodyShort>
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">
          Fødselsnummer for nærmeste leder
        </BodyShort>
        <BodyShort>
          {row.managerIdentificationNumber
            ? formatFnr(row.managerIdentificationNumber)
            : "—"}
        </BodyShort>
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">Kontaktinformasjon</BodyShort>
        <ContactDetails row={row} />
      </VStack>
      <VStack gap="space-4">
        <BodyShort weight="semibold">Leder siden</BodyShort>
        <BodyShort>{formatActiveFrom(row.activeFrom)}</BodyShort>
      </VStack>
    </VStack>
  );
}

function getRows(props: OversiktTabellProps): OverviewRow[] {
  if (props.variant === "missing-linemanager") {
    return props.requirements.map((requirement) => ({
      key: requirement.id,
      employeeName: formatName(requirement.name),
      employeeIdentificationNumber: requirement.employeeIdentificationNumber,
      managerName: "Ikke registrert",
      managerIdentificationNumber: null,
      managerEmail: null,
      managerMobile: null,
      activeFrom: null,
      action: (
        <MissingLinemanagerActionMenu
          requirement={requirement}
          orgNumber={props.orgNumber}
        />
      ),
    }));
  }

  return props.linemanagers.map((item) => ({
    key: item.linemanagerId,
    employeeName: formatName(item.employee.name),
    employeeIdentificationNumber: item.employee.nationalIdentificationNumber,
    managerName: formatName(item.manager.name),
    managerIdentificationNumber: item.manager.nationalIdentificationNumber,
    managerEmail: item.manager.email,
    managerMobile: item.manager.mobile,
    activeFrom: item.activeFrom,
    action: (
      <LinemanagerActionMenu
        item={item}
        orgNumber={props.orgNumber}
        hasActiveSickLeave={props.hasActiveSickLeave}
        revokingKey={props.revokingKey}
        onRevoke={props.onRevoke}
      />
    ),
  }));
}

export function OversiktTabell(props: OversiktTabellProps) {
  const rows = getRows(props);

  if (props.loading) {
    return <OversiktSpinner />;
  }

  if (rows.length === 0) {
    return (
      <VStack
        align="center"
        gap="space-12"
        paddingBlock="space-40"
        data-testid={UiSelector.OversiktTomState}
      >
        <BodyShort>Ingen ansatte å vise her.</BodyShort>
      </VStack>
    );
  }

  return (
    <VStack data-testid={UiSelector.OversiktTabell}>
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
              <Table.HeaderCell scope="col" align="right">
                <BodyShort as="span" visuallyHidden>
                  Handling
                </BodyShort>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.ExpandableRow
                key={row.key}
                content={<MobileDetails row={row} />}
              >
                <Table.HeaderCell scope="row">
                  <PersonSummary
                    name={row.employeeName}
                    nationalIdentificationNumber={
                      row.employeeIdentificationNumber
                    }
                    showNationalIdentificationNumber={false}
                  />
                </Table.HeaderCell>
                <Table.DataCell>
                  <PersonSummary
                    name={row.managerName}
                    nationalIdentificationNumber={
                      row.managerIdentificationNumber
                    }
                    showNationalIdentificationNumber={false}
                  />
                </Table.DataCell>
                <Table.DataCell align="right">{row.action}</Table.DataCell>
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
              <Table.HeaderCell scope="col" align="right">
                Handling
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.key}>
                <Table.HeaderCell scope="row">
                  <PersonSummary
                    name={row.employeeName}
                    nationalIdentificationNumber={
                      row.employeeIdentificationNumber
                    }
                  />
                </Table.HeaderCell>
                <Table.DataCell>
                  <PersonSummary
                    name={row.managerName}
                    nationalIdentificationNumber={
                      row.managerIdentificationNumber
                    }
                  />
                </Table.DataCell>
                <Table.DataCell>
                  <ContactDetails row={row} />
                </Table.DataCell>
                <Table.DataCell>
                  {formatActiveFrom(row.activeFrom)}
                </Table.DataCell>
                <Table.DataCell align="right">{row.action}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Hide>
    </VStack>
  );
}
