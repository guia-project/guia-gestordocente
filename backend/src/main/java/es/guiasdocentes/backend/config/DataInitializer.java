package es.guiasdocentes.backend.config;

import es.guiasdocentes.backend.models.UsuarioDocument;
import es.guiasdocentes.backend.ItemTemaNivel;
import es.guiasdocentes.backend.ItemTextoNivel;
import es.guiasdocentes.backend.dto.ActividadEvaluacionDto;
import es.guiasdocentes.backend.dto.ActividadSemanaDto;
import es.guiasdocentes.backend.dto.BibliografiaDto;
import es.guiasdocentes.backend.dto.CompetenciaDto;
import es.guiasdocentes.backend.dto.DatosGeneralesDto;
import es.guiasdocentes.backend.dto.OtrosDatosDto;
import es.guiasdocentes.backend.dto.ProfesorDto;
import es.guiasdocentes.backend.dto.SemanaCronogramaDto;
import es.guiasdocentes.backend.models.GuiaDocenteDocument;
import es.guiasdocentes.backend.repositories.UsuarioRepository;
import es.guiasdocentes.backend.repositories.GuiaDocenteRepository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final GuiaDocenteRepository guiaDocenteRepository;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, GuiaDocenteRepository guiaDocenteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.guiaDocenteRepository = guiaDocenteRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String emailTest = "test@test.es";
        
        // 1. BUSCAR O CREAR USUARIO
        UsuarioDocument usuarioGuardado;
        if (usuarioRepository.findByEmail(emailTest).isEmpty()) {
            UsuarioDocument testUser = new UsuarioDocument();
            testUser.setNombre("Profesor de Pruebas");
            testUser.setEmail(emailTest);
            testUser.setPassword(passwordEncoder.encode("test"));
            usuarioGuardado = usuarioRepository.save(testUser);
        } else {
            // SI YA EXISTE EN PRODUCCIÓN, LO RECUPERAMOS
            usuarioGuardado = usuarioRepository.findByEmail(emailTest).get();
        }
        
        // 2. COMPROBAR SI ESE USUARIO YA TIENE GUÍAS (Para no crearle una nueva cada vez que se reinicie el servidor)
        if (guiaDocenteRepository.findByUsuarioId(usuarioGuardado.getId()).isEmpty()) {
            
            // =========================================================================
            // --- INSTANCIACIÓN DE LA GUÍA PRINCIPAL ---
            // =========================================================================
            GuiaDocenteDocument guiaDemo = new GuiaDocenteDocument();
            guiaDemo.setUsuarioId(usuarioGuardado.getId()); 
            guiaDemo.setNombreDocumento("Guía Oficial - Fundamentos de Ingeniería del Software");

            // =========================================================================
            // --- BLOQUE 1: DATOS GENERALES ---
            // =========================================================================
            DatosGeneralesDto datosGenerales = new DatosGeneralesDto();
            datosGenerales.setNombreAsignatura("Fundamentos de Ingeniería del Software");
            datosGenerales.setCodigoAsignatura("615000240");
            datosGenerales.setCreditos("9");
            datosGenerales.setTitulacion("61IW - Grado en Ingenieria del Software");
            datosGenerales.setCurso("2");
            datosGenerales.setSemestre("4");
            datosGenerales.setPeriodo("Febrero-Junio");
            datosGenerales.setAnioPlanEstudios("2014");
            datosGenerales.setCursoImplantacion("Sin especificar");
            datosGenerales.setRama("Sin especificar");
            datosGenerales.setCentro("E.T.S. De Ing. De Sistemas Informáticos");
            datosGenerales.setDepartamento("Sistemas informáticos");
            datosGenerales.setArea("Sin especificar");
            datosGenerales.setIdioma("Castellano");
            datosGenerales.setModalidad("Sin especificar");
            datosGenerales.setModulo("Sin especificar");
            datosGenerales.setCaracter("Obligatoria");
            guiaDemo.setDatosGenerales(datosGenerales);

            // =========================================================================
            // --- BLOQUE 2: PROFESORADO ---
            // =========================================================================
            String tutoriasComun = "Sin horario. Se publicarán en la Web de la ETSISI y en el Moodle de la Asignatura.";
            
            ProfesorDto p1 = new ProfesorDto();
            p1.setNombre("Joaquin Gayoso Cabada"); p1.setEmail("j.gayoso@upm.es"); p1.setDespacho("-"); p1.setHorarioTutorias(tutoriasComun); p1.setEsCoordinador(false);

            ProfesorDto p2 = new ProfesorDto();
            p2.setNombre("Daniel Lopez Fernandez"); p2.setEmail("daniel.lopez@upm.es"); p2.setDespacho("-"); p2.setHorarioTutorias(tutoriasComun); p2.setEsCoordinador(true);

            ProfesorDto p3 = new ProfesorDto();
            p3.setNombre("Aldo Gordillo Mendez"); p3.setEmail("a.gordillo@upm.es"); p3.setDespacho("-"); p3.setHorarioTutorias(tutoriasComun); p3.setEsCoordinador(false);

            ProfesorDto p4 = new ProfesorDto();
            p4.setNombre("Jorge Enrique Perez Martinez"); p4.setEmail("jorgeenrique.perez@upm.es"); p4.setDespacho("-"); p4.setHorarioTutorias(tutoriasComun); p4.setEsCoordinador(false);

            ProfesorDto p5 = new ProfesorDto();
            p5.setNombre("Agustin Yague Panadero"); p5.setEmail("agustin.yague@upm.es"); p5.setDespacho("-"); p5.setHorarioTutorias(tutoriasComun); p5.setEsCoordinador(false);

            ProfesorDto p6 = new ProfesorDto();
            p6.setNombre("Jordi Burguet Castell"); p6.setEmail("j.getburguet@upm.es"); p6.setDespacho("-"); p6.setHorarioTutorias(tutoriasComun); p6.setEsCoordinador(false);

            ProfesorDto p7 = new ProfesorDto();
            p7.setNombre("Carlos Castilla Ruiz"); p7.setEmail("c.castilla@upm.es"); p7.setDespacho("-"); p7.setHorarioTutorias(tutoriasComun); p7.setEsCoordinador(false);

            ProfesorDto p8 = new ProfesorDto();
            p8.setNombre("Gonzalo Martinez Ruiz De Arcaute"); p8.setEmail("gonzalo.martinez.ruizdearcaute@upm.es"); p8.setDespacho("-"); p8.setHorarioTutorias(tutoriasComun); p8.setEsCoordinador(false);

            guiaDemo.setProfesorado(List.of(p1, p2, p3, p4, p5, p6, p7, p8));

            // =========================================================================
            // --- BLOQUE 3: OTROS DATOS (ESTRUCTURAS COMPLEJAS) ---
            // =========================================================================
            OtrosDatosDto otrosDatos = new OtrosDatosDto();

            // --- 3.1 Conocimientos Previos Recomendados ---
            ItemTextoNivel cp0 = new ItemTextoNivel(); cp0.setTexto("Asignaturas previas que se recomienda haber cursado"); cp0.setNivel(0);
            ItemTextoNivel cp1 = new ItemTextoNivel(); cp1.setTexto("Programacion Orientada A Objetos"); cp1.setNivel(1);
            ItemTextoNivel cp2 = new ItemTextoNivel(); cp2.setTexto("Estructura De Datos"); cp2.setNivel(1);
            ItemTextoNivel cp3 = new ItemTextoNivel(); cp3.setTexto("Bases De Datos"); cp3.setNivel(1);
            ItemTextoNivel cp4 = new ItemTextoNivel(); cp4.setTexto("Fundamentos De Programación"); cp4.setNivel(1);
            ItemTextoNivel cp5 = new ItemTextoNivel(); cp5.setTexto("Algoritmica Y Complejidad"); cp5.setNivel(1);
            ItemTextoNivel cp8 = new ItemTextoNivel(); cp8.setTexto("Otros conocimientos previos recomendados para cursar la asignatura"); cp8.setNivel(0);
            ItemTextoNivel cp6 = new ItemTextoNivel(); cp6.setTexto("Conocimientos de lenguaje de programación en Java"); cp6.setNivel(1);
            ItemTextoNivel cp7 = new ItemTextoNivel(); cp7.setTexto("Manejo de sistema de gestion de repositorios GIT"); cp7.setNivel(1);
            otrosDatos.setConocimientosPrevios(List.of(cp0, cp1, cp2, cp3, cp4, cp5, cp8, cp6, cp7));

            // --- 3.2 Competencias ---
            CompetenciaDto c1 = new CompetenciaDto(); c1.setTipo("Básica"); c1.setCodigo("CB5"); c1.setDescripcion("Conocimiento de la estructura, funcionamiento e interconexión de los sistemas informáticos, así como los fundamentos de su programación");
            CompetenciaDto c2 = new CompetenciaDto(); c2.setTipo("General"); c2.setCodigo("CC16"); c2.setDescripcion("Conocimiento y aplicación de los principios, metodologías y ciclos de vida de la ingeniería de software");
            CompetenciaDto c3 = new CompetenciaDto(); c3.setTipo("General"); c3.setCodigo("CC17"); c3.setDescripcion("Capacidad para diseñar y evaluar interfaces persona computador que garanticen la accesibilidad y usabilidad a los sistemas, servicios y aplicaciones informática");
            CompetenciaDto c4 = new CompetenciaDto(); c4.setTipo("General"); c4.setCodigo("CC8"); c4.setDescripcion("Capacidad para analizar, diseñar, construir y mantener aplicaciones de forma robusta, segura y eficiente, eligiendo el paradigma y los lenguajes de programación más adecuados");
            CompetenciaDto c5 = new CompetenciaDto(); c5.setTipo("Transversal"); c5.setCodigo("CT11"); c5.setDescripcion("Liderazgo: Cualidades, actitudes, conocimientos y destrezas que posee un individuo...");
            CompetenciaDto c6 = new CompetenciaDto(); c6.setTipo("Transversal"); c6.setCodigo("CT8"); c6.setDescripcion("Trabajo en equipo: Ser capaz de trabajar como miembro de un equipo interdisciplinar...");
            otrosDatos.setCompetencias(List.of(c1, c2, c3, c4, c5, c6));

            // --- 3.3 Objetivos (Resultados de Aprendizaje) ---
            ItemTextoNivel obj1 = new ItemTextoNivel(); obj1.setTexto("RA38 - Desarrolla, mantiene y evalúa sistemas software que satisfacen requisitos de usuario"); obj1.setNivel(0);
            ItemTextoNivel obj2 = new ItemTextoNivel(); obj2.setTexto("RA45 - Aplica las distintas técnicas de verificación, validación y pruebas del software mediante el uso de las herramientas apropiadas"); obj2.setNivel(0);
            ItemTextoNivel obj3 = new ItemTextoNivel(); obj3.setTexto("RA39 - Modela y Diseña soluciones atendiendo a los compromisos de eficiencia, modularidad"); obj3.setNivel(0);
            ItemTextoNivel obj4 = new ItemTextoNivel(); obj4.setTexto("RA41 - Conoce y aplica las teorías, modelos y técnicas actuales para la identificación de problemas, el análisis, el diseño del software..."); obj4.setNivel(0);
            ItemTextoNivel obj5 = new ItemTextoNivel(); obj5.setTexto("RA40 - Identifica y analiza problemas para solventar soluciones software sobre la base de un conocimiento adecuado..."); obj5.setNivel(0);
            ItemTextoNivel obj6 = new ItemTextoNivel(); obj6.setTexto("RA46 - Desarrolla soluciones que ponen en práctica las técnicas básicas de Ingeniería del Software"); obj6.setNivel(0);
            ItemTextoNivel obj7 = new ItemTextoNivel(); obj7.setTexto("RA37 - Evalúa el cumplimiento de los requisitos de usuario de sistemas software"); obj7.setNivel(0);
            ItemTextoNivel obj8 = new ItemTextoNivel(); obj8.setTexto("RA47 - Es capaz de trabajar como miembro de un equipo con la finalidad de contribuir a desarrollar proyectos con pragmatismo..."); obj8.setNivel(0);
            otrosDatos.setObjetivos(List.of(obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8));

            // --- 3.4 Contenidos (Temario) ---
            List<ItemTemaNivel> temario = new ArrayList<>();

            // TEMA 1
            ItemTemaNivel t1 = new ItemTemaNivel(); t1.setTema("1. Introducción a la Ingeniería del Software"); t1.setNivel(0); temario.add(t1);
            ItemTemaNivel t1_1 = new ItemTemaNivel(); t1_1.setTema("1.1. Introducción"); t1_1.setNivel(1); temario.add(t1_1);
            ItemTemaNivel t1_2 = new ItemTemaNivel(); t1_2.setTema("1.2. El Proceso Software"); t1_2.setNivel(1); temario.add(t1_2);
            ItemTemaNivel t1_3 = new ItemTemaNivel(); t1_3.setTema("1.3. Modelos de Proceso Software"); t1_3.setNivel(1); temario.add(t1_3);

            // TEMA 2
            ItemTemaNivel t2 = new ItemTemaNivel(); t2.setTema("2. Ingeniería de Requisitos Software"); t2.setNivel(0); temario.add(t2);
            ItemTemaNivel t2_1 = new ItemTemaNivel(); t2_1.setTema("2.1. Requisitos: Conceptos Generales"); t2_1.setNivel(1); temario.add(t2_1);
            ItemTemaNivel t2_2 = new ItemTemaNivel(); t2_2.setTema("2.2. Ingeniería de Requisitos"); t2_2.setNivel(1); temario.add(t2_2);
            ItemTemaNivel t2_2_1 = new ItemTemaNivel(); t2_2_1.setTema("2.2.1. Visión Global"); t2_2_1.setNivel(2); temario.add(t2_2_1);
            ItemTemaNivel t2_2_2 = new ItemTemaNivel(); t2_2_2.setTema("2.2.2. Extracción de Requisitos"); t2_2_2.setNivel(2); temario.add(t2_2_2);
            ItemTemaNivel t2_2_3 = new ItemTemaNivel(); t2_2_3.setTema("2.2.3. Análisis de Requisitos"); t2_2_3.setNivel(2); temario.add(t2_2_3);
            ItemTemaNivel t2_2_4 = new ItemTemaNivel(); t2_2_4.setTema("2.2.4. Especificación de Requisitos"); t2_2_4.setNivel(2); temario.add(t2_2_4);
            ItemTemaNivel t2_2_5 = new ItemTemaNivel(); t2_2_5.setTema("2.2.5. Validación de Requisitos"); t2_2_5.setNivel(2); temario.add(t2_2_5);
            ItemTemaNivel t2_3 = new ItemTemaNivel(); t2_3.setTema("2.3. Modelado de Requisitos: Casos de Uso"); t2_3.setNivel(1); temario.add(t2_3);

            // TEMA 3
            ItemTemaNivel t3 = new ItemTemaNivel(); t3.setTema("3. Análisis de Software"); t3.setNivel(0); temario.add(t3);
            ItemTemaNivel t3_1 = new ItemTemaNivel(); t3_1.setTema("3.1. Introducción"); t3_1.setNivel(1); temario.add(t3_1);
            ItemTemaNivel t3_2 = new ItemTemaNivel(); t3_2.setTema("3.2. Modelado Estructural I: Diagramas de clases"); t3_2.setNivel(1); temario.add(t3_2);
            ItemTemaNivel t3_3 = new ItemTemaNivel(); t3_3.setTema("3.3. Modelado Comportamiento: Diagramas de estados, actividad y secuencia"); t3_3.setNivel(1); temario.add(t3_3);
            ItemTemaNivel t3_4 = new ItemTemaNivel(); t3_4.setTema("3.4. Trazabilidad de Requisitos a Análisis"); t3_4.setNivel(1); temario.add(t3_4);

            // TEMA 4
            ItemTemaNivel t4 = new ItemTemaNivel(); t4.setTema("4. Diseño de software"); t4.setNivel(0); temario.add(t4);
            ItemTemaNivel t4_1 = new ItemTemaNivel(); t4_1.setTema("4.1. Fundamentos de Diseño de Software"); t4_1.setNivel(1); temario.add(t4_1);
            ItemTemaNivel t4_2 = new ItemTemaNivel(); t4_2.setTema("4.2. Modelado estructural II: Diagramas de clases"); t4_2.setNivel(1); temario.add(t4_2);
            ItemTemaNivel t4_3 = new ItemTemaNivel(); t4_3.setTema("4.3. Principios de Diseño"); t4_3.setNivel(1); temario.add(t4_3);
            ItemTemaNivel t4_4 = new ItemTemaNivel(); t4_4.setTema("4.4. Trazabilidad de Análisis a Diseño y de Diseño a Implementación"); t4_4.setNivel(1); temario.add(t4_4);
            ItemTemaNivel t4_5 = new ItemTemaNivel(); t4_5.setTema("4.5. Patrones y Antipatrones de Diseño"); t4_5.setNivel(1); temario.add(t4_5);
            ItemTemaNivel t4_6 = new ItemTemaNivel(); t4_6.setTema("4.6. Arquitectura Software"); t4_6.setNivel(1); temario.add(t4_6);
            ItemTemaNivel t4_7 = new ItemTemaNivel(); t4_7.setTema("4.7. Modelado estructural III: Diagramas de componentes y despliegue"); t4_7.setNivel(1); temario.add(t4_7);

            // TEMA 5
            ItemTemaNivel t5 = new ItemTemaNivel(); t5.setTema("5. Verificación y Validación"); t5.setNivel(0); temario.add(t5);
            ItemTemaNivel t5_1 = new ItemTemaNivel(); t5_1.setTema("5.1. Verificación y validación: Pruebas del Software"); t5_1.setNivel(1); temario.add(t5_1);
            ItemTemaNivel t5_2 = new ItemTemaNivel(); t5_2.setTema("5.2. Técnicas de prueba"); t5_2.setNivel(1); temario.add(t5_2);
            ItemTemaNivel t5_2_1 = new ItemTemaNivel(); t5_2_1.setTema("5.2.1. Pruebas de Caja Blanca"); t5_2_1.setNivel(2); temario.add(t5_2_1);
            ItemTemaNivel t5_2_2 = new ItemTemaNivel(); t5_2_2.setTema("5.2.2. Pruebas de Caja Negra"); t5_2_2.setNivel(2); temario.add(t5_2_2);
            ItemTemaNivel t5_3 = new ItemTemaNivel(); t5_3.setTema("5.3. Tipos de Pruebas"); t5_3.setNivel(1); temario.add(t5_3);
            ItemTemaNivel t5_3_1 = new ItemTemaNivel(); t5_3_1.setTema("5.3.1. Pruebas Unitarias"); t5_3_1.setNivel(2); temario.add(t5_3_1);
            ItemTemaNivel t5_3_2 = new ItemTemaNivel(); t5_3_2.setTema("5.3.2. Pruebas de Integración"); t5_3_2.setNivel(2); temario.add(t5_3_2);
            ItemTemaNivel t5_3_3 = new ItemTemaNivel(); t5_3_3.setTema("5.3.3. Pruebas de Sistema"); t5_3_3.setNivel(2); temario.add(t5_3_3);
            ItemTemaNivel t5_3_4 = new ItemTemaNivel(); t5_3_4.setTema("5.3.4. Pruebas de Aceptación"); t5_3_4.setNivel(2); temario.add(t5_3_4);

            otrosDatos.setContenidos(temario);

           // --- 3.5 Cronograma de Trabajo Completo ---
            // Semana 1
            SemanaCronogramaDto sem1 = new SemanaCronogramaDto();
            sem1.setSemana("Semana 1");
            ActividadSemanaDto a1_1 = new ActividadSemanaDto(); a1_1.setClasificacion("Tipo 1"); a1_1.setTipo("Lección Magistral"); a1_1.setDescripcion("Tema 1"); a1_1.setHoras("2 h");
            ActividadSemanaDto a1_2 = new ActividadSemanaDto(); a1_2.setClasificacion("Tipo 1"); a1_2.setTipo("Lección Magistral"); a1_2.setDescripcion("Tema 1"); a1_2.setHoras("2 h");
            ActividadSemanaDto a1_3 = new ActividadSemanaDto(); a1_3.setClasificacion("Tipo 2"); a1_3.setTipo("Prácticas de laboratorio"); a1_3.setDescripcion("Introducción tema 1"); a1_3.setHoras("2 h");
            sem1.setActividades(List.of(a1_1, a1_2, a1_3));

            // Semana 2
            SemanaCronogramaDto sem2 = new SemanaCronogramaDto();
            sem2.setSemana("Semana 2");
            ActividadSemanaDto a2_1 = new ActividadSemanaDto(); a2_1.setClasificacion("Tipo 1"); a2_1.setTipo("Lección Magistral"); a2_1.setDescripcion("Tema 2"); a2_1.setHoras("2 h");
            ActividadSemanaDto a2_2 = new ActividadSemanaDto(); a2_2.setClasificacion("Tipo 1"); a2_2.setTipo("Clase de problemas"); a2_2.setDescripcion("Tema 2: Ejercicios"); a2_2.setHoras("2 h");
            ActividadSemanaDto a2_3 = new ActividadSemanaDto(); a2_3.setClasificacion("Tipo 2"); a2_3.setTipo("Prácticas de laboratorio"); a2_3.setDescripcion("Presentación de la Práctica y el Entorno de Trabajo"); a2_3.setHoras("0,5 h");
            ActividadSemanaDto a2_4 = new ActividadSemanaDto(); a2_4.setClasificacion("Tipo 2"); a2_4.setTipo("Prácticas de laboratorio"); a2_4.setDescripcion("Requisitos"); a2_4.setHoras("1,5 h");
            sem2.setActividades(List.of(a2_1, a2_2, a2_3, a2_4));

            // Semana 3
            SemanaCronogramaDto sem3 = new SemanaCronogramaDto();
            sem3.setSemana("Semana 3");
            ActividadSemanaDto a3_1 = new ActividadSemanaDto(); a3_1.setClasificacion("Tipo 1"); a3_1.setTipo("Lección Magistral"); a3_1.setDescripcion("Tema 2"); a3_1.setHoras("2 h");
            ActividadSemanaDto a3_2 = new ActividadSemanaDto(); a3_2.setClasificacion("Tipo 1"); a3_2.setTipo("Clase de problemas"); a3_2.setDescripcion("Tema 2: Ejercicios"); a3_2.setHoras("2 h");
            ActividadSemanaDto a3_3 = new ActividadSemanaDto(); a3_3.setClasificacion("Tipo 2"); a3_3.setTipo("Prácticas de laboratorio"); a3_3.setDescripcion("Requisitos"); a3_3.setHoras("2 h");
            sem3.setActividades(List.of(a3_1, a3_2, a3_3));

            // Semana 4
            SemanaCronogramaDto sem4 = new SemanaCronogramaDto();
            sem4.setSemana("Semana 4");
            ActividadSemanaDto a4_1 = new ActividadSemanaDto(); a4_1.setClasificacion("Tipo 1"); a4_1.setTipo("Lección Magistral"); a4_1.setDescripcion("Tema 3"); a4_1.setHoras("2 h");
            ActividadSemanaDto a4_2 = new ActividadSemanaDto(); a4_2.setClasificacion("Tipo 1"); a4_2.setTipo("Clase de problemas"); a4_2.setDescripcion("Tema 3: Ejercicios"); a4_2.setHoras("2 h");
            ActividadSemanaDto a4_3 = new ActividadSemanaDto(); a4_3.setClasificacion("Tipo 2"); a4_3.setTipo("Prácticas de laboratorio"); a4_3.setDescripcion("Análisis"); a4_3.setHoras("2 h");
            sem4.setActividades(List.of(a4_1, a4_2, a4_3));

            // Semana 5
            SemanaCronogramaDto sem5 = new SemanaCronogramaDto();
            sem5.setSemana("Semana 5");
            ActividadSemanaDto a5_1 = new ActividadSemanaDto(); a5_1.setClasificacion("Tipo 1"); a5_1.setTipo("Lección Magistral"); a5_1.setDescripcion("Tema 3"); a5_1.setHoras("2 h");
            ActividadSemanaDto a5_2 = new ActividadSemanaDto(); a5_2.setClasificacion("Tipo 1"); a5_2.setTipo("Clase de problemas"); a5_2.setDescripcion("Tema 3: Ejercicios"); a5_2.setHoras("2 h");
            ActividadSemanaDto a5_3 = new ActividadSemanaDto(); a5_3.setClasificacion("Tipo 2"); a5_3.setTipo("Prácticas de laboratorio"); a5_3.setDescripcion("Análisis"); a5_3.setHoras("2 h");
            ActividadSemanaDto a5_4 = new ActividadSemanaDto(); a5_4.setClasificacion("Evaluación"); a5_4.setTipo("Trabajo en grupo"); a5_4.setDescripcion("Práctica 1"); a5_4.setHoras("0 h");
            sem5.setActividades(List.of(a5_1, a5_2, a5_3, a5_4));

            // Semana 6
            SemanaCronogramaDto sem6 = new SemanaCronogramaDto();
            sem6.setSemana("Semana 6");
            ActividadSemanaDto a6_1 = new ActividadSemanaDto(); a6_1.setClasificacion("Tipo 1"); a6_1.setTipo("Lección Magistral"); a6_1.setDescripcion("Tema 3"); a6_1.setHoras("2 h");
            ActividadSemanaDto a6_2 = new ActividadSemanaDto(); a6_2.setClasificacion("Tipo 1"); a6_2.setTipo("Clase de problemas"); a6_2.setDescripcion("Tema 3: Ejercicios"); a6_2.setHoras("2 h");
            ActividadSemanaDto a6_3 = new ActividadSemanaDto(); a6_3.setClasificacion("Tipo 1"); a6_3.setTipo("Prácticas de laboratorio"); a6_3.setDescripcion("Repaso temas 1-3"); a6_3.setHoras("2 h");
            ActividadSemanaDto a6_4 = new ActividadSemanaDto(); a6_4.setClasificacion("Evaluación"); a6_4.setTipo("Examen escrito"); a6_4.setDescripcion("Examen Parcial 1"); a6_4.setHoras("1 h");
            sem6.setActividades(List.of(a6_1, a6_2, a6_3, a6_4));

            // Semana 8
            SemanaCronogramaDto sem8 = new SemanaCronogramaDto();
            sem8.setSemana("Semana 8");
            ActividadSemanaDto a8_1 = new ActividadSemanaDto(); a8_1.setClasificacion("Tipo 1"); a8_1.setTipo("Lección Magistral"); a8_1.setDescripcion("Tema 4"); a8_1.setHoras("2 h");
            ActividadSemanaDto a8_2 = new ActividadSemanaDto(); a8_2.setClasificacion("Tipo 1"); a8_2.setTipo("Clase de problemas"); a8_2.setDescripcion("Tema 4: Ejercicios"); a8_2.setHoras("2 h");
            ActividadSemanaDto a8_3 = new ActividadSemanaDto(); a8_3.setClasificacion("Tipo 2"); a8_3.setTipo("Prácticas de laboratorio"); a8_3.setDescripcion("Introducción Tema 4"); a8_3.setHoras("2 h");
            sem8.setActividades(List.of(a8_1, a8_2, a8_3));

            // Semana 9
            SemanaCronogramaDto sem9 = new SemanaCronogramaDto();
            sem9.setSemana("Semana 9");
            ActividadSemanaDto a9_1 = new ActividadSemanaDto(); a9_1.setClasificacion("Tipo 1"); a9_1.setTipo("Lección Magistral"); a9_1.setDescripcion("Tema 4"); a9_1.setHoras("2 h");
            ActividadSemanaDto a9_2 = new ActividadSemanaDto(); a9_2.setClasificacion("Tipo 1"); a9_2.setTipo("Clase de problemas"); a9_2.setDescripcion("Tema 4: Ejercicios"); a9_2.setHoras("2 h");
            ActividadSemanaDto a9_3 = new ActividadSemanaDto(); a9_3.setClasificacion("Tipo 2"); a9_3.setTipo("Prácticas de laboratorio"); a9_3.setDescripcion("Diseño"); a9_3.setHoras("2 h");
            sem9.setActividades(List.of(a9_1, a9_2, a9_3));

            // Semana 10
            SemanaCronogramaDto sem10 = new SemanaCronogramaDto();
            sem10.setSemana("Semana 10");
            ActividadSemanaDto a10_1 = new ActividadSemanaDto(); a10_1.setClasificacion("Tipo 1"); a10_1.setTipo("Lección Magistral"); a10_1.setDescripcion("Tema 4"); a10_1.setHoras("2 h");
            ActividadSemanaDto a10_2 = new ActividadSemanaDto(); a10_2.setClasificacion("Tipo 1"); a10_2.setTipo("Clase de problemas"); a10_2.setDescripcion("Tema 4: Ejercicios"); a10_2.setHoras("2 h");
            ActividadSemanaDto a10_3 = new ActividadSemanaDto(); a10_3.setClasificacion("Tipo 2"); a10_3.setTipo("Prácticas de laboratorio"); a10_3.setDescripcion("Diseño"); a10_3.setHoras("2 h");
            sem10.setActividades(List.of(a10_1, a10_2, a10_3));

            // Semana 11
            SemanaCronogramaDto sem11 = new SemanaCronogramaDto();
            sem11.setSemana("Semana 11");
            ActividadSemanaDto a11_1 = new ActividadSemanaDto(); a11_1.setClasificacion("Tipo 1"); a11_1.setTipo("Lección Magistral"); a11_1.setDescripcion("Tema 4"); a11_1.setHoras("2 h");
            ActividadSemanaDto a11_2 = new ActividadSemanaDto(); a11_2.setClasificacion("Tipo 1"); a11_2.setTipo("Clase de problemas"); a11_2.setDescripcion("Tema 4: Ejercicios"); a11_2.setHoras("2 h");
            ActividadSemanaDto a11_3 = new ActividadSemanaDto(); a11_3.setClasificacion("Tipo 2"); a11_3.setTipo("Prácticas de laboratorio"); a11_3.setDescripcion("Diseño"); a11_3.setHoras("2 h");
            sem11.setActividades(List.of(a11_1, a11_2, a11_3));

            // Semana 12
            SemanaCronogramaDto sem12 = new SemanaCronogramaDto();
            sem12.setSemana("Semana 12");
            ActividadSemanaDto a12_1 = new ActividadSemanaDto(); a12_1.setClasificacion("Tipo 1"); a12_1.setTipo("Clase de problemas"); a12_1.setDescripcion("Tema 4: Ejercicios"); a12_1.setHoras("2 h");
            ActividadSemanaDto a12_2 = new ActividadSemanaDto(); a12_2.setClasificacion("Tipo 1"); a12_2.setTipo("Lección Magistral"); a12_2.setDescripcion("Tema 5"); a12_2.setHoras("2 h");
            ActividadSemanaDto a12_3 = new ActividadSemanaDto(); a12_3.setClasificacion("Tipo 2"); a12_3.setTipo("Prácticas de laboratorio"); a12_3.setDescripcion("Diseño | Implementación"); a12_3.setHoras("2 h");
            sem12.setActividades(List.of(a12_1, a12_2, a12_3));

            // Semana 13
            SemanaCronogramaDto sem13 = new SemanaCronogramaDto();
            sem13.setSemana("Semana 13");
            ActividadSemanaDto a13_1 = new ActividadSemanaDto(); a13_1.setClasificacion("Tipo 1"); a13_1.setTipo("Lección Magistral"); a13_1.setDescripcion("Tema 5"); a13_1.setHoras("2 h");
            ActividadSemanaDto a13_2 = new ActividadSemanaDto(); a13_2.setClasificacion("Tipo 1"); a13_2.setTipo("Clase de problemas"); a13_2.setDescripcion("Tema 5: Ejercicios"); a13_2.setHoras("2 h");
            ActividadSemanaDto a13_3 = new ActividadSemanaDto(); a13_3.setClasificacion("Tipo 2"); a13_3.setTipo("Prácticas de laboratorio"); a13_3.setDescripcion("Implementación"); a13_3.setHoras("2 h");
            sem13.setActividades(List.of(a13_1, a13_2, a13_3));

            // Semana 14
            SemanaCronogramaDto sem14 = new SemanaCronogramaDto();
            sem14.setSemana("Semana 14");
            ActividadSemanaDto a14_1 = new ActividadSemanaDto(); a14_1.setClasificacion("Tipo 1"); a14_1.setTipo("Lección Magistral"); a14_1.setDescripcion("Tema 5"); a14_1.setHoras("2 h");
            ActividadSemanaDto a14_2 = new ActividadSemanaDto(); a14_2.setClasificacion("Tipo 1"); a14_2.setTipo("Clase de problemas"); a14_2.setDescripcion("Tema 5: Ejercicios"); a14_2.setHoras("2 h");
            ActividadSemanaDto a14_3 = new ActividadSemanaDto(); a14_3.setClasificacion("Tipo 2"); a14_3.setTipo("Prácticas de laboratorio"); a14_3.setDescripcion("Implementación, Verificación y validación"); a14_3.setHoras("2 h");
            ActividadSemanaDto a14_4 = new ActividadSemanaDto(); a14_4.setClasificacion("Evaluación"); a14_4.setTipo("Trabajo en grupo"); a14_4.setDescripcion("Examen parcial 2"); a14_4.setHoras("1 h");
            sem14.setActividades(List.of(a14_1, a14_2, a14_3, a14_4));

            // Semana 15
            SemanaCronogramaDto sem15 = new SemanaCronogramaDto();
            sem15.setSemana("Semana 15");
            ActividadSemanaDto a15_1 = new ActividadSemanaDto(); a15_1.setClasificacion("Tipo 1"); a15_1.setTipo("Clase de problemas"); a15_1.setDescripcion("Temas 1-5: Ejercicios"); a15_1.setHoras("2 h");
            ActividadSemanaDto a15_2 = new ActividadSemanaDto(); a15_2.setClasificacion("Tipo 1"); a15_2.setTipo("Clase de problemas"); a15_2.setDescripcion("Temas 1-5: Ejercicios"); a15_2.setHoras("2 h");
            ActividadSemanaDto a15_3 = new ActividadSemanaDto(); a15_3.setClasificacion("Tipo 2"); a15_3.setTipo("Prácticas de laboratorio"); a15_3.setDescripcion("Verificación y validación"); a15_3.setHoras("2 h");
            sem15.setActividades(List.of(a15_1, a15_2, a15_3));

            // Semana 17
            SemanaCronogramaDto sem17 = new SemanaCronogramaDto();
            sem17.setSemana("Semana 17");
            ActividadSemanaDto a17_1 = new ActividadSemanaDto(); a17_1.setClasificacion("Evaluación"); a17_1.setTipo("Trabajo en grupo"); a17_1.setDescripcion("Práctica 2"); a17_1.setHoras("0 h");
            ActividadSemanaDto a17_2 = new ActividadSemanaDto(); a17_2.setClasificacion("Evaluación"); a17_2.setTipo("Examen escrito"); a17_2.setDescripcion("Examen Final"); a17_2.setHoras("3 h");
            ActividadSemanaDto a17_3 = new ActividadSemanaDto(); a17_3.setClasificacion("Evaluación"); a17_3.setTipo("Otras actividades formativas"); a17_3.setDescripcion("ACTIVIDAD NO RECUPERABLE"); a17_3.setHoras("0 h");
            sem17.setActividades(List.of(a17_1, a17_2, a17_3));

            // Inyectar la lista de semanas completa en otrosDatos
            otrosDatos.setCronograma(List.of(sem1, sem2, sem3, sem4, sem5, sem6, sem8, sem9, sem10, sem11, sem12, sem13, sem14, sem15, sem17));

            // --- 3.6 Actividades de Evaluación ---
            ActividadEvaluacionDto ev1 = new ActividadEvaluacionDto(); ev1.setNombre("Práctica 1"); ev1.setTipo("Progresiva"); ev1.setPeso("12"); ev1.setNotaMinima("/10"); ev1.setCompetencias("CB5, CC16");
            ActividadEvaluacionDto ev2 = new ActividadEvaluacionDto(); ev2.setNombre("Examen Parcial 1"); ev2.setTipo("Progresiva"); ev2.setPeso("14"); ev2.setNotaMinima("/10"); ev2.setCompetencias("CC17, CB5, CC8, CC16");
            ActividadEvaluacionDto ev3 = new ActividadEvaluacionDto(); ev3.setNombre("Examen Parcial 2"); ev3.setTipo("Progresiva"); ev3.setPeso("14"); ev3.setNotaMinima("/10"); ev3.setCompetencias("CC17, CB5, CC8, CC16");
            ActividadEvaluacionDto ev4 = new ActividadEvaluacionDto(); ev4.setNombre("Práctica 2"); ev4.setTipo("Global"); ev4.setPeso("18"); ev4.setNotaMinima("/10"); ev4.setCompetencias("CC17, CT8, CB5, CC8, CT11, CC16");
            ActividadEvaluacionDto ev5 = new ActividadEvaluacionDto(); ev5.setNombre("Examen Final"); ev5.setTipo("Global"); ev5.setPeso("42"); ev5.setNotaMinima("4/10"); ev5.setCompetencias("CC17, CB5, CC8, CC16");
            ActividadEvaluacionDto ev6 = new ActividadEvaluacionDto(); ev6.setNombre("Examen Extraordinario"); ev6.setTipo("Extraordinaria"); ev6.setPeso("70"); ev6.setNotaMinima("5/10"); ev6.setCompetencias("CC17, CB5, CC8, CC16");
            ActividadEvaluacionDto ev7 = new ActividadEvaluacionDto(); ev7.setNombre("Examen Prácticas"); ev7.setTipo("Extraordinaria"); ev7.setPeso("30"); ev7.setNotaMinima("5/10"); ev7.setCompetencias("CC17, CT8, CB5, CC8, CT11, CC16");
            otrosDatos.setActividadesEvaluacion(List.of(ev1, ev2, ev3, ev4, ev5, ev6, ev7));

            // --- 3.7 Textos de Metodología y Criterios de Evaluación ---
            otrosDatos.setMetodologia("Desarrollo de proyectos utilizando metodologías de desarrollo ágiles y lecciones participativas.");
            otrosDatos.setEvaluacion("EVALUACIÓN ORDINARIA:\n- Nota Teoría (NT) = 0.20 x EP1 + 0.20 x EP2 + 0.60 x EF\n- Nota Práctica (NP) = 0.40 x P1 + 0.60 x P2\n- Nota Final (NF) = 0.70 x NT + 0.30 x NP\n* Requisito: Examen Final (EF) >= 4 y bloques >= 5.\n\nEVALUACIÓN EXTRAORDINARIA:\n- Nota = 0.70 x EE + 0.30 x PE (Mínimo 5 en cada bloque).");

            // --- 3.8 Bibliografía ---
            BibliografiaDto b1 = new BibliografiaDto(); b1.setTipo("Libro"); b1.setReferencia("Ingeniería del Software: un enfoque práctico. 7ª Edición. Roger S. Pressman, 2010");
            BibliografiaDto b2 = new BibliografiaDto(); b2.setTipo("Libro"); b2.setReferencia("Ingeniería del Software 9ª edición. Ian Sommerville. 2011");
            BibliografiaDto b3 = new BibliografiaDto(); b3.setTipo("Recurso Web"); b3.setReferencia("UML Website, Object Management Group (OMG), http://www.uml.org");
            BibliografiaDto b4 = new BibliografiaDto(); b4.setTipo("Recurso Web"); b4.setReferencia("Sumérgete en los PATRONES de DISEÑO. https://refactoring.guru/");
            otrosDatos.setBibliografia(List.of(b1, b2, b3, b4));

            guiaDemo.setOtrosDatos(otrosDatos);

            // =========================================================================
            // --- PERSISTENCIA FINAL EN MONGODB ---
            // =========================================================================
            guiaDocenteRepository.save(guiaDemo);
            
            guiaDocenteRepository.save(guiaDemo);
            System.out.println("🚀 Guía demo inicializada y enlazada al usuario en Producción.");
        }
    }
}