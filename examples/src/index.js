import http from 'http';
import React from 'react';
import App from './app';
import RAMPT from '../../lib';
const debug = require('debug')('example:server');
const error = require('debug')('example:server:error');


const createTemplate = () => {
  /**
  * react-amp-template returns a promise which will be fulfilled
  * with a string that holds the whole HTML document ready to serve.
  * The promise will reject for any internal error.
  * Once done rendering, proceed to create the server.
  */
  const rampt = new RAMPT({
    ampValidations: true,
    template: {
      head: {
        title: 'react amp template',
        canonical: 'http://non-amp.html',
      }
    }
  });

  return rampt
    .renderStatic(<App bannerText="React-AMP-Template" />)
    .catch(error);
}


http.createServer((request, response) => {
  createTemplate()
  .then(function(html){
    response.writeHeader(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
  });
})

.listen(8000)

.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  error(err);
});

debug('Listening on port 8000');
