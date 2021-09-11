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
                addEmployee();
            }
            if (firstPrompt === 'Update employee role') {
                updateRole();
            }
            if (firstPrompt === 'Exit') {
                db.end();
            }
        });
};


function allDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        console.table(res);
        inquirer.prompt([
            {
                name: 'startExit',
                type: 'list',
                message: 'Would you like to return to main menu or exit?',
                choices: [
                    'Main Menu',
                    'EXIT'
                ]
            }
        ])
            .then(({ startExit }) => {
                if (startExit === 'Main Menu') {
                    startPrompt();
                }
                if (startExit === 'EXIT') {
                    db.end();
                }
            });
    });
};

function allRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        console.table(res);
        inquirer.prompt([
            {
                name: 'startExit',
                type: 'list',
                message: 'Would you like to return to main menu or exit?',
                choices: [
                    'Main Menu',
                    'EXIT'
                ]
            }
        ])
            .then(({ startExit }) => {
                if (startExit === 'Main Menu') {
                    startPrompt();
                }
                if (startExit === 'EXIT') {
                    db.end();
                }
            });
    });
};

function allEmployees() {
    db.query('SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, res) => {
        console.table(res);
        inquirer.prompt([
            {
                name: 'startExit',
                type: 'list',
                message: 'Would you like to return to main menu or exit?',
                choices: [
                    'Main Menu',
                    'EXIT'
                ]
            }
        ])
            .then(({ startExit }) => {
                if (startExit === 'Main Menu') {
                    startPrompt();
                }
                if (startExit === 'EXIT') {
                    db.end();
                }
            });
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
                inquirer.prompt([
                    {
                        name: 'startExit',
                        type: 'list',
                        message: 'Would you like to return to main menu or exit?',
                        choices: [
                            'Main Menu',
                            'EXIT'
                        ]
                    }
                ])
                    .then(({ startExit }) => {
                        if (startExit === 'Main Menu') {
                            startPrompt();
                        }
                        if (startExit === 'EXIT') {
                            db.end();
                        }
                    });
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
                    inquirer.prompt([
                        {
                            name: 'startExit',
                            type: 'list',
                            message: 'Would you like to return to main menu or exit?',
                            choices: [
                                'Main Menu',
                                'EXIT'
                            ]
                        }
                    ])
                        .then(({ startExit }) => {
                            if (startExit === 'Main Menu') {
                                startPrompt();
                            }
                            if (startExit === 'EXIT') {
                                db.end();
                            }
                        });
                });
            });
    });
};

function addEmployee() {
    db.query('SELECT * FROM role', (err, res) => {
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employees first name?',
                validate: (firstName) => {
                    if (!firstName) {
                        return 'Please enter a name!';
                    }
                    return true;
                }
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?',
                validate: (lastName) => {
                    if (!lastName) {
                        return 'Please enter a name!';
                    }
                    return true;
                }
            },
            {
                name: 'employeeRole',
                type: 'list',
                message: 'What is the employees role?',
                choices: res.map((role) => role.title)
            }
        ])
            .then(({ firstName, lastName, employeeRole }) => {
                res.map(finds => {
                    if (finds.title === employeeRole) {
                        var roleID = finds.id;
                        db.query('INSERT INTO employee SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: roleID
                            },
                            console.log('New employee added')
                        );
                        db.query('SELECT * FROM employee', (err, res) => {
                            console.table(res);
                            inquirer.prompt([
                                {
                                    name: 'startExit',
                                    type: 'list',
                                    message: 'Would you like to return to main menu or exit?',
                                    choices: [
                                        'Main Menu',
                                        'EXIT'
                                    ]
                                }
                            ])
                                .then(({ startExit }) => {
                                    if (startExit === 'Main Menu') {
                                        startPrompt();
                                    }
                                    if (startExit === 'EXIT') {
                                        db.end();
                                    }
                                });
                        });
                    };
                });
            });
    });
};

function updateRole() {
    db.query('SELECT * FROM employee', (err, res) => {

        inquirer.prompt([
            {
                name: 'employeeID',
                type: 'rawlist',
                message: 'Which employee role would you like to update?',
                choices: () => {
                    var empArr = [];
                    res.forEach((data) => {
                        var name = (data.first_name + ' ' + data.last_name)
                        var value = data.id
                        empArr.push({ name, value })
                    })
                    return empArr;
                }
            }
        ])
            .then((empmloyeeAnswer) => {
                db.query('SELECT * FROM role', (err, roleRes) => {
                    inquirer.prompt([
                        {
                            name: 'employeeRole',
                            type: 'list',
                            message: 'What is the employees new role?',
                            choices: () => {
                                var roleArr = [];
                                roleRes.forEach((data1) => {
                                    var name = data1.title
                                    var value = data1.id
                                    roleArr.push({ name, value })
                                })
                                return roleArr;
                            }
                        }
                    ])
                        .then((roleAnswer) => {
                            for (var i = 0; i < roleRes.length; i++) {
                                if (roleAnswer.employeeRole === (roleRes[i].id)) {
                                    db.query('UPDATE employee SET ? WHERE ?',
                                        [
                                            {
                                                role_id: roleAnswer.employeeRole
                                            },
                                            {
                                                id: empmloyeeAnswer.employeeID
                                            }
                                        ],
                                    );
                                    console.log('Employee role updated!');
                                    db.query('SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, res) => {
                                        console.table(res);
                                        inquirer.prompt([
                                            {
                                                name: 'startExit',
                                                type: 'list',
                                                message: 'Would you like to return to main menu or exit?',
                                                choices: [
                                                    'Main Menu',
                                                    'EXIT'
                                                ]
                                            }
                                        ])
                                            .then(({ startExit }) => {
                                                if (startExit === 'Main Menu') {
                                                    startPrompt();
                                                }
                                                if (startExit === 'EXIT') {
                                                    db.end();
                                                }
                                            });
                                    });
                                };
                            };
                        });
                });
            });
    });
};
