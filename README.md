# 12_ft_transcendence

## Project overview

This is a 42 school project, the last one of the core curriculum.

This project focuses on the design, development and organisation of a complete web application.

## How to use this repository?

1. Go to the directory where you want to clone the directory: `cd path/of/repository/`
2. Clone this repository: `git clone git@github.com:romainkassel/12_ft_transcendence.git`
3. Enter into cloned repository: `cd 12_ft_transcendence`
4. Open repository with VS Code: `open .`
5. At the root of this repository, rename the `.env.example` file to `.env`: `mv .env.example .env`
6. Associate a value to each environment variable listed in the .env file

> [!NOTE]
> If you have any trouble at this step, please contact me!

7. Still at the root of the repository, launch the project's build: `make`

> [!TIP]
> This command builds and starts all services, including those related to DevOps<br/>
> It includes Monitoring system (Prometheus / Grafana) and Log Management (ELK (Elasticsearch, Logstash, Kibana))<br/>
> That's why build and services launch may take (a lot of) time<br/>
> If you want to save time, you can run a lighter version of this projet without services above: `make lite`<br/>

8. Once the project has been built and services started, you should see something like this in your console:

<img width="609" alt="console_ft_transcendence_ecole_42" src="https://github.com/user-attachments/assets/15d7f571-553d-4ba2-aa9c-99670efd1af6" />

9. You can now open your favorite browser, 



