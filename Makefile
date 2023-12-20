test:
	npm run build
	rm -rf ~/.nvm/versions/node/v18.16.1/lib/node_modules/homebridge-polestar/dist/*.js
	cp -r dist/ ~/.nvm/versions/node/v18.16.1/lib/node_modules/homebridge-polestar/dist/
	cp config.schema.json ~/.nvm/versions/node/v18.16.1/lib/node_modules/homebridge-polestar/config.schema.json
	rm -rf ~/.homebridge/accessories
	sudo hb-service restart