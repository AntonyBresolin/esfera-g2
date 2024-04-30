let idGeralClient;

window.onload = async function () {
    await fetchAllClients();
}


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


function listClients(clients) {
    let table = document.getElementById('tableClients');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    clients.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50'
        tr.innerHTML = `
      <td class="px-4 py-4"><input id="${data.client.idClient}" type="checkbox"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      name="foo" value="${data.client.idClient}" />
      <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
      <td class="px-6">
        <span class='align-middle inline-block text-primary font-bold'> ${data.client.name} </span>
      </td>
      <td class="px-6">${data.address.city}</td>
      <td class="px-6">${data.contact[2].data}</td>
      <td class="px-6">${data.client.cpfCnpj}</td>
      <td class="px-6">${data.contact[3].data}</td>
      <td class="px-6">
        <a class="bg-gray-200 px-2 py-2 rounded-lg text-black font-bold flex items-center w-full cursor-pointer hover:bg-gray-300"
        href="https://wa.me/${data.contact[2].data}"
        target="_blank"
        >
          <ion-icon name="call" fontSize='' class='text-lg mx-2'></ion-icon>
          <span class="text-sm">Enviar Mensagem</span>
        </a>
      </td>
      <td>
        <div class="flex items-center">
          <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
          onClick="handleCloseEditClient(${data.client.idClient})"
          >
            <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
          </div>
          <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
          onClick="deleteClient(${data.client.idClient})"
          >
            <ion-icon name="trash" fontSize='' class='text-lg'></ion-icon>
          </div>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function fetchAllClients() {
    await fetch('http://localhost:8080/client-address-contact/all')
        .then(response => response.json())
        .then(data => {
            listClients(data);
        })
        .catch(error => console.error('Error:', error));
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
        .then(() => {
            alert('Cliente cadastrado com sucesso!');
            handleCloseAddCliente();
            fetchAllClients();
        })
        .catch((error) => {
            alert('Erro ao cadastrar cliente!');
            console.error('Error:', error);
        });
}

// IMPORT CLIENTS

function handleCloseImportClientData() {
    let importClientData = document.getElementById('importClientData');
    importClientData.classList.toggle('hidden');
}


async function fetchImportClientData() {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files[0]) {
        alert('Selecione um arquivo para importar!');
        return;
    }

    formData.append('file', fileInput.files[0]);

    await fetch('http://localhost:8080/client-address-contact/import', {
        method: 'POST',
        body: formData
    })
        .then(response => alert("Dados importados com sucesso!"))
        .catch(error => {
            alert("Erro ao importar dados!");
            console.error('Error:', error)
        })
        .finally(() => {
                document.getElementById('fileInput').value = '';
                handleCloseImportClientData();
                fetchAllClients();
            }
        );
}

async function deleteClient(idClient) {
    await fetch(`http://localhost:8080/client-address-contact/delete/${idClient}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            alert('Cliente excluído com sucesso!');
            fetchAllClients();
        })
        .catch((error) => {
            alert('Erro ao excluir cliente!');
            console.error('Error:', error);
        });
}

async function deleteSelectedClients() {
    let checkboxes = document.getElementsByName('foo');
    let clients = [];
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            clients.push(checkbox.value);
        }
    }

    await fetch('http://localhost:8080/client-address-contact/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clients)
    })
        .then(() => {
            alert('Clientes excluídos com sucesso!');
            fetchAllClients();
        })
        .catch((error) => {
            alert('Erro ao excluir clientes!');
            console.error('Error:', error);
        });
}

function handleCloseEditClient(idClient) {
    let editClient = document.getElementById('editClient');
    editClient.classList.toggle('hidden');

    if (!editClient.classList.contains('hidden')) {
        console.log(idClient);
        getElementsEditClient(idClient);
    } else {
        clearClientEditFields();
    }
}

function clearClientEditFields() {
    document.getElementById('nameEdit').value = '';
    document.getElementById('cpfEdit').value = '';
    document.getElementById('companyEdit').value = '';
    document.getElementById('roleEdit').value = '';
    document.getElementById('celularEdit').value = '';
    document.getElementById('telefoneEdit').value = '';
    document.getElementById('whatsappEdit').value = '';
    document.getElementById('emailEdit').value = '';
    document.getElementById('zipCodeEdit').value = '';
    document.getElementById('streetEdit').value = '';
    document.getElementById('numberEdit').value = '';
    document.getElementById('stateEdit').value = '';
    document.getElementById('cityEdit').value = '';
    document.getElementById('countryEdit').value = '';
}

function getElementsEditClient(idClient) {
    fetch(`http://localhost:8080/client-address-contact/${idClient}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.client && data.contact && data.address) {
                idGeralClient = data.client.idClient;
                document.getElementById('nameEdit').value = data.client.name;
                document.getElementById('cpfEdit').value = data.client.cpfCnpj;
                document.getElementById('companyEdit').value = data.client.company;
                document.getElementById('roleEdit').value = data.client.role;
                // Considerar verificar se cada contato existe
                document.getElementById('celularEdit').value = data.contact[0]?.data || '';
                document.getElementById('telefoneEdit').value = data.contact[1]?.data || '';
                document.getElementById('whatsappEdit').value = data.contact[2]?.data || '';
                document.getElementById('emailEdit').value = data.contact[3]?.data || '';
                document.getElementById('zipCodeEdit').value = data.address.zipCode;
                document.getElementById('streetEdit').value = data.address.street;
                document.getElementById('numberEdit').value = data.address.number;
                document.getElementById('stateEdit').value = data.address.state;
                document.getElementById('cityEdit').value = data.address.city;
                document.getElementById('countryEdit').value = data.address.country;
            }
        })
        .catch(error => {
            console.error('Error fetching client data:', error);
        });
}

function fetchEditClient(event) {
    event.preventDefault();
    const idClient = idGeralClient;
    const data = {
        client: {
            name: document.getElementById('nameEdit').value,
            cpfCnpj: document.getElementById('cpfEdit').value,
            company: document.getElementById('companyEdit').value,
            role: document.getElementById('roleEdit').value,
            date: 33333333,
        },
        contact: [
            {
                "data": document.getElementById('celularEdit').value,
                idTypeContact: {
                    "idTypeContact": 1,
                    type: "celular"
                }
            },
            {
                "data": document.getElementById('telefoneEdit').value,
                idTypeContact: {
                    "idTypeContact": 2,
                    type: "telefone"
                }
            },
            {
                "data": document.getElementById('whatsappEdit').value,
                idTypeContact: {
                    "idTypeContact": 3,
                    type: "whatsapp"
                }
            },
            {
                "data": document.getElementById('emailEdit').value,
                idTypeContact: {
                    "idTypeContact": 4,
                    type: "email"
                }
            }
        ],
        address: {
            zipCode: document.getElementById('zipCodeEdit').value,
            street: document.getElementById('streetEdit').value,
            number: document.getElementById('numberEdit').value,
            state: document.getElementById('stateEdit').value,
            city: document.getElementById('cityEdit').value,
            country: document.getElementById('countryEdit').value
        }
    };

    fetch(`http://localhost:8080/client-address-contact/update/${idClient}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Cliente atualizado com sucesso!');
            idGeralClient = null;
            handleCloseEditClient();
            fetchAllClients();
        })
        .catch((error) => {
            alert('Erro ao atualizar cliente!');
            console.error('Error:', error);
        });
}

async function fetchSearchClientByName() {
    const name = document.getElementById('searchClient').value;
    await fetch(`http://localhost:8080/client-address-contact/name/${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            listClients(data);
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}