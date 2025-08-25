import type { Sale, CompanyInfo, Client } from '../types';

// Simula la generación de un Documento Tributario Electrónico (DTE) en formato XML.
export function generateDteXml(sale: Sale, companyInfo: CompanyInfo, client: Client | null): string {
  const saleId = sale.id.replace('SALE-', '');
  const neto = Math.round(sale.total / 1.19);
  const iva = sale.total - neto;

  // Encabezado del DTE
  const header = `
    <Encabezado>
      <IdDoc>
        <TipoDTE>39</TipoDTE>
        <Folio>${saleId}</Folio>
        <FchEmis>${new Date(sale.date).toISOString().split('T')[0]}</FchEmis>
      </IdDoc>
      <Emisor>
        <RUTEmisor>${companyInfo.rut}</RUTEmisor>
        <RznSoc>${companyInfo.name}</RznSoc>
        <GiroEmis>VENTA AL POR MENOR DE OTROS PRODUCTOS</GiroEmis>
        <DirOrigen>${companyInfo.address}</DirOrigen>
      </Emisor>
      <Receptor>
        <RUTRecep>${client ? client.rut : '66666666-6'}</RUTRecep>
        <RznSocRecep>${client ? client.name : 'CLIENTE GENERICO'}</RznSocRecep>
        <DirRecep>${client ? client.address : 'S/D'}</DirRecep>
      </Receptor>
      <Totales>
        <MntNeto>${neto}</MntNeto>
        <TasaIVA>19</TasaIVA>
        <IVA>${iva}</IVA>
        <MntTotal>${sale.total}</MntTotal>
      </Totales>
    </Encabezado>
  `;

  // Timbre Electrónico Simulado (en una implementación real, esto es generado y firmado digitalmente)
  const timbre = `<TED version="1.0"><DD><RE>${companyInfo.rut}</RE><TD>39</TD><F>${saleId}</F><FE>${new Date(sale.date).toISOString().split('T')[0]}</FE><RR>${client ? client.rut : '66666666-6'}</RR><RSR>${client ? client.name.substring(0, 40) : 'CLIENTE GENERICO'}</RSR><MNT>${sale.total}</MNT><IT1>Productos Varios</IT1><CAF version="1.0">...</CAF><TSTED>${new Date().toISOString()}</TSTED></DD><FRMT alg="SHA1withRSA">FRMT_SIMULADO</FRMT></TED>`;

  return `<?xml version="1.0" encoding="ISO-8859-1"?>
<DTE version="1.0">
  <Documento ID="DTE${saleId}">
    ${header}
    ${timbre}
  </Documento>
</DTE>
  `;
}
