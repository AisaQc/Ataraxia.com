// netlify/functions/procesar-pago.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { token, monto, descripcion, correo } = JSON.parse(event.body);

  const response = await fetch('https://api.culqi.com/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk_test_XXXXXX' // ← Reemplaza con tu SK de prueba o producción
    },
    body: JSON.stringify({
      amount: monto,
      currency_code: 'PEN',
      email: correo,
      source_id: token,
      description: descripcion
    })
  });

  const data = await response.json();
  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pago exitoso', data })
    };
  } else {
    return {
      statusCode: response.status,
      body: JSON.stringify({ message: 'Error en el pago', data })
    };
  }
};
