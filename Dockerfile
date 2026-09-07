FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o vortexdm .

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/vortexdm .

EXPOSE 7070

VOLUME ["/app/downloads"]

ENTRYPOINT ["./vortexdm", "--port", "7070", "--headless"]
