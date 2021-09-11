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
                addRole();
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
    inquirer.prompt([
        {
            name: 'newDep',
            type: 'input',
            message: 'What would you like to call the new department?'
        }
    ])
        .then(({ newDep }) => {
            db.query('INSERT INTO department SET ?',
                {
                    name: newDep
                }
            );
            console.log('New department added!');
            db.query('SELECT * FROM department', (err, res) => {
                console.table(res);
                startPrompt();
            });
        });
};

function addRole() {
    db.query('SELECT * FROM role INNER JOIN department ON role.department_id = department.id', (err, res) => {
        console.table(res);
    });
    db.query('SELECT * FROM department', (err, res) => {
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the new roles title?',
                validate: (title) => {
                    if (!title) {
                        return 'Please enter a new title'
                    }
                    return true;
                }
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary of the new role AS A NUMBER!',
                validate: (salary) => {
                    if (isNaN(salary)) {
                        return 'Please enter a number';
                    }
                    return true;
                }
            },
            {
                name: 'roleDep',
                type: 'list',
                message: 'What department',
                choices: res.map(department => department.name)
            }
        ])
        .then(({ title, salary, roleDep }) => {
            res.map(finds => {
                if (finds.name === roleDep) {
                    var depId = finds.id;
                    db.query('INSERT INTO role SET ?',
                    {
                        title: title,
                        salary: salary,
                        department_id: depId
                    });
                    console.log('New role added.');
                }
            });
            db.query('SELECT * FROM role', (err, res) => {
                console.table(res);
                startPrompt();
            });
        });
    });
};

