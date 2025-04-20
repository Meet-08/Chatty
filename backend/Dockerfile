# Use Eclipse Temurin's Java 21 JDK as the base image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/chatty-0.0.1-SNAPSHOT.jar app.jar

# Expose the application's port
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
