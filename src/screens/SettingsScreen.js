import React, { useState } from 'react';
import '../styles/SettingsScreen.css';

function SettingsScreen({
    language,
    setLanguage,
    theme,
    setTheme,
    locationEnabled,
    setLocationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    cameraEnabled,
    setCameraEnabled,
    onBackHome,
    onAccount,
    onLogout
}) {

    const [activeModal, setActiveModal] = useState(null);
    const [faqOpen, setFaqOpen] = useState(null);

    const isDark = theme === 'dark';

    const text = {
        es: {
            title: 'Ajustes',
            preferences: 'Preferencias',
            language: 'Idioma',
            spanish: 'Español',
            english: 'English',
            visual: 'Brillo / Modo visual',
            dark: 'Modo oscuro',
            light: 'Modo claro',
            location: 'Ubicación',
            locationDesc: 'Preferencia para futuras recomendaciones de médicos cercanos',
            notifications: 'Notificaciones',
            notificationsDesc: 'Preferencia de notificaciones; función aún no conectada',
            camera: 'Cámara',
            cameraDesc: 'Permitir captura de fotografías durante la evaluación',
            information: 'Información',
            privacy: 'Aviso de Privacidad',
            help: 'Ayuda',
            faq: 'Preguntas frecuentes',
            contact: 'Contacto',
            account: 'Mi cuenta',
            logout: 'Cerrar sesión',
            close: 'Cerrar',
            privacyTitle: 'Aviso de Privacidad',
            helpTitle: 'Ayuda',
            faqTitle: 'Preguntas frecuentes',
            contactTitle: 'Contacto',
            privacyText:
                'DECIA utiliza la información proporcionada por el usuario para ofrecer una orientación inicial sobre sus síntomas. Los datos relacionados con la salud pueden considerarse información sensible. DECIA debe utilizar esta información únicamente para las funciones autorizadas por el usuario y aplicar medidas de protección adecuadas.',
            privacyText2:
                'Las fotografías tomadas mediante la cámara forman parte de la información proporcionada durante una evaluación. El usuario puede consultar, modificar o solicitar la eliminación de sus datos conforme a los mecanismos disponibles y a la legislación aplicable.',
            helpIntro:
                'DECIA es una herramienta de orientación inicial. No sustituye la valoración, diagnóstico o tratamiento de un profesional de la salud.',
            faq1: '¿DECIA realiza diagnósticos médicos?',
            faq1Answer:
                'No. DECIA proporciona una orientación inicial y una clasificación de prioridad. El resultado no constituye un diagnóstico médico.',
            faq2: '¿Qué hago si mis síntomas empeoran?',
            faq2Answer:
                'Si los síntomas empeoran, aparecen nuevos signos de alarma o existe una emergencia, busca atención médica inmediatamente.',
            faq3: '¿Es obligatorio responder todas las preguntas?',
            faq3Answer:
                'Las respuestas ayudan a generar una orientación más completa. Si no conoces una respuesta, debes indicarlo en lugar de proporcionar información incorrecta.',
            faq4: '¿Qué significan los colores?',
            faq4Answer:
                'Rojo corresponde a atención inmediata; Naranja a emergencia; Amarillo a urgencia; Verde a menos urgente; Azul a no urgente.'
        },

        en: {
            title: 'Settings',
            preferences: 'Preferences',
            language: 'Language',
            spanish: 'Español',
            english: 'English',
            visual: 'Brightness / Visual mode',
            dark: 'Dark mode',
            light: 'Light mode',
            location: 'Location',
            locationDesc: 'Allow nearby doctor recommendations',
            notifications: 'Notifications',
            notificationsDesc: 'Health alerts and reminders',
            camera: 'Camera',
            cameraDesc: 'Allow photo capture during evaluation',
            information: 'Information',
            privacy: 'Privacy Notice',
            help: 'Help',
            faq: 'Frequently Asked Questions',
            contact: 'Contact',
            account: 'My account',
            logout: 'Log out',
            close: 'Close',
            privacyTitle: 'Privacy Notice',
            helpTitle: 'Help',
            faqTitle: 'Frequently Asked Questions',
            contactTitle: 'Contact',
            privacyText:
                'DECIA uses the information provided by the user to offer initial guidance regarding symptoms. Health-related data may be considered sensitive information. DECIA should use this information only for functions authorized by the user and apply appropriate protection measures.',
            privacyText2:
                'Photographs taken through the camera are part of the information provided during an evaluation. Users may consult, modify or request deletion of their information according to available mechanisms and applicable legislation.',
            helpIntro:
                'DECIA is an initial guidance tool. It does not replace professional medical evaluation, diagnosis or treatment.',
            faq1: 'Does DECIA provide medical diagnoses?',
            faq1Answer:
                'No. DECIA provides initial guidance and priority classification. The result is not a medical diagnosis.',
            faq2: 'What should I do if my symptoms get worse?',
            faq2Answer:
                'If symptoms get worse, new warning signs appear or there is an emergency, seek medical attention immediately.',
            faq3: 'Do I have to answer every question?',
            faq3Answer:
                'Answers help provide more complete guidance. If you do not know an answer, indicate that instead of providing incorrect information.',
            faq4: 'What do the colors mean?',
            faq4Answer:
                'Red means immediate attention; Orange means emergency; Yellow means urgent; Green means less urgent; Blue means non-urgent.'
        }
    };

    const t = language === 'en' ? text.en : text.es;


    const openModal = (modal) => {
        setActiveModal(modal);
    };


    const closeModal = () => {
        setActiveModal(null);
        setFaqOpen(null);
    };


    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };


    return (
        <div className={`settings-screen ${isDark ? 'dark-mode' : ''}`}>

            {/* FONDO DECORATIVO */}

            <div className="settings-decoration" aria-hidden="true">
                <span className="gear gear-one">⚙</span>
                <span className="gear gear-two">⚙</span>
                <span className="gear gear-three">⚙</span>
                <span className="medical-cross cross-one">+</span>
                <span className="medical-cross cross-two">+</span>
            </div>


            {/* HEADER */}

            <header className="settings-header">

                <button
                    className="settings-back"
                    onClick={onBackHome}
                >
                    ‹ Inicio
                </button>

                <h1>{t.title}</h1>

                <button
                    className="account-header-button"
                    onClick={onAccount}
                >
                    Cuenta
                </button>

            </header>


            <main className="settings-content">


                {/* PREFERENCIAS */}

                <section className="settings-card">

                    <h2>{t.preferences}</h2>


                    {/* IDIOMA */}

                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>{t.language}</strong>
                            <span>
                                Selecciona el idioma de DECIA
                            </span>
                        </div>

                        <select
                            className="language-select"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <option value="es">
                                {t.spanish}
                            </option>

                            <option value="en">
                                {t.english}
                            </option>
                        </select>

                    </div>


                    {/* TEMA */}

                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>{t.visual}</strong>

                            <span>
                                {isDark ? t.dark : t.light}
                            </span>
                        </div>

                        <label className="switch">

                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={(e) =>
                                    setTheme(
                                        e.target.checked
                                            ? 'dark'
                                            : 'light'
                                    )
                                }
                            />

                            <span className="slider"></span>

                        </label>

                    </div>


                    {/* UBICACIÓN */}

                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>{t.location}</strong>

                            <span>
                                {t.locationDesc}
                            </span>
                        </div>

                        <label className="switch">

                            <input
                                type="checkbox"
                                checked={locationEnabled}
                                onChange={(e) =>
                                    setLocationEnabled(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="slider"></span>

                        </label>

                    </div>


                    {/* NOTIFICACIONES */}

                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>{t.notifications}</strong>

                            <span>
                                {t.notificationsDesc}
                            </span>
                        </div>

                        <label className="switch">

                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) =>
                                    setNotificationsEnabled(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="slider"></span>

                        </label>

                    </div>


                    {/* CÁMARA */}

                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>{t.camera}</strong>

                            <span>
                                {t.cameraDesc}
                            </span>
                        </div>

                        <label className="switch">

                            <input
                                type="checkbox"
                                checked={cameraEnabled}
                                onChange={(e) =>
                                    setCameraEnabled(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="slider"></span>

                        </label>

                    </div>

                </section>


                {/* INFORMACIÓN */}

                <section className="settings-card">

                    <h2>{t.information}</h2>


                    <button
                        className="settings-option"
                        onClick={() => openModal('privacy')}
                    >
                        <span>{t.privacy}</span>
                        <span>›</span>
                    </button>


                    <button
                        className="settings-option"
                        onClick={() => openModal('help')}
                    >
                        <span>{t.help}</span>
                        <span>›</span>
                    </button>


                    <button
                        className="settings-option"
                        onClick={() => openModal('faq')}
                    >
                        <span>{t.faq}</span>
                        <span>›</span>
                    </button>


                    <button
                        className="settings-option"
                        onClick={() => openModal('contact')}
                    >
                        <span>{t.contact}</span>
                        <span>›</span>
                    </button>

                </section>


                {/* CERRAR SESIÓN */}

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    {t.logout}
                </button>


            </main>


            {/* ==========================================
                MODAL
            ========================================== */}

            {activeModal && (

                <div
                    className="settings-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="settings-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={closeModal}
                        >
                            ×
                        </button>


                        {/* PRIVACIDAD */}

                        {activeModal === 'privacy' && (

                            <>

                                <h2>
                                    {t.privacyTitle}
                                </h2>

                                <h3>
                                    Aviso de Privacidad y Uso de DECIA
                                </h3>

                                <p>
                                    {t.privacyText}
                                </p>

                                <p>
                                    {t.privacyText2}
                                </p>

                                <p>
                                    Fecha de actualización:
                                    <strong>
                                        {' 18 de septiembre de 2026'}
                                    </strong>
                                </p>

                            </>

                        )}


                        {/* AYUDA */}

                        {activeModal === 'help' && (

                            <>

                                <h2>
                                    {t.helpTitle}
                                </h2>

                                <p>
                                    {t.helpIntro}
                                </p>

                                <div className="help-steps">

                                    <div>
                                        <strong>1.</strong>
                                        Selecciona el síntoma
                                        que deseas evaluar.
                                    </div>

                                    <div>
                                        <strong>2.</strong>
                                        Selecciona el perfil
                                        de la persona evaluada.
                                    </div>

                                    <div>
                                        <strong>3.</strong>
                                        Responde las preguntas.
                                    </div>

                                    <div>
                                        <strong>4.</strong>
                                        Revisa el resultado
                                        proporcionado por DECIA.
                                    </div>

                                    <div>
                                        <strong>5.</strong>
                                        Si los síntomas empeoran,
                                        busca atención profesional.
                                    </div>

                                </div>


                                <h3>
                                    Significado de los niveles
                                </h3>

                                <div className="triage-table">

                                    <div className="triage-row rojo">
                                        <strong>Rojo</strong>
                                        <span>
                                            Atención inmediata
                                        </span>
                                    </div>

                                    <div className="triage-row naranja">
                                        <strong>Naranja</strong>
                                        <span>
                                            Emergencia
                                        </span>
                                    </div>

                                    <div className="triage-row amarillo">
                                        <strong>Amarillo</strong>
                                        <span>
                                            Urgencia
                                        </span>
                                    </div>

                                    <div className="triage-row verde">
                                        <strong>Verde</strong>
                                        <span>
                                            Menos urgente
                                        </span>
                                    </div>

                                    <div className="triage-row azul">
                                        <strong>Azul</strong>
                                        <span>
                                            No urgente
                                        </span>
                                    </div>

                                </div>

                            </>

                        )}


                        {/* FAQ */}

                        {activeModal === 'faq' && (

                            <>

                                <h2>
                                    {t.faqTitle}
                                </h2>


                                <div className="faq-list">

                                    <button
                                        onClick={() =>
                                            setFaqOpen(
                                                faqOpen === 1
                                                    ? null
                                                    : 1
                                            )
                                        }
                                    >
                                        <span>
                                            {t.faq1}
                                        </span>
                                        <span>
                                            {faqOpen === 1
                                                ? '−'
                                                : '+'}
                                        </span>
                                    </button>

                                    {faqOpen === 1 && (
                                        <p>
                                            {t.faq1Answer}
                                        </p>
                                    )}


                                    <button
                                        onClick={() =>
                                            setFaqOpen(
                                                faqOpen === 2
                                                    ? null
                                                    : 2
                                            )
                                        }
                                    >
                                        <span>
                                            {t.faq2}
                                        </span>
                                        <span>
                                            {faqOpen === 2
                                                ? '−'
                                                : '+'}
                                        </span>
                                    </button>

                                    {faqOpen === 2 && (
                                        <p>
                                            {t.faq2Answer}
                                        </p>
                                    )}


                                    <button
                                        onClick={() =>
                                            setFaqOpen(
                                                faqOpen === 3
                                                    ? null
                                                    : 3
                                            )
                                        }
                                    >
                                        <span>
                                            {t.faq3}
                                        </span>
                                        <span>
                                            {faqOpen === 3
                                                ? '−'
                                                : '+'}
                                        </span>
                                    </button>

                                    {faqOpen === 3 && (
                                        <p>
                                            {t.faq3Answer}
                                        </p>
                                    )}


                                    <button
                                        onClick={() =>
                                            setFaqOpen(
                                                faqOpen === 4
                                                    ? null
                                                    : 4
                                            )
                                        }
                                    >
                                        <span>
                                            {t.faq4}
                                        </span>
                                        <span>
                                            {faqOpen === 4
                                                ? '−'
                                                : '+'}
                                        </span>
                                    </button>

                                    {faqOpen === 4 && (
                                        <p>
                                            {t.faq4Answer}
                                        </p>
                                    )}

                                </div>

                            </>

                        )}


                        {/* CONTACTO */}

                        {activeModal === 'contact' && (

                            <>

                                <h2>
                                    {t.contactTitle}
                                </h2>

                                <p>
                                    Si necesitas ayuda con
                                    DECIA puedes comunicarte
                                    con nuestro correo de soporte.
                                </p>

                                <div className="contact-box">

                                    <strong>
                                        decia1905@gmail.com
                                    </strong>

                                </div>

                                <a
                                    className="email-button"
                                    href="mailto:decia1905@gmail.com"
                                >
                                    Enviar correo
                                </a>

                            </>

                        )}


                        <button
                            className="modal-close-button"
                            onClick={closeModal}
                        >
                            {t.close}
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default SettingsScreen;