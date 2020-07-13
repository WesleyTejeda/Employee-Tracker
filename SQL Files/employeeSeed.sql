INSERT INTO department(name) VALUES("sales"),('engineering'),('finance'),('legal');

INSERT INTO role(title,salary, department_id) VALUES('Sales Lead',100000,1),('Salesperson',80000,1),('Lead Engineer',150000,2),('Software Engineer',120000, 2),('Accountant',125000, 3),('Legal Team Lead',250000, 4),('Lawyer',100000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Sam','Simmons',1,null),('Lea','Hayes',2,1),('Domas','Harrison',2,1),('Cherry','Duke',3,null),('Eloise','Sierra',4,4),('Mark','Rayner',5,null),('Benjamin','Campbell',6,null),('Joann','Rowland',7,7);