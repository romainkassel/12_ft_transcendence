all:
	@sh ipsetter.sh
	@(docker-compose up --build)

stop:
	docker-compose stop

clean:
	docker-compose stop
	docker ps
	rm -rf ./nginx-logs
	@sh ipreset.sh

fclean: clean
	docker-compose down
	docker system prune -af --volumes
	docker volume rm $$(docker volume ls -q)
	docker image ls
	docker volume ls
	docker ps

re: fclean all

.PHONY: all clean fclean re lite
