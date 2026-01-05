CREATE TABLE gebruiker (
    gebruiker_id SERIAL PRIMARY KEY,
    profielfoto VARCHAR(255),
    gebruikersnaam VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    wachtwoord VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    datum_aanmaak TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reportit_buddy (
    buddy_id SERIAL PRIMARY KEY,
    gebruiker_id INT NOT NULL,
    paired_status BOOLEAN NOT NULL DEFAULT FALSE,
    device_naam VARCHAR(100) NOT NULL,
    FOREIGN KEY (gebruiker_id) REFERENCES gebruiker(gebruiker_id)
        ON DELETE CASCADE
);

CREATE TABLE incident (
    incident_id SERIAL PRIMARY KEY,
    gebruiker_id INT NOT NULL,
    type_incident VARCHAR(50) NOT NULL,
    notitie TEXT,
    media VARCHAR(255),
    urgentie INT NOT NULL CHECK (urgentie BETWEEN 1 AND 5),
    tijdstip TIMESTAMP NOT NULL,
    FOREIGN KEY (gebruiker_id) REFERENCES gebruiker(gebruiker_id)
        ON DELETE CASCADE
);

CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    tijdstip_aanmaak TIMESTAMP DEFAULT NOW(),
    titel VARCHAR(100) NOT NULL
);

CREATE TABLE bericht (
    bericht_id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    gebruiker_id INT NOT NULL,
    inhoud TEXT NOT NULL,
    tijdstip TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (thread_id) REFERENCES thread(thread_id)
        ON DELETE CASCADE,
    FOREIGN KEY (gebruiker_id) REFERENCES gebruiker(gebruiker_id)
        ON DELETE CASCADE
);

CREATE TABLE mood_geschiedenis (
    mood_id SERIAL PRIMARY KEY,
    gebruiker_id INT NOT NULL,
    mood VARCHAR(20) NOT NULL,
    tijdstip TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (gebruiker_id) REFERENCES gebruiker(gebruiker_id)
        ON DELETE CASCADE
);

CREATE TABLE vertrouwenspersoon (
    vertrouwenspersoon_id SERIAL PRIMARY KEY,
    naam VARCHAR(100) NOT NULL,
    contactinfo VARCHAR(255)
);

CREATE TABLE vertrouwensrelatie (
    gebruiker_id INT NOT NULL,
    vertrouwenspersoon_id INT NOT NULL,
    relatie_tot_gebruiker VARCHAR(50) NOT NULL,
    PRIMARY KEY(gebruiker_id, vertrouwenspersoon_id),
    FOREIGN KEY(gebruiker_id) REFERENCES gebruiker(gebruiker_id)
        ON DELETE CASCADE,
    FOREIGN KEY(vertrouwenspersoon_id) REFERENCES vertrouwenspersoon(vertrouwenspersoon_id)
        ON DELETE CASCADE
);
