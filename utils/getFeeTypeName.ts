export function getFeeTypeName(feeType: number) {
  switch (feeType) {
    case 1:
      return 'con seis precios para seis periodos fijos';
    case 2:
      return 'indexada';
    case 3:
      return 'plana';
    case 4:
      return 'PVPC (Regulada)';
    case 5:
      return 'con tres precios para tres periodos fijos';
    case 6:
      return 'con dos precios fijos para Punta y Valle, sin Llano';
    default:
      return 'general';
  }
}
