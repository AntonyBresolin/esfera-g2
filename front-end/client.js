function selectAllCheckboxes(source) {
  let checkboxes = document.getElementsByName('foo');
  for (let checkbox of checkboxes) {
    checkbox.checked = source.checked;
  }
}

function handleCloseAddCliente() {
  let addCliente = document.getElementById('cadClient');
  addCliente.classList.toggle('hidden');
}

async function fetchAddClient(event) {
  event.preventDefault();
  const data = {
    client: {
      name: document.getElementById('name').value,
      cpfCnpj: document.getElementById('cpf').value,
      company: document.getElementById('company').value,
      role: document.getElementById('role').value,
      date: 33333333,
    },
    contact: [
      {
        "data": document.getElementById('celular').value,
        idTypeContact: {
          "idTypeContact": 1,
          type: "celular"
        }
      },
      {
        "data": document.getElementById('telefone').value,
        idTypeContact: {
          "idTypeContact": 2,
          type: "telefone"
        }
      },
      {
        "data": document.getElementById('whatsapp').value,
        idTypeContact: {
          "idTypeContact": 3,
          type: "whatsapp"
        }
      },
      {
        "data": document.getElementById('email').value,
        idTypeContact: {
          "idTypeContact": 4,
          type: "email"
        }
      }
    ],
    address: {
      zipCode: document.getElementById('zipCode').value,
      street: document.getElementById('street').value,
      number: document.getElementById('number').value,
      state: document.getElementById('state').value,
      city: document.getElementById('city').value,
      country: document.getElementById('country').value
    }
  };

  await fetch('http://localhost:8080/client-address-contact/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => console.log('Success:', response)) // Log the success 
    .catch(error => console.error('Error:', error)); // Log errors if any
}
