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
}

function handleCloseAddProposal() {
    let addProposal = document.getElementById('cadProposal');
    addProposal.classList.toggle('hidden');
  }

function listProposals(proposals) {
    let table = document.getElementById('tableProposals');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    proposals.forEach(data => {
        let tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50'
        tr.innerHTML = `
      <td class="px-4 py-4"><input id="${data.proposal.idProposal}" type="checkbox"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      name="foo" value="${data.proposal.idProposal}" />
      <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
      <td class="px-6">
        <span class='align-middle inline-block text-primary font-bold'> ${data.proposal.name} </span>
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
          onClick="handleCloseEditProposal(${data.proposal.idProposal})"
          >
            <ion-icon name="create" fontSize='' class='text-lg'></ion-icon>
          </div>
          <div class="bg-gray-200 px-2 py-2 rounded-full text-black font-bold flex justify-center items-center w-full cursor-pointer hover:bg-gray-300"
          onClick="deleteProposal(${data.proposal.idProposal})"
          >
            <ion-icon name="trash" fontSize='' class='text-lg'></ion-icon>
          </div>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function fetchAllProposals() {
    await fetch('http://localhost:8080/proposal/all')
        .then(response => response.json())
        .then(data => {
            listProposals(data);
        })
        .catch(error => console.error('Error:', error));
}



    async function fetchAddProposal(event) {
        event.preventDefault();
        const data = {
            proposal: {
                name: document.getElementById('name').value,
                cpfCnpj: document.getElementById('cpfCnpj').value,
                soluction: document.getElementById('soluction').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value,
                date: document.getElementById('date').value,
                value: document.getElementById('value').value,
                profilePicture: document.getElementById('profilePicture').value,
            }
        }

        await fetch('http://localhost:8080/proposal/add', {
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

async function deleteProposal(idProposal) {
    await fetch(`http://localhost:8080/proposal/delete/${idProposal}`, {
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
            alert('Erro ao excluir proposta!');
            console.error('Error:', error);
        });
}

function handleCloseEditProposal(idProposal) {
    let editClient = document.getElementById('editProposal');
    editProposal.classList.toggle('hidden');

    if (!editProposalclassList.contains('hidden')) {
        console.log(idProposal);
        getElementsEditProposal(idProposal);
    } else {
        clearProposalEditFields();
    }
}

function clearProposalEditFields() {
    document.getElementById('nameEdit').value = '';
    document.getElementById('cpfCnpjEdit').value = '';
    document.getElementById('soluctionEdit').value = '';
    document.getElementById('statusEdit').value = '';
    document.getElementById('descriptionEdit').value = '';
    document.getElementById('dateEdit').value = '';
    document.getElementById('valueEdit').value = '';
    document.getElementById('profilePictureEdit').value = '';
}

function getElementsEditProposal(idProposal) {
    fetch(`http://localhost:8080/proposal/${idProposal}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.proposal) {
                idGeralProposal = data.proposal.idProposal;
                document.getElementById('nameEdit').value = data.proposal.name;
                document.getElementById('cpfCnpjEdit').value = data.proposal.cpfCnpj;
                document.getElementById('soluctionEdit').value = data.proposal.soluction;
                document.getElementById('statusEdit').value = data.proposal.status;
                document.getElementById('descriptionEdit').value = data.proposal.description;
                document.getElementById('dateEdit').value = data.proposal.date;
                document.getElementById('valueEdit').value = data.proposal.value;
                document.getElementById('profilePictureEdit').value = data.proposal.profilePicture;

            }
        })
        .catch(error => {
            console.error('Error fetching client data:', error);
        });
}

function fetchEditProposal(event) {
    event.preventDefault();
    const idProposal = idGeralProposal;
    const data = {
        proposal: {
            name: document.getElementById('name').value,
            cpfcnpj: document.getElementById('cpfcnpj').value,
            soluction: document.getElementById('soluction').value,
            status: document.getElementById('status').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value,
            value: document.getElementById('value').value,
            profilePicture: document.getElementById('profilePicture').value,
        }
    };

    fetch(`http://localhost:8080/proposal/update/${idProposal}`, {
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

async function fetchSearchProposalByName() {
    const name = document.getElementById('searchProposal').value;
    await fetch(`http://localhost:8080/proposal/name/${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            listProposals(data);
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}