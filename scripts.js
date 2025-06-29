// scripts.js

// ========== Datos de Productos ==========
const products = [
  {
    name: 'Combat Noise',
    type: 'Vinilo',
    price: 100,
    description: 'Frontline Offensive Force, 12\" Picture',
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
    description: 'Bestias Hominum, 12\" Incluye bonus track',
    options: ['Edición Clasica', 'Edición Picture'],
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

    let imageHtml = `
      <div class="relative mb-2">
        <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">Incluye envío a todo el Perú</span>
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

  cart.push({ name, price: product.price });
  updateCart();
}

// ========== Actualizar Vista del Carrito ==========
function updateCart() {
  const cartList = document.getElementById('cartItems');
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - S/ ${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });

  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// ========== Pago con Yape ==========
function pagarConYape() {
  alert('Para pagar con Yape, escanea el QR o comunícate con nosotros.');
}

// ========== Pago con Tarjeta (próximamente) ==========
function pagarConTarjeta() {
  alert('El pago con tarjeta está en desarrollo. Por favor usa PayPal o Yape.');
}

// ========== Inicialización ==========
document.getElementById('searchInput').addEventListener('input', renderProducts);
document.getElementById('filterType').addEventListener('change', renderProducts);

document.addEventListener('DOMContentLoaded', renderProducts);
