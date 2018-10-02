Sans docker compose:
	# build l'image
	docker build -t solary .

	#met sur le port 3000
	docker run -p 3000:3000 -v $(pwd)/log:/app/log solary

	# supprime les anciennes images
	docker container prune

	# supprime ton truc
	docker kill (le nom du truc)
Avec :
	docker-compose build
	docker-compose up
