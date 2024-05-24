#!  /usr/bin/env node

import  inquirer from 'inquirer';
import  fs from 'fs';

interface TodoItem {
    id: number;
    task: string;
    completed: boolean;
}

let todoList: TodoItem[] = [];

const loadTodoList = (): void => {
    try {
        const data = fs.readFileSync('todos.json', 'utf8');
        todoList = JSON.parse(data);
    } catch (err) {
        console.log("No todos found, starting with an empty list.");
    }
};

const saveTodoList = (): void => {
    fs.writeFileSync('todos.json', JSON.stringify(todoList), 'utf8');
};

const showTodoList = (): void => {
    console.log("\nTODO LIST\n");
    todoList.forEach((todo) => {
        const status = todo.completed ? "[x]" : "[ ]";
        console.log(`${status} ${todo.id}. ${todo.task}`);
    });
    console.log("\n");
};

const addTodo = async (): Promise<void> => {
    const { task } = await inquirer.prompt({
        type: 'input',
        name: 'task',
        message: 'Enter task:'
    });

    const newTodo: TodoItem = {
        id: todoList.length + 1,
        task,
        completed: false
    };

    todoList.push(newTodo);
    saveTodoList();
    console.log("Task added successfully!");
};

const markComplete = async (): Promise<void> => {
    const { taskId } = await inquirer.prompt({
        type: 'input',
        name: 'taskId',
        message: 'Enter the ID of the task you want to mark as complete:'
    });

    const id = parseInt(taskId);
    const todo = todoList.find((t) => t.id === id);

    if (todo) {
        todo.completed = true;
        saveTodoList();
        console.log("Task marked as complete!");
    } else {
        console.log("Task not found!");
    }
};

const mainMenu = async (): Promise<void> => {
    loadTodoList();
    let choice: string = '';

    while (choice !== 'Quit') {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View Todo List', 'Add Todo', 'Mark Task Complete', 'Quit']
        });

        switch (action) {
            case 'View Todo List':
                showTodoList();
                break;
            case 'Add Todo':
                await addTodo();
                break;
            case 'Mark Task Complete':
                await markComplete();
                break;
            case 'Quit':
                console.log("Goodbye!");
                break;
            default:
                console.log("Invalid choice!");
        }

        if (action !== 'Quit') {
            choice = await inquirer.prompt({
                type: 'confirm',
                name: 'continue',
                message: 'Do you want to continue?',
                default: true
            }).then((answer) => answer.continue ? '' : 'Quit');
        }
    }
};

mainMenu();
