const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Configuración de CORS antes de cualquier ruta
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Manejar las solicitudes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Configuración de Bold
const BOLD_API_KEY = '_rwNxehv700w7y1Dsr5UE4ADEZKE7AgtTUC5vHRS17g';
const BOLD_API_URL = 'https://integrations.api.bold.co';

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Endpoint para crear pago
app.post('/api/create-payment', async (req, res) => {
    try {
        console.log('Creando pago:', req.body);
        const response = await axios.post(`${BOLD_API_URL}/online/link/v1`, req.body, {
            headers: {
                'Authorization': `x-api-key ${BOLD_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Respuesta de Bold:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error al crear pago:', error.response?.data || error.message);
        res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Error desconocido'
        });
    }
});

// Endpoint para verificar pago
app.get('/api/check-payment/:paymentLink', async (req, res) => {
    try {
        console.log('Verificando pago:', req.params.paymentLink);
        const response = await axios.get(
            `${BOLD_API_URL}/online/link/v1/${req.params.paymentLink}`,
            {
                headers: {
                    'Authorization': `x-api-key ${BOLD_API_KEY}`
                }
            }
        );
        console.log('Estado del pago:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error al verificar pago:', error.response?.data || error.message);
        res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Error desconocido'
        });
    }
});

module.exports = app;
