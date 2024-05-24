if (localStorage.getItem('loggedIn') === 'true' && currentDate <= sessionEndDate) {
} else {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
}

let currentPage = 0; // Página atual
let pageSize = 20; // Tamanho padrão da página
let sortBy = 'idLead'; // Ordenação padrão


let idGeralLead;

window.onload = async function () {
    var userId = localStorage.getItem('userId');
    if (userId) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/' + userId, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var userData = JSON.parse(xhr.responseText);
                    var userNameDisplay = document.getElementById('userNameDisplay');
                    var userRoleDisplay = document.getElementById('userRoleDisplay');
                    if (userNameDisplay && userRoleDisplay) {
                        userNameDisplay.textContent = userData.name;
                        userRoleDisplay.textContent = userData.role;
                    } else {
                        console.error('Elemento com ID "userNameDisplay" ou "userRoleDisplay" não encontrado.');
                    }
                } else {
                    console.error('Erro ao obter dados do usuário: ' + xhr.status);
                }
            }
        };
        xhr.send();
    }
    await fetchAllLeads(currentPage);
}



function handleCloseAddLead() {
    let addLead = document.getElementById('cadLead');
    addLead.classList.toggle('hidden');
}

function listLeads(leads) {
    let table = document.getElementById('tableLeads');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    leads.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50';
        let dataFormatada = new Date(data.date).toLocaleDateString();
        let resultIcon = getResultIcon(data.result.result);

        tr.innerHTML = `
            <td class="px-6 py-3">
                <span class='align-middle inline-block text-primary font-bold'>${data.idLead}</span>
            </td>
            <td class="px-6 py-3">${data.idClient.name}</td>
            <td class="px-6 py-3">
                <div class="flex items-center gap-2">
                    ${resultIcon}
                    <span>${data.result.result}</span>
                </div>
            </td>
            <td class="px-6 py-3">${data.description}</td>
            <td class="px-6 py-3">${dataFormatada}</td>
            <td class="px-6 py-3">${data.callTime}</td>
            <td class="px-6 py-3">${data.duration}</td>
            <td class="px-6 py-3">${data.contact}</td>
            <td class="px-6 py-3">
                <div class="flex items-center gap-2">
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="handleCloseEditLead(${data.idLead})">
                        <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
                    </div>
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="showDeleteLeadModal(${data.idLead})">
                        <ion-icon name="trash" fontSize='' class='text-lg'></ion-icon>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function fetchAllLeads(page) {
    await fetch(`http://localhost:8080/lead/all?page=${page}&size=${pageSize}&sort=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            listLeads(data.content);
            updatePagination(data);
        })
        .catch(error => console.error('Error:', error));
}

function updatePagination(pageInfo) {
    const totalPages = pageInfo.totalPages;
    const currentPage = pageInfo.number;
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    if (currentPage > 0) {
        paginationElement.innerHTML += `<button class="font-semibold mx-2 float-right" onClick="fetchAllLeads(${currentPage - 1})">Anterior</button>`;
    }
    if (currentPage < totalPages - 1) {
        paginationElement.innerHTML += `<button class="font-semibold mx-2" onClick="fetchAllLeads(${currentPage + 1})">Próximo</button>`;
    }
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
            idClient: document.getElementById('clientSelect').value
        }
    };

    await fetch('http://localhost:8080/lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('Lead cadastrado com sucesso!');
            clearLeadFields();
            handleCloseAddLead();
            fetchAllLeads(currentPage);
        })
        .catch((error) => {
            alert('Erro ao cadastrar lead!');
            console.error('Error:', error);
        });
}

async function deleteLead() {
    event.preventDefault();
    let warning = document.getElementById('warnings');
    let warningMessage = document.getElementById('warningMessage');
    let warningTitle = document.getElementById('warningTitle');
    await fetch(`http://localhost:8080/lead/delete/${sessionStorage.getItem("idLeadToDel")}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.status === 409) {
                warning.classList.toggle('hidden');
                warningMessage.textContent = 'Lead não pode ser excluído, pois está associado a uma ou mais propostas.';
                warningTitle.classList.add('bg-red-200');
                setTimeout(() => {
                    warning.classList.toggle('hidden');
                    warningTitle.classList.remove('bg-red-200');
                }, 3000);
            } else if (response.status === 404) {
                alert('Lead não encontrado.');
            } else {
                warning.classList.toggle('hidden');
                warningMessage.textContent = 'Lead excluído com sucesso.';
                warningTitle.classList.add('bg-green-200');
                setTimeout(() => {
                    warning.classList.toggle('hidden');
                    warningTitle.classList.remove('bg-green-200');
                }, 3000);
            }
            showDeleteLeadModal();
            fetchAllLeads(currentPage);
        })
        .catch(error => console.error('Erro ao buscar nome do cliente:', error));
}

async function fetchSearchLeadByClientCpfCnpj(page) {

    const name = document.getElementById('searchByNamePesquisar').value;

    await fetch(`http://localhost:8080/lead/name/${name}?page=${page}&size=${pageSize}&sort=${sortBy}`,
        {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            listLeads(data.content);
            updatePaginationSearch(data);
        })
        .catch(error => console.error('Error:', error));
}

async function fetchSearchClientByCpfCnpj() {
    const cpfCnpj = document.getElementById('cpfCnpjSearchByCPF').value;

    await fetch(`http://localhost:8080/client/cpf/`+cpfCnpj, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Limpar as opções anteriores
            const clientSelect = document.getElementById('clientSelect');
            clientSelect.innerHTML = '';

            data.forEach(client => {
                const option = document.createElement('option');
                option.value = client.idClient;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
            clientSelect.addEventListener('change', changeContactPhone);
        })
        .catch(error => console.error('Erro ao buscar nome do cliente:', error));
}


async function changeContactPhone() {
    await fetch(`http://localhost:8080/contact/clientId/${document.getElementById('clientSelect').value}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('contact').value = data.data;
        })
        .catch(error => console.error('Erro ao buscar telefone do cliente:', error));
}


function updatePaginationSearch(pageInfo) {
    const totalPages = pageInfo.totalPages;
    const currentPage = pageInfo.number;
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    if (currentPage > 0) {
        paginationElement.innerHTML += `<button class="font-semibold mx-2 float-right" onClick="fetchSearchLeadByClientCpfCnpj(${currentPage - 1})">Anterior</button>`;
    }
    if (currentPage < totalPages - 1) {
        paginationElement.innerHTML += `<button class="font-semibold mx-2" onClick="fetchSearchLeadByClientCpfCnpj(${currentPage + 1})">Próximo</button>`;
    }

}

function handleCloseEditLead(idLead) {
    let editLead = document.getElementById('editLead');
    editLead.classList.toggle('hidden');

    if (!editLead.classList.contains('hidden')) {
        getElementsEditLead(idLead);
    } else {
        clearLeadEditFields(); // Limpa os campos de edição do lead
    }
}

function clearLeadFields() {
    document.getElementById('date').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('callTime').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('description').value = '';
    document.getElementById('clientSelect').value = '1';
    document.getElementById('cpfCnpjSearchByCPF').value = '';
    document.getElementById('result').value = '1'; // Define o resultado padrão para "Atendeu"
}

function clearLeadEditFields() {
    document.getElementById('dateEdit').value = '';
    document.getElementById('contactEdit').value = '';
    document.getElementById('callTimeEdit').value = '';
    document.getElementById('durationEdit').value = '';
    document.getElementById('descriptionEdit').value = '';
    document.getElementById('clientIdEdit').value = '';
    document.getElementById('cpfCnpjEdit').value = '';
    document.getElementById('resultEdit').value = '1'; // Define o resultado padrão para "Atendeu"
}

function getElementsEditLead(id) {
    fetch(`http://localhost:8080/lead/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                document.getElementById('dateEdit').value = (new Date(data.date)).toISOString().substring(0, 10);
                document.getElementById('contactEdit').value = data.contact;
                document.getElementById('callTimeEdit').value = data.callTime;
                document.getElementById('durationEdit').value = data.duration;
                document.getElementById('descriptionEdit').value = data.description;
                document.getElementById('clientIdEdit').value = data.idClient.idClient;
                document.getElementById('cpfCnpjEdit').value = data.idClient.cpfCnpj;
                document.getElementById('resultEdit').value = data.result.idLeadResult;
                idGeralLead = data.idLead;
            }
        })

        .catch(error => {
            console.error('Error fetching lead data:', error);
        });

}

async function fetchAllStatusLeads() {
    var selection = document.getElementById("result");
    var selectionEdit = document.getElementById("resultEdit");
    await fetch('http://localhost:8080/LeadResult')
        .then(response => response.json())
        .then(data => {
            data.forEach(value => {
                selection.innerHTML += `<option value="${value.idLeadResult}">${value.name}</option>`;
                selectionEdit.innerHTML += `<option value="${value.idLeadResult}">${value.name}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));
}

async function fetchAddEditLead() {
    event.preventDefault();
    let id = idGeralLead;
    const data = {
        contact: document.getElementById('contactEdit').value,
        date: document.getElementById('dateEdit').value,
        callTime: document.getElementById('callTimeEdit').value,
        duration: document.getElementById('durationEdit').value,
        description: document.getElementById('descriptionEdit').value,
        result: {
            idLeadResult: document.getElementById('resultEdit').value,
        },
        idClient: {
            idClient: document.getElementById('clientIdEdit').value,
        }
    };

    await fetch('http://localhost:8080/lead/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            alert('Lead editado com sucesso!');
            idGeralLead = null;
            handleCloseEditLead();
            fetchAllLeads(0);
        })
        .catch((error) => {
            alert('Erro ao editar lead!');
            console.error('Error:', error);
        });
}

function showDeleteLeadModal(idLead) {
    let deleteModal = document.getElementById('deleteLeadModal');
    deleteModal.classList.toggle('hidden');

    sessionStorage.setItem('idLeadToDel', idLead);
}

async function exportLeads() {
    try {
        const response = await fetch('http://localhost:8080/lead/export');
        const leads = await response.json();

        if (leads && leads.length > 0) {
            let csvContent = '';

            const header = 'ID,NOME,RESULTADO,DESCRIÇÃO,DATA,HORA,DURAÇÃO,CONTATO';
            csvContent += header + '\n';

            leads.forEach(lead => {
                const id = lead.idLead || '';
                const nome = lead.idClient ? lead.idClient.name : '';
                const resultado = lead.result ? lead.result.result : '';
                const descricao = lead.description || '';
                const data = lead.date ? new Date(lead.date).toLocaleDateString() : '';
                const hora = lead.callTime || '';
                const duracao = lead.duration || '';
                const contato = lead.contact || '';

                const leadData = `${id},${nome},${resultado},${descricao},${data},${hora},${duracao},${contato}`;
                csvContent += leadData + '\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'leads.csv';

            link.click();
        } else {
            console.log('Não há dados de leads para exportar.');
        }
    } catch (error) {
        console.error('Erro ao exportar leads:', error);
    }
}

function getResultIcon(result) {
    switch (result) {
        case 'Atendido':
            return '<ion-icon name="checkmark-circle" class="text-green-500 text-2xl"></ion-icon>';
        case 'Desligado':
            return '<ion-icon name="close-circle" class="text-red-500 text-2xl"></ion-icon>';
        case 'Cx. Postal':
            return '<ion-icon name="help-circle" class="text-blue-500 text-2xl"></ion-icon>';
        case 'Ocupado':
            return '<ion-icon name="remove-circle-outline" class="text-orange-500 text-2xl"></ion-icon>';
        default:
            return '';
    }
}

