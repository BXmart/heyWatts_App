export function formatInvoiceDate(dateString: string) {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const date = new Date(dateString);
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const month = months[monthIndex];

  return `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`;
}
