const MACHINE_PREFIX = "MAC-";

const extractMachineNumericPart = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const match = String(value).trim().match(/(\d+)$/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const formatMachineId = (rawMachineId, fallbackId) => {
  const numericPart = extractMachineNumericPart(rawMachineId) ?? extractMachineNumericPart(fallbackId);
  if (numericPart === null) {
    return "";
  }

  return `${MACHINE_PREFIX}${String(numericPart).padStart(3, "0")}`;
};

export const getMachineDisplayId = (machine) => {
  return formatMachineId(machine?.machineId, machine?.id);
};
