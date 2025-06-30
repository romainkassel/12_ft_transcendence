import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from '@fastify/static';
import path from 'path';
import routes from "./routes.js";
import { fastifyJwt } from "@fastify/jwt";
import { registerClient } from "./socket.js";

export const server = fastify({
	trustProxy: true,
});

// multipart/form-data pour l'upload des avatars
server.register(multipart);

// static pour acceder aux avatars depuis le front
server.register(fastifyStatic, {
	root: path.join(process.cwd(), '/avatars'),
	prefix: '/avatars/'
});

// CORS pour les requêtes HTTP
await server.register(cors, {
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'DELETE']
});

// JWT
await server.register(fastifyJwt, {
	secret: process.env.JWT_SIGNIN_SECRET
});

// Socket.IO
await server.register(fastifyIO, {
	cors: {
		origin: true,
		methods: ['GET', 'POST'],
		credentials: true
	},
	path : '/socket.io/',
	transports: ["websocket"],
  	pingTimeout: 20000,
  	pingInterval: 10000,
});

// Middleware JWT
server.decorate("jwtAuth", async function (req, res) {
	try {
		await req.jwtVerify();
	} catch (err) {
		res.code(401).send({ message: "Unauthorized" });
	}
});

server.register(routes);

export let clients = []

// WebSocket - connexion
server.ready()

  server.io.on("connection", (socket) => {
    registerClient(socket, server.io);
  });

// Gestion des erreurs
server.setErrorHandler((error, req, res) => {
	console.error(error);
	res.code(500).send({ error: error.message });
});

// Démarrage du serveur
const start = async () => {
	try {
		console.log("Démarrage du serveur HTTP + WebSocket...");
		await server.listen({ host: '0.0.0.0', port: 8181 });
		console.log("Serveur bakcend en ligne sur http://0.0.0.0:8181");
		console.log("Serveur frontend en ligne sur https://{TRANSCENDENCE_IP}:8080");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
