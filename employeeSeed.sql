INSERT INTO department(name) VALUES("sales"),('engineering'),('finance'),('legal');

INSERT INTO role(title,salary, department_id) VALUES('sales_Lead',100000,1),('salesperson',80000,1),('lead_engineer',150000,2),('software_engineer',120000, 2),('accountant',125000, 3),('legal_team_lead',250000, 4),('lawyer',100000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Sam','Simmons',1,null),('Lea','Hayes',2,1),('Domas','Harrison',2,1),('Cherry','Duke',3,null),('Eloise','Sierra',4,4),('Mark','Rayner',5,null),('Benjamin','Campbell',6,null),('Joann','Rowland',7,7);