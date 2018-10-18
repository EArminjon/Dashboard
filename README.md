# README
>## INSTALLATION PROD
>>### Without docker compose:      
    /* build image */
	docker build -t solary .

	/* host to port 3000 */
	docker run -p 3000:3000 -v $(pwd)/log:/app/log solary

	/* delete former images */
	docker container prune

	/* supprime ton truc */
	docker kill (le nom du truc)
>>### With docker compose :
	docker-compose build
	docker-compose up
	
>## INSTALLATION DEV
    npm install
    node_modules/nodemon/bin/nodemon.js node/server.js
    
*******************************
*******************************

# Add a service (one service == one widget)
Requirement to create widget :
* widgets/{widget}.js
* widgets/{widget_template}.ejs
* finally add new entry on servicesManager.js

>###{widget}.js
* must export functions array with service and defaultOptions
    *  (module.exports = {functions: {service: timeService, defaultOptions: defaultOptions}};)
        *   service return (response = {url: null, function: null, header: null};)
            * url: if need api
            * function: fonction callback: code of the widget   
        *   defaultOptions return list of default option (id, title and refresh are mandatory)
>### {widget_template}.js
* must follow this schema:

        <div class="widget" id="<%= id %>">
        <div class="invisible widget-options" style="position: absolute; z-index: 10">
            <form data-id="<%= id %>" data-service="time">
                # input name must be same as widget options
            </form>
        </div>            
        <div class="visible widget-content" style="z-index:1;color: #00ABEB;">
            # content of the widget, you are free here
        </div>
            
                              
