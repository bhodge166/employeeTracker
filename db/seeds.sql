INSERT INTO department (name) 
VALUES ("Sales"), 
        ("Engineering"), 
        ("Legal"), 
        ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 4),
        ("Accountant", 125000, 4),
        ("Lawyer", 190000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 1, null),
        ("Ashley", "Rodriguez", 2, null),
        ("Kevin", "Tupik", 2, 2),
        ("Kunal", "Singh", 4, null),
        ("Sarah", "Lourd", 3, null);