let idGeralProposal;

window.onload = async function () {
    await fetchAllProposals();
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

    proposals.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50';

        // Verificar se as propriedades necessárias estão definidas
        const idProposal = data.proposal ? data.proposal.idProposal : '';
        const clientName = data.client ? data.client.name : '';
        const clientCpfCnpj = data.client ? data.client.cpfCnpj : '';
        const service = data.proposal ? data.proposal.service : '';
        const description = data.proposal ? data.proposal.description : '';
        const date = data.proposal ? data.proposal.date : '';
        const value = data.proposal ? data.proposal.value : '';

        tr.innerHTML = `
            <td class="px-6">
                <span class='align-middle inline-block text-primary font-bold'>${idProposal}</span>
            </td>
            <td class="px-6">${clientName}</td>
            <td class="px-6">${clientCpfCnpj}</td>
            <td class="px-6">${service}</td>
            <td class="px-6">${description}</td>
            <td class="px-6">${date}</td>
            <td class="px-6">${value}</td>
            <td class="px-6">
                <ion-icon name="call" fontSize='' class='text-lg mx-2'></ion-icon>
                <span class="text-sm">Ver Anexo</span>
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
        lead: {
            idLead: document.getElementById('idLead').value,
            client: {
                idClient: document.getElementById('idClient').value,
                name: document.getElementById('name').value,
            },
        },
            service: document.getElementById('service').value,
            proposalDate: document.getElementById('date').value,
            value: document.getElementById('value').value,
            description: document.getElementById('description').value,
            file: document.getElementById('file').value,
            status: document.getElementById('status').value,
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

function clearProposalEditFields() {
    document.getElementById('dateEdit').value = '';
    document.getElementById('valueEdit').value = '';
    document.getElementById('soluctionEdit').value = '';
    document.getElementById('statusEdit').value = '';
    document.getElementById('fileEdit').value = '';
    document.getElementById('idLigacaoEdit').value = '';

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
            if (data && data.proposal && data.lead) {
                idGeralProposal = data.proposal.id;
                document.getElementById('idLeadEdit').value = data.lead.idLead;
                document.getElementById('serviceEdit').value = data.proposal.service;
                document.getElementById('dateEdit').value = data.proposal.date;
                document.getElementById('valueEdit').value = data.proposal.value;
                document.getElementById('descriptionEdit').value = data.proposal.description;
                document.getElementById('fileEdit').value = data.proposal.file;
            }
        })
        .catch(error => {
            console.error('Error fetching proposal data:', error);
        });
}

function fetchEditProposal(event) {
    event.preventDefault();
    const id = idGeralProposal;
    const data = {
        lead: {
            idLead: document.getElementById('idLead').value,
            client: {
                idClient: document.getElementById('idClient').value,
                name: document.getElementById('name').value,
            },
        },
        proposal: {
            service: document.getElementById('service').value,
            proposalDate: document.getElementById('date').value,
            value: document.getElementById('value').value,
            description: document.getElementById('description').value,
            file: document.getElementById('file').value,
        }
    };

    fetch(`http://localhost:8080/proposal/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Proposta atualizada com sucesso!');
            idGeralProposal = null;
            handleCloseEditProposal();
            fetchAllProposals();
        })
        .catch((error) => {
            alert('Erro ao atualizar proposta!');
            console.error('Error:', error);
        });
}