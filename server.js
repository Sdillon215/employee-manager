const inquirer = require('inquirer');
const db = require('./db/connection');
const table = require('console.table');

startPrompt = function () {
    inquirer.prompt({
        name: 'firstPrompt',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role'
        ]
    })
        .then(({ firstPrompt }) => {
            if (firstPrompt === 'View all departments') {
                console.log(1);
            } 
            if (firstPrompt === 'View all roles') {
                console.log(2);
            } 
            if (firstPrompt === 'View all employees') {
                console.log(3);
            } 
            if (firstPrompt === 'Add a department') {
                console.log(4);
            }
            if (firstPrompt === 'Add a role') {
                console.log(5);
            } 
            if (firstPrompt === 'Add an employee') {
                console.log(6);
            } 
            if (firstPrompt === 'Update employee role') {
                console.log(7);
            }
        });
};
