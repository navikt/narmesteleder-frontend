FROM gcr.io/distroless/nodejs24-debian12@sha256:ac05a8febf24b547f09068149fcd6a071f69629cb2148b6f707a157e7f4c6306 as runtime

WORKDIR /app

COPY package.json /app/
COPY .next/standalone /app/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]
