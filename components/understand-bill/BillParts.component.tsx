import React, { useState } from "react";
import BillTour from "./BillTour.component";

const billData = {
  iberdrola: [
    {
      index: 1,
      title: "Datos del contrato",
      text: "En esta sección encontrarás datos del contrato básicos, en concreto el nombre del titular del contrato, la dirección del suministro y la potencias contratada, este último dato es fundamental para poder calcular la parte correspondiente al término de potencia en la factura",
      popupTitle: "Datos del contrato",
      popupText:
        "En esta sección encontrarás datos del contrato básicos, en concreto el nombre del titular del contrato, la dirección del suministro y la potencias contratada, este último dato es fundamental para poder calcular la parte correspondiente al término de potencia en la factura",
      height: "300",
      popupPosition: "top-[60px] right-[-10px]",
      highlightedTerms: [
        {
          term: "titular",
          definition: "La persona o entidad legal responsable del contrato.",
        },
        {
          term: "potencia",
          definition: "Es la capacidad máxima de consumo eléctrico que tu instalación puede soportar en un momento dado, similar a cuánto puede fluir agua por una tubería sin que esta reviente.",
        },
      ],
    },
    {
      index: 2,
      title: "Resumen de la factura",
      text: "Información general de la facturación con un breve desglose de los términos sin detallar. Además del importe total facturado es importante contrastar aquí los días facturados y la fecha prevista de cobro.",
      popupTitle: "Resumen de la factura",
      popupText:
        "Información general de la facturación con un breve desglose de los términos sin detallar. Además del importe total facturado es importante contrastar aquí los días facturados y la fecha prevista de cobro.",
      popupPosition: "top-[102px] right-[-14px]",
      highlightedTerms: [
        {
          term: "facturación",
          definition: "Proceso de emitir una factura detallando los cargos por el suministro eléctrico.",
        },
      ],
    },
    {
      index: 3,
      title: "Información del consumo eléctrico",
      text: 'En esta sección puedes ver como has ido evolucionando en tus consumos energéticos durante el año, lo que te sirve para ver tu "estacionalidad" en el consumo, es importante entender que estos consumos son valores totales en el mes y medias estadísticas, sirven para ayudar a ver la evolución si los comparas con otras facturas anteriores pero no son datos detallados.',
      popupTitle: "Información del consumo eléctrico",
      popupText:
        'En esta sección puedes ver como has ido evolucionando en tus consumos energéticos durante el año, lo que te sirve para ver tu "estacionalidad" en el consumo, es importante entender que estos consumos son valores totales en el mes y medias estadísticas, sirven para ayudar a ver la evolución si los comparas con otras facturas anteriores pero no son datos detallados.',
      popupPosition: "top-[225px] right-[-14px]",
      highlightedTerms: [
        {
          term: "consumos energéticos",
          definition: "La cantidad de energía eléctrica utilizada durante un período específico.",
        },
      ],
    },
    {
      index: 4,
      title: "Detalle de la factura",
      text: ``,
      popupTitle: "Detalle de la factura",
      popupPosition: "top-[85px] right-[210px]",
      popupText: `Al inicio de esta sección de la factura puede resultar confuso que bajo el término “ENERGÍA” se englobe tanto la energía como la potencia, a pesar de ser conceptos distintos. La energía se refiere a la electricidad consumida, mientras que la potencia es la capacidad máxima de electricidad que puedes tener disponible en tu hogar.

vamos a tratar de explicar los detalles de esta factura de electricidad y cómo se calculan los distintos costos:

Potencia Facturada: Este costo se refiere a la capacidad de electricidad que puedes tener disponible en tu hogar, y se paga aunque no consumas energía. Se divide en dos períodos:

Período punta: Cuesta 0.104435 euros por cada kilovatio (Kw) al día. Si tu capacidad es de 5.75 Kw, cada día pagarás 0.104435 euros x 5.75 = 0.6005 euros. En un mes de 30 días, esto suma 18.02 euros.

Período valle: Cuesta 0.014518 euros por Kw al día. Con la misma capacidad de 5.75 Kw, pagarás 0.014518 euros x 5.75 = 0.0835 euros cada día, y 2.50 euros al mes.

La suma de estos dos períodos es de 20.52 euros por mes.

No Confundir: A pesar de las palabras “punta” y “valle”, estos costos no están relacionados con los horarios de consumo habituales en las tarifas residenciales, sino que pertenecen a la estructura de tarifas ATR o “peajes” de tu contrato eléctrico.

Energía Consumida: Aquí se cobra la electricidad que realmente utilizas, medida en kilovatios por hora (Kwh). En el ejemplo, cada Kwh cuesta un precio fijo de 0.240065 euros, resultando en un costo de 279 Kwh x 0.240065 euros = 66.98 euros.

Bonos y Cargos Adicionales: Incluyen el bono social, un apoyo del gobierno que en este caso es de 0.038455 euros al día, sumando 1.15 euros al mes. También se incluyen cargos como el alquiler del contador de luz y un servicio de urgencias eléctricas.

Impuestos:

Impuesto Especial de la Energía: Se aplica sobre el total de potencia, energía y bono social. En el ejemplo, es el 0.5% de (potencia + energía + bono social = 88.65 euros), resultando en 0.44 euros.

IVA: Este impuesto se aplica de manera diferenciada según el tipo de gasto:

Reducido (5%): Se aplica a la suma de la energía consumida y el alquiler del contador (89.09 euros + 0.80 euros = 89.89 euros), añadiendo 4.49 euros de IVA. Este IVA reducido puede o no estar vigente dependiendo de la política fiscal actual.

Normal (21%): Si el IVA reducido no está vigente, el IVA normal se aplica a todos los conceptos, incluyendo energía y servicios adicionales.

Total de la Factura: Todos los costes e impuestos anteriores se suman para dar un total final de 97.13 euros.

Advertencia: La factura también puede incluir otros gastos menores relacionados con el transporte y regulación de la energía, que no siempre se detallan claramente. Es importante contactar con la compañía eléctrica para obtener un desglose completo de estos costos.`,
      isLongContent: true,
      highlightedTerms: [
        {
          term: "energía",
          definition: "La electricidad consumida, medida en kilovatios-hora (kWh).",
        },
        {
          term: "potencia",
          definition: "Es la capacidad máxima de consumo eléctrico que tu instalación puede soportar en un momento dado, similar a cuánto puede fluir agua por una tubería sin que esta reviente.",
        },
      ],
    },
    {
      index: 5,
      title: "Información adicional",
      text: "En esta sección se detallan las características del contrato eléctrico, resaltar como importante que aquí podrás encontrar el CUPS, el nombre de la empresa distribuidora (que en este caso es i-DE, la empresa distribuidora de Iberdrola, pero podría ser otra aunque el contrato lo tengas con Iberdrola) y el tipo de tarifa ATR (acceso a terceros a a la red) que es una suerte de tarifa de distribución, que en el caso del ejemplo el el 2.0TD",
      popupTitle: "Información adicional",
      popupText:
        "En esta sección se detallan las características del contrato eléctrico, resaltar como importante que aquí podrás encontrar el CUPS, el nombre de la empresa distribuidora (que en este caso es i-DE, la empresa distribuidora de Iberdrola, pero podría ser otra aunque el contrato lo tengas con Iberdrola) y el tipo de tarifa ATR (acceso a terceros a a la red) que es una suerte de tarifa de distribución, que en el caso del ejemplo el el 2.0TD",
      popupPosition: "top-[255px] right-[200px]",
      highlightedTerms: [
        {
          term: "CUPS",
          definition: "Código Unívoco de Punto de Suministro: Identificador único para cada punto de suministro de electricidad.",
        },
        {
          term: "ATR",
          definition:
            "Tarifa de acceso a la red, también conocida como tarifa de distribución o peaje eléctrico: son las cuotas reguladas por el gobierno que los consumidores pagan por el uso de las redes de transporte y distribución de electricidad, cubriendo los costes de mantenimiento y operación de la red.",
        },
        {
          term: "2.0TD",
          definition:
            "Tarifa de acceso para consumidores domésticos y pequeños negocios con potencia contratada inferior a 15 kW, con precios que varían según la hora de consumo (punta, llano, valle) para fomentar un uso eficiente de la energía.",
        },
      ],
    },
  ],
};

const BillParts = () => {
  const [activeSection, setActiveSection] = useState(1);

  const handleTourPointClick = (section: any) => {
    setActiveSection(section);
  };

  return <BillTour activeSection={activeSection} onClickTourPoint={handleTourPointClick} billData={billData} />;
};

export default BillParts;
