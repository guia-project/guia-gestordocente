import { useState, useEffect } from 'react';
import Modal from './Modal';

/**
 * Componente principal tipo "Dashboard" que muestra el listado de guías docentes almacenadas.
 * Gestiona la comunicación con la API y mantiene un estado persistente local (localStorage) 
 * para las personalizaciones visuales (colores y logos).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {function} props.onEditar - Función callback para abrir una guía existente en el Formulario principal.
 */
export default function ListaGuias({ onEditar }) {
    const [guias, setGuias] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // 1. Estados inicializados leyendo directamente la memoria (localStorage) (Lazy Initialization)
    const [colores, setColores] = useState(() => {
        const guardado = localStorage.getItem('coloresGuias');
        return guardado ? JSON.parse(guardado) : {};
    });

    const [logos, setLogos] = useState(() => {
        const guardado = localStorage.getItem('logosGuias');
        return guardado ? JSON.parse(guardado) : {};
    });

    const [guiaPersonalizando, setGuiaPersonalizando] = useState(null);

    // URL del Backend inyectada desde Variables de Entorno
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // 2. EFECTOS DE AUTOGUARDADO: Si cambia el color o el logo, se guarda al instante
    useEffect(() => {
        localStorage.setItem('coloresGuias', JSON.stringify(colores));
    }, [colores]);

    useEffect(() => {
        localStorage.setItem('logosGuias', JSON.stringify(logos));
    }, [logos]);

    useEffect(() => {
        const obtenerGuias = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/guias/todas`);
                const data = await response.json();
                setGuias(data);
                setCargando(false);
            } catch (error) {
                console.error("Error al cargar las guías:", error);
                setCargando(false);
            }
        };
        obtenerGuias();
    }, [baseUrl]);

    const eliminarGuia = async (idGuia) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta guía docente? Esta acción no se puede deshacer.")) return;
        try {
            const response = await fetch(`${baseUrl}/api/guias/eliminar/${idGuia}`, { method: 'DELETE' });
            if (response.ok) setGuias(guias.filter(guia => guia.id !== idGuia));
            else alert("Error al eliminar la guía del servidor.");
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión al intentar eliminar.");
        }
    };

    // MAGIA DE LA FASE 2: DUPLICAR GUÍA (Deep Copy)
    const duplicarGuia = (guiaOriginal) => {
        if (!onEditar) return;
        
        const copiaGuia = JSON.parse(JSON.stringify(guiaOriginal));
        copiaGuia.id = null;
        
        const nombreActual = copiaGuia.nombreDocumento || copiaGuia["Nombre del documento"] || "Guía";
        copiaGuia.nombreDocumento = "Copia de " + nombreActual;
        
        onEditar(copiaGuia);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const descargarPdf = async (idGuia, tituloGuia) => {
        const hexColor = colores[idGuia] || '#0056b3';
        const colorSinAlmohadilla = hexColor.replace('#', '');
        const logoBase64 = logos[idGuia] || null;

        try {
            const response = await fetch(`${baseUrl}/api/guias/${idGuia}/pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color: colorSinAlmohadilla, logo: logoBase64 })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${tituloGuia.replace(/ /g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert("Error al generar el PDF. Asegúrate de que el backend está listo.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }
    };

    // NUEVA FUNCIÓN: Descargar el grafo semántico en formato Turtle
    const handleDescargarTurtle = async (idGuia) => {
        try {
            const token = localStorage.getItem('token'); 
            console.log("Generando archivo Turtle...");

            const response = await fetch(`${baseUrl}/api/guias/descargar-turtle/${idGuia}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `Guia_${idGuia}_Semantica.ttl`; 
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                
                console.log("¡Descarga de RDF completada!");
            } else {
                alert('❌ Error al generar el archivo RDF/Turtle. Comprueba la consola del backend.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('❌ Error crítico al conectar con el servidor.');
        }
    };

    const handleSubirLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogos({ ...logos, [guiaPersonalizando.id]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        setColores({ ...colores, [guiaPersonalizando.id]: e.target.value });
    };

    const btnStyle = {
        backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', 
        padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', 
        fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s'
    };

    if (cargando) return <div className="formulario-container">Cargando guías guardadas...</div>;

    return (
        <div className="formulario-container">
            {guias.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px dashed #444' }}>
                    <p style={{ color: '#aaa', fontSize: '16px' }}>Aún no hay ninguna guía en la base de datos.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {guias.map((guia) => {
                        const dg = guia.datosGenerales || {};
                        const nombreAsignatura = dg.nombreAsignatura || dg["Nombre asignatura"] || '';
                        const codigoAsignatura = dg.codigoAsignatura || dg["Código asignatura"] || '';
                        
                        const tituloMostrar = guia.nombreDocumento || (nombreAsignatura ? `Guía de ${nombreAsignatura}` : 'Guía Docente Sin Título');

                        return (
                            <div key={guia.id} style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                                
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}>{tituloMostrar}</h3>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                                        Asignatura: <span style={{color: '#e0e0e0', fontWeight: 'bold'}}>{nombreAsignatura || 'No definida'}</span> | Código: <span style={{color: '#e0e0e0', fontWeight: 'bold'}}>{codigoAsignatura || 'No definido'}</span>
                                    </p>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    
                                    <button 
                                        onClick={() => setGuiaPersonalizando(guia)} 
                                        style={btnStyle}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; }}
                                    >
                                        🎨 Personalizar
                                    </button>

                                    <button 
                                        onClick={() => { if(onEditar) onEditar(guia); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                        style={btnStyle}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; }}
                                    >
                                        ✏️ Editar
                                    </button>
                                    
                                    <button 
                                        onClick={() => duplicarGuia(guia)} 
                                        style={btnStyle}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; }}
                                    >
                                        👯‍♂️ Duplicar
                                    </button>

                                    <button 
                                        onClick={() => descargarPdf(guia.id, tituloMostrar)} 
                                        style={btnStyle}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; }}
                                    >
                                        📄 PDF
                                    </button>

                                    {/* BOTÓN ACTUALIZADO PARA DESCARGAR TURTLE */}
                                    <button 
                                        onClick={() => handleDescargarTurtle(guia.id)} 
                                        style={btnStyle}
                                        title="Descarga los datos semánticos en formato Turtle (.ttl)"
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#374151'; e.target.style.borderColor = '#6b7280'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; }}
                                    >
                                        🕸️ RDF (.ttl)
                                    </button>

                                    <button 
                                        onClick={() => eliminarGuia(guia.id)} 
                                        style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s', marginLeft: '10px' }} 
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#b91c1c'; }} 
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#dc2626'; }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={!!guiaPersonalizando} onClose={() => setGuiaPersonalizando(null)} titulo="🎨 Personalizar Exportación">
                {guiaPersonalizando && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #444' }}>
                            <label style={{ display: 'block', color: '#e0e0e0', fontWeight: 'bold', marginBottom: '10px' }}>1. Color Corporativo de la Universidad</label>
                            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '15px' }}>Este color se usará para los títulos y tablas del PDF.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <input 
                                    type="color" 
                                    value={colores[guiaPersonalizando.id] || '#0056b3'} 
                                    onChange={handleColorChange}
                                    style={{ cursor: 'pointer', height: '50px', width: '80px', padding: '0', border: 'none', borderRadius: '8px', backgroundColor: 'transparent' }}
                                />
                                <span style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '16px' }}>{colores[guiaPersonalizando.id] || '#0056b3'}</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #444' }}>
                            <label style={{ display: 'block', color: '#e0e0e0', fontWeight: 'bold', marginBottom: '10px' }}>2. Logo de la Universidad</label>
                            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '15px' }}>Sube una imagen (PNG o JPG) para la cabecera del PDF.</p>
                            
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg" 
                                onChange={handleSubirLogo}
                                style={{ display: 'block', marginBottom: '15px', color: '#aaa' }}
                            />

                            {logos[guiaPersonalizando.id] && (
                                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '8px', display: 'inline-block', border: '1px dashed #555' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Vista Previa:</p>
                                    <img src={logos[guiaPersonalizando.id]} alt="Logo Universidad" style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}