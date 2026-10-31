import React, { useEffect, useRef, useState } from 'react';
import { getUserProfile } from '../services/api';
import '../styles/AccountScreen.css';

function AccountScreen({
    theme = 'light',
    onBack,
    onHome,
    onSettings
}) {
    const isDark = theme === 'dark';

   const [profiles, setProfiles] = useState([]);
   const [profileLoading, setProfileLoading] = useState(true);
   const [profileError, setProfileError] = useState('');

    const [contacts, setContacts] = useState([]);

    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const [showProfileForm, setShowProfileForm] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);

    const [showSOS, setShowSOS] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: '',
        relationship: '',
        phone: '',
        primary: false
    });

    const [profileForm, setProfileForm] = useState({
        name: '',
        gender: '',
        birthDate: '',
        conditions: '',
        bloodType: '',
        allergies: '',
        photo: null
    });

    const fileInputRef = useRef(null);
    const [photoTarget, setPhotoTarget] = useState(null);

useEffect(() => {
    const loadUserProfile = async () => {
        try {
            setProfileLoading(true);
            setProfileError('');

            const response = await getUserProfile();

            const data = response?.data || response;
            const account = data?.cuenta;
            const profile = data?.perfil;

            if (!account) {
                throw new Error('No se encontraron los datos de la cuenta.');
            }

            const userProfile = {
                id: profile?.id_perfil || account.id_cuenta,
                name: profile?.nombre || account.nombre || 'Usuario DECIA',
                gender: profile?.genero || '',
                birthDate: profile?.fecha_nacimiento || '',
                conditions: 'Sin antecedentes registrados',
                bloodType: '',
                allergies: '',
                photo: null
            };

            setProfiles([userProfile]);
            setSelectedProfile(userProfile);

        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            setProfileError(
                error.message || 'No fue posible cargar tu perfil.'
            );
        } finally {
            setProfileLoading(false);
        }
    };

    loadUserProfile();
}, []);



    const getInitials = (name) => {
        if (!name) return 'US';

        return name
            .trim()
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    };

    const handleSOS = () => {
        setShowSOS(true);
    };

    const call911 = () => {
        window.location.href = 'tel:911';
    };

    const sendEmergencySMS = (contact) => {
        if (!contact?.phone) return;

        const sendLocationMessage = (locationText) => {
            const message =
                `ALERTA DECIA: Necesito ayuda de emergencia. ` +
                `Persona: ${selectedProfile?.name || 'Usuario DECIA'}. ` +
                `${locationText}`;

            window.location.href =
                `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
        };

        if (!navigator.geolocation) {
            sendLocationMessage('No fue posible obtener la ubicación.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const locationText =
                    `Ubicación aproximada: https://maps.google.com/?q=${latitude},${longitude}`;

                sendLocationMessage(locationText);
            },
            () => {
                sendLocationMessage(
                    'No fue posible obtener la ubicación. Verifica tu ubicación manualmente.'
                );
            }
        );
    };

    const handleAddContact = () => {
        setEditingContact(null);

        setContactForm({
            name: '',
            relationship: '',
            phone: '',
            primary: contacts.length === 0
        });

        setShowContactForm(true);
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);

        setContactForm({
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
            primary: contact.primary
        });

        setShowContactForm(true);
    };

    const handleDeleteContact = (id) => {
        const confirmDelete = window.confirm(
            '¿Deseas eliminar este contacto de emergencia?'
        );

        if (!confirmDelete) return;

        const updated = contacts.filter(contact => contact.id !== id);

        setContacts(updated);

        if (updated.length > 0 && !updated.some(contact => contact.primary)) {
            setContacts(
                updated.map((contact, index) => ({
                    ...contact,
                    primary: index === 0
                }))
            );
        }
    };

   const handleContactSubmit = (event) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
        alert('El nombre y teléfono son obligatorios.');
        return;
    }

    const contact = editingContact
        ? {
            ...editingContact,
            ...contactForm
        }
        : {
            id: Date.now(),
            ...contactForm
        };

    setContacts(prev => {
        const updated = editingContact
            ? prev.map(item =>
                item.id === editingContact.id ? contact : item
            )
            : [...prev, contact];

        if (contactForm.primary || updated.length === 1) {
            return updated.map(item => ({
                ...item,
                primary: item.id === contact.id
            }));
        }

        return updated;
    });

    setShowContactForm(false);
};

    const handleAddProfile = () => {
        setEditingProfile(null);

        setProfileForm({
            name: '',
            gender: '',
            birthDate: '',
            conditions: '',
            bloodType: '',
            allergies: '',
            photo: null
        });

        setShowProfileForm(true);
    };

    const handleEditProfile = (profile) => {
        setEditingProfile(profile);

        setProfileForm({
            name: profile.name,
            gender: profile.gender,
            birthDate: profile.birthDate,
            conditions: profile.conditions,
            bloodType: profile.bloodType,
            allergies: profile.allergies,
            photo: profile.photo
        });

        setShowProfileForm(true);
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();

        if (!profileForm.name.trim()) {
            alert('El nombre completo es obligatorio.');
            return;
        }

        if (editingProfile) {
            const updatedProfile = {
                ...editingProfile,
                ...profileForm
            };

            setProfiles(prev =>
                prev.map(profile =>
                    profile.id === editingProfile.id
                        ? updatedProfile
                        : profile
                )
            );

           if (selectedProfile?.id === editingProfile.id){
                setSelectedProfile(updatedProfile);
            }
        } else {
            const newProfile = {
                id: Date.now(),
                ...profileForm
            };

            setProfiles(prev => [...prev, newProfile]);
        }

        setShowProfileForm(false);
    };

    const handlePhotoClick = (profileId) => {
        setPhotoTarget(profileId);

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file || !photoTarget) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const photo = e.target.result;

            setProfiles(prev =>
                prev.map(profile =>
                    profile.id === photoTarget
                        ? { ...profile, photo }
                        : profile
                )
            );

            if (selectedProfile.id === photoTarget) {
                setSelectedProfile(prev => ({
                    ...prev,
                    photo
                }));
            }
        };

        reader.readAsDataURL(file);
    };

    const primaryContact = contacts.find(contact => contact.primary);

    return (
        <div className={`account-screen ${isDark ? 'dark-mode' : ''}`}>

            <header className="account-header">
                <button
                    className="account-back-button"
                    onClick={onBack || onHome}
                    type="button"
                >
                    ←
                </button>

                <div className="account-header-title">
                    <h1>Mi Cuenta</h1>
                    <p>Perfiles y contactos de emergencia</p>
                </div>

                <div className="account-header-space"></div>
            </header>

            <main className="account-content">

                <section className="sos-section">
                    <button
                        className="sos-button"
                        onClick={handleSOS}
                        type="button"
                    >
                        <span className="sos-icon">SOS</span>
                        <span className="sos-text">
                            EMERGENCIA
                        </span>
                        <small>
                            Presiona para solicitar ayuda
                        </small>
                    </button>
                </section>

                <section className="medical-card">

                    <div className="section-title">
                        <div>
                            <h2>Ficha médica rápida</h2>
                            <p>Información importante para una emergencia</p>
                        </div>
                    </div>

                    <div className="medical-grid">

                        <div className="medical-item">
                            <span>Tipo de sangre</span>
                            <strong>
                                {selectedProfile?.bloodType || 'No registrado'}
                            </strong>
                        </div>

                        <div className="medical-item">
                            <span>Alergias</span>
                            <strong>
                                 {selectedProfile?.allergies || 'No registradas'}
                            </strong>
                        </div>

                        <div className="medical-item medical-item-wide">
                            <span>Padecimientos / antecedentes</span>
                           <strong>
                                 {selectedProfile?.conditions || 'No registrados'}          
                            </strong>
                        </div>

                    </div>

                </section>

                <section className="profiles-section">

                    <div className="section-heading">
                        <div>
                            <h2>Mis perfiles</h2>
                            <p>Personas registradas en DECIA</p>
                        </div>

                        <button
                            className="add-button"
                            onClick={handleAddProfile}
                            type="button"
                        >
                            + Agregar
                        </button>
                        {profileLoading && (
                                <p>Cargando información de tu cuenta...</p>
                            )}

                            {profileError && (
                                <p role="alert">{profileError}</p>
                            )}
                    </div>

                    <div className="profiles-list">

                        {profiles.map(profile => (

                            <article
                                className={`profile-account-card ${
                                    selectedProfile?.id === profile.id
                                        ? 'selected'
                                        : ''
                                }`}
                                key={profile.id}
                            >

                                <button
                                    className="profile-avatar-button"
                                    onClick={() => handlePhotoClick(profile.id)}
                                    type="button"
                                    title="Cambiar fotografía"
                                >
                                    {profile.photo ? (
                                        <img
                                            src={profile.photo}
                                            alt={profile.name}
                                        />
                                    ) : (
                                        <span>
                                            {getInitials(profile.name)}
                                        </span>
                                    )}

                                    <span className="camera-badge">
                                        Cámara
                                    </span>
                                </button>

                                <div className="profile-account-info">

                                    <h3>{profile.name}</h3>

                                    <p>
                                        {profile.gender || 'Género no registrado'}
                                    </p>

                                    <p>
                                        Fecha de nacimiento:{' '}
                                        {profile.birthDate || 'No registrada'}
                                    </p>

                                    <button
                                        className="select-profile-button"
                                        onClick={() => setSelectedProfile(profile)}
                                        type="button"
                                    >
                                        {selectedProfile?.id === profile.id
                                            ? 'Perfil activo'
                                            : 'Usar este perfil'}
                                    </button>

                                </div>

                                <button
                                    className="edit-button"
                                    onClick={() => handleEditProfile(profile)}
                                    type="button"
                                >
                                    Editar
                                </button>

                            </article>

                        ))}

                    </div>

                </section>

                <section className="emergency-contacts-section">

                    <div className="section-heading">

                        <div>
                            <h2>Contactos de emergencia</h2>
                            <p>
                                Personas que pueden recibir una alerta
                            </p>
                        </div>

                        <button
                            className="add-button"
                            onClick={handleAddContact}
                            type="button"
                        >
                            + Agregar
                        </button>

                    </div>

                    <div className="contacts-list">

                        {contacts.length === 0 ? (

                            <div className="empty-state">
                                <h3>No hay contactos registrados</h3>
                                <p>
                                    Agrega una persona para utilizarla
                                    como contacto de emergencia.
                                </p>
                            </div>

                        ) : (

                            contacts.map(contact => (

                                <article
                                    className="emergency-contact-card"
                                    key={contact.id}
                                >

                                    <div className="contact-avatar">
                                        {getInitials(contact.name)}
                                    </div>

                                    <div className="contact-info">

                                        <div className="contact-name-row">
                                            <h3>{contact.name}</h3>

                                            {contact.primary && (
                                                <span className="primary-badge">
                                                    Contacto Principal
                                                </span>
                                            )}

                                        </div>

                                        <p>
                                            {contact.relationship ||
                                                'Sin parentesco registrado'}
                                        </p>

                                        <p>{contact.phone}</p>

                                    </div>

                                    <div className="contact-actions">

                                        <button
                                            onClick={() =>
                                                handleEditContact(contact)
                                            }
                                            type="button"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteContact(contact.id)
                                            }
                                            type="button"
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                </section>

            </main>

            <nav className="account-bottom-nav">

                <button
                    type="button"
                    onClick={onHome}
                >
                    <span>Inicio</span>
                </button>

                <button
                    type="button"
                    className="active"
                >
                    <span>Perfiles</span>
                </button>

                <button
                    type="button"
                    onClick={onSettings}
                >
                    <span>Ajustes</span>
                </button>

            </nav>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={handlePhotoChange}
            />

            {showSOS && (

                <div className="account-modal-overlay">

                    <div className="sos-modal">

                        <button
                            className="modal-close"
                            onClick={() => setShowSOS(false)}
                            type="button"
                        >
                            ×
                        </button>

                        <div className="sos-modal-icon">
                            SOS
                        </div>

                        <h2>¿Necesitas ayuda de emergencia?</h2>

                        <p>
                            Utiliza esta opción únicamente si existe
                            una situación que requiere atención inmediata.
                        </p>

                        <div className="quick-medical-info">

                            <strong>
                                {selectedProfile?.name}
                            </strong>

                            <span>
                                Sangre:{' '}
                                {selectedProfile?.bloodType ||
                                    'No registrada'}
                            </span>

                            <span>
                                Alergias:{' '}
                                {selectedProfile?.allergies ||
                                    'No registradas'}
                            </span>

                            <span>
                                Antecedentes:{' '}
                                {selectedProfile?.conditions ||
                                    'No registrados'}
                            </span>

                        </div>

                        <button
                            className="call-911-button"
                            onClick={call911}
                            type="button"
                        >
                            Llamar al 911
                        </button>

                        {primaryContact && (

                            <button
                                className="sms-emergency-button"
                                onClick={() =>
                                    sendEmergencySMS(primaryContact)
                                }
                                type="button"
                            >
                                Alertar a {primaryContact.name}
                            </button>

                        )}

                        <button
                            className="cancel-sos-button"
                            onClick={() => setShowSOS(false)}
                            type="button"
                        >
                            Cancelar
                        </button>

                    </div>

                </div>

            )}

            {showContactForm && (

                <div className="account-modal-overlay">

                    <form
                        className="account-form-modal"
                        onSubmit={handleContactSubmit}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setShowContactForm(false)}
                            type="button"
                        >
                            ×
                        </button>

                        <h2>
                            {editingContact
                                ? 'Editar contacto'
                                : 'Agregar contacto'}
                        </h2>

                        <label>
                            Nombre completo
                            <input
                                type="text"
                                value={contactForm.name}
                                onChange={e =>
                                    setContactForm({
                                        ...contactForm,
                                        name: e.target.value
                                    })
                                }
                                required
                            />
                        </label>

                        <label>
                            Parentesco
                            <input
                                type="text"
                                placeholder="Ej. Esposa, hermano, médico"
                                value={contactForm.relationship}
                                onChange={e =>
                                    setContactForm({
                                        ...contactForm,
                                        relationship: e.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Teléfono
                            <input
                                type="tel"
                                value={contactForm.phone}
                                onChange={e =>
                                    setContactForm({
                                        ...contactForm,
                                        phone: e.target.value
                                    })
                                }
                                required
                            />
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={contactForm.primary}
                                onChange={e =>
                                    setContactForm({
                                        ...contactForm,
                                        primary: e.target.checked
                                    })
                                }
                            />
                            Contacto Principal
                        </label>

                        <button
                            className="save-form-button"
                            type="submit"
                        >
                            Guardar contacto
                        </button>

                    </form>

                </div>

            )}

            {showProfileForm && (

                <div className="account-modal-overlay">

                    <form
                        className="account-form-modal profile-form"
                        onSubmit={handleProfileSubmit}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setShowProfileForm(false)}
                            type="button"
                        >
                            ×
                        </button>

                        <h2>
                            {editingProfile
                                ? 'Editar perfil'
                                : 'Crear perfil'}
                        </h2>

                        <label>
                            Nombre completo
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        name: e.target.value
                                    })
                                }
                                required
                            />
                        </label>

                        <label>
                            Género
                            <select
                                value={profileForm.gender}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        gender: e.target.value
                                    })
                                }
                            >
                                <option value="">Seleccionar</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Otro">Otro</option>
                                <option value="Prefiero no decirlo">
                                    Prefiero no decirlo
                                </option>
                            </select>
                        </label>

                        <label>
                            Fecha de nacimiento
                            <input
                                type="date"
                                value={profileForm.birthDate}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        birthDate: e.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Tipo de sangre
                            <input
                                type="text"
                                placeholder="Ej. O+"
                                value={profileForm.bloodType}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        bloodType: e.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Alergias
                            <textarea
                                placeholder="Alergias conocidas"
                                value={profileForm.allergies}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        allergies: e.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Padecimientos o antecedentes médicos
                            <textarea
                                placeholder="Información médica relevante"
                                value={profileForm.conditions}
                                onChange={e =>
                                    setProfileForm({
                                        ...profileForm,
                                        conditions: e.target.value
                                    })
                                }
                            />
                        </label>

                        <button
                            className="save-form-button"
                            type="submit"
                        >
                            Guardar perfil
                        </button>

                    </form>

                </div>

            )}

        </div>
    );
}

export default AccountScreen;