# Use a modern, stable JRE 21 image
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR /app

# Copy the pre-built JAR file into the container
COPY qa-training-app.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
