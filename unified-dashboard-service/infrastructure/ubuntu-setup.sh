#!/bin/bash

# Unified Dashboard Service - Ubuntu Setup Script
# Run as: sudo bash ubuntu-setup.sh

set -e

echo "🚀 Setting up Unified Dashboard Service..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Create project directory
mkdir -p ~/unified-dashboard-service
cd ~/unified-dashboard-service

# Clone or copy your project files
# git clone <your-repo> .

# Set up firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
sudo ufw --force enable

echo "✅ Setup complete!"
echo "📝 Next steps:"
echo "1. Run: docker-compose up -d"
echo "2. Access dashboard at http://localhost:3000"
echo "3. Access GraphQL at http://localhost:4000/graphql"
echo "4. Access n8n at http://localhost:5678"