FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw -q -DskipTests package
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/jack-and-paws-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:+UseSerialGC","-XX:MaxRAMPercentage=75","-jar","app.jar"]
