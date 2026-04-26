import { useState, useEffect } from 'react';
import Modal from './Modal';

// Importación de subcomponentes
import SeccionDatosGenerales from './SeccionDatosGenerales';
import SeccionProfesorado from './SeccionProfesorado';
import SeccionOtrosDatos from './SeccionOtrosDatos';
import SubidaPdfIa from './SubidaPdfIa';
import SeccionCronograma from './SeccionCronograma';
import SeccionCompetencias from './SeccionCompetencias';
import SeccionActividadesEvaluacion from './SeccionActividadesEvaluacion';
import SeccionListasSimples from './SeccionListasSimples';
import SeccionBibliografia from './SeccionBibliografia';
import SeccionTemario from './SeccionTemario'; 

/**
 * COMPONENTE ORQUESTADOR: Formulario Principal de la Guía Docente.
 * Implementa el patrón "Single Source of Truth" (Única Fuente de Verdad). 
 * Centraliza todo el estado de la aplicación y lo distribuye a los componentes hijos.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.guiaEnEdicion - Si es nulo, creamos guía nueva. Si tiene datos, modo Edición.
 * @param {function} props.limpiarEdicion - Callback para salir del modo edición.
 */
export default function FormularioGuia({ guiaEnEdicion, limpiarEdicion }) {
    
    // --- 1. ESTADO GLOBAL (Single Source of Truth) ---
    const [idEdicion, setIdEdicion] = useState(null);
    const [mostrarIA, setMostrarIA] = useState(false);
    const [estadoEnvio, setEstadoEnvio] = useState('');
    const [nombreDocumento, setNombreDocumento] = useState('');

    const [datosGenerales, setDatosGenerales] = useState({
        nombreAsignatura: '', codigoAsignatura: '', creditos: '', titulacion: '',
        curso: '', cursoImplantacion: '', anioPlanEstudios: '', semestre: '', periodo: '',
        caracter: '', idioma: '', modalidad: '', modulo: '', rama: '', area: '', departamento: '',
        centro: ''
    });

    const [profesores, setProfesores] = useState([{
        Nombre: '', Email: '', Despacho: '', Telefono: '', HorarioTutorias: '',
        UrlWeb: '', Grupo: '', esCoordinador: false
    }]);

    const [competencias, setCompetencias] = useState([{ tipo: 'General', codigo: '', descripcion: '' }]);
    const [actividadesEvaluacion, setActividadesEvaluacion] = useState([{ nombre: '', descripcion: '', competencias: '', tipo: 'Progresiva', peso: '', notaMinima: '' }]);
    
    // ACTUALIZACIÓN JERÁRQUICA: Ahora son objetos, no strings planos.
    const [conocimientos, setConocimientos] = useState([{ texto: '', nivel: 0 }]);
    const [objetivos, setObjetivos] = useState([{ texto: '', nivel: 0 }]);
    
    const [contenidos, setContenidos] = useState([{ tema: '', nivel: 0 }]);
    const [bibliografia, setBibliografia] = useState([{ tipo: 'Libro', referencia: '' }]);

    const [cronograma, setCronograma] = useState(
        Array.from({ length: 17 }, (_, i) => ({ 
            semana: `${i + 1}`, 
            // NUEVO: Añadido el campo clasificacion por defecto
            actividades: [{ clasificacion: 'Tipo 1', tipo: 'Lección Magistral', descripcion: '', horas: '' }] 
        }))
    );

    const [otrosDatos, setOtrosDatos] = useState({
        metodologia: '', evaluacion: '', normasRealizacionPruebas: '', ausenciaMaxima: '', otraInformacion: ''
    });

    // --- 2. EFECTO DE CARGA (MODO EDICIÓN) ---
    useEffect(() => {
        if (guiaEnEdicion) {
            setIdEdicion(guiaEnEdicion.id);
            setNombreDocumento(guiaEnEdicion.nombreDocumento || guiaEnEdicion["Nombre del documento"] || '');

            // Normalización defensiva de Datos Generales
            const dg = guiaEnEdicion.datosGenerales || {};
            setDatosGenerales({
                nombreAsignatura: dg.nombreAsignatura || dg["Nombre asignatura"] || '',
                codigoAsignatura: dg.codigoAsignatura || dg["Código asignatura"] || '',
                creditos: dg.creditos || dg["No créditos"] || '',
                titulacion: dg.titulacion || dg["Titulación"] || '',
                curso: dg.curso || dg["Curso"] || '',
                cursoImplantacion: dg.cursoImplantacion || dg["Curso implantación"] || '',
                anioPlanEstudios: dg.anioPlanEstudios || dg["Año plan de estudios"] || '',
                semestre: dg.semestre || dg["Semestre"] || '',
                periodo: dg.periodo || dg["Período de impartición"] || '',
                caracter: dg.caracter || dg["Carácter"] || '',
                idioma: dg.idioma || dg["Idioma"] || '',
                modalidad: dg.modalidad || dg["Modalidad"] || '',
                modulo: dg.modulo || dg["Módulo"] || '',
                rama: dg.rama || dg["Rama de conocimiento"] || '',
                area: dg.area || dg["Área"] || '',
                departamento: dg.departamento || dg["Departamento"] || '',
                centro: dg.centro || dg["Centro"] || ''
            });

            // Normalización de Profesorado
            const profs = guiaEnEdicion.profesorado || [];
            if (profs.length > 0) {
                setProfesores(profs.map(p => ({
                    Nombre: p.Nombre || p.nombre || '', Email: p.Email || p.email || '',
                    Telefono: p.Telefono || p.telefono || '', Despacho: p.Despacho || p.despacho || '',
                    HorarioTutorias: p.HorarioTutorias || p.horarioTutorias || p["Horario tutorías"] || '',
                    UrlWeb: p.UrlWeb || p.urlWeb || p["URL web"] || '', Grupo: p.Grupo || p.grupo || '',
                    esCoordinador: p.esCoordinador !== undefined ? p.esCoordinador : (p["Es coordinador"] || false)
                })));
            } else {
                setProfesores([{ Nombre: '', Email: '', Despacho: '', Telefono: '', HorarioTutorias: '', UrlWeb: '', Grupo: '', esCoordinador: false }]);
            }

            // Normalización de Otros Datos
            const od = guiaEnEdicion.otrosDatos || {};

            setOtrosDatos({
                metodologia: od.metodologia || od["Metodología"] || '',
                evaluacion: od.evaluacion || od["Evaluación"] || '',
                normasRealizacionPruebas: od.normasRealizacionPruebas || od["Normas realización pruebas"] || '',
                ausenciaMaxima: od.ausenciaMaxima || od["Ausencia máxima"] || '',
                otraInformacion: od.otraInformacion || od["Otra información"] || ''
            });

            // Normalización Jerárquica: Conocimientos
            const conocs = od["Conocimientos previos recomendados"] || od.conocimientosPrevios;
            if (conocs && conocs.length > 0) {
                setConocimientos(conocs.map(c => {
                    if (typeof c === 'string') return { texto: c, nivel: 0 };
                    return { texto: c.texto || c["Texto"] || '', nivel: c.nivel !== undefined ? c.nivel : (c["Nivel"] || 0) };
                }));
            } else {
                setConocimientos([{ texto: '', nivel: 0 }]);
            }

            // Normalización Jerárquica: Objetivos
            const objs = od["Objetivos"] || od.objetivos;
            if (objs && objs.length > 0) {
                setObjetivos(objs.map(o => {
                    if (typeof o === 'string') return { texto: o, nivel: 0 };
                    return { texto: o.texto || o["Texto"] || '', nivel: o.nivel !== undefined ? o.nivel : (o["Nivel"] || 0) };
                }));
            } else {
                setObjetivos([{ texto: '', nivel: 0 }]);
            }
            
            const conts = od["Contenidos"] || od.contenidos;
            if (conts && conts.length > 0) {
                setContenidos(conts.map(c => {
                    if (typeof c === 'string') return { tema: c, nivel: 0 };
                    return { tema: c["Tema"] || c.tema || '', nivel: c["Nivel"] !== undefined ? c["Nivel"] : (c.nivel || 0) };
                }));
            } else {
                setContenidos([{ tema: '', nivel: 0 }]);
            }

            const bibs = od["Bibliografía"] || od.bibliografia;
            if (bibs && bibs.length > 0) {
                setBibliografia(bibs.map(b => ({ tipo: b["Tipo"] || b.tipo || 'Libro', referencia: b["Referencia"] || b.referencia || '' })));
            } else {
                setBibliografia([{ tipo: 'Libro', referencia: '' }]);
            }

            const comps = od["Competencias"] || od.competencias;
            if (comps && comps.length > 0) {
                setCompetencias(comps.map(c => ({ tipo: c["Tipo"] || c.tipo || 'General', codigo: c["Código"] || c.codigo || '', descripcion: c["Descripción"] || c.descripcion || '' })));
            }

            const acts = od["Actividades de evaluación"] || od.actividadesEvaluacion;
            if (acts && acts.length > 0) {
                setActividadesEvaluacion(acts.map(a => ({ 
                    nombre: a["Nombre"] || a.nombre || '', 
                    descripcion: a["Descripción"] || a.descripcion || '',
                    competencias: a["Competencias"] || a.competencias || '', 
                    tipo: a["Tipo"] || a.tipo || 'Progresiva',
                    peso: a["Peso"] || a.peso || '',
                    notaMinima: a["Nota mínima"] || a.notaMinima || ''
                })));
            } else {
                setActividadesEvaluacion([{ nombre: '', descripcion: '', competencias: '', tipo: 'Progresiva', peso: '', notaMinima: '' }]);
            }

            const crono = od["Cronograma"] || od.cronograma;
            if (crono && crono.length > 0) {
                setCronograma(crono.map(c => {
                    const actsRaw = c["Actividades"] || c.actividades;
                    const actividadesMapeadas = Array.isArray(actsRaw) ? actsRaw.map(act => ({
                        // NUEVO: Recuperamos la clasificación de la BD o ponemos Tipo 1 por defecto
                        clasificacion: act["Clasificación"] || act.clasificacion || 'Tipo 1',
                        tipo: act["Tipo"] || act.tipo || 'Lección Magistral',
                        descripcion: act["Descripción"] || act.descripcion || '',
                        horas: act["Horas"] || act.horas || ''
                    })) : [{ clasificacion: 'Tipo 1', tipo: 'Lección Magistral', descripcion: '', horas: '' }];

                    return {
                        semana: c["Semana"] || c.semana || '',
                        actividades: actividadesMapeadas
                    };
                }));
            }
        }
    }, [guiaEnEdicion]);

    // --- 3. RELLENADO DE DATOS DESDE IA ---
    const rellenarConIa = (datosIa) => {
        if (datosIa["Datos Generales"]) {
            const dg = datosIa["Datos Generales"];
            setDatosGenerales({
                nombreAsignatura: dg["Nombre asignatura"] || '', codigoAsignatura: dg["Código asignatura"] || '',
                creditos: dg["No créditos"] || '', titulacion: dg["Titulación"] || '', curso: dg["Curso"] || '',
                cursoImplantacion: dg["Curso implantación"] || '', anioPlanEstudios: dg["Año plan de estudios"] || '',
                semestre: dg["Semestre"] || '', periodo: dg["Período de impartición"] || '', caracter: dg["Carácter"] || '',
                idioma: dg["Idioma"] || '', modalidad: dg["Modalidad"] || '', modulo: dg["Módulo"] || '',
                rama: dg["Rama de conocimiento"] || '', area: dg["Área"] || '', departamento: dg["Departamento"] || '',
                centro: dg["Centro"] || ''
            });
        }

        if (datosIa["Profesorado"] && datosIa["Profesorado"].length > 0) {
            setProfesores(datosIa["Profesorado"].map(p => ({
                Nombre: p["Nombre"] || '', Email: p["Email"] || '', Telefono: p["Telefono"] || '',
                Despacho: p["Despacho"] || '', HorarioTutorias: p["Horario tutorías"] || '', UrlWeb: p["URL web"] || '',
                Grupo: p["Grupo"] || '', esCoordinador: p["Es coordinador"] || false
            })));
        }

        if (datosIa["Otros Datos"]) {
            const od = datosIa["Otros Datos"];

            setOtrosDatos({
                metodologia: od["Metodología"] || '', evaluacion: od["Evaluación"] || '',
                normasRealizacionPruebas: od["Normas realización pruebas"] || '',
                ausenciaMaxima: od["Ausencia máxima"] || '', otraInformacion: od["Otra información"] || ''
            });

            // Mapeos Jerárquicos de IA
            if (Array.isArray(od["Conocimientos previos recomendados"])) {
                setConocimientos(od["Conocimientos previos recomendados"].map(c => ({ texto: c["Texto"] || c || '', nivel: c["Nivel"] || 0 })));
            }
            if (Array.isArray(od["Objetivos"])) {
                setObjetivos(od["Objetivos"].map(o => ({ texto: o["Texto"] || o || '', nivel: o["Nivel"] || 0 })));
            }
            
            if (Array.isArray(od["Contenidos"])) {
                setContenidos(od["Contenidos"].map(c => ({ tema: c["Tema"] || '', nivel: c["Nivel"] || 0 })));
            }

            if (Array.isArray(od["Bibliografía"])) setBibliografia(od["Bibliografía"].map(b => ({ tipo: b["Tipo"] || 'Libro', referencia: b["Referencia"] || '' })));
            if (Array.isArray(od["Competencias"])) setCompetencias(od["Competencias"].map(c => ({ tipo: c["Tipo"] || 'General', codigo: c["Código"] || '', descripcion: c["Descripción"] || '' })));
            if (Array.isArray(od["Actividades de evaluación"])) {
                setActividadesEvaluacion(od["Actividades de evaluación"].map(a => ({ 
                    nombre: a["Nombre"] || '', descripcion: a["Descripción"] || '', competencias: a["Competencias"] || '', tipo: a["Tipo"] || 'Progresiva', peso: a["Peso"] || '', notaMinima: a["Nota mínima"] || '' 
                })));
            }
            if (Array.isArray(od["Cronograma"])) {
                setCronograma(od["Cronograma"].map(c => ({ 
                    semana: c["Semana"] || '', 
                    actividades: Array.isArray(c["Actividades"]) ? c["Actividades"].map(act => ({ 
                        // NUEVO: La IA también rellenará la clasificación
                        clasificacion: act["Clasificación"] || 'Tipo 1',
                        tipo: act["Tipo"] || 'Lección Magistral', 
                        descripcion: act["Descripción"] || '', 
                        horas: act["Horas"] || '' 
                    })) : [] 
                })));
            }
        }
    };

    // --- 4. HANDLERS (Elevación de estado) ---
    const handleChangeGenerales = (e) => setDatosGenerales({ ...datosGenerales, [e.target.name]: e.target.value });
    const handleChangeOtrosDatos = (e) => setOtrosDatos({ ...otrosDatos, [e.target.name]: e.target.value });

    const handleProfesorChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const nuevosProfesores = [...profesores];
        nuevosProfesores[index][name] = type === 'checkbox' ? checked : value;
        setProfesores(nuevosProfesores);
    };
    const agregarProfesor = () => setProfesores([...profesores, { Nombre: '', Email: '', Telefono: '', Despacho: '', HorarioTutorias: '', UrlWeb: '', Grupo: '', esCoordinador: false }]);
    const eliminarProfesor = (index) => setProfesores(profesores.filter((_, i) => i !== index));

    // NUEVO HANDLER JERÁRQUICO
    const handleListaChange = (setter, lista, index, campo, valor) => {
        const nueva = [...lista];
        nueva[index] = { ...nueva[index], [campo]: valor };
        setter(nueva);
    };
    const eliminarLista = (setter, lista, index) => setter(lista.filter((_, i) => i !== index));

    const handleTemarioChange = (index, campo, valor) => {
        const nuevos = [...contenidos];
        nuevos[index][campo] = valor;
        setContenidos(nuevos);
    };

    const handleBiblioChange = (index, campo, valor) => {
        const nueva = [...bibliografia];
        nueva[index][campo] = valor;
        setBibliografia(nueva);
    };
    const agregarBiblio = () => setBibliografia([...bibliografia, { tipo: 'Libro', referencia: '' }]);
    const eliminarBiblio = (index) => setBibliografia(bibliografia.filter((_, i) => i !== index));

    const handleActividadChange = (index, event) => {
        const { name, value } = event.target;
        const nuevas = [...actividadesEvaluacion];
        nuevas[index][name] = value;
        setActividadesEvaluacion(nuevas);
    };
    const agregarActividad = () => setActividadesEvaluacion([...actividadesEvaluacion, { nombre: '', descripcion: '', competencias: '', tipo: 'Progresiva', peso: '', notaMinima: '' }]);
    const eliminarActividad = (index) => setActividadesEvaluacion(actividadesEvaluacion.filter((_, i) => i !== index));

    const handleCompetenciaChange = (index, event) => {
        const { name, value } = event.target;
        const nuevas = [...competencias];
        nuevas[index][name] = value;
        setCompetencias(nuevas);
    };
    const agregarCompetencia = () => setCompetencias([...competencias, { tipo: 'General', codigo: '', descripcion: '' }]);
    const eliminarCompetencia = (index) => setCompetencias(competencias.filter((_, i) => i !== index));

    const handleSemanaChange = (indexSemana, event) => {
        const { value } = event.target;
        const nuevoCrono = [...cronograma];
        nuevoCrono[indexSemana].semana = value;
        setCronograma(nuevoCrono);
    };
    const handleActividadCronoChange = (indexSemana, indexActividad, event) => {
        const { name, value } = event.target;
        const nuevoCrono = [...cronograma];
        nuevoCrono[indexSemana].actividades[indexActividad][name] = value;
        setCronograma(nuevoCrono);
    };
    const agregarSemanaCronograma = () => setCronograma([...cronograma, { semana: `${cronograma.length + 1}`, actividades: [] }]);
    const eliminarSemanaCronograma = (indexSemana) => setCronograma(cronograma.filter((_, i) => i !== indexSemana));
    const agregarActividadCrono = (indexSemana) => {
        const nuevoCrono = [...cronograma];
        // NUEVO: La actividad creada por defecto lleva su clasificación
        nuevoCrono[indexSemana].actividades.push({ clasificacion: 'Tipo 1', tipo: 'Lección Magistral', descripcion: '', horas: '' });
        setCronograma(nuevoCrono);
    };
    const eliminarActividadCrono = (indexSemana, indexActividad) => {
        const nuevoCrono = [...cronograma];
        nuevoCrono[indexSemana].actividades = nuevoCrono[indexSemana].actividades.filter((_, i) => i !== indexActividad);
        setCronograma(nuevoCrono);
    };

    // --- 5. ENVÍO AL BACKEND (Submit y Data Sanitization) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoEnvio('Enviando...');

        const payload = {
            "Nombre del documento": nombreDocumento,
            "Datos Generales": {
                "Nombre asignatura": datosGenerales.nombreAsignatura, "Código asignatura": datosGenerales.codigoAsignatura,
                "No créditos": datosGenerales.creditos, "Titulación": datosGenerales.titulacion, "Curso": datosGenerales.curso,
                "Curso implantación": datosGenerales.cursoImplantacion, "Año plan de estudios": datosGenerales.anioPlanEstudios,
                "Semestre": datosGenerales.semestre, "Período de impartición": datosGenerales.periodo, "Carácter": datosGenerales.caracter,
                "Idioma": datosGenerales.idioma, "Modalidad": datosGenerales.modalidad, "Módulo": datosGenerales.modulo,
                "Rama de conocimiento": datosGenerales.rama, "Área": datosGenerales.area, "Departamento": datosGenerales.departamento,
                "Centro": datosGenerales.centro,
            },
            "Profesorado": profesores.filter(p => p.Nombre.trim() !== '').map(p => ({
                "Nombre": p.Nombre, "Email": p.Email, "Telefono": p.Telefono, "Despacho": p.Despacho,
                "Horario tutorías": p.HorarioTutorias, "URL web": p.UrlWeb, "Grupo": p.Grupo, "Es coordinador": p.esCoordinador
            })),
            "Otros Datos": {
                // Sanitización de objetos jerárquicos
                "Conocimientos previos recomendados": conocimientos.filter(item => item.texto && item.texto.trim() !== '').map(item => ({ "Texto": item.texto, "Nivel": item.nivel })),
                "Objetivos": objetivos.filter(item => item.texto && item.texto.trim() !== '').map(item => ({ "Texto": item.texto, "Nivel": item.nivel })),
                "Contenidos": contenidos.filter(t => t.tema.trim() !== '').map(t => ({ "Tema": t.tema, "Nivel": t.nivel })),
                "Metodología": otrosDatos.metodologia,
                "Evaluación": otrosDatos.evaluacion,
                "Normas realización pruebas": otrosDatos.normasRealizacionPruebas,
                "Ausencia máxima": otrosDatos.ausenciaMaxima,
                "Otra información": otrosDatos.otraInformacion,
                "Bibliografía": bibliografia.filter(b => b.referencia.trim() !== '').map(b => ({ "Tipo": b.tipo, "Referencia": b.referencia })),
                "Competencias": competencias.filter(c => c.descripcion.trim() !== '' || c.codigo.trim() !== '').map(c => ({ "Tipo": c.tipo, "Código": c.codigo, "Descripción": c.descripcion })),
                "Actividades de evaluación": actividadesEvaluacion.filter(a => a.nombre.trim() !== '').map(a => ({ 
                    "Nombre": a.nombre, "Descripción": a.descripcion, "Competencias": a.competencias, "Tipo": a.tipo, "Peso": a.peso, "Nota mínima": a.notaMinima 
                })),
                "Cronograma": cronograma.filter(c => c.semana.trim() !== '').map(c => ({ 
                    "Semana": c.semana, 
                    "Actividades": c.actividades.filter(act => act.descripcion.trim() !== '').map(act => ({
                        "Clasificación": act.clasificacion, "Tipo": act.tipo, "Descripción": act.descripcion, "Horas": act.horas // NUEVO
                    }))
                }))
            }
        };

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const url = idEdicion ? `${baseUrl}/api/guias/editar/${idEdicion}` : `${baseUrl}/api/guias/crear`;
        const method = idEdicion ? 'PUT' : 'POST';

        // RECUPERAMOS EL TOKEN Y LO INYECTAMOS
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(url, { 
                method: method, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }, 
                body: JSON.stringify(payload) 
            });
            
            if (response.ok) {
                setEstadoEnvio(idEdicion ? '✅ ¡Guía actualizada con éxito!' : '✅ ¡Guía guardada con éxito!');
                setTimeout(() => {
                    if (limpiarEdicion) limpiarEdicion();
                }, 1500);
            } else {
                setEstadoEnvio('❌ Error al guardar la guía. Comprueba la conexión o tus permisos.');
            }
        } catch (error) {
            console.error(error);
            setEstadoEnvio('❌ Error crítico de conexión al servidor.');
        }
    };

    // --- 6. RENDERIZADO VISUAL ---
    return (
        <div className="formulario-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, border: 'none' }}>{idEdicion ? '✏️ Editando Guía Docente' : 'Crear Nueva Guía Docente'}</h2>
                <button type="button" onClick={() => setMostrarIA(!mostrarIA)} style={{ backgroundColor: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}>
                    {mostrarIA ? '❌ Ocultar Inteligencia Artificial' : '✨ Autocompletar con IA'}
                </button>
            </div>

            {mostrarIA && <SubidaPdfIa onDatosExtraidos={rellenarConIa} />}

            <div style={{ marginBottom: '20px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#3b82f6', display: 'block', marginBottom: '8px' }}>Nombre para guardar este documento:</label>
                <input type="text" value={nombreDocumento} onChange={(e) => setNombreDocumento(e.target.value)} placeholder="Ej: Guía de Ingeniería Web 2024 - Grupo A" style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff' }} required />
            </div>

            <form onSubmit={handleSubmit} className="formulario-layout">
                
                <SeccionDatosGenerales datos={datosGenerales} onChange={handleChangeGenerales} />
                <SeccionProfesorado profesores={profesores} onProfesorChange={handleProfesorChange} onAgregar={agregarProfesor} onEliminar={eliminarProfesor} />
                
                <SeccionListasSimples 
                    titulo="Conocimientos Previos Recomendados" 
                    items={conocimientos}
                    onCambio={(index, campo, valor) => handleListaChange(setConocimientos, conocimientos, index, campo, valor)}
                    onAgregar={() => setConocimientos([...conocimientos, { texto: '', nivel: 0 }])}
                    onEliminar={(index) => eliminarLista(setConocimientos, conocimientos, index)} 
                />
                
                <SeccionCompetencias competencias={competencias} onCompetenciaChange={handleCompetenciaChange} onAgregar={agregarCompetencia} onEliminar={eliminarCompetencia} />
                
                <SeccionListasSimples 
                    titulo="Objetivos" 
                    items={objetivos}
                    onCambio={(index, campo, valor) => handleListaChange(setObjetivos, objetivos, index, campo, valor)}
                    onAgregar={() => setObjetivos([...objetivos, { texto: '', nivel: 0 }])}
                    onEliminar={(index) => eliminarLista(setObjetivos, objetivos, index)} 
                />
                
                <SeccionTemario 
                    temas={contenidos} 
                    onChange={handleTemarioChange} 
                    onAgregar={() => setContenidos([...contenidos, {tema: '', nivel: 0}])} 
                    onEliminar={(idx) => setContenidos(contenidos.filter((_, i) => i !== idx))} 
                />
                
                <SeccionCronograma cronograma={cronograma} onSemanaChange={handleSemanaChange} onActividadChange={handleActividadCronoChange} onAgregarSemana={agregarSemanaCronograma} onEliminarSemana={eliminarSemanaCronograma} onAgregarActividad={agregarActividadCrono} onEliminarActividad={eliminarActividadCrono} />
                
                <SeccionActividadesEvaluacion actividades={actividadesEvaluacion} onActividadChange={handleActividadChange} onAgregar={agregarActividad} onEliminar={eliminarActividad} />
                
                <SeccionOtrosDatos datos={otrosDatos} onChange={handleChangeOtrosDatos} />
                
                <SeccionBibliografia bibliografia={bibliografia} onCambio={handleBiblioChange} onAgregar={agregarBiblio} onEliminar={eliminarBiblio} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '40px' }}>
                    
                    {/* CARTEL DE ESTADO VISUAL AÑADIDO AQUÍ */}
                    {estadoEnvio && (
                        <div style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            textAlign: 'center', 
                            fontWeight: 'bold',
                            backgroundColor: estadoEnvio.includes('❌') ? '#fee2e2' : (estadoEnvio.includes('✅') ? '#d1fae5' : '#1e293b'),
                            color: estadoEnvio.includes('❌') ? '#b91c1c' : (estadoEnvio.includes('✅') ? '#047857' : '#38bdf8'),
                            border: `1px solid ${estadoEnvio.includes('❌') ? '#f87171' : (estadoEnvio.includes('✅') ? '#34d399' : '#0ea5e9')}`
                        }}>
                            {estadoEnvio}
                        </div>
                    )}

                    <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.transform = 'translateY(0)'; }}>
                        {idEdicion ? '💾 Actualizar Guía en Base de Datos' : '💾 Guardar Guía en Base de Datos'}
                    </button>

                    {idEdicion && (
                        <button type="button" onClick={() => { setIdEdicion(null); if (limpiarEdicion) limpiarEdicion(); }} style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #4b5563', padding: '14px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#4b5563'; }}>
                            ❌ Cancelar Edición
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}