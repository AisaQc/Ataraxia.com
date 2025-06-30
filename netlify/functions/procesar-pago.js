// netlify/functions/procesar-pago.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { token, monto, correo, descripcion } = JSON.parse(event.body);

  const response = await fetch('https://api.culqi.com/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk_test_xxxxxxxxxxxxxxxxxxx' // Reemplaza con tu clave privada
    },
    body: JSON.stringify({
      amount: monto,
      currency_code: 'PEN',
      email: correo,
      source_id: token,
      description
    })
  });

  const data = await response.json();

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
