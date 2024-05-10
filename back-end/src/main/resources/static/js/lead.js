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
    tbody.innerHTML = '';
    leads.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50';
        let dataFormatada = new Date(data.date).toLocaleDateString();

        tr.innerHTML = `
            <td class="px-4 py-4">
                <input id="${data.idLead}" type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    name="foo" value="${data.idLead}" />
                <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
            </td>
            <td class="px-6">
                <span class='align-middle inline-block text-primary font-bold'> ${data.idLead} </span>
            </td>
        
            <td class="px-6">${data.idClient.name}</td>
            <td class="px-6">${data.result.result}</td>
             <td class="px-6">${data.description}</td>
             <td class="px-6" >${dataFormatada}</td>
            <td class="px-6">${data.callTime}</td>
             <td class="px-6">${data.duration}</td>
            <td class="px-6">${data.contact}</td>
            
            <td>
                <div class="flex items-center">
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="handleCloseEditLead(${data.idLead})"
                    >
                        <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
                    </div>
                    <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
                        onClick="showDeleteLeadModal(${data.idLead})"
                    >
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
            idClient: document.getElementById('clientId').value
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
        .catch((error) => {
            alert('Erro ao excluir lead!');
            console.error('Error:', error);
        });
}

function handleCloseEditLead(idLead) {
    let editLead = document.getElementById('editLead');
    editLead.classList.toggle('hidden');

    if (!editLead.classList.contains('hidden')) {
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

function showDeleteLeadModal(idLead) {
    let deleteModal = document.getElementById('deleteLeadModal');
    deleteModal.classList.toggle('hidden');

    sessionStorage.setItem('idLeadToDel', idLead);
}


