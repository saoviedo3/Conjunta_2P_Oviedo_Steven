# Usa una imagen base de OpenJDK para ejecutar tu aplicación
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR a la imagen
COPY target/micro_usuarios-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto que tu aplicación usa
EXPOSE 8002

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
