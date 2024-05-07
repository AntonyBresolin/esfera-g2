if (localStorage.getItem('loggedIn') === 'true' && currentDate <= sessionEndDate) {
} else {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
}

let idGeralProposal;

window.onload = async function () {
    await fetchAllProposals();
    await fetchAllStatusProposals();
}

function handleCloseAddProposal() {
    let addProposal = document.getElementById('cadProposal');
    addProposal.classList.toggle('hidden');
}


async function fetchAllProposals() {
    await fetch('http://localhost:8080/proposal/all')
        .then(response => response.json())
        .then(data => {
            listProposals(data);
        })
        .catch(error => console.error('Error:', error));
}

function listProposals(proposals) {
    let table = document.getElementById('tableProposals');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    console.log(proposals)
    proposals.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50';

        // Verificar se as propriedades necessárias estão definidas
        const idProposal = data.idProposal ? data.idProposal : '';
        const clientName = data.idLead ? data.idLead.idClient.name : '';
        const clientCpfCnpj = data.idLead ? data.idLead.idClient.cpfCnpj: '';
        const service = data.service ? data.service : '';
        const description = data.description ? data.description : '';
        const date = data.proposalDate ? data.proposalDate : '';
        const value = data.value ? data.value : '';
        const status = data.idStatusProposal ? data.idStatusProposal.name : '';
        const file = data.file ? data.file : '';

        tr.innerHTML = `
            <td class="px-6">
                <span class='align-middle inline-block text-primary font-bold'>${idProposal}</span>
            </td>
            <td class="px-6">${clientName}</td>
            <td class="px-6">${clientCpfCnpj}</td>
            <td class="px-6">${service}</td>
            <td class="px-6">${status}</td>
            <td class="px-6">${description}</td>
            <td class="px-6">${date}</td>
            <td class="px-6">${value}</td>
            <td class="px-6">
            <a href="${file}"
               target="_blank"> </a>
                <div class="bg-gray-200 px-2 py-2 rounded-lg text-black font-bold flex items-center w-full cursor-pointer hover:bg-gray-300">
                    <ion-icon name="document-outline" fontSize='' class='text-lg mx-2'></ion-icon>
                    <span class="text-sm">Ver Anexo</span>
                </div>
            </td>
            <td>
                <div class="flex items-center">
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="handleCloseEditProposal(${idProposal})"
                    >
                        <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
                    </div>
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="deleteProposal(${idProposal})"
                    >
                        <ion-icon name="trash" fontSize='' class='text-lg'></ion-icon>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


async function fetchAddProposal(event) {
    event.preventDefault();
    const data = {
        idLead: {
            idLead: document.getElementById('idLead').value,
        },
        idStatusProposal: {
            idStatusProposal: document.getElementById('status').value,
        },
        service: document.getElementById('service').value,
        proposalDate: document.getElementById('date').value,
        value: document.getElementById('value').value,
        description: document.getElementById('description').value,
        file: document.getElementById('file').value,
    }

    await fetch(`http://localhost:8080/proposal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Proposta cadastrada com sucesso!');
            clearProposalFields();
            handleCloseAddProposal();
            fetchAllProposals();
        })
        .catch((error) => {
            alert('Erro ao cadastrar proposta!');
            console.error('Error:', error);
        });
}

async function fetchSearchProposalByName() {
    const id = document.getElementById('idLead').value;
    await fetch(`http://localhost:8080/lead/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.idClient.name;
            document.getElementById('idClient').value = data.idClient.idClient;
        })
        .catch(error => console.error('Error:', error));
}

async function fetchSearchProposalByNameEdit() {
    const id = document.getElementById('idLeadEdit').value;
    await fetch(`http://localhost:8080/lead/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('nameEdit').value = data.idClient.name;
            document.getElementById('idClientEdit').value = data.idClient.idClient;
        })
        .catch(error => console.error('Error:', error));
}



async function deleteProposal(id) {
    await fetch(`http://localhost:8080/proposal/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            alert('Proposta excluída com sucesso!');
            fetchAllProposals();
        })
        .catch((error) => {
            alert('Erro ao excluir Proposta!');
            console.error('Error:', error);
        });
}


function handleCloseEditProposal(idProposal) {
    let editProposal = document.getElementById('editProposal');
    editProposal.classList.toggle('hidden');

    if (!editProposal.classList.contains('hidden')) {
        console.log(idProposal);
        getElementsEditProposal(idProposal);
    } else {
        clearProposalEditFields();
    }
}

function clearProposalFields() {
    document.getElementById('date').value = '';
    document.getElementById('value').value = '';
    document.getElementById('service').value = 'Acompanhamento';
    document.getElementById('status').value = '1';
    document.getElementById('file').value = '';
    document.getElementById('idLead').value = '';
    document.getElementById('idClient').value = '';
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';

}


function clearProposalEditFields() {
    document.getElementById('dateEdit').value = '';
    document.getElementById('valueEdit').value = '';
    document.getElementById('serviceEdit').value = 'Acompanhamento';
    document.getElementById('statusEdit').value = '1';
    document.getElementById('fileEdit').value = '';
    document.getElementById('idLeadEdit').value = '';
    document.getElementById('idClientEdit').value = '';
    document.getElementById('nameEdit').value = '';
    document.getElementById('descriptionEdit').value = '';

}

function getElementsEditProposal(id) {
    fetch(`http://localhost:8080/proposal/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (data && data.idLead && data.idStatusProposal) {
                idGeralProposal = data.idProposal;
                document.getElementById('dateEdit').value = data.proposalDate;
                document.getElementById('valueEdit').value = data.value;
                document.getElementById('serviceEdit').value = data.service;
                document.getElementById('statusEdit').value = data.idStatusProposal.idStatusProposal;
                document.getElementById('idLeadEdit').value = data.idLead.idLead;
                document.getElementById('idClientEdit').value = data.idLead.idClient.idClient;
                document.getElementById('nameEdit').value = data.idLead.idClient.name;
                document.getElementById('descriptionEdit').value = data.description;
            }
        })
        .catch(error => {
            console.error('Error fetching proposal data:', error);
        });
}


async function fetchAllStatusProposals() {
    var selection = document.getElementById("status");
    var selectionEdit = document.getElementById("statusEdit");
    await fetch('http://localhost:8080/statusProposal')
        .then(response => response.json())
        .then(data => {
            data.forEach(value => {
                selection.innerHTML += `<option value="${value.idStatusProposal}">${value.name}</option>`
                selectionEdit.innerHTML += `<option value="${value.idStatusProposal}">${value.name}</option>`

            })
        })
        .catch(error => console.error('Error:', error));
}


async function fetchAddEditProposal(event) {
    event.preventDefault();
    const id = idGeralProposal;
    const data = {
        idLead: {
            idLead: document.getElementById('idLeadEdit').value,
        },
        idStatusProposal: {
            idStatusProposal: document.getElementById('statusEdit').value,
        },
        service: document.getElementById('serviceEdit').value,
        proposalDate: document.getElementById('dateEdit').value,
        value: document.getElementById('valueEdit').value,
        description: document.getElementById('descriptionEdit').value,
        file: document.getElementById('fileEdit').value,
    }

    await fetch(`http://localhost:8080/proposal/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Proposta editada com sucesso!');
            idGeralProposal = null;
            handleCloseEditProposal();
            fetchAllProposals();
        })
        .catch((error) => {
            alert('Erro ao editar proposta!');
            console.error('Error:', error);
        });
}