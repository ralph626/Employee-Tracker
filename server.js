const inquirer = require("inquirer");
const connection = require("./db/connections");

const addPrompts = {
  role: [
    {
      name: "title",
      type: "input",
      message: "Enter the name of the new role",
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the Salary of the new role",
    },
    {
      name: "department_id",
      type: "list",

      message: "Enter the department the new role will go to",
      choices: async () => {
        const departments = await view("department");
        return departments.map((a) => ({ name: a.name, value: a.id }));
      },
    },
  ],
  department: {
    name: "name",
    message: "what is the name of the department",
  },
  employee: [
    {
      name: "first_name",
      message: "Enter employee first name",
    },
    {
      name: "last_name",
      message: "Enter employee last name",
    },
    {
      name: "role_id",
      message: "Choose employee role",
      type: "list",
      choices: async () => {
        const roles = await view("role");
        return roles.map((a) => ({ name: a.title, value: a.id }));
      },
    },
    {
      name: "manager_id",
      message: "Who is the employee's manager?",
      type: "list",
      choices: async () => {
        const employees = await view("employee");
        return employees.map((a) => ({
          name: a.first_name + " " + a.last_name,
          value: a.id,
        }));
      },
    },
  ],
};

runSearch();
//===============INQUIRER COMMAND PATH QUESTION 1====================//
async function runSearch() {
  const answer = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "what would you like to do",
    choices: [
      "ADD Employee",
      "ADD Role",
      "ADD Department",
      "VIEW Employee",
      "VIEW Role",
      "VIEW Department",
      "UPDATE employee",
    ],
  });

  const [action, table] = answer.action.toLowerCase().split(" ");
  if (action === "view") {
    console.table(await view(table));
  } else if (action === "add") {
    const data = await inquirer.prompt(addPrompts[table]);
    await add(table, data);
    console.log("successfully added!");
    console.table(await view(table));
  } else if (action === "update") {
    const { id } = await inquirer.prompt({
      message: `Choose the ${table} you want to update.`,
      name: "id",
      type: "list",
      choices: async () => {
        const data = await view(table);
        return data.map((a) => ({
          name: a.first_name + " " + a.last_name,
          value: a.id,
        }));
      },
    });
    const { newRole } = await inquirer.prompt({
      message: `Choose the new role for this employee`,
      name: "newRole",
      type: "list",
      choices: async () => {
        const roles = await view("role");
        return roles.map((a) => ({ name: a.title, value: a.id }));
      },
    });
    console.log("updating employee with id ", id, newRole);
    await update(table, id, newRole);
  }

  setTimeout(runSearch, 3000);
}
//for choosing which table to enter
async function view(tableName) {
  return connection.query(`SELECT * FROM ${tableName}`);
}
//for inserting a new name
async function add(tableName, data) {
  return connection.query(`INSERT INTO ${tableName} SET ?`, data);
}
//for updating
async function update(tableName, id, newRole) {
  return connection.query(`UPDATE ${tableName} SET role_id=? WHERE id=?`, [
    newRole,
    id,
  ]);
}
