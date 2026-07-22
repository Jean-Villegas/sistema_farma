import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalisis, fetchAnalisisByCliente, createAnalisis, deleteAnalisis, updateDiagnosis } from '../features/analisis/analisisSlice';
import { ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import DataTable from './DataTable';
import Modal from './Modal';
import FormField from './FormField';
import Loading from './Loading';
import Alert from './Alert';
import { TIPOS_ANALISIS, formatDate } from '../utils/constants';
import { downloadAnalisisPDF } from './pdf/AnalisisPDF';

export default function Analisis() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, loading } = useSelector((s) => s.analisis);
  const [alert, setAlert] = useState(null);
  const modal = useModal();
  const diagModal = useModal();
  const form = useForm({ tipo_examen: 'Sangre de rutina', fecha_examen: '', resultados_glucosa: '', resultados_colesterol: '', resultados_trigliceridos: '', diagnostico_paciente: '' });
  const diagForm = useForm({ diagnostico_medico: '', analisis_id: '' });
  const isCliente = user?.rol === ROLES.CLIENTE;
  const isMedico = user?.rol === ROLES.MEDICO;

  const reloadAnalisis = () => {
    if (!user?.id) return;
    if (isCliente) dispatch(fetchAnalisisByCliente(user.id));
    else dispatch(fetchAnalisis());
  };

  useEffect(() => {
    reloadAnalisis();
  }, [dispatch, user?.id, user?.rol]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAnalisis(form.values)).unwrap();
      setAlert({ message: 'Análisis registrado correctamente', type: 'success' });
      modal.close();
      form.reset();
      reloadAnalisis();
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handleDelete = async (row) => {
    if (window.confirm('¿Eliminar este análisis?')) {
      try { await dispatch(deleteAnalisis(row.id)).unwrap(); setAlert({ message: 'Análisis eliminado', type: 'success' }); } catch (err) { setAlert({ message: err, type: 'error' }); }
    }
  };

  const openDiagnostico = (row) => {
    diagForm.setValue('diagnostico_medico', row.diagnostico_medico || '');
    diagForm.setValue('analisis_id', row.id);
    diagModal.open(row);
  };

  const handleDiagnostico = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateDiagnosis({ id: diagForm.values.analisis_id, data: { diagnostico_medico: diagForm.values.diagnostico_medico, medico_id: user.id } })).unwrap();
      setAlert({ message: 'Diagnóstico registrado', type: 'success' });
      diagModal.close();
      reloadAnalisis();
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handlePdf = async (row) => {
    try {
      await downloadAnalisisPDF(row, row.cliente_username || user?.username);
      setAlert({ message: 'PDF descargado', type: 'success' });
    } catch (err) {
      setAlert({ message: err?.message || 'No se pudo generar el PDF', type: 'error' });
    }
  };

  const columns = [
    ...(isMedico ? [{ key: 'cliente_username', label: 'Paciente', render: (v) => <span className="font-medium text-slate-800">{v || '--'}</span> }] : []),
    { key: 'fecha_examen', label: 'Fecha', render: (v) => formatDate(v) },
    { key: 'tipo_examen', label: 'Tipo', render: (v) => <span className="badge bg-sky-50 text-sky-600">{v || '--'}</span> },
    { key: 'resultados_glucosa', label: 'Glucosa', render: (v) => v ? `${v} mg/dL` : '--' },
    { key: 'resultados_colesterol', label: 'Colesterol', render: (v) => v ? `${v} mg/dL` : '--' },
    { key: 'diagnostico_medico', label: 'Diagnóstico', render: (v) => v ? <span className="text-xs line-clamp-2">{v}</span> : <span className="badge bg-amber-50 text-amber-600">Pendiente</span> },
  ];

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-800">
            <i className="fas fa-flask text-purple-500 mr-2" />
            {isMedico ? 'Análisis de Pacientes' : 'Mis Análisis Médicos'}
          </h2>
          {isCliente && (
            <button onClick={() => { form.reset(); modal.open(); }} className="btn-primary btn-sm">
              <i className="fas fa-plus" /> Nuevo Análisis
            </button>
          )}
        </div>
        {loading ? <Loading /> : (
          <DataTable
            columns={columns}
            data={list}
            onDelete={isCliente ? handleDelete : null}
            onView={isMedico ? openDiagnostico : null}
            onPdf={handlePdf}
          />
        )}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Registrar Análisis">
        <form onSubmit={handleCreate}>
          <FormField label="Tipo de Examen" name="tipo_examen" type="select" options={TIPOS_ANALISIS} value={form.values.tipo_examen} onChange={form.handleChange} />
          <FormField label="Fecha del Examen" name="fecha_examen" type="date" value={form.values.fecha_examen} onChange={form.handleChange} />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Glucosa (mg/dL)" name="resultados_glucosa" type="number" step="0.01" value={form.values.resultados_glucosa} onChange={form.handleChange} />
            <FormField label="Colesterol (mg/dL)" name="resultados_colesterol" type="number" step="0.01" value={form.values.resultados_colesterol} onChange={form.handleChange} />
            <FormField label="Triglicéridos" name="resultados_trigliceridos" type="number" step="0.01" value={form.values.resultados_trigliceridos} onChange={form.handleChange} />
          </div>
          <FormField label="Síntomas u Observaciones" name="diagnostico_paciente" type="textarea" value={form.values.diagnostico_paciente} onChange={form.handleChange} />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={modal.close} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><i className="fas fa-save" /> Guardar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={diagModal.isOpen} onClose={diagModal.close} title="Emitir Diagnóstico">
        {diagModal.data && (
          <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm space-y-2">
            <p><span className="font-semibold text-slate-700">Paciente:</span> {diagModal.data.cliente_username || '--'}</p>
            <p><span className="font-semibold text-slate-700">Examen:</span> {diagModal.data.tipo_examen || '--'} · {formatDate(diagModal.data.fecha_examen)}</p>
            <p>
              <span className="font-semibold text-slate-700">Resultados:</span>{' '}
              Glucosa {diagModal.data.resultados_glucosa ?? '--'} · Colesterol {diagModal.data.resultados_colesterol ?? '--'} · Triglicéridos {diagModal.data.resultados_trigliceridos ?? '--'}
            </p>
            {diagModal.data.diagnostico_paciente && (
              <p><span className="font-semibold text-slate-700">Observaciones del paciente:</span> {diagModal.data.diagnostico_paciente}</p>
            )}
          </div>
        )}
        <form onSubmit={handleDiagnostico}>
          <FormField label="Diagnóstico Médico" name="diagnostico_medico" type="textarea" rows={6} value={diagForm.values.diagnostico_medico} onChange={diagForm.handleChange} required />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={diagModal.close} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><i className="fas fa-paper-plane" /> Enviar Diagnóstico</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
