export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.toLocaleString('default', {
    month: 'long',
  });

  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return `${month} ${String(day)}, ${String(year)} at ${time}`;
};

export const titleCase = (string: string) => {
  return string
    .replace(/^[-_]*(.)/, (_, c: string) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c: string) => ' ' + c.toUpperCase());
};
