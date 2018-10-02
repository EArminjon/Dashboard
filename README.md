docker build -t solary .
docker run -p 3000:3000 -v $(pwd)/log:/app/log solary