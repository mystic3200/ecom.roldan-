// cart.js
let cart = [];

function addToCart(name, price) {
  const item = { name, price };
  cart.push(item);
  alert(`${name} añadida al carrito.`);
}

function viewCart() {
  let items = "";
  let total = 0;
  cart.forEach((item, index) => {
    items += `${index + 1}. ${item.name} - €${item.price}\n`;
    total += item.price;
  });
  if (items === "") {
    alert("Tu carrito está vacío.");
    return;
  }
  if (confirm(`Tu carrito:\n${items}\nTotal: €${total}\n\n¿Proceder al pago?`)) {
    processPayment(total);
  }
}

function processPayment(total) {
  // Renderiza PayPal
  const body = document.body;
  const container = document.createElement('div');
  container.id = 'paypal-button-container';
  body.appendChild(container);

  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: total.toFixed(2) }
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert('Pago completado por ' + details.payer.name.given_name);
        sendEmail(details);
      });
    }
  }).render('#paypal-button-container');
}

function sendEmail(details) {
  const items = cart.map(item => `${item.name} - €${item.price}`).join("\n");
  emailjs.send("service_2yq26nb", "template_z69v7ax", {
    order: items,
    total: cart.reduce((a, b) => a + b.price, 0),
    customer: details.payer.email_address
  }, "xjiaLwf9DwmhXJjP_").then(
    (response) => alert("Correo de pedido enviado."),
    (error) => alert("Error al enviar correo.")
  );
}
