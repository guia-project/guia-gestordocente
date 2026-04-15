import { useState } from 'react';

/**
 * Componente UI para la carga de archivos PDF y su posterior análisis mediante Inteligencia Artificial.
 * Encapsula la lógica de subida de archivos (Multipart form-data), el manejo de estados de carga (loading) 
 * y la comunicación con el endpoint de IA en el backend de Spring Boot.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {function} props.onDatosExtraidos - Función callback (Event Handler). Se ejecuta únicamente cuando 
 * la IA devuelve el JSON estructurado con éxito. Su misión es transferir ese JSON al estado global del formulario.
 */
export default function SubidaPdfIa({ onDatosExtraidos }) {
    
    // --- ESTADO LOCAL ---
    const [archivo, setArchivo] = useState(null); // Almacena temporalmente el objeto File del navegador
    const [cargando, setCargando] = useState(false); // Actúa como un semáforo (bloquea el UI mientras la IA piensa)
    const [mensaje, setMensaje] = useState(''); // Feedback visual para el usuario

    /**
     * Captura el evento de selección de un archivo desde el disco duro del usuario.
     * @param {Event} e - Evento de cambio del input nativo tipo 'file'.
     */
    const handleFileChange = (e) => {
        // e.target.files es un array porque el input podría admitir múltiples archivos.
        // Cogemos el [0] porque solo queremos procesar un PDF cada vez.
        setArchivo(e.target.files[0]);
        setMensaje(''); // Limpiamos errores anteriores si el usuario cambia de idea
    };

    /**
     * Orquesta el proceso de empaquetado del archivo y su envío al servidor.
     * Es una función asíncrona porque debe esperar la respuesta (potencialmente lenta) del modelo de IA.
     */
    const extraerDatos = async () => {
        // Validación de Seguridad Front-End (Fail Fast)
        if (!archivo) {
            setMensaje('❌ Por favor, selecciona un archivo PDF primero.');
            return;
        }

        // Bloqueamos la interfaz y avisamos al usuario (UX)
        setCargando(true);
        setMensaje('⏳ Analizando el PDF con Inteligencia Artificial... Esto puede tardar unos segundos.');
        
        // CRÍTICO: Para enviar archivos binarios no usamos JSON.stringify().
        // Construimos un objeto FormData (estándar de HTML5) que codifica el archivo como 'multipart/form-data'.
        const formData = new FormData();
        formData.append('file', archivo);

        // Parametrización de la URL usando Variables de Entorno (.env)
        // Hacemos fallback a localhost por si la variable de entorno no estuviera configurada.
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

        try {
            // Enviamos el FormData a nuestro backend Java
            const response = await fetch(`${baseUrl}/api/guias/procesar-pdf-ia`, {
                method: 'POST',
                body: formData, // Observa que NO configuramos la cabecera 'Content-Type'. El navegador lo hace solo al ver un FormData.
            });

            if (response.ok) {
                // Parseamos la respuesta (que es un String JSON gigante devuelto por Gemini)
                const datos = await response.json();
                console.log("Datos extraídos por la IA:", datos);
                setMensaje('✅ ¡Datos extraídos con éxito! El formulario se ha rellenado automáticamente.');
                
                // ELEVACIÓN DE ESTADO: Pasamos los datos parseados al componente padre (FormularioGuia)
                if (onDatosExtraidos) onDatosExtraidos(datos);
                
            } else {
                // Manejo de errores controlados (ej. PDF corrupto o IA caída)
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                setMensaje(`❌ Error: ${errorData.error || 'No se pudieron extraer los datos del PDF'}`);
            }
        } catch (error) {
            // Manejo de errores de red (ej. Backend de Docker no iniciado)
            console.error("Error de red:", error);
            setMensaje('❌ Error de conexión al servidor.');
        } finally {
            // El bloque 'finally' se ejecuta SIEMPRE, tanto si hubo éxito como error.
            // Es el lugar ideal para "apagar el semáforo" y liberar la interfaz.
            setCargando(false);
        }
    };

    return (
        <div style={{ 
            marginBottom: '25px', backgroundColor: '#1e1e1e', padding: '25px', 
            borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', textAlign: 'center'
        }}>
            {/* Título y Descripción Omitidos en el JSDoc para brevedad (son autoexplicativos) */}
            <h3 style={{ color: '#3b82f6', marginTop: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                Autocompletar con Inteligencia Artificial
            </h3>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                Sube una guía docente en formato PDF y la IA rellenará este formulario por ti.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                {/* Input nativo de archivos restringido a extensiones .pdf */}
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    style={{ 
                        color: '#aaa', backgroundColor: '#2a2a2a', padding: '8px 15px', borderRadius: '6px', 
                        border: '1px solid #333', cursor: 'pointer' 
                    }}
                />

                {/* Botón dinámico: Cambia su estilo y cursor según el estado 'cargando' */}
                <button 
                    onClick={extraerDatos} 
                    disabled={cargando}
                    style={{ 
                        backgroundColor: cargando ? '#555' : '#3b82f6', 
                        color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', 
                        cursor: cargando ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', 
                        transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' 
                    }}
                    onMouseOver={(e) => { if (!cargando) e.target.style.backgroundColor = '#2563eb'; }}
                    onMouseOut={(e) => { if (!cargando) e.target.style.backgroundColor = '#3b82f6'; }}
                >
                    {cargando ? '⌛ Analizando PDF...' : 'Extraer datos con IA'}
                </button>
            </div>

            {/* Sistema de Feedback de Usuario (UX) por colores (Semántica visual) */}
            {mensaje && (
                <p style={{ 
                    marginTop: '20px', fontWeight: '500', fontSize: '14px',
                    color: mensaje.includes('❌') ? '#ef4444' : mensaje.includes('✅') ? '#10b981' : '#f59e0b' 
                }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}