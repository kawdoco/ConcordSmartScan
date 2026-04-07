import GenericLookupInput from "./GenericLookupInput";

function buildMachineDisplayId(machine) {
  const numericId = machine?.id;
  if (numericId !== null && numericId !== undefined) {
    return `MAC-${String(numericId).padStart(3, "0")}`;
  }

  const rawMachineId = String(machine?.machineId || "").trim();
  if (!rawMachineId) {
    return "-";
  }

  return rawMachineId.toUpperCase().startsWith("MAC-") ? rawMachineId : `MAC-${rawMachineId}`;
}

export default function MachineLookupInput({
  id,
  name,
  label,
  value,
  onChange,
  onSelectMachine,
  error,
  placeholder = "",
  className = "new-request-field"
}) {
  return (
    <GenericLookupInput
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onSelectOption={onSelectMachine}
      error={error}
      placeholder={placeholder}
      className={className}
      modifierClassName="generic-lookup--machine"
      endpoint="/machines"
      searchFields={[
        (machine) => buildMachineDisplayId(machine),
        "machineId",
        "serialNumber",
        "model"
      ]}
      getOptionKey={(machine) => machine.id || `${machine.machineId}-${machine.serialNumber}`}
      getOptionValue={(machine) => buildMachineDisplayId(machine)}
      getPrimaryText={(machine) => buildMachineDisplayId(machine)}
      getSecondaryText={(machine) => `Serial: ${machine.serialNumber || "-"} | Model: ${machine.model || "-"}`}
      emptyMessage="No machines found"
      loadingMessage="Loading machines..."
    />
  );
}
