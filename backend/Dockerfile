# Stage 1: Build the application using Maven
FROM maven:3.8.5-openjdk-17 AS build
# Set the working directory inside the container
WORKDIR /app
# Copy the Maven wrapper and pom.xml file to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Download dependencies
RUN ./mvnw dependency:go-offline
# Copy the rest of the source code
COPY src ./src
# Build the application, skipping tests
RUN ./mvnw package -DskipTests

# Stage 2: Create the final, smaller image to run the application
FROM openjdk:17-jdk-slim
# Set the working directory
WORKDIR /app
# Copy the built .jar file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port the application will run on (Render will use this)
EXPOSE 8080
# The command to run the application
ENTRYPOINT ["java","-jar","app.jar"]
