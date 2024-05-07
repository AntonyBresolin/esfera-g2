if (localStorage.getItem('loggedIn') === 'true' && currentDate <= sessionEndDate) {
} else {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
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

function fetchAddLead() { 
    fetch('http://localhost:8080/lead', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        name: document.getElementById('nome').value, 
        date: document.getElementById('data').value, 
        soluction: document.getElementById('result').value, 
        callTime: document.getElementById('horariodaligacao').value,
        callTimecr: document.getElementById('duration').value, 
        contact: document.getElementById('contact').value, 
        description: document.getElementById('descricaoCall').value, 
      }),
  
    })
  }