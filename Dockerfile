# Prototipo Kora IA: sitio estático + intermediario con Gemini (Node 20, sin dependencias).
FROM node:20-alpine
WORKDIR /app
COPY server.js index.html ./
COPY css ./css
COPY js ./js
ENV PORT=5190
EXPOSE 5190
USER node
CMD ["node", "server.js"]
