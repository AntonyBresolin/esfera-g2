FROM maven:3.8.4-openjdk-17-slim AS build
COPY src /home/app/src 
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

 FROM openjdk:17-jdk-slim
 COPY --from=build /home/app/target/esfera-g2-0.0.1-SNAPSHOT.jar /usr/local/lib/esfera-g2-0.0.1-SNAPSHOT.jar
 EXPOSE 8080
 ENTRYPOINT ["java","-jar","/usr/local/lib/esfera-g2-0.0.1-SNAPSHOT.jar"]