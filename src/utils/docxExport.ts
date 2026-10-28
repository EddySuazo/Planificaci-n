import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, Packer } from 'docx';
import { LessonPlan } from '../types';

export async function exportLessonPlanToDocx(plan: LessonPlan): Promise<void> {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: '002B49' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: '002B49' },
    left: { style: BorderStyle.SINGLE, size: 1, color: '002B49' },
    right: { style: BorderStyle.SINGLE, size: 1, color: '002B49' },
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 1000, right: 1000 },
          },
        },
        children: [
          // Header MINERD
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'REPÚBLICA DOMINICANA',
                bold: true,
                size: 24,
                color: '002B49',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MINISTERIO DE EDUCACIÓN (MINERD)',
                bold: true,
                size: 22,
                color: 'CE1126',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `DIRECCIÓN REGIONAL ${plan.regional} | DISTRITO EDUCATIVO ${plan.distrito}`,
                italics: true,
                size: 18,
                color: '4B5563',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `PLANIFICACIÓN PEDAGÓGICA OFICIAL (${plan.tipo.toUpperCase()})`,
                bold: true,
                size: 26,
                color: '002B49',
              }),
            ],
          }),

          // Info Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Centro Educativo:', bold: true }), new TextRun(` ${plan.centroEducativoNombre}`)] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Código SIGERD:', bold: true }), new TextRun(` ${plan.centroEducativoId}`)] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Docente:', bold: true }), new TextRun(` ${plan.docenteNombre}`)] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Cédula:', bold: true }), new TextRun(` ${plan.docenteCedula}`)] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nivel / Ciclo / Grado:', bold: true }), new TextRun(` ${plan.nivel} - ${plan.ciclo} | ${plan.grado} "${plan.seccion}"`)] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Área Curricular:', bold: true }), new TextRun(` ${plan.area}`)] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Año Escolar y Período:', bold: true }), new TextRun(` ${plan.anoEscolar} | ${plan.periodo}`)] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Código Documento:', bold: true }), new TextRun(` ${plan.codigoDocumento}`)] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Título de la Unidad o Secuencia', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun(plan.titulo)] }),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Situación de Aprendizaje', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun(plan.situacionAprendizaje || 'No especificada.')] }),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Competencias Fundamentales', bold: true, color: '002B49' })] }),
          ...plan.competenciasFundamentales.map(c => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(c)] })),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Competencias Específicas del Grado', bold: true, color: '002B49' })] }),
          ...plan.competenciasEspecificas.map(c => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(c)] })),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Indicadores de Logro MINERD', bold: true, color: '002B49' })] }),
          ...plan.indicadoresLogro.map(i => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(i)] })),

          // Contenidos
          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Contenidos Curriculares', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun({ text: 'Conceptuales: ', bold: true }), new TextRun(plan.contenidosConceptuales.join('; '))] }),
          new Paragraph({ children: [new TextRun({ text: 'Procedimentales: ', bold: true }), new TextRun(plan.contenidosProcedimentales.join('; '))] }),
          new Paragraph({ children: [new TextRun({ text: 'Actitudinales y Valores: ', bold: true }), new TextRun(plan.contenidosActitudinales.join('; '))] }),

          // Sesiones de clase
          // Weekly plan table
          ...(plan.diasSemana && plan.diasSemana.length > 0 ? [
            new Paragraph({ spacing: { before: 200, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Distribución Semanal de Clases (Lunes a Viernes)', bold: true, color: '002B49' })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Día', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Intención Pedagógica', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Actividades de Aprendizaje', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Indicadores / Tareas', bold: true })] })] }),
                  ]
                }),
                ...plan.diasSemana.map(d => new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: d.dia, bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(d.intencionPedagogica)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(d.actividades)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(`${d.indicadores} | Tareas: ${d.tareas}`)] })] }),
                  ]
                }))
              ]
            })
          ] : []),

          // Quarterly plan table
          ...(plan.cronogramaPeriodo && plan.cronogramaPeriodo.length > 0 ? [
            new Paragraph({ spacing: { before: 200, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `Cronograma del Período Oficial (${plan.periodo || 'P1 - P4'})`, bold: true, color: '002B49' })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Semanas', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Unidad o Tema Central', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Competencias e Indicadores', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Hito Evaluativo', bold: true })] })] }),
                  ]
                }),
                ...plan.cronogramaPeriodo.map(cp => new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: cp.semana, bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(cp.unidadTema)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(cp.competenciasEIndicadores)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: cp.evaluacionHito, bold: true, color: 'CE1126' })] })] }),
                  ]
                }))
              ]
            })
          ] : []),

          // Annual plan table
          ...(plan.cronogramaAnual && plan.cronogramaAnual.length > 0 ? [
            new Paragraph({ spacing: { before: 200, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `Plan Docente Anual (${plan.anoEscolar}) - 190 Días Lectivos`, bold: true, color: '002B49' })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Mes / Período', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Unidades y Secuencias', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Efemérides MINERD', bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Días Lectivos', bold: true })] })] }),
                  ]
                }),
                ...plan.cronogramaAnual.map(ca => new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: `${ca.mes} (${ca.periodo})`, bold: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(ca.unidadesSecuencias)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: ca.efemeridesMINERD, italics: true })] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(`${ca.diasLectivos} días`)] })] }),
                  ]
                }))
              ]
            })
          ] : []),

          ...(plan.sesiones.length > 0 ? [
            new Paragraph({ spacing: { before: 200, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Desarrollo de las Sesiones de Clase (Momentos Pedagógicos)', bold: true, color: '002B49' })] }),
            ...plan.sesiones.flatMap(ses => [
              new Paragraph({
                spacing: { before: 100, after: 50 },
                children: [
                  new TextRun({ text: `Sesión ${ses.numero} (${ses.duracionMinutos} minutos) - Fecha: ${ses.fecha || 'Pendiente'}`, bold: true, color: 'CE1126' })
                ]
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Momento de la Clase / Duración', bold: true })] })] }),
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Actividades Pedagógicas', bold: true })] })] }),
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Recursos', bold: true })] })] }),
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: `Inicio (${ses.momentoInicio.duracionMin} min)`, bold: true })] })] }),
                      new TableCell({
                        borders: tableBorder,
                        children: [
                          new Paragraph({ children: [new TextRun({ text: 'Rutina Diaria: ', bold: true }), new TextRun(ses.momentoInicio.rutinaDiaria)] }),
                          new Paragraph({ children: [new TextRun({ text: 'Retroalimentación: ', bold: true }), new TextRun(ses.momentoInicio.retroalimentacion)] }),
                          new Paragraph({ children: [new TextRun({ text: 'Saberes Previos: ', bold: true }), new TextRun(ses.momentoInicio.saberesPrevios)] }),
                        ]
                      }),
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(ses.momentoInicio.recursos)] })] }),
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: `Desarrollo (${ses.momentoDesarrollo.duracionMin} min)`, bold: true })] })] }),
                      new TableCell({
                        borders: tableBorder,
                        children: [
                          new Paragraph({ children: [new TextRun(ses.momentoDesarrollo.actividades)] }),
                          new Paragraph({ children: [new TextRun({ text: `Referencia en Secuencia: ${ses.momentoDesarrollo.numeroLetraSecuencia || 'Actividad nuclear'}`, italics: true })] }),
                        ]
                      }),
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(ses.momentoDesarrollo.recursos)] })] }),
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun({ text: `Cierre (${ses.momentoCierre.duracionMin} min)`, bold: true })] })] }),
                      new TableCell({
                        borders: tableBorder,
                        children: [
                          new Paragraph({ children: [new TextRun({ text: 'Puntualizaciones: ', bold: true }), new TextRun(ses.momentoCierre.puntualizaciones)] }),
                          new Paragraph({ children: [new TextRun({ text: 'Sistematización: ', bold: true }), new TextRun(ses.momentoCierre.sistematizacion)] }),
                          new Paragraph({ children: [new TextRun({ text: 'Metacognición: ', bold: true }), new TextRun(ses.momentoCierre.metacognicion)] }),
                        ]
                      }),
                      new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(ses.momentoCierre.recursos)] })] }),
                    ]
                  }),
                ]
              }),
              new Paragraph({ spacing: { before: 50 }, children: [new TextRun({ text: 'Atención a la Diversidad: ', bold: true }), new TextRun(ses.actividadesDiversidad)] }),
              new Paragraph({ children: [new TextRun({ text: 'Actividad para el Diario del Estudiante: ', bold: true }), new TextRun(ses.actividadDiarioEstudiante)] }),
              new Paragraph({ children: [new TextRun({ text: 'Lectura Recomendada o Libro de la Semana: ', bold: true }), new TextRun(ses.lecturaRecomendada)] }),
              new Paragraph({ spacing: { after: 150 }, children: [new TextRun({ text: 'Nota para el Docente: ', bold: true, italics: true }), new TextRun({ text: ses.notasDocente, italics: true })] }),
            ])
          ] : []),

          // Recursos, Evaluación y Validación
          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Recursos Didácticos y Tecnológicos', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun(plan.recursosDidacticos.join(', '))] }),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Técnicas e Instrumentos de Evaluación', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun(plan.tecnicasEvaluacion.join(', '))] }),

          new Paragraph({ spacing: { before: 150, after: 100 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Estrategias de Recuperación y Refuerzo', bold: true, color: '002B49' })] }),
          new Paragraph({ children: [new TextRun(plan.actividadesRecuperacion || 'Sesiones de tutoría pedagógica y refuerzo.')] }),

          // Signatures table
          new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: 'Validación y Firmas Institucionales', bold: true, color: '002B49' })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('_____________________________')] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: plan.docenteNombre, bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('Docente del Grado')] }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('_____________________________')] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Coordinación Pedagógica', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('Segundo Ciclo Primaria')] }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('_____________________________')] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dirección del Centro', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('Sello Oficial')] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: 'Generado con PlanificaRD - Plataforma Inteligente de Planificación Docente MINERD República Dominicana',
                italics: true,
                size: 16,
                color: '6B7280',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.codigoDocumento}_${plan.area.replace(/\s+/g, '_')}_${plan.grado.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
