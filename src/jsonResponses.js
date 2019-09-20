// returns the specified status code and message/id in JSON format
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// returns the specified status code and message/id in XML format
const respondXML = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(content);
  response.end();
};

// Creates and returns a header and response object
// Header is based on the page parameter
// Format of response is taken from the 'Accept' header
const respond = (request, response, page, params) => {
  const acceptedTypes = request.headers.accept.split(',');
  const requestType = acceptedTypes[0];

  let responseCode = 200;
  let message = 'This is a successful response';
  let id;

  switch (page) {
    case '/success':
      responseCode = 200;
      break;
    case '/badRequest':
      if (!params.valid || params.valid !== 'true') {
        responseCode = 400;
        message = 'Missing valid query parameter set to true';
        id = 'badRequest';
      } else message = 'This request has the required parameters';
      break;
    case '/unauthorized':
      if (!params.loggedIn || params.loggedIn !== 'yes') {
        responseCode = 401;
        message = 'Missing loggedIn query parameter set to yes';
        id = 'unauthorized';
      } else message = 'You have successfully viewed the content';
      break;
    case '/forbidden':
      responseCode = 403;
      message = 'You do not have access to this content';
      id = 'forbidden';
      break;
    case '/internal':
      responseCode = 500;
      message = 'Internal server error. Something went wrong';
      id = 'internalError';
      break;
    case '/notImplemented':
      responseCode = 501;
      message = 'A get request for this page has not been implemented yet. Check again later for updated content';
      id = 'notImplemented';
      break;
    default:
      responseCode = 404;
      message = 'The page you are looking for was not found';
      id = 'notFound';
      break;
  }

  // Create and send the XML response
  if (requestType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message}</message>`;
    if (id) responseXML = `${responseXML} <id>${id}</id>`;
    responseXML = `${responseXML} </response>`;
    return respondXML(request, response, responseCode, responseXML);
  }

  // Create and send the JSON response (default)
  const responseJSON = {};
  responseJSON.message = message;
  if (id) responseJSON.id = id;
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  respond,
};
