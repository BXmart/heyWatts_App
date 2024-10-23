export function formatProposalDates(inputDate: any): string {
  const dateParts: string[] = inputDate.split('-');
  const month: number = parseInt(dateParts[1], 10);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthName: string = monthNames[month - 1];
  const year: number = parseInt(dateParts[0], 10);
  if (!monthName || !year) return undefined;
  const formattedDate: string = `${monthName} de ${year}`;
  return formattedDate;
}
