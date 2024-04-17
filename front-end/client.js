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