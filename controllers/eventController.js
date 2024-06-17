const Event = require('../models/Event');

// Criar evento
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: req.user.id
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor, tente novamente mais tarde');
    }
};

// Obter todos os eventos
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('Organizador', ['name', 'email']);
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor, tente novamente mais tarde');
    }
};

// Obter um evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('Organizador', ['name', 'email']);
        if (!event) {
            return res.status(404).json({ msg: 'Evento não encontrado' });
        }
        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Evento não encontrado' });
        }
        res.status(500).send('Erro no Servidor, tente novamente mais tarde');
    }
};

// Atualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        // Build event object
        const eventFields = {};
        if (title) eventFields.title = title;
        if (description) eventFields.description = description;
        if (date) eventFields.date = date;
        if (location) eventFields.location = location;

        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Erro no Servidor, tente novamente mais tarde' });

        // Verificar se o usuário é o organizador do evento
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuário não autorizado' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor, tente novamente mais tarde');
    }
};

// Excluir evento
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Evento não encontrado' });
        }

        // Verificar se o usuário é o organizador do evento
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuário não autorizado' });
        }

        await event.remove();

        res.json({ msg: 'Evento Removido' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Evento não encontrado' });
        }
        res.status(500).send('Erro no Servidor, tente novamente mais tarde');
    }
};
