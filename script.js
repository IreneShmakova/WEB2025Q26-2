document.addEventListener('DOMContentLoaded', function() {
    createAppStructure();
    initApp();
});

function createAppStructure() {
    //создание контейнера приложения
    const container = document.createElement('div');
    container.className = 'container';

    //заголовок header
    const header = document.createElement('header');
    const h1 = document.createElement('h1');
    h1.textContent = 'ToDo Лист';

    //создание main - основного раздела. пока в нем секция ввода 
    // и секция с добавленными задачками (созбраны ниже)
    const main = document.createElement('main');

    //секция ввода
    const inputSection = document.createElement('section');
    inputSection.className = 'input-section';

    //ряд с элементами для ввода задачки
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    
    //окошко для ввода задачи
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'Название задачи';
    taskInput.id = 'taskInput';
    
    //интерактивное окно для ввода даты
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'dateInput';

    //кнопочка добавки задачи
    const addButton = document.createElement('button');
    addButton.id = 'addButton';
    addButton.textContent = 'Добавить задачу';

    //добавляем элементы в строчку-секцию ввода
    inputRow.appendChild(taskInput);
    inputRow.appendChild(dateInput);
    inputRow.appendChild(addButton);

    inputSection.appendChild(inputRow);

    //секция задач
    const tasksSection = document.createElement('section');
    tasksSection.className = 'tasks-section';
    
    //заголовок 
    const tasksTitle = document.createElement('h2');
    tasksTitle.textContent = 'Мои задачи';

    //список задачек непосредственно
    //'ul' - тег означающий список
    const taskList = document.createElement('ul');
    taskList.className = 'task-list';
    taskList.id = 'taskList';

    //собираем все в секцию задачек
    tasksSection.appendChild(tasksTitle);
    tasksSection.appendChild(taskList);

    //сборка структуры main
    main.appendChild(inputSection);
    main.appendChild(tasksSection);

    //footer - подпись снизу
    const footer = document.createElement('footer');
    footer.textContent = 'Шмакова И.Д. Сайт для курса "Web-программирование" 2025';

    //сборка полной структуры
    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);

    //добавление контейнера в body
    document.body.appendChild(container);
}

//логика приложения - пока что добавить, удалить, отредачить
function initApp() {
    //в локалсторедж храним список задач 
    // - чтобы не слетали при обновлении страницы
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    //окна ввода задачи, ввода даты, кнопка добавки, список задачек
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // функция отображения задач
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            showEmptyState();
            return;
        }
        // каждую задачу из списка добавляем по одной (ф-я описана ниже)
        tasks.forEach((task) => {
            createTaskElement(task);
        });
    }
    // функция показа пустого списка задач
    function showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';

        const emptyTitle = document.createElement('h3');
        emptyTitle.textContent = 'Задач пока нет';

        const emptyText = document.createElement('p');
        emptyText.textContent = 'Добавьте свою первую задачу выше';

        // собираем вместе заголовок и текст
        // они подсказывают пользователю состояние задач + что сделать
        emptyState.appendChild(emptyTitle);
        emptyState.appendChild(emptyText);

        taskList.appendChild(emptyState);
    }
    // функция добавки задачи
    function createTaskElement(task) {
        //li - list element
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;
        
        // общая секция для хар-к задачки
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // название задачки
        const taskTitle = document.createElement('div');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.text;
        
        // дата (дедлайн)
        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        taskDate.textContent = `Дата: ${formatDate(task.date)}`;

        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskDate);

        // строчка для действий с задачами
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Редактировать';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Удалить';

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        //в задачу собираем секцию с хар-ками и действиями
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);

        // обработчик для кнопки удаления задачи
        deleteButton.addEventListener('click', () => {
            showDeleteConfirmation(task);
        });

        // обработчик для кнопки редактирования задачи
        editButton.addEventListener('click', () => {
            showEditPopup(task);
        });
    }

    // ф-я для корректного отображения даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        //форматирование для отображения как в россии
        return date.toLocaleDateString('ru-RU');
    }

    //ф-я показа сообщения для подтверждения удаления
    function showDeleteConfirmation(task) {
        const popup = createPopup(
            'Подтверждение удаления',
            `Вы уверены, что хотите удалить задачу "${task.text}"?`,
            [
                { text: 'Отмена', type: 'cancel' },
                {
                    text: 'Удалить',
                    type: 'delete',
                    action: () => {
                        tasks = tasks.filter(t => t.id !== task.id);
                        saveTasks();
                        renderTasks();
                    }
                }
            ]
        );
        document.body.appendChild(popup);
    }

    //функция показа поп-апа редактирования
    function showEditPopup(task) {
        const popup = createEditPopup(task);
        document.body.appendChild(popup);
    }

    // универсальная функция создания поп-апа
    function createPopup(title, message, buttons) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'popup';

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;

        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.marginBottom = '20px';
        messageElement.style.textAlign = 'center';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';

        // определяем классы кнопок
        buttons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.textContent = buttonConfig.text;

            if (buttonConfig.type === 'cancel') {
                button.className = 'cancel-btn';
                button.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                });
            } else {
                button.addEventListener('click', () => {
                    if (buttonConfig.action) {
                        buttonConfig.action();
                    }
                    document.body.removeChild(overlay);
                });

                if (buttonConfig.type === 'delete') {
                    button.className = 'delete-btn';
                }
            }

            buttonsContainer.appendChild(button);
        });

        //собираем заголовок, само сообщение и кнопки
        popup.appendChild(titleElement);
        popup.appendChild(messageElement);
        popup.appendChild(buttonsContainer);

        overlay.appendChild(popup);

        return overlay;
    }

    // ф-я для создания поп-апа редактирования
    function createEditPopup(task) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'popup';

        const titleElement = document.createElement('h3');
        titleElement.textContent = 'Редактирование задачи';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'popup-input';
        textInput.value = task.text;
        textInput.placeholder = 'Название задачи';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'popup-input';
        dateInput.value = task.date;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';
        cancelButton.className = 'cancel-btn';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        saveButton.addEventListener('click', () => {
            const newText = textInput.value.trim();
            const newDate = dateInput.value;

            if (newText === '') {
                showErrorPopup('Пожалуйста, введите текст задачи');
                return;
            }

            if (newDate === '') {
                showErrorPopup('Пожалуйста, выберите дату');
                return;
            }

            task.text = newText;
            task.date = newDate;
            saveTasks();
            renderTasks();
            document.body.removeChild(overlay);
        });

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(saveButton);

        popup.appendChild(titleElement);
        popup.appendChild(textInput);
        popup.appendChild(dateInput);
        popup.appendChild(buttonsContainer);

        overlay.appendChild(popup);

        return overlay;
    }

    function showErrorPopup(message) {
        const popup = createPopup('Ошибка', message, [
            { text: 'OK', type: 'cancel' }
        ]);
        document.body.appendChild(popup);
    }

    // ф-я сохранения задач в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // ф-я добавления новой задачи
    function addTask() {
        const text = taskInput.value.trim();
        const date = dateInput.value;

        if (text === '') {
            showErrorPopup('Пожалуйста, введите текст задачи');
            return;
        }

        if (date === '') {
            showErrorPopup('Пожалуйста, выберите дату');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text: text,
            date: date
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        // очистка полей ввода
        taskInput.value = '';
        dateInput.value = '';
        taskInput.focus();
    }

    // обработчики событий
    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // установка минимальной даты как сегодняшней
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // первоначальная отрисовка задач
    renderTasks();
}