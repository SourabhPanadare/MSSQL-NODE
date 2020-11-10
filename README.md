# Import And Export MSSQL

	Exporting sql file
	Open MSSM:- Right Click on desired db (MeritEstimatorDev):- Tasks:- Export Data-Tier Application
	
	Importing sql file
	Open MSSM:- Right click on Databases folder:- Import Data-Tier Application
	
# Setting UP Local MSSQL

	a. Enable SQL Server Browser Service
	b. Enable the TCP/IP protocol
	c. Sql Server Authentication

	a. Enable SQL Server Browser Service
		Open SQL server Configuration Manager:- SQL Server Services:- Right Click SQL Server Browser:- properties:- Service:- Start Mode:-Automatic
		Windows Search:- services:- SQL server browser:- Right Click:- Start

	b. Enable the TCP/IP protocol
	    Open SQL server Configuration Manager:- SQL Server Network Configuration:- Protocols for MSSQLSERVER:- TCP/IP
		Right click on “TCP/IP” and choose “Enable” and press ok
		Right click on “TCP/IP”:- properties:- IP Addresses:- IPAll at bottom:- TCP port:1433
		Click on “SQL Server Services”:- Right click on “SQL Server (MSSQLSERVER) and choose “Restart”

	c. Sql Server Authentication instead of windows authentication
	   
		Open MSSM:- Select windows authentication at start:-Press Connect
		Right Click SOURABH-PC\SQLEXPRESS:- properties:- Security:-  SQL Server and Windows Authentication mode
		Right Click SOURABH-PC\SQLEXPRESS:- Restart
		Expand Security Option Below Databases:- Expand Logins:- New Login
		General:- Login Name:- xxxxxxxxx and SQL Server Authentication:- Put Your passwords:- press ok
		Server Roles:- Make Sure SysAdmin is selected:- press ok

