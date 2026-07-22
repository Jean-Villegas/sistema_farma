import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { createElement } from 'react';
import { formatDate } from '../../utils/constants';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#0284c7',
    paddingBottom: 12,
  },
  brand: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0284c7',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '40%',
    color: '#64748b',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    width: '60%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
});

function AnalisisDocument({ analisis, paciente }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>HealthHub</Text>
          <Text style={styles.title}>Informe de Análisis Médico</Text>
          <Text style={styles.subtitle}>
            Generado el {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del paciente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Paciente</Text>
            <Text style={styles.value}>{paciente || analisis?.cliente_username || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de examen</Text>
            <Text style={styles.value}>{analisis?.tipo_examen || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha del examen</Text>
            <Text style={styles.value}>{formatDate(analisis?.fecha_examen)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultados de laboratorio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Glucosa</Text>
            <Text style={styles.value}>
              {analisis?.resultados_glucosa != null ? `${analisis.resultados_glucosa} mg/dL` : '—'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Colesterol</Text>
            <Text style={styles.value}>
              {analisis?.resultados_colesterol != null ? `${analisis.resultados_colesterol} mg/dL` : '—'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Triglicéridos</Text>
            <Text style={styles.value}>
              {analisis?.resultados_trigliceridos != null ? `${analisis.resultados_trigliceridos} mg/dL` : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones del paciente</Text>
          <Text>{analisis?.diagnostico_paciente || 'Sin observaciones registradas.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnóstico médico</Text>
          <Text>{analisis?.diagnostico_medico || 'Pendiente de diagnóstico.'}</Text>
        </View>

        <Text style={styles.footer}>
          HealthHub · Documento generado automáticamente · Uso informativo
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadAnalisisPDF(analisis, paciente) {
  const blob = await pdf(createElement(AnalisisDocument, { analisis, paciente })).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analisis-${analisis?.id || 'informe'}-${Date.now()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export default AnalisisDocument;
