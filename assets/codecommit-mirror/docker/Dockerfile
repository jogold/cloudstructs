FROM alpine:3.12

RUN apk add --no-cache \
    git \
    python3

RUN python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip awscli git-remote-codecommit && \
    rm -r /root/.cache

COPY mirror.sh .

CMD ["./mirror.sh"]
