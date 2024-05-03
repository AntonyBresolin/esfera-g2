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



    async function fetchAddProposal(event) {
        event.preventDefault();
        const data = {
                lead:{
                    idLead: document.getElementById('idLead').value,
                    client: {
                      name: document.getElementById('name').value,
                },
                },
                service: document.getElementById('service').value,
                proposalDate: document.getElementById('date').value,
                value: document.getElementById('value').value,
                description: document.getElementById('description').value,
                file: document.getElementById('file').value,
        }
        console.log(data)

        await fetch('http://localhost:8080/proposal', {
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

async function fetchSearchClientByName() {
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
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}
