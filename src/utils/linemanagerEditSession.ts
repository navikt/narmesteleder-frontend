export interface LinemanagerEditSessionPayload {
  employeeIdentificationNumber: string;
  lastName: string;
  orgnr: string;
}

const LINEMANAGER_EDIT_SESSION_KEY_PREFIX = "linemanager-edit:";
const THIRTY_SECONDS_IN_MS = 30 * 1000;

interface StoredLinemanagerEditSession extends LinemanagerEditSessionPayload {
  createdAtMs: number;
}

const getSessionKey = (editId: string) =>
  `${LINEMANAGER_EDIT_SESSION_KEY_PREFIX}${editId}`;

export function createLinemanagerEditSession(
  payload: LinemanagerEditSessionPayload,
): string {
  const editId = crypto.randomUUID();
  const key = getSessionKey(editId);

  const value: StoredLinemanagerEditSession = {
    ...payload,
    createdAtMs: Date.now(),
  };

  sessionStorage.setItem(key, JSON.stringify(value));

  return editId;
}

export function consumeLinemanagerEditSession(
  editId: string,
): LinemanagerEditSessionPayload | null {
  const key = getSessionKey(editId);
  const raw = sessionStorage.getItem(key);

  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(key);

  try {
    const parsed = JSON.parse(raw) as Partial<StoredLinemanagerEditSession>;
    if (
      typeof parsed.employeeIdentificationNumber !== "string" ||
      typeof parsed.lastName !== "string" ||
      typeof parsed.orgnr !== "string" ||
      typeof parsed.createdAtMs !== "number"
    ) {
      return null;
    }

    if (Date.now() - parsed.createdAtMs > THIRTY_SECONDS_IN_MS) {
      return null;
    }

    return {
      employeeIdentificationNumber: parsed.employeeIdentificationNumber,
      lastName: parsed.lastName,
      orgnr: parsed.orgnr,
    };
  } catch {
    return null;
  }
}
