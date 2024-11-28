#!/bin/bash

# Create .cert directory if it doesn't exist
mkdir -p .cert

# Generate SSL certificates
openssl req -x509 -newkey rsa:2048 -keyout .cert/key.pem -out .cert/cert.pem -days 365 -nodes -subj "/C=US/ST=California/L=San Francisco/O=Development/CN=localhost"

# Set appropriate permissions
chmod 600 .cert/key.pem .cert/cert.pem

echo "SSL certificates generated successfully!"
