FROM openjdk:17-jdk-slim

#Establecer el directorio de trabajo en el contenedor
WORKDIR /app

#Copiar el archivo jar desde el host al contenedor
COPY target/micro_cursos-1.0.0.jar app.jar

#Exponer en el puerto 8002 la aplicación
EXPOSE 8002
#Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]