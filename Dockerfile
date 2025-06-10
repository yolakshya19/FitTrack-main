# Step 1: Use Node.js image to build the React app
FROM node:22-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json for installing dependencies
COPY client/package.json client/package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire client folder (including src and public) into the container
COPY client/ ./client/

# Step 6: Expose port 3000
EXPOSE 3000

# Step 7: Run the React app
CMD ["npm", "start"]
