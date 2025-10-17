FROM gcr.io/distroless/nodejs22-debian12 as runtime

WORKDIR /app

COPY package.json /app/
COPY .next/standalone /app/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]
