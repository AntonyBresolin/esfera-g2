document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetch('/proposal/faturamento/' + userId)
            .then(response => response.json())
            .then(data => {
                document.getElementById('faturamento-total').innerText = `R$${data.totalFaturamento.toFixed(2)}`;
                document.getElementById('faturamento-crescimento').innerText = `${data.crescimentoPercentual.toFixed(2)}% em comparação ao mês anterior`;
            })
            .catch(error => console.error('Erro ao buscar os dados de faturamento:', error));
    } else {
        console.error('User ID não encontrado no local storage.');
    }
});

// grafico linhas 1

window.onload = function () {
    setLeadsByDayOfTheWeak();
    setLeadsByDayOfTheMonth();
    fetchTasks(localStorage.getItem('userId'));
}

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


// grafico pizza (Propostas)

async function fetchAndUpdateChartProposal() {
    const userId = localStorage.getItem('userId');
    const periodSelect = document.getElementById('periodSelect');
    const period = periodSelect.value || 'all';

    try {
        const response = await axios.get(`/proposal/statistics/${userId}`, {
            params: { period: period }
        });
        const statistics = response.data;

        const labels = statistics.map(item => item[0]);
        const data = statistics.map(item => item[1]);

        const backgroundColors = [
            '#BA55D3',
            '#A020F0',
            '#8B008B',
            '#FF69B4',
            '#DA70D6'
        ];

        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length)
            }]
        };

        const ctx = document.getElementById('pieChart1').getContext('2d');

        if (window.pieChart instanceof Chart) {
            window.pieChart.data = chartData;
            window.pieChart.update();
        } else {
            window.pieChart = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Gráfico de Pizza'
                    }
                }
            });
        }

        const totalProposals = data.reduce((a, b) => a + b, 0);
        document.getElementById('totalProposals').innerText = `${totalProposals} Propostas`;

    } catch (error) {
        console.error('Erro ao buscar dados: ', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdateChartProposal();
    document.getElementById('periodSelect').addEventListener('change', fetchAndUpdateChartProposal);
});

// grafico pizza (Ligações)

async function fetchAndUpdateChartCalls() {
    const userId = localStorage.getItem('userId');
    const periodSelect = document.getElementById('periodSelectCalls');
    const period = periodSelect.value || 'all';

    try {
        const response = await axios.get(`/lead/statistics/${userId}`, {
            params: { period: period }
        });
        const statistics = response.data;

        const labels = statistics.map(item => item[0]);
        const data = statistics.map(item => item[1]);

        const backgroundColors = [
            '#BA55D3',
            '#A020F0',
            '#8B008B',
            '#FF69B4',
            '#DA70D6'
        ];

        const chartDataCalls = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length)
            }]
        };

        const ctxCalls = document.getElementById('pieChart2').getContext('2d');

        if (window.pieChartCalls instanceof Chart) {
            window.pieChartCalls.data = chartDataCalls;
            window.pieChartCalls.update();
        } else {
            window.pieChartCalls = new Chart(ctxCalls, {
                type: 'pie',
                data: chartDataCalls,
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Gráfico de Pizza (Ligações)'
                    }
                }
            });
        }

        const totalCalls = data.reduce((a, b) => a + b, 0);
        document.getElementById('totalCalls').innerText = `${totalCalls} Ligações`;

    } catch (error) {
        console.error('Erro ao buscar dados: ', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdateChartCalls();
    document.getElementById('periodSelectCalls').addEventListener('change', fetchAndUpdateChartCalls);
});

// gerenciador de tarefas

function closeFormsOnClickOutside(event) {
    const taskForm = document.querySelector('.task-form');
    const editForm = document.querySelector('.edit-task-form');
    
    if (taskForm.style.display === 'block' && !taskForm.contains(event.target)) {
        taskForm.style.display = 'none';
    }
    if (editForm.style.display === 'block' && !editForm.contains(event.target)) {
        editForm.style.display = 'none';
    }
}

document.addEventListener('click', closeFormsOnClickOutside);

const addTaskButton = document.getElementById('add-task-btn');
const taskForm = document.querySelector('.task-form');

addTaskButton.addEventListener('click', () => {
    taskForm.style.display = 'block';
    event.stopPropagation();
});

function updateTaskStatus(taskId, status) {
    fetch(`/task/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error updating task status');
        }
    })
    .catch(error => console.error('Error:', error));
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.dataset.id);
}

function drop(event, columnId) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const taskElement = document.querySelector(`.task[data-id='${taskId}']`);
    const oldColumnId = taskElement.dataset.status;
    const newStatus = columnId;
    if (oldColumnId !== newStatus) {
        taskElement.dataset.status = newStatus;
        const newTaskList = document.getElementById(newStatus);
        newTaskList.appendChild(taskElement);

        fetch(`/task/${taskId}/status?status=${newStatus}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task status');
            }
        })
        .catch(error => console.error('Error updating task status:', error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const taskFormElement = document.getElementById('task-form');
    taskFormElement.addEventListener('submit', function (event) {
        event.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskDescription = document.getElementById('task-description').value;
        const dueDate = document.getElementById('due-date').value;
        const userId = localStorage.getItem('userId');

        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate,
            user: { idUser: userId },
            status: "todo-list"
        };

        console.log(taskData);

        fetch('/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            return response.json();
        })
        .then(data => {
            addTaskToList(data);
            taskForm.style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
    });
});

function fetchTasks(userId) {
    fetch(`/task/all/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(task => addTaskToList(task));
        })
        .catch(error => console.error('Error:', error));
}

function openEditForm(taskElement) {
    const editForm = document.querySelector('.edit-task-form');
    const taskId = taskElement.dataset.id;
    const taskName = taskElement.querySelector('b').innerText;
    const taskDescription = taskElement.querySelector('.task-description').innerText;
    const dueDate = taskElement.querySelector('.due-date').innerText;

    document.getElementById('edit-task-id').value = taskId;
    document.getElementById('edit-task-name').value = taskName;
    document.getElementById('edit-task-description').value = taskDescription;

    const [day, month, year] = dueDate.split('-');
    const formattedDueDate = `${year}-${month}-${day}`;
    document.getElementById('edit-due-date').value = formattedDueDate;

    editForm.style.display = 'block';
    event.stopPropagation();
}

function submitEditForm() {
    const taskId = document.getElementById('edit-task-id').value;
    const taskName = document.getElementById('edit-task-name').value;
    const taskDescription = document.getElementById('edit-task-description').value;
    const dueDate = document.getElementById('edit-due-date').value;
    const taskStatus = document.querySelector(`.task[data-id='${taskId}']`).dataset.status;
    const userId = localStorage.getItem('userId');

    const taskData = {
        idTask: taskId,
        name: taskName,
        description: taskDescription,
        dueDate: dueDate,
        status: taskStatus,
        idUser: { idUser: userId }
    };

    fetch(`/task/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        updateTaskInList(data);
        document.querySelector('.edit-task-form').style.display = 'none';
    })
    .catch(error => console.error('Error updating task:', error));
}

function updateTaskInList(task) {
    const taskElement = document.querySelector(`.task[data-id='${task.idTask}']`);
    if (taskElement) {
        taskElement.querySelector('b').innerText = task.name;
        taskElement.querySelector('.task-description').innerText = task.description;
        taskElement.querySelector('.due-date').innerText = formatDate(task.dueDate);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

function addTaskToList(task) {
    const statusMap = {
        "todo-list": "todo-list",
        "inprogress-list": "inprogress-list",
        "done-list": "done-list"
    };

    const taskListId = statusMap[task.status];
    const taskList = document.getElementById(taskListId);

    if (!taskList) {
        console.error(`Task list element with ID '${taskListId}' not found`);
        return;
    }

    const taskElement = document.createElement("li");
    taskElement.className = "task";
    taskElement.draggable = true;
    taskElement.dataset.id = task.idTask;
    taskElement.dataset.status = task.status;

    const formattedDate = formatDate(task.dueDate);
    const taskHTML = "<b>" + task.name + "</b><br><span class='task-description'>" + task.description + "</span><br><span class='due-date'>" + formattedDate + "</span>";
    taskElement.innerHTML = taskHTML;

    taskElement.addEventListener("dragstart", drag);

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerText = "Editar";
    editButton.addEventListener("click", function () {
        openEditForm(taskElement);
    });

    const space = document.createElement("span");
    space.innerHTML = "&nbsp;";

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Excluir";
    deleteButton.addEventListener("click", function () {
        deleteTask(taskElement);
    });

    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(space);
    taskButtons.appendChild(deleteButton);

    taskElement.appendChild(taskButtons);

    taskList.appendChild(taskElement);
}

function deleteTask(taskElement) {
    const taskId = taskElement.dataset.id;
    fetch(`/task/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            taskElement.remove();
        } else {
            console.error('Error deleting task');
        }
    });
}


async function setLeadsByDayOfTheWeak() {
    await fetch('http://localhost:8080/lead/graph/leadsweek/' + localStorage.getItem('userId'), {
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
                        label: 'Total de ligações (Últimos 7 dias)',
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


async function setLeadsByDayOfTheMonth() {
    await fetch('http://localhost:8080/lead/graph/leadsmonth/'+localStorage.getItem('userId'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
                var ctx = document.getElementById('lineChart1').getContext('2d');
                var dataLead = {

                    labels: data.dateLead,
                    datasets: [{
                        label: 'Total de ligações (Últimos 30 dias)',
                        data: data.leadCount,
                        backgroundColor: '#8B008B',
                        borderWidth: 1,
                        borderColor: "purple",
                        fill: false
                    }]
                };

                var barChart = new Chart(ctx, {
                    type: 'line',
                    data: dataLead,
                    options: options
                });
            }
        )
}