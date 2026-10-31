import React, { useState } from 'react';
import '../styles/ResultScreen.css';

function ResultScreen({
    language,
    theme,
    result,
    onBackHome,
    onFindDoctor
}) {
    const isDark = theme === 'dark';

    const [showFirstAid, setShowFirstAid] = useState(true);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showAnswers, setShowAnswers] = useState(true);
    const [showFlags, setShowFlags] = useState(true);

    /*
     * RESULTADO DEL BACKEND
     */

    const finalResult =
        result?.resultado_final ||
        result?.data?.resultado_final ||
        result ||
        {};

    const rawUrgency = (
        finalResult.clasificacion_color ||
        result?.urgency ||
        ''
    ).toString().trim().toUpperCase();

    /*
     * NIVELES DE TRIAGE
     *
     * 1 ROJO
     * 2 NARANJA
     * 3 AMARILLO
     * 4 AZUL
     * 5 VERDE
     */

    const urgencyData = {
        ROJO: {
            level: 1,
            label: 'Rojo',
            title: 'Atención inmediata',
            time: 'Requiere atención médica inmediata.',
            description: 'Busca atención médica de emergencia.',
            className: 'rojo'
        },

        NARANJA: {
            level: 2,
            label: 'Naranja',
            title: 'Emergencia',
            time: 'Requiere atención médica prioritaria, en un máximo aproximado de 10 a 15 minutos.',
            description: 'Se recomienda valoración médica lo antes posible.',
            className: 'naranja'
        },

        AMARILLO: {
            level: 3,
            label: 'Amarillo',
            title: 'Urgencia',
            time: 'Requiere valoración médica en un máximo aproximado de 60 minutos.',
            description: 'Se recomienda atención médica en un periodo corto.',
            className: 'amarillo'
        },

        AZUL: {
            level: 4,
            label: 'Azul',
            title: 'No urgente',
            time: 'Puede ser atendido mediante consulta externa, en un máximo aproximado de 240 minutos.',
            description: 'No se identifican señales de urgencia inmediata.',
            className: 'azul'
        },

        VERDE: {
            level: 5,
            label: 'Verde',
            title: 'Menos urgente',
            time: 'Puede esperar hasta aproximadamente 120 minutos para recibir atención.',
            description: 'No se identifican señales de urgencia inmediata.',
            className: 'verde'
        }
    };

    // Fallback dinámico seguro: Si la urgencia no es reconocida, no asume 'AMARILLO'
    const currentUrgency = urgencyData[rawUrgency] || {
        level: 'N/D',
        label: 'Sin clasificación',
        title: 'No se pudo determinar el nivel de urgencia',
        time: 'Es necesario revisar el resultado de la evaluación.',
        description: 'Solicita una valoración profesional para confirmar tu estado de salud.',
        className: 'amarillo'
    };

    /*
     * DATOS DEL PACIENTE Y EVALUACIÓN
     */

    const symptomName =
        result?.symptomName || 'No especificado';

    const justification =
        finalResult.justificacion ||
        'No se recibió una justificación del sistema.';

    const symptoms =
        Array.isArray(finalResult.sintomas_identificados)
            ? finalResult.sintomas_identificados
            : [];

    const redFlags =
        Array.isArray(finalResult.banderas_rojas)
            ? finalResult.banderas_rojas
            : [];

    const recommendations =
        finalResult.recomendaciones ||
        'No se recibieron recomendaciones adicionales.';

    const legalNotice =
        finalResult.aviso_legal ||
        'Esta evaluación es orientativa y no sustituye la valoración de un profesional de la salud.';

    const visualAnalysis =
        finalResult.analisis_visual;

    const answers =
        result?.answers || {};

    const hasDoubt =
        result?.doubt === true;

    const showEmergencyButton =
        rawUrgency === 'ROJO' || rawUrgency === 'NARANJA';

    /*
     * FORMATEAR RECOMENDACIONES
     */

    const recommendationList = Array.isArray(recommendations)
        ? recommendations
        : null;

    /*
     * LLAMADA A EMERGENCIAS
     */

    const handleEmergencyCall = () => {
        window.location.href = 'tel:911';
    };

    /*
     * UBICAR MÉDICO
     */

    const handleFindDoctor = () => {
        if (onFindDoctor) {
            onFindDoctor(result);
        }
    };

    /*
     * ANÁLISIS VISUAL
     */

    const getVisualText = () => {
        if (!visualAnalysis) {
            return 'No se realizó un análisis visual.';
        }

        if (typeof visualAnalysis === 'string') {
            return visualAnalysis;
        }

        if (typeof visualAnalysis === 'object') {
            return (
                visualAnalysis.descripcion ||
                visualAnalysis.mensaje ||
                visualAnalysis.resultado ||
                'Se recibió información del análisis visual.'
            );
        }

        return 'No hay información visual disponible.';
    };

    return (
        <div
            className={`result-screen ${currentUrgency.className} ${
                isDark ? 'dark-mode' : ''
            }`}
        >

            {/* FONDO DECORATIVO */}

            <div className="medical-pattern" aria-hidden="true">
                <span>+</span>
                <span>○</span>
                <span>+</span>
                <span>◇</span>
                <span>+</span>
                <span>○</span>
                <span>◇</span>
                <span>+</span>
            </div>

            {/* HEADER */}

            <header className="result-header">

                <button
                    className="result-back"
                    onClick={onBackHome}
                >
                    ‹ Inicio
                </button>

                <h1>Resultado</h1>

                <button
                    className="pdf-button"
                    onClick={() =>
                        alert('La exportación PDF se conectará posteriormente.')
                    }
                >
                    PDF
                </button>

            </header>

            {/* CONTENIDO */}

            <main className="result-content">

                <div className="medical-card">

                    {/* AVISO MÉDICO */}

                    <div className="medical-disclaimer">

                        <div>
                            <strong>Aviso importante</strong>

                            <p>
                                {legalNotice}
                            </p>
                        </div>

                        <button
                            className="disclaimer-toggle"
                            onClick={() =>
                                setShowDisclaimer(!showDisclaimer)
                            }
                        >
                            {showDisclaimer ? 'Ocultar' : 'Ver más'}
                        </button>

                    </div>

                    {showDisclaimer && (
                        <div className="disclaimer-extra">
                            DECIA proporciona orientación inicial.
                            No sustituye un diagnóstico, consejo o
                            tratamiento médico. Si los síntomas empeoran
                            o aparece una señal de alarma, busca atención
                            médica profesional.
                        </div>
                    )}

                    {/* RESULTADO DE TRIAGE */}

                    <section className="urgency-card">

                        <div className="urgency-header">

                            <span className="urgency-circle"></span>

                            <div>
                                <span className="urgency-level">
                                    Nivel {currentUrgency.level}
                                </span>

                                <h2>{currentUrgency.label}</h2>
                            </div>

                        </div>

                        <h3>{currentUrgency.title}</h3>

                        <p className="urgency-time">
                            {currentUrgency.time}
                        </p>

                        <p className="urgency-description">
                            {currentUrgency.description}
                        </p>

                    </section>

                    {/* EMERGENCIAS */}

                    {showEmergencyButton && (
                        <section className="emergency-section">

                            <div className="emergency-text">

                                <strong>Atención prioritaria</strong>

                                <span>
                                    Si se trata de una emergencia,
                                    solicita ayuda inmediatamente.
                                </span>

                            </div>

                            <button
                                className="emergency-button"
                                onClick={handleEmergencyCall}
                            >
                                Llamar a emergencias 911
                            </button>

                        </section>
                    )}

                    {/* JUSTIFICACIÓN */}

                    <section className="clinical-card">

                        <h2>Justificación del resultado</h2>

                        <p style={{
                            color: '#52636a',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            margin: 0
                        }}>
                            {justification}
                        </p>

                    </section>

                    {/* DATOS EVALUADOS */}

                    <section className="clinical-card">

                        <h2>Datos evaluados</h2>

                        <div className="clinical-item">

                            <span>Síntoma inicial</span>

                            <strong>{symptomName}</strong>

                        </div>

                        <div className="clinical-item">
                            <span>Perfil evaluado</span>
                            <strong>
                                {result?.profileName || 'Perfil de la cuenta'}
                            </strong>
                        </div>

                        <div className="clinical-item symptoms-item">

                            <span>Síntomas identificados</span>

                            <div className="symptom-chips">

                                {symptoms.length > 0 ? (
                                    symptoms.map((symptom, index) => (
                                        <span
                                            key={index}
                                            className="symptom-chip"
                                        >
                                            {typeof symptom === 'string'
                                                ? symptom
                                                : JSON.stringify(symptom)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-symptoms">
                                        No se registraron síntomas adicionales.
                                    </span>
                                )}

                            </div>

                        </div>

                        <div className="clinical-item">

                            <span>Nivel de urgencia recibido</span>

                            <strong>
                                {finalResult.nivel_urgencia ??
                                    currentUrgency.level}
                            </strong>

                        </div>

                        <div className="clinical-item">

                            <span>Fecha de evaluación</span>

                            <strong>
                                {finalResult.fecha_creacion
                                    ? new Date(
                                        finalResult.fecha_creacion
                                    ).toLocaleString('es-MX')
                                    : 'No disponible'}
                            </strong>

                        </div>

                    </section>

                    {/* BANDERAS ROJAS */}

                    <section className="causes-card">

                        <button
                            className="causes-button"
                            onClick={() => setShowFlags(!showFlags)}
                        >
                            <span>Señales de alarma identificadas</span>

                            <span className="accordion-arrow">
                                {showFlags ? '⌃' : '⌄'}
                            </span>
                        </button>

                        {showFlags && (
                            <div className="causes-content">

                                {redFlags.length > 0 ? (
                                    <ul>
                                        {redFlags.map((flag, index) => (
                                            <li key={index}>
                                                {typeof flag === 'string'
                                                    ? flag
                                                    : JSON.stringify(flag)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>
                                        El sistema no registró banderas rojas
                                        adicionales en esta evaluación.
                                    </p>
                                )}

                            </div>
                        )}

                    </section>

                    {/* RECOMENDACIONES */}

                    <section className="first-aid-card">

                        <button
                            className="first-aid-button"
                            onClick={() =>
                                setShowFirstAid(!showFirstAid)
                            }
                        >
                            <span>Recomendaciones</span>

                            <span className="accordion-arrow">
                                {showFirstAid ? '⌃' : '⌄'}
                            </span>
                        </button>

                        {showFirstAid && (
                            <div className="first-aid-content">

                                {recommendationList ? (
                                    <ul>
                                        {recommendationList.map(
                                            (recommendation, index) => (
                                                <li key={index}>
                                                    {recommendation}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p style={{
                                        color: '#52636a',
                                        fontSize: '13px',
                                        lineHeight: '1.6'
                                    }}>
                                        {recommendations}
                                    </p>
                                )}

                                <p className="first-aid-warning">
                                    Sigue las indicaciones de un profesional
                                    de la salud. Estas recomendaciones no
                                    sustituyen una valoración médica.
                                </p>

                            </div>
                        )}

                    </section>

                    {/* ANÁLISIS VISUAL */}

                    <section className="clinical-card">

                        <h2>Análisis visual</h2>

                        <p style={{
                            color: '#52636a',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            margin: 0
                        }}>
                            {getVisualText()}
                        </p>

                    </section>

                    {/* DUDA */}

                    {hasDoubt && (
                        <section className="doubt-card">

                            <div className="doubt-icon">?</div>

                            <div>
                                <strong>
                                    Se indicó una duda durante la evaluación
                                </strong>

                                <p>
                                    Se recomienda que un profesional de la
                                    salud valide la información proporcionada.
                                </p>
                            </div>

                        </section>
                    )}

                    {/* RESUMEN DE RESPUESTAS */}

                    <section className="answers-summary">

                        <button
                            className="causes-button"
                            onClick={() =>
                                setShowAnswers(!showAnswers)
                            }
                        >
                            <span>Resumen de respuestas</span>

                            <span className="accordion-arrow">
                                {showAnswers ? '⌃' : '⌄'}
                            </span>
                        </button>

                        {showAnswers && (

                            Object.keys(answers).length > 0 ? (

                                Object.entries(answers).map(
                                    ([questionId, item]) => (

                                        <div
                                            className="answer-summary-item"
                                            key={questionId}
                                        >

                                            <span>
                                                {item.question ||
                                                    `Pregunta ${questionId}`}
                                            </span>

                                            <strong>
                                                {item.answer ?? item}
                                            </strong>

                                        </div>

                                    )
                                )

                            ) : (

                                <p className="no-answers">
                                    No hay respuestas registradas.
                                </p>

                            )

                        )}

                    </section>

                    {/* MÉDICO */}

                    <button
                        className="doctor-button"
                        onClick={handleFindDoctor}
                    >
                        Ubicar Médico
                    </button>

                </div>

            </main>

        </div>
    );
}

export default ResultScreen;