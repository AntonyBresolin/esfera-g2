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

function fetchAddClient() {
  fetch('http://localhost:3000/client-address-contact/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
      name: document.getElementById('nome').value,
      company: document.getElementById('empresa').value,
      cpfCnpj: document.getElementById('cpf').value,
      role: document.getElementById('cargo').value,
      date: document.getElementById('data').value,
    },
    {
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      whatsapp: document.getElementById('whatsapp').value,
      celular: document.getElementById('celular').value,
    },
    {
      cep: document.getElementById('cep').value,
      rua: document.getElementById('rua').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
    }),

  })
}