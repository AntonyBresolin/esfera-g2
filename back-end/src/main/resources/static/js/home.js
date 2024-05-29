// grafico linhas 1

window.onload = function () {
    setLeadsByDayOfTheWeak();
}

var data = {
    labels: ["Novembro", "Dezembro", "Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
    datasets: [{
        label: "Ligações",
        data: [0, 50, 30, 80, 70, 130, 143],
        borderColor: "purple",
        fill: false
    }]
};

var options = {
    responsive: true,
    title: {
        display: true,
        text: 'Gráfico de Ligações Mensais'
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

var ctx = document.getElementById("lineChart1").getContext("2d");

var lineChart1 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});

// grafico linhas 2

var data = {
    labels: ["Novembro", "Dezembro", "Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
    datasets: [{
        label: "Propostas",
        data: [0, 15, 30, 65, 52, 70, 77],
        borderColor: "purple",
        fill: false
    }]
};

var options = {
    responsive: true,
    title: {
        display: true,
        text: 'Gráfico de Propostas Mensais'
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

var ctx = document.getElementById("lineChart2").getContext("2d");

var lineChart2 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});

// grafico barras


var options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};


// grafico pizza

var data = {
    labels: ['50% Fechado', '30% Em Negociação', '20% Perdido'],
    datasets: [{
        data: [15, 9, 6],
        backgroundColor: [
            '#BA55D3',
            '#A020F0',
            '#8B008B'
        ]
    }]
};

var options = {
    responsive: true,
    title: {
        display: true,
        text: 'Gráfico de Pizza'
    },
};

var ctx = document.getElementById('pieChart').getContext('2d');

var pieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
});

// gerenciador de tarefas

const addTaskButton = document.getElementById('add-task-btn');
const taskForm = document.querySelector('.task-form');

addTaskButton.addEventListener('click', () => {
    taskForm.style.display = 'block';
});

document.addEventListener('click', (event) => {
    if (!taskForm.contains(event.target) && event.target !== addTaskButton) {
        taskForm.style.display = 'none';
    }
});

let draggedTask;

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    draggedTask = event.target.closest('.task');
}

function drop(event, targetListId) {
    event.preventDefault();
    const targetList = document.getElementById(targetListId);
    const rect = targetList.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const targetTask = findTaskAtOffset(targetList, offsetY);

    if (draggedTask && targetTask) {
        targetList.insertBefore(draggedTask, targetTask);
    } else if (draggedTask) {
        targetList.appendChild(draggedTask);
    }
}

function findTaskAtOffset(list, offsetY) {
    const tasks = list.querySelectorAll('.task');
    for (let i = 0; i < tasks.length; i++) {
        const rect = tasks[i].getBoundingClientRect();
        if (offsetY < rect.top + rect.height / 2) {
            return tasks[i];
        }
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {
    const todoList = document.getElementById("todo-list");
    const inProgressList = document.getElementById("inprogress-list");
    const doneList = document.getElementById("done-list");

    addTask(todoList, "Tarefa 1", "Descrição da tarefa 1", "2021-06-30");
    addTask(todoList, "Tarefa 2", "Descrição da tarefa 2", "2021-06-30");
    addTask(inProgressList, "Tarefa 3", "Descrição da tarefa 3", "2021-06-30");
    addTask(doneList, "Tarefa 4", "Descrição da tarefa 4", "2021-06-30");

    const taskFormElement = document.getElementById('task-form');
    taskFormElement.addEventListener('submit', function (event) {
        event.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskDescription = document.getElementById('task-description').value;
        const dueDate = document.getElementById('due-date').value;

        if (taskName && taskDescription && dueDate) {
            addTask(todoList, taskName, taskDescription, dueDate);
        } else {
            alert('Preencha todos os campos!');
        }

        document.querySelector('.task-form').style.display = 'none';
    });
});

function openEditForm(task) {
    const editForm = document.querySelector('.edit-task-form');
    const editTaskId = editForm.querySelector('#edit-task-id');
    const editTaskName = editForm.querySelector('#edit-task-name');
    const editTaskDescription = editForm.querySelector('#edit-task-description');
    const editDueDate = editForm.querySelector('#edit-due-date');

    if (task.dataset.id) {
        editTaskId.value = task.dataset.id;
        editTaskName.value = task.querySelector('b').innerText;
        editTaskDescription.value = task.querySelector('.task-description').innerText;
        editDueDate.value = task.querySelector('.due-date').innerText;

        editForm.style.display = 'block';
    } else {
        console.error("Valor de data-id da tarefa não encontrado.");
    }
}

document.addEventListener('click', (event) => {
    const editForm = document.querySelector('.edit-task-form');
    const editButtons = document.querySelectorAll('.edit-button');
    let isEditButton = false;

    editButtons.forEach((button) => {
        if (button.contains(event.target)) {
            isEditButton = true;
        }
    });

    if (!editForm.contains(event.target) && !isEditButton) {
        closeEditForm();
    }
});

function submitEditForm() {
    const editTaskId = document.getElementById('edit-task-id').value;
    const editTaskName = document.getElementById('edit-task-name').value;
    const editTaskDescription = document.getElementById('edit-task-description').value;
    const editDueDate = document.getElementById('edit-due-date').value;

    const task = document.querySelector(`.task[data-id="${editTaskId}"]`);
    task.querySelector('b').innerText = editTaskName;
    task.querySelector('.task-description').innerText = editTaskDescription;
    task.querySelector('.due-date').innerText = editDueDate;

    closeEditForm();
}

function closeEditForm() {
    const editForm = document.querySelector('.edit-task-form');
    editForm.style.display = 'none';
}

function addTask(list, taskName, taskDescription, dueDate) {
    const task = document.createElement("li");
    task.className = "task";
    task.draggable = true;
    task.dataset.id = taskName.replace(/\s+/g, '-').toLowerCase();

    const taskHTML = "<b>" + taskName + "</b><br><span class='task-description'>" + taskDescription + "</span><br><span class='due-date'>" + dueDate + "</span>";
    task.innerHTML = taskHTML;

    task.addEventListener("dragstart", drag);

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerText = "Editar";
    editButton.addEventListener("click", function () {
        openEditForm(task);
    });

    const space = document.createElement("span");
    space.innerHTML = "&nbsp;";

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Excluir";
    deleteButton.addEventListener("click", function () {
        deleteTask(task);
    });

    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(space);
    taskButtons.appendChild(deleteButton);

    task.appendChild(taskButtons);

    list.appendChild(task);
}

document.getElementById('edit-task-form').addEventListener('submit', function (event) {
    event.preventDefault();
    submitEditForm();
});

function deleteTask(task) {
    task.remove();
}


async function setLeadsByDayOfTheWeak() {
    await fetch('http://localhost:8080/lead/graph/leadsweek', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {

                var ctx = document.getElementById('barChart').getContext('2d');
                var dataLead = {

                    labels: data.dateLead,
                    datasets: [{
                        label: 'Total de ligações',
                        data: data.leadCount,
                        backgroundColor: '#8B008B',
                        borderColor: 'black',
                        borderWidth: 1
                    }]
                };

                var barChart = new Chart(ctx, {
                    type: 'bar',
                    data: dataLead,
                    options: options
                });
            }
        )
}