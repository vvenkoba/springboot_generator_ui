package com.java.kafka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringBootSampleKafkaConsumerApplication {

	public static void main(String[] args) {

		SpringApplication.run(
				new Object[] { SpringBootSampleKafkaConsumerApplication.class }, args);
	}
}