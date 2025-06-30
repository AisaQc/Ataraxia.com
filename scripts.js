// scripts.js

// ========== Datos de Productos ==========
const products = [
  {
    name: 'Combat Noise',
    type: 'Vinilo',
    price: 100,
    description: 'Frontline Offensive Force, 12" Picture',
    includesShipping: true,
    images: [
      'images/AP001_2.jpg',
      'images/AP001_1.jpg',
      'images/AP001.jpg'
    ],
    defaultImage: 'images/AP001_2.jpg'
  },
  {
    name: 'Heretique',
    type: 'Vinilo',
    price: 100,
    description: 'Bestias Hominum, 12" Incluye bonus track',
    options: ['Edición Clasica', 'Edición Picture'],
    includesShipping: false,
    images: {
      'Edición Clasica': 'images/AP011_3.png',
      'Edición Picture': 'images/AP011_1.png'
    },
    gallery: [
      'images/AP011_4.jpg',
      'images/AP011.jpg',
      'images/AP011_2.jpg',
      'images/AP011_5.jpg'
    ],
    defaultImage: 'images/AP011_4.jpg'
  }
];

const cart = [];

// ========== Renderizar Productos ==========
function renderProducts() {
  const list = document.getElementById('productList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filter = document.getElementById('filterType').value;
  list.innerHTML = '';

  products.filter((p) => {
    return (
      (p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)) &&
      (filter === '' || p.type === filter)
    );
  }).forEach((product, i) => {
    const div = document.createElement('div');
    div.className = 'bg-gray-900 p-4 rounded shadow text-white';

    let mainImage = product.defaultImage || (Array.isArray(product.images) ? product.images[0] : Object.values(product.images)[0]);

    let envioHtml = product.includesShipping ? `<span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">Incluye envío a todo el Perú</span>` : '';

    let imageHtml = `
      <div class="relative mb-2">
        ${envioHtml}
        <img src="${mainImage}" id="img-${i}" class="w-full h-72 object-contain bg-black rounded" alt="${product.name}" />
      </div>
    `;

    let galleryHtml = '';
    if (Array.isArray(product.images)) {
      galleryHtml = `
        <div class="flex space-x-2 overflow-x-auto mb-2">
          ${product.images.map(img => `<img src="${img}" class="w-24 h-24 object-contain bg-black rounded cursor-pointer" onclick="document.getElementById('img-${i}').src='${img}'" alt="${product.name}" />`).join('')}
        </div>
      `;
    } else if (product.gallery && Array.isArray(product.gallery)) {
      galleryHtml = `
        <div class="flex space-x-2 overflow-x-auto mb-2">
          ${product.gallery.map(img => `<img src="${img}" class="w-24 h-24 object-contain bg-black rounded cursor-pointer" onclick="document.getElementById('img-${i}').src='${img}'" alt="${product.name}" />`).join('')}
        </div>
      `;
    }

    let html = `
      <h3 class="text-xl font-bold mb-2">${product.name}</h3>
      ${imageHtml}
      ${galleryHtml}
      <p class="text-sm text-gray-400">${product.type}</p>
      <p class="my-2">${product.description}</p>
      <p class="font-semibold">S/ ${product.price.toFixed(2)}</p>
    `;

    if (product.options) {
      html += `<select id="opt-${i}" class="my-2 w-full border rounded px-2 py-1 text-black" onchange="updateImage(${i})">`;
      product.options.forEach((opt) => {
        html += `<option value="${opt}">${opt}</option>`;
      });
      html += `</select>`;
    }

    html += `<button onclick="addToCart(${i})" class="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full">Agregar al carrito</button>`;

    div.innerHTML = html;
    list.appendChild(div);
  });
}

// ========== Actualizar Imagen según Opción ==========
function updateImage(index) {
  const select = document.getElementById(`opt-${index}`);
  const selected = select.value;
  const product = products[index];
  if (product.images && typeof product.images === 'object') {
    const image = document.getElementById(`img-${index}`);
    image.src = product.images[selected] || product.defaultImage;
  }
}

// ========== Agregar al Carrito ==========
function addToCart(index) {
  const product = products[index];
  const selectedOption = product.options ? document.getElementById(`opt-${index}`).value : null;
  const name = selectedOption ? `${product.name} - ${selectedOption}` : product.name;

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price: product.price || 0, quantity: 1 });
  }

  updateCart();
}

// ========== Actualizar Vista del Carrito ==========
function updateCart() {
  const cartList = document.getElementById('cartItems');
  cartList.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`;
    cartList.appendChild(li);
    subtotal += item.price * item.quantity;
  });

  let total = paymentMethod === 'paypal' ? subtotal * 1.05 : subtotal;
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// ========== Pago con Yape ==========
function mostrarQRYape() {
  paymentMethod = 'yape';
  updateCart();
  document.getElementById('modalYape').classList.remove('hidden');
}

function cerrarQRYape() {
  document.getElementById('modalYape').classList.add('hidden');
}

// ========== Pago con Plin ==========
function mostrarQRPlin() {
  paymentMethod = 'plin';
  updateCart();
  document.getElementById('modalPlin').classList.remove('hidden');
}

function cerrarQRPlin() {
  document.getElementById('modalPlin').classList.add('hidden');
}

// ========== Pago con Tarjeta ==========
function mostrarFormularioTarjeta() {
  paymentMethod = 'tarjeta';
  updateCart();
  document.getElementById('formularioTarjeta').classList.remove('hidden');
}

// ========== Mostrar Formulario de Dirección ==========
document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('shippingFormContainer');
  if (contenedor) {
    contenedor.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">Datos de envío (Olva Courier)</h3>
      <p class="text-sm mb-3 text-yellow-300">Todos los envíos se realizan mediante Olva Courier. Por favor ingrese sus datos completos.</p>
      <input type="text" id="nombreCompleto" placeholder="Nombre completo" class="mb-2 w-full px-3 py-2 rounded text-black">
      <input type="text" id="dni" placeholder="DNI" class="mb-2 w-full px-3 py-2 rounded text-black">
      <input type="text" id="celular" placeholder="Celular" class="mb-2 w-full px-3 py-2 rounded text-black">
      <select id="departamento" class="mb-2 w-full px-3 py-2 rounded text-black">
        <option value="">Departamento</option>
        <option>Lima</option>
        <option>Arequipa</option>
        <option>Cusco</option>
        <option>La Libertad</option>
        <option>Piura</option>
        <option>Otro</option>
      </select>
      <select id="provincia" class="mb-2 w-full px-3 py-2 rounded text-black">
        <option value="">Provincia</option>
        <option>Lima</option>
        <option>Arequipa</option>
        <option>Cusco</option>
        <option>Trujillo</option>
        <option>Piura</option>
      </select>
      <select id="distrito" class="mb-2 w-full px-3 py-2 rounded text-black">
        <option value="">Distrito</option>
        <option>Miraflores</option>
        <option>San Isidro</option>
        <option>Cercado</option>
        <option>Yanahuara</option>
        <option>Otros</option>
      </select>
      <input type="text" id="direccion" placeholder="Dirección exacta" class="mb-2 w-full px-3 py-2 rounded text-black">
      <select id="pais" class="mb-4 w-full px-3 py-2 rounded text-black">
        <option value="Perú">Perú</option>
        <option>Otro</option>
      </select>
    `;
  }
});

// ========== Configuración de PayPal ==========
if (window.paypal) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      const total = document.getElementById('cartTotal').textContent;
      return actions.order.create({
        purchase_units: [{ amount: { value: total } }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Gracias por tu compra, ' + details.payer.name.given_name);
      });
    }
  }).render('#paypal-button-container');
}

// ========== Preparar y enviar pedido por correo ==========
function prepararCorreo() {
  const nombre = document.getElementById('nombreCompleto')?.value || '';
  const dni = document.getElementById('dni')?.value || '';
  const celular = document.getElementById('celular')?.value || '';
  const departamento = document.getElementById('departamento')?.value || '';
  const provincia = document.getElementById('provincia')?.value || '';
  const distrito = document.getElementById('distrito')?.value || '';
  const direccion = document.getElementById('direccion')?.value || '';
  const pais = document.getElementById('pais')?.value || '';

  let detalles = `📦 NUEVO PEDIDO:\n\n`;
  detalles += `🧾 PRODUCTOS:\n`;
  cart.forEach(item => {
    detalles += `- ${item.name} - S/ ${item.price.toFixed(2)}\n`;
  });
  detalles += `\n💰 TOTAL: S/ ${document.getElementById('cartTotal').textContent}\n\n`;

  detalles += `🚚 DATOS DE ENVÍO:\n`;
  detalles += `👤 Nombre: ${nombre}\n`;
  detalles += `🪪 DNI: ${dni}\n`;
  detalles += `📱 Celular: ${celular}\n`;
  detalles += `🌍 Dirección: ${direccion}, ${distrito}, ${provincia}, ${departamento}, ${pais}\n`;

  document.getElementById('detallePedido').value = detalles;
  return true; // Permite el envío del formulario
}

// ========== Inicialización ==========
document.getElementById('searchInput').addEventListener('input', renderProducts);
document.getElementById('filterType').addEventListener('change', renderProducts);
document.addEventListener('DOMContentLoaded', renderProducts);
