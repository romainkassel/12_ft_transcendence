# 12_ft_transcendence

<img width="609" alt="console_ft_transcendence_ecole_42" src="https://github.com/user-attachments/assets/15d7f571-553d-4ba2-aa9c-99670efd1af6" />

## Project overview

This is a 42 school project, the last one of the core curriculum.

This project focuses on the design, development and organisation of a complete web application.

## How to use this repository?

### Recommended Operating System (OS)

I recommand to use a Linux distribution such as:

- Latest stable version (LTS) of Ubuntu
- Latest stable version (LTS) of Debian

### Prerequisites

This project is using Docker.
In order to follow the steps below, you have to install Docker packages first.

### Steps to follow

1. Go to the directory where you want to clone the directory: `cd path/of/repository/`
2. Clone this repository: `git clone git@github.com:romainkassel/12_ft_transcendence.git`
3. Enter into cloned repository: `cd 12_ft_transcendence`
4. If you have VS Code installed, open it: `open .`
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

9. Now you can open your favorite browser and go the following URL: `https://localhost:8080`

> [!NOTE]
> You are warned that the site is not secure and it is true<br/>
> We used the HTTPS protocol for this website and, as a student project, we have not submitted the SSL certificates for validation by an official authority<br/>
> You can trust us and agree to continue browsing our website despite this warning!

10. Here you go! If everything went smoothly, the site should be displayed and you can start exploring.

<img width="1470" alt="page_login_ft_transcendence_ecole_42" src="https://github.com/user-attachments/assets/e958a5b3-6e7d-473c-950d-3c1559b810b2" />

> [!TIP]
> Do not forget to create an account before trying to connect. Simply click on the `Create an account` link at the bottom of the page.

## I tested the site and I'm happy. Now I'd like to clean it up. What do I do?

1. In your terminal, stop Docker services by clicking on `CTRL + C`
2. Run the following command to remove everything (containers, images and volumes): `make fclean`
3. Go outside of the repository: `cd ..`
4. Remove the repository: `rm -rf 12_ft_transcendence`
