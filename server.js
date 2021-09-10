const inquirer = require('inquirer');
const db = require('./db/connection');

const mysql = require('mysql2');
require('dotenv').config();


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
            'Update employee role',
            'Exit'
        ]
    })
        .then(({ firstPrompt }) => {
            if (firstPrompt === 'View all departments') {
                allDepartments();
            }
            if (firstPrompt === 'View all roles') {
                allRoles();
            }
            if (firstPrompt === 'View all employees') {
                allEmployees();
            }
            if (firstPrompt === 'Add a department') {
                addDepartment();
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
            if (firstPrompt === 'Exit') {
                db.end();
            }
        });
};


function allDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        console.table(res);
        startPrompt();
    });
};

function allRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        console.table(res);
        startPrompt();
    });
};

function allEmployees() {
    db.query('SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, res) => {
        console.table(res);
        startPrompt();
    });
};

function addDepartment() {
    inquirer.prompt 
}