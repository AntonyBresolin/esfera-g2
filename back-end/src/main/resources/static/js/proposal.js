function handleCloseAddProposal() {
    let addProposal = document.getElementById('cadProposal');
    addProposal.classList.toggle('hidden');
  }


function fetchAddProposal() {
    fetch('http://localhost:8080/proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        name: document.getElementById('nome').value,
        soluction: document.getElementById('solucao').value,
        date: document.getElementById('data').value,
        status: document.getElementById('status').value,
        value: document.getElementById('valores').value,
        description: document.getElementById('descricao').value,
      }),
  
    })
  }