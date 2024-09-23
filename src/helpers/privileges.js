export const privileges = [
  "class-representative",
  "manage-facilities",
  "manage-labs",
  "manage-departments",
  "manage-schools",
  "manage-programs",
  "manage-intakes",
  "manage-facilities-booking",
  "manage-time-table",
  "manage-users",
  "manage-facility-approval",
  "manage-lab-approval",
  "manage-lab-technitian",
  "school-dean"
];

// Check privilege validity from the list of allowed privileges
export const checkPrivilegeValidity = (privilegesFromReqBody) => {
  const set = new Set(privileges);

  // Use the filter method to find elements in array1 that are not in array2
  const difference = privilegesFromReqBody.filter(
    (element) => !set.has(element)
  );
  return difference;
};

export const checkprivileges = (userprivileges, privilegeToCheck) => {
  if (!userprivileges) {
    return false;
  }
  return userprivileges.includes(privilegeToCheck);
};
