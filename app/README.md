# Running the Stereoscopic Image Analyzer
## What is the Stereoscopic Image Analyzer?
The Stereoscopic Image Analyzer is a platform agnostic computer vision application for measuring distances in arbitrary stereographs.

## How does it work? How do I use it?

### Application Layers
The application consists of two seperate layers that work together. The api server is written in JavaScript using Node.js as a runtime environment for server side operations. The client server is written using JavaScript, HTML and CSS with the help of the React npm library.

### Node.js Server
The api server used for this application is built using Node.js and Express. Node.js provides an asynchronous runtime environment for handling server-side requests with JavaScript. Express is a library that provides an easy way to handle requests and define behavior at specified endpoints.
The api server provides the mathematical and computer vision functionality for the project. This server gives the client access to the api it defines, and it houses our predictive model, the code that utilized the model, creates disparity maps, and estimates distance, among other things.

### React.js Front-End
The application front-end is built using the React JavaScript library. The React library provides tools for defining custom components and behaviors using the modular power of JavaScript. The front-end builds the user interface, and sends requests to the api server using the user inputted parameters, including images, focal length, and reference measurements.

### Putting it all together
Both the client and api server are seperate npm environments. This means that they have seperate dependencies, and run as seperate processes. The api server must be set up as a proxy server for the client server to call its functions. Setting up these environments and knowing which commands to run can often lead to user error, and make it difficult to debug errors.

### Docker and Docker Compose
Docker is a technology that creates executable software packages called containers. Docker Containers include all of the code needed for an application or environment to run, including system tools and libraries, code, and runtime information. Unlike virtual machines, a Docker uses the resources of the host machine rather than having its own.
Installation guides for various common operating systems can be found [here.](https://docs.docker.com/v17.09/engine/installation/)

Docker images create a uniform system environment which includes all of the dependencies the application requires to run, abstracting away these requirements from the user while ensuring that the application runs on all Docker supported platforms.

Docker Compose is a tool for defining and multi container docker application. Docker Compose reads in a docker-compose.yml in the parent directory of the dockerized code modules, and defines the docker images as services that can be run in parallel. Installation guides for various common operating systems can be found [here.](https://docs.docker.com/compose/install/)

)In this case, the services are the server, which provides the applications api code, and the client, which renders the front end and gives real-time requests to the server. The docker images run separately from one another, however, the communication ports used for interacting with the localhost and with each container remain open and functional.
While in the /app/ directory of the application, this command builds and runs the image(s): 
`docker-compose up --build`

Once the images are built, `docker-compose up` will run the application. The --build flag builds the images, and should only be used when changes in the repository environment are made.



