/**
 * Seed de datos del Sistema de Salud
 * Ejecutar UNA sola vez: node src/config/seedDb.js
 *
 * Crea:
 *  - 1 Administrador
 *  - 2 Médicos
 *  - 3 Pacientes (Clientes)
 *  - Perfiles de salud para cada paciente
 *  - 3 Posts en el foro
 *  - 4 Análisis médicos con y sin diagnóstico
 */

const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ── Datos de muestra ──────────────────────────────────────────────────────────

const USUARIOS = [
  // [username, email, password_plano, rol]
  ['admin',     'admin@salud.com',    'Admin123!',   'Administrador'],
  ['dr_garcia', 'garcia@salud.com',   'Medico123!',  'Medico'],
  ['dr_lopez',  'lopez@salud.com',    'Medico123!',  'Medico'],
  ['paciente1', 'maria@gmail.com',    'Paciente1!',  'Cliente'],
  ['paciente2', 'juan@gmail.com',     'Paciente2!',  'Cliente'],
  ['paciente3', 'luisa@gmail.com',    'Paciente3!',  'Cliente'],
];

const MEDICOS = [
  // usuario_index (0-based dentro de USUARIOS), especialidad, cedula, telefono
  [1, 'Cardiología',    '7654321', '04121234567'],
  [2, 'Endocrinología', '8765432', '04141234567'],
];

const CLIENTES = [
  // usuario_index, nombre, apellido, cedula, telefono, direccion, fecha_nac, genero
  [3, 'María',  'Pérez',   '12345678', '04161111111', 'Av. Principal 101', '1990-05-14', 'F'],
  [4, 'Juan',   'Rodríguez','23456789', '04142222222', 'Calle 5 Casa 3',   '1985-11-20', 'M'],
  [5, 'Luisa',  'Martínez', '34567890', '04263333333', 'Urb. Las Mercedes', '2000-03-08', 'F'],
];

const PERFILES_SALUD = [
  // cliente_usuario_index, peso_kg, altura_cm, tipo_sangre, color_piel, alergias, antecedentes
  [3, 62.5, 165, 'A+',  'moreno_claro', 'Penicilina',    'Diabetes tipo 2 familiar'],
  [4, 85.0, 175, 'O+',  'blanco',       null,            'Hipertensión arterial'],
  [5, 55.0, 160, 'AB+', 'moreno_medio', 'Polen, Ácaros', null],
];

const POSTS_FORO = [
  // autor_usuario_index, titulo, contenido
  [1, '¡Bienvenidos a HealthHub!',
    'Esta plataforma conecta médicos y pacientes. Comparte tus dudas, síntomas y consejos de salud con toda la comunidad.'],
  [3, '¿Cómo controlar los niveles de glucosa?',
    'Desde que me diagnosticaron pre-diabetes busco formas naturales de mantener la glucosa estable. ¿Algún consejo de la comunidad?'],
  [1, 'Tip del día: Hidratación',
    'Beber 2 litros de agua al día mejora la concentración, la digestión y el estado de ánimo. ¡Pequeños hábitos, grandes cambios!'],
];

const ANALISIS = [
  // cliente_index, medico_index_o_null, fecha_examen, tipo, glucosa, colesterol, trigliceridos, diag_paciente, diag_medico
  [3, 1, '2026-03-10', 'Sangre Completa', 112.5, 195.0, 140.0,
    'Me siento cansada y con visión borrosa después de comer.',
    'Glucosa en rango límite pre-diabético. Se recomienda dieta baja en carbohidratos, ejercicio aeróbico 30 min/día y control mensual.'],
  [4, null, '2026-03-25', 'Perfil Lipídico', 95.0, 242.0, 165.0,
    'Dolor leve en el pecho al hacer esfuerzo.',
    null],
  [5, 1, '2026-04-01', 'Hormonal + Lípidos', 88.0, 178.0, 130.0,
    'Siento fatiga constante y aumento de peso sin cambio de dieta.',
    'Valores dentro de rangos normales. Se solicita perfil tiroideo para descartar hipotiroidismo. Cita de seguimiento en 30 días.'],
  [3, null, '2026-04-05', 'Sangre Completa', 118.0, 201.0, 145.0,
    'Control mensual. Sigo con la dieta indicada.',
    null],
];

const MEDICAMENTOS = [
  ['Ibuprofeno', 'Antiinflamatorio no esteroideo (AINE) utilizado para aliviar el dolor, reducir la fiebre y disminuir la inflamación. Actúa inhibiendo las enzimas COX-1 y COX-2.', 'Tabletas 400 mg y 600 mg', 'Adultos: 400-800 mg cada 6-8 horas. Máximo 3200 mg/día. Tomar con alimentos.', 'Bayer / Pfizer', 'Analgésico/AINE', 'Molestias gastrointestinales, náuseas, úlceras pépticas con uso prolongado, retención de líquidos, riesgo cardiovascular.', 'Úlcera péptica activa, insuficiencia renal grave, último trimestre del embarazo, hipersensibilidad a AINEs.'],
  ['Paracetamol', 'Analgésico y antipirético de uso común. Actúa a nivel central inhibiendo la síntesis de prostaglandinas. No tiene efecto antiinflamatorio significativo.', 'Tabletas 500 mg y 1000 mg; Jarabe 120 mg/5 mL; Supositorios', 'Adultos: 500-1000 mg cada 4-6 horas. Máximo 4 g/día. Niños: 10-15 mg/kg/dosis.', 'Bristol-Myers / Tylenol', 'Analgésico/Antipirético', 'Generalmente bien tolerado. En sobredosis: hepatotoxicidad grave. Raramente: reacciones alérgicas cutáneas.', 'Hepatopatía grave, alcoholismo crónico, hipersensibilidad al paracetamol.'],
  ['Amoxicilina', 'Antibiótico betalactámico de amplio espectro. Inhibe la síntesis de la pared celular bacteriana. Eficaz en infecciones respiratorias, urinarias y de piel.', 'Cápsulas 500 mg; Suspensión oral 250 mg/5 mL', 'Adultos: 500 mg cada 8 horas o 875 mg cada 12 horas. Curso de 7-10 días según infección.', 'GlaxoSmithKline / Amoxil', 'Antibiótico', 'Diarrea, náuseas, erupción cutánea, superinfección por cándida, colitis pseudomembranosa (rara).', 'Alergia a penicilinas o cefalosporinas, mononucleosis infecciosa.'],
  ['Metformina', 'Biguanida hipoglucemiante de primera línea para diabetes tipo 2. Reduce la glucosa hepática y mejora la sensibilidad a la insulina sin causar hipoglucemia.', 'Tabletas 500 mg, 850 mg, 1000 mg (liberación inmediata y prolongada)', 'Inicial: 500 mg con desayuno y cena. Máximo 2550-3000 mg/día.', 'Merck / Glucophage', 'Antidiabético', 'Náuseas, diarrea, vómitos, sabor metálico. Rara: acidosis láctica (en insuficiencia renal).', 'Insuficiencia renal (TFG < 30 mL/min), insuficiencia hepática, alcoholismo, insuficiencia cardíaca descompensada.'],
  ['Enalapril', 'Inhibidor de la enzima convertidora de angiotensina (IECA). Reduce la presión arterial y protege la función renal en diabéticos e hipertensos.', 'Tabletas 5 mg, 10 mg, 20 mg', 'Inicial: 5 mg/día. Mantenimiento: 10-40 mg/día en 1 o 2 dosis.', 'Merck / Vasotec', 'Antihipertensivo/IECA', 'Tos seca persistente (muy común), hipotensión de primera dosis, hiperpotasemia, angioedema (raro pero grave).', 'Embarazo (teratógeno), antecedente de angioedema por IECA, estenosis arterial renal bilateral.'],
  ['Atorvastatina', 'Estatina inhibidora de la HMG-CoA reductasa. Reduce el colesterol LDL y triglicéridos; eleva el HDL. Previene eventos cardiovasculares.', 'Tabletas 10 mg, 20 mg, 40 mg, 80 mg', 'Inicial: 10-20 mg una vez al día (noche). Rango: 10-80 mg/día.', 'Pfizer / Lipitor', 'Hipolipemiante', 'Mialgia, miopatía, elevación de transaminasas, raramente rabdomiólisis. Cefalea, trastornos gastrointestinales.', 'Hepatopatía activa, embarazo y lactancia, hipersensibilidad. Precaución con interacciones medicamentosas.'],
  ['Losartán', 'Antagonista del receptor de angiotensina II (ARA-II). Antihipertensivo que no causa tos. Protección cardiovascular y renal.', 'Tabletas 25 mg, 50 mg, 100 mg', 'Inicial: 50 mg una vez al día. Rango: 25-100 mg/día.', 'Merck / Cozaar', 'Antihipertensivo/ARA-II', 'Hiperpotasemia, hipotensión, mareo, deterioro de función renal. Menos tos que IECAs.', 'Embarazo (teratógeno), hiperpotasemia severa.'],
  ['Omeprazol', 'Inhibidor de la bomba de protones (IBP). Bloquea la secreción ácida gástrica. Tratamiento de úlceras, ERGE y gastroprotección en usuarios de AINEs.', 'Cápsulas 20 mg, 40 mg; Vial IV 40 mg', 'ERGE: 20 mg/día. Úlcera péptica: 20-40 mg/día. Erradicación H. pylori: 20 mg 2 veces/día.', 'AstraZeneca / Prilosec', 'Antiulceroso/IBP', 'Cefalea, diarrea, estreñimiento, náuseas. Uso prolongado: hipomagnesemia, hipocalcemia, fractura ósea.', 'Hipersensibilidad a IBPs, uso con nelfinavir. Precaución en hepatopatía severa.'],
  ['Amlodipino', 'Bloqueante de los canales de calcio dihidropiridínico. Antihipertensivo y antianginoso de acción prolongada. Bien tolerado en la mayoría de pacientes.', 'Tabletas 5 mg, 10 mg', 'Hipertensión/angina: inicial 5 mg/día. Máximo 10 mg/día. Toma única diaria.', 'Pfizer / Norvasc', 'Antihipertensivo/BCC', 'Edema periférico (tobillo), rubefacción, palpitaciones, cefalea, mareo. Raramente: hiperplasia gingival.', 'Hipersensibilidad a dihidropiridinas, shock cardiogénico, angina inestable severa.'],
  ['Metoprolol', 'Betabloqueante cardioselectivo B1. Reduce la frecuencia cardíaca y la presión arterial. Indicado en hipertensión, angina, post-infarto e insuficiencia cardíaca.', 'Tabletas 50 mg, 100 mg (liberación inmediata y prolongada)', 'Hipertensión: 50-200 mg/día en 1-2 dosis. IC: inicio 12.5-25 mg/día, incremento gradual.', 'AstraZeneca / Lopressor', 'Betabloqueante', 'Bradicardia, fatiga, frío en extremidades, broncoespasmo leve, disfunción eréctil, depresión.', 'Asma grave o EPOC, bradicardia sinusal, bloqueo AV 2-3 grado, shock cardiogénico.'],
  ['Azitromicina', 'Antibiótico macrólido de amplio espectro. Inhibe la síntesis proteica bacteriana. Tratamiento de infecciones respiratorias, ITS y de piel.', 'Cápsulas 250 mg, 500 mg; Suspensión 200 mg/5 mL', 'Adultos: 500 mg día 1, luego 250 mg días 2-5. ITS: 1 g dosis única.', 'Pfizer / Zithromax', 'Antibiótico', 'Náuseas, diarrea, dolor abdominal. Raramente: prolongación QT, hepatotoxicidad, reacciones alérgicas.', 'Hipersensibilidad a macrólidos, hepatopatía severa, arritmias cardíacas.'],
  ['Loratadina', 'Antihistamínico de segunda generación. Antagonista selectivo del receptor H1 periférico. No cruza la barrera hematoencefálica significativamente (no sedante).', 'Tabletas 10 mg; Jarabe 5 mg/5 mL', 'Adultos y niños >12 años: 10 mg una vez al día. Niños 2-12 años: 5 mg/día.', 'Schering-Plough / Claritin', 'Antihistamínico', 'Cefalea, somnolencia leve, sequedad de boca, taquicardia (rara).', 'Hipersensibilidad a loratadina. Precaución en insuficiencia hepática severa.'],
  ['Diazepam', 'Benzodiacepina de acción prolongada. Ansiolítico, sedante, anticonvulsivante y relajante muscular. Potencia la acción del GABA en el SNC.', 'Tabletas 2 mg, 5 mg, 10 mg; Solución IV 5 mg/mL', 'Ansiedad: 2-10 mg 2-4 veces/día. Convulsiones: 5-10 mg IV/IM. Máximo 30 mg/episodio.', 'Roche / Valium', 'Ansiolítico', 'Sedación, somnolencia, ataxia, confusión, dependencia física y psicológica, depresión respiratoria en sobredosis.', 'Miastenia gravis, insuficiencia respiratoria severa, apnea del sueño, embarazo 1er trimestre.'],
  ['Insulina Glargina', 'Insulina análoga de acción prolongada (24 horas). Sin pico pronunciado. Control glucémico basal en diabetes tipo 1 y 2. Administración subcutánea.', 'Solución inyectable 100 UI/mL (pluma precargada)', 'Individualizar dosis. Inicial en DM2: 10 UI/día SC a la misma hora. Ajustar según glucemia basal.', 'Sanofi / Lantus', 'Insulina', 'Hipoglucemia (principal riesgo), reacciones en sitio de inyección, lipodistrofia, aumento de peso.', 'Hipoglucemia activa. No mezclar con otras insulinas. Ajuste en insuficiencia renal o hepática.'],
  ['Prednisona', 'Corticosteroide oral de acción intermedia. Potente antiinflamatorio e inmunosupresor. Usado en enfermedades autoinmunes, alérgicas e inflamatorias.', 'Tabletas 5 mg, 20 mg, 50 mg', 'Dosis variable: 5-60 mg/día según indicación. Reducir gradualmente al suspender.', 'Pfizer / Deltasone', 'Corticosteroide', 'Hiperglucemia, hipertensión, osteoporosis, aumento de peso, síndrome de Cushing, úlcera péptica.', 'Infecciones sistémicas no controladas, tuberculosis activa, herpes simplex ocular.'],
  ['Ciprofloxacino', 'Antibiótico fluoroquinolona de amplio espectro. Inhibe la ADN girasa bacteriana. Eficaz en infecciones urinarias, gastrointestinales y respiratorias.', 'Tabletas 250 mg, 500 mg, 750 mg; Solución IV 2 mg/mL', 'ITU no complicada: 250-500 mg cada 12 horas por 3-7 días. Otras: 500-750 mg cada 12 horas.', 'Bayer / Cipro', 'Antibiótico', 'Náuseas, diarrea, cefalea. Raramente: tendinitis, prolongación QT, convulsiones, fotosensibilidad.', 'Menores de 18 años (excepto especial), embarazo, epilepsia no controlada. No tomar con antiácidos.'],
  ['Warfarina', 'Anticoagulante oral antagonista de la vitamina K. Previene trombos. Requiere monitorización del INR. Numerosas interacciones con alimentos y medicamentos.', 'Tabletas 1 mg, 2 mg, 2.5 mg, 5 mg', 'Dosis ajustada según INR (objetivo 2-3). Toma única diaria a la misma hora. Inicio 2-5 mg/día.', 'Bristol-Myers / Coumadin', 'Anticoagulante', 'Hemorragia (principal riesgo), necrosis cutánea, alopecia. Requiere monitorización periódica del INR.', 'Embarazo, hemorragia activa, HTA severa no controlada, cirugía reciente del SNC.'],
  ['Salbutamol', 'Agonista B2-adrenérgico de acción corta (SABA). Broncodilatador de rescate en asma y EPOC. Relaja el músculo liso bronquial en minutos.', 'Inhalador 100 mcg/dosis; Nebulización 5 mg/mL; Tabletas 2 mg, 4 mg', 'Crisis aguda: 2-4 pulsaciones cada 20 min por 3 dosis. Mantenimiento: 2 pulsaciones cada 4-6 horas.', 'GlaxoSmithKline / Ventolin', 'Broncodilatador', 'Temblor fino, taquicardia, cefalea, palpitaciones, hipopotasemia (dosis altas), nerviosismo.', 'Hipersensibilidad a salbutamol. Precaución en cardiopatía isquémica, hipertiroidismo.'],
  ['Levotiroxina', 'Hormona tiroidea sintética (T4). Tratamiento del hipotiroidismo y bocio. Reemplaza la hormona tiroidea endógena. Administración matinal en ayunas.', 'Tabletas 25 mcg, 50 mcg, 75 mcg, 100 mcg, 150 mcg', 'Individualizar. Inicio: 25-50 mcg/día. Incremento gradual cada 4-6 semanas. Controlar TSH.', 'Abbott / Synthroid', 'Hormona Tiroidea', 'Síntomas de hipertiroidismo si sobredosificación: taquicardia, insomnio, pérdida de peso, temblor.', 'Tirotoxicosis no tratada, infarto reciente, insuficiencia suprarrenal no tratada.'],
  ['Clopidogrel', 'Antiagregante plaquetario inhibidor del receptor P2Y12 del ADP. Previene trombosis arterial. Usado en síndrome coronario agudo, angioplastia e ictus isquémico.', 'Tabletas 75 mg, 300 mg', 'Profilaxis: 75 mg una vez al día. Dosis de carga SCA/stent: 300-600 mg. Combinado con aspirina.', 'Sanofi / Plavix', 'Antiagregante', 'Sangrado (principal riesgo), equimosis, hematomas, dispepsia, diarrea, raramente PTT.', 'Hemorragia activa, hipersensibilidad. Precaución en riesgo hemorrágico. Interacción con omeprazol.'],
];

// ── Lógica de inserción ───────────────────────────────────────────────────────

async function seed() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('✅ Conectado a la base de datos:', process.env.DB_NAME);

  // Mapa: usuario_index → id real en BD
  const userIds = {};

  // ── Usuarios ────────────────────────────────────────────────────────────────
  console.log('\n📝 Insertando usuarios...');
  for (let i = 0; i < USUARIOS.length; i++) {
    const [username, email, password, rol] = USUARIOS[i];
    const hash = await bcrypt.hash(password, 10);
    try {
      const [r] = await conn.execute(
        'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)',
        [username, email, hash, rol]
      );
      userIds[i] = r.insertId;
      console.log(`   [${rol}] ${username} → id ${r.insertId}`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        const [[row]] = await conn.execute('SELECT id FROM usuarios WHERE username = ?', [username]);
        userIds[i] = row.id;
        console.log(`   ⚠️  ${username} ya existe → id ${row.id}`);
      } else { throw e; }
    }
  }

  // ── Médicos ─────────────────────────────────────────────────────────────────
  console.log('\n🩺 Insertando médicos...');
  for (const [ui, especialidad, cedula, telefono] of MEDICOS) {
    try {
      await conn.execute(
        'INSERT INTO medicos (usuario_id, especialidad, cedula, telefono) VALUES (?, ?, ?, ?)',
        [userIds[ui], especialidad, cedula, telefono]
      );
      console.log(`   Dr. ${USUARIOS[ui][0]} (${especialidad})`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') console.log(`   ⚠️  Médico ${USUARIOS[ui][0]} ya existe`);
      else throw e;
    }
  }

  // ── Clientes ────────────────────────────────────────────────────────────────
  console.log('\n👤 Insertando clientes...');
  for (const [ui, nombre, apellido, cedula, telefono, direccion, fecha_nac, genero] of CLIENTES) {
    try {
      await conn.execute(
        `INSERT INTO clientes (usuario_id, nombre, apellido, cedula, telefono, direccion, fecha_nacimiento, genero)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userIds[ui], nombre, apellido, cedula, telefono, direccion, fecha_nac, genero]
      );
      console.log(`   ${nombre} ${apellido}`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') console.log(`   ⚠️  Cliente ${nombre} ya existe`);
      else throw e;
    }
  }

  // ── Perfiles de salud ────────────────────────────────────────────────────────
  console.log('\n💊 Insertando perfiles de salud...');
  for (const [ui, peso, altura, sangre, piel, alergias, antecedentes] of PERFILES_SALUD) {
    try {
      await conn.execute(
        `INSERT INTO perfiles_salud (cliente_id, peso_kg, altura_cm, tipo_sangre, color_piel, alergias, antecedentes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userIds[ui], peso, altura, sangre, piel, alergias, antecedentes]
      );
      console.log(`   Perfil de ${USUARIOS[ui][0]}: ${peso}kg, ${altura}cm, ${sangre}`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') console.log(`   ⚠️  Perfil de ${USUARIOS[ui][0]} ya existe`);
      else throw e;
    }
  }

  // ── Posts del foro ────────────────────────────────────────────────────────────
  console.log('\n📰 Insertando posts del foro...');
  for (const [ui, titulo, contenido] of POSTS_FORO) {
    const [r] = await conn.execute(
      'INSERT INTO foros (autor_id, titulo, contenido) VALUES (?, ?, ?)',
      [userIds[ui], titulo, contenido]
    );
    console.log(`   Post #${r.insertId}: "${titulo.substring(0, 40)}..."`);
  }

  // ── Análisis médicos ──────────────────────────────────────────────────────────
  console.log('\n🔬 Insertando análisis médicos...');
  for (const [cui, mui, fecha, tipo, glucosa, colesterol, trigliceridos, diag_pac, diag_med] of ANALISIS) {
    const medicoId = mui !== null ? userIds[MEDICOS[mui][0]] : null;
    const fechaDiag = diag_med ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
    const [r] = await conn.execute(
      `INSERT INTO analisis_medicos
         (cliente_id, medico_id, fecha_examen, tipo_examen,
          resultados_glucosa, resultados_colesterol, resultados_trigliceridos,
          diagnostico_paciente, diagnostico_medico, fecha_diagnostico)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userIds[cui], medicoId, fecha, tipo,
       glucosa, colesterol, trigliceridos,
       diag_pac, diag_med, fechaDiag]
    );
    const estado = diag_med ? '✓ Diagnosticado' : '⏳ Pendiente';
    console.log(`   Análisis #${r.insertId}: ${USUARIOS[cui][0]} — ${tipo} ${estado}`);
  }

  // ── Medicamentos ──────────────────────────────────────────────────────────────
  console.log('\n💊 Insertando medicamentos...');
  for (const [nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos, contraindicaciones] of MEDICAMENTOS) {
    try {
      const [r] = await conn.execute(
        `INSERT INTO medicamentos (nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos, contraindicaciones]
      );
      console.log(`   ${nombre} (${laboratorio})`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') console.log(`   ⚠️  ${nombre} ya existe`);
      else throw e;
    }
  }

  await conn.end();

  console.log('\n🎉 Seed completado exitosamente.\n');
  console.log('Credenciales de acceso:');
  console.log('  Admin        → admin / Admin123!');
  console.log('  Médico 1     → dr_garcia / Medico123!');
  console.log('  Médico 2     → dr_lopez / Medico123!');
  console.log('  Paciente 1   → paciente1 / Paciente1!');
  console.log('  Paciente 2   → paciente2 / Paciente2!');
  console.log('  Paciente 3   → paciente3 / Paciente3!');
}

seed().catch(err => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});
