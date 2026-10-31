import React, { useEffect, useRef, useState } from 'react';
import '../styles/SymptomStep1.css';
import {
    iniciarTriaje,
    responderPregunta
} from '../services/api';

function SymptomStep1({
    language,
    theme,
    symptomName,
    profileId,
    profileName, // <--- Recibe el nombre del perfil
    onBack,
    onFinish
}) {
    const isDark = theme === 'dark';
    const fileInputRef = useRef(null);

    const [sessionId, setSessionId] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [answers, setAnswers] = useState({});
    const [questionCount, setQuestionCount] = useState(0);
    const [maxQuestions, setMaxQuestions] = useState(12);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const startEvaluation = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await iniciarTriaje(symptomName);
                const data = response?.data;

                if (!data) {
                    throw new Error('El servidor no devolvió los datos del cuestionario.');
                }

                if (!active) return;

                setSessionId(data.id_sesion);
                setQuestion(data.pregunta_actual || null);
                setQuestionCount(data.preguntas_realizadas || 0);
                setMaxQuestions(data.max_preguntas || 12);

            } catch (err) {
                if (active) {
                    setError(err.message || 'No fue posible iniciar la evaluación.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        startEvaluation();

        return () => {
            active = false;
        };
    }, [symptomName]);

    const handleAnswer = (value) => {
        setAnswer(value);
        setError('');
    };

    const handlePhoto = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Selecciona un archivo de imagen válido.');
            return;
        }

        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setError('');
    };

    const removePhoto = () => {
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhoto(null);
        setPhotoPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleContinue = async () => {
        if (!question || !sessionId || sending) return;

        const isImageQuestion = question.tipo === 'imagen';
        const selectedYes = answer.toLowerCase().includes('sí');

        if (!answer.trim()) {
            setError('Selecciona o escribe una respuesta para continuar.');
            return;
        }

        if (isImageQuestion && selectedYes && !photo) {
            setError('Seleccionaste adjuntar una foto. Primero debes elegir una imagen.');
            return;
        }

        try {
            setSending(true);
            setError('');

            const response = await responderPregunta({
                idSesion: sessionId,
                idPregunta: question.id_node,
                respuesta: answer,
                archivo: isImageQuestion && selectedYes ? photo : null
            });

            const data = response?.data;

            if (!data) {
                throw new Error('El servidor no devolvió una respuesta válida.');
            }

            const updatedAnswers = {
                ...answers,
                [question.id_node]: {
                    question: question.pregunta,
                    answer: answer
                }
            };

            setAnswers(updatedAnswers);

            // El backend terminó la evaluación
            if (
                data.estado === 'COMPLETADO' &&
                data.resultado_final
            ) {
                const finalResult = {
                    ...data.resultado_final,
                    resultado_final: data.resultado_final,
                    symptomName,
                    profileId,
                    profileName: profileName || 'Perfil principal', // <--- Se agrega al resultado final
                    answers: updatedAnswers
                };

                onFinish(finalResult);
                return;
            }

            if (data.estado === 'EN_PROGRESO' && data.pregunta_actual) {
                setQuestion(data.pregunta_actual);
                setQuestionCount(data.preguntas_realizadas || questionCount + 1);
                setAnswer('');
                removePhoto();
                return;
            }

            throw new Error(
                data.mensaje || 'El cuestionario no pudo continuar.'
            );

        } catch (err) {
            setError(err.message || 'Ocurrió un error al enviar tu respuesta.');
        } finally {
            setSending(false);
        }
    };

    const handlePrevious = () => {
        if (questionCount <= 0) {
            onBack();
        } else {
            setError(
                'El cuestionario se procesa en orden. No es posible regresar a una pregunta anterior.'
            );
        }
    };

    const progress = Math.min(
        100,
        (questionCount / maxQuestions) * 100
    );

    const renderQuestion = () => {
        if (!question) return null;

        switch (question.tipo) {
            case 'opcion':
                return (
                    <div className="answer-list">
                        {(question.opciones || []).map((option, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`answer-option ${
                                    answer === option ? 'selected' : ''
                                }`}
                                onClick={() => handleAnswer(option)}
                                disabled={sending}
                            >
                                <span className="answer-circle"></span>
                                {option}
                            </button>
                        ))}
                    </div>
                );

            case 'escala':
                return (
                    <div className="answer-list">
                        <p>Selecciona un valor del 1 al 10:</p>

                        <div className="scale-options">
                            {Array.from({ length: 10 }, (_, index) => {
                                const value = String(index + 1);

                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        className={`answer-option ${
                                            answer === value ? 'selected' : ''
                                        }`}
                                        onClick={() => handleAnswer(value)}
                                        disabled={sending}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'texto':
                return (
                    <div className="answer-list">
                        <textarea
                            className="text-answer"
                            value={answer}
                            onChange={(event) => handleAnswer(event.target.value)}
                            placeholder="Escribe tu respuesta..."
                            rows={4}
                            disabled={sending}
                        />
                    </div>
                );

            case 'imagen':
                return (
                    <div className="photo-section">
                        {(question.opciones || []).map((option, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`answer-option ${
                                    answer === option ? 'selected' : ''
                                }`}
                                onClick={() => {
                                    handleAnswer(option);

                                    if (!option.toLowerCase().includes('sí')) {
                                        removePhoto();
                                    }
                                }}
                                disabled={sending}
                            >
                                <span className="answer-circle"></span>
                                {option}
                            </button>
                        ))}

                        {answer.toLowerCase().includes('sí') && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden-file-input"
                                    onChange={handlePhoto}
                                />

                                <button
                                    type="button"
                                    className="photo-button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={sending}
                                >
                                    Seleccionar fotografía
                                </button>

                                {photoPreview && (
                                    <div className="photo-preview">
                                        <img
                                            src={photoPreview}
                                            alt="Vista previa"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '180px',
                                                objectFit: 'contain'
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                        >
                                            Quitar fotografía
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );

            default:
                return (
                    <p>El tipo de pregunta recibido no es compatible.</p>
                );
        }
    };

    return (
        <div className={`symptom-screen ${isDark ? 'dark-mode' : ''}`}>
            <header className="symptom-header">
                <button
                    className="symptom-back"
                    onClick={handlePrevious}
                    disabled={sending}
                >
                    ‹ Regresar
                </button>

                <div className="symptom-header-info">
                    <h1>Evaluación de síntomas</h1>
                    <p>{symptomName}</p>
                </div>
            </header>

            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>

                <span>
                    Pregunta {questionCount + 1} de {maxQuestions}
                </span>
            </div>

            <main className="symptom-content">
                {loading ? (
                    <div className="question-card">
                        <p>Preparando tu evaluación...</p>
                    </div>
                ) : error && !question ? (
                    <div className="question-card">
                        <p>{error}</p>

                        <button
                            className="continue-button"
                            onClick={onBack}
                        >
                            Regresar
                        </button>
                    </div>
                ) : question ? (
                    <>
                        <div className="symptom-tag">
                            {symptomName}
                        </div>

                        <section className="question-card">
                            <span className="question-number">
                                Pregunta {questionCount + 1}
                            </span>

                            <h2>{question.pregunta}</h2>

                            {renderQuestion()}

                            {error && (
                                <p
                                    role="alert"
                                    style={{
                                        color: '#c62828',
                                        fontSize: '13px',
                                        marginTop: '12px'
                                    }}
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                className="continue-button"
                                onClick={handleContinue}
                                disabled={sending}
                            >
                                {sending ? 'Enviando respuesta...' : 'Continuar'}
                            </button>
                        </section>
                    </>
                ) : (
                    <div className="question-card">
                        <p>No hay una pregunta disponible.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default SymptomStep1;