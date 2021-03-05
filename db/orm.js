const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_tracker",
});

class orm {
  getEmployee(id, cb) {
    connection.query("select * from employee where id =?", [id], cb);
  }
  addEmployee(firstName, lastName, role, manager, cb) {
    connection.query(
      "insert into employee(first_name,last_name, role_id, manager_id) values(?,?,?,?)",
      [firstName, lastName, role, manager],
      cb
    );
  }
}
const db = new orm();
db.addEmployee("Ralph", "something", 1, 1, function (err, res) {
  console.log(res);
});
