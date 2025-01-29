package com.espe.micro_conciertos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MicroConciertoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroConciertoApplication.class, args);
	}

}
