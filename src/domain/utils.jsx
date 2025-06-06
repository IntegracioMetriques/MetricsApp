export const filterHistoricData = (data, days) => {
  if (days === "lifetime") return data;

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - parseInt(days));
  const cutoffDateString = cutoff.toISOString().split("T")[0];

  const filtered = {};
  for (const date in data) {
    if (date >= cutoffDateString) {
      filtered[date] = data[date];
    }
  }

  return filtered;
};

export const truncateName = (name, maxLength = 18) => {
  return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
};
