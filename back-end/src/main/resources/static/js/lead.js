if (localStorage.getItem('loggedIn') === 'true' && currentDate <= sessionEndDate) {
} else {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
}

let idGeralLead;

window.onload = async function () {
    await fetchAllLeads();
}

function selectAllCheckboxes(source) {
    let checkboxes = document.getElementsByName('foo');
    for (let checkbox of checkboxes) {
        checkbox.checked = source.checked;
    }
}

function handleCloseAddLead() {
    let addCliente = document.getElementById('cadLead');
    addCliente.classList.toggle('hidden');
}

function listLeads(leads) {
    let table = document.getElementById('tableLeads');
    let tbody = table.getElementsByTagName('tbody')[0];
    console.log(leads);
    tbody.innerHTML = '';
    leads.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="px-4 py-4">
                <input id="${data.idLead}" type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    name="foo" value="${data.idLead}" />
                <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
            </td>
            <td class="px-6">
                <span class='align-middle inline-block text-primary font-bold'> ${data.contact} </span>
            </td>
            <td class="px-6">${data.date}</td>
            <td class="px-6">${data.duration}</td>
            <td class="px-6">${data.description}</td>
            <td class="px-6">${data.result.result}</td>
            <td class="px-6">${data.idClient.name}</td>
            <td class="px-6">
                <a class="bg-gray-200 px-2 py-2 rounded-lg text-black font-bold flex items-center w-full cursor-pointer hover:bg-gray-300"
                    href="https://wa.me/${data.contact}"
                    target="_blank"
                >
                    <ion-icon name="call" fontSize='' class='text-lg mx-2'></ion-icon>
                    <span class="text-sm">Enviar Mensagem</span>
                </a>
            </td>
            <td>
                <div class="flex items-center">
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="handleCloseEditLead(${data.idLead})"
                    >
                        <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
                    </div>
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="deleteLead(${data.idLead})"
                    >
                        <ion-icon name="trash" fontSize='' class='text-lg'></ion-icon>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function fetchAllLeads() {
    await fetch('http://localhost:8080/lead/all')
        .then(response => response.json())
        .then(data => {
            listLeads(data);
        })
        .catch(error => console.error('Error:', error));
}

async function fetchAddLead() {
    event.preventDefault();
    const data = {
        contact: document.getElementById('contact').value,
        date: document.getElementById('date').value,
        callTime: document.getElementById('callTime').value,
        duration: document.getElementById('duration').value,
        description: document.getElementById('description').value,
        result: {
            idLeadResult: document.getElementById('result').value,
        },
        idClient: {
            idClient: document.getElementById('clientId').value
        }
    };
    console.log(data)

    await fetch('http://localhost:8080/lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Lead cadastrado com sucesso!');
            handleCloseAddLead();
            fetchAllLeads();
        })
        .catch((error) => {
            alert('Erro ao cadastrar lead!');
            console.error('Error:', error);
        });
}

async function deleteLead(idLead) {
    await fetch(`http://localhost:8080/lead/delete/${idLead}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            alert('Lead excluído com sucesso!');
            fetchAllLeads();
        })
        .catch((error) => {
            alert('Erro ao excluir lead!');
            console.error('Error:', error);
        });
}

function handleCloseEditLead(idLead) {
    let editLead = document.getElementById('editLead');
    editLead.classList.toggle('hidden');

    if (!editLead.classList.contains('hidden')) {
        console.log(idLead);
        getElementsEditLead(idLead);
    } else {
        clearLeadEditFields();
    }
}

function clearLeadEditFields() {
    document.getElementById('contactEdit').value = '';
    document.getElementById('dateEdit').value = '';
    document.getElementById('durationEdit').value = '';
    document.getElementById('descriptionEdit').value = '';
    document.getElementById('resultEdit').value = '';
}

function getElementsEditLead(idLead) {
    fetch(`http://localhost:8080/lead/${idLead}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.lead) {
                idGeralLead = data.lead.idLead;
                document.getElementById('nameEdit').value = data.lead.contact;
                document.getElementById('dateEdit').value = data.lead.date;
                document.getElementById('durationEdit').value = data.lead.duration;
                document.getElementById('descriptionEdit').value = data.lead.description;
                // Considere verificar se o resultado existe
                document.getElementById('resultEdit').value = data.lead.result ? data.lead.result.result : '';
            }
        })
        .catch(error => {
            console.error('Error fetching lead data:', error);
        });
}
