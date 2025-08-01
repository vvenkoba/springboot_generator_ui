package com.java.kafka.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class kafkaProducerConfig {
	
	public Map<String,Object> getkafkaproperties()
	{
		Map<String,Object> properties = new HashMap<>();
		//here put all the properties related to your kafka producer , giving one example
		properties.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT");
		
		return properties;
	}

	
	@Bean
	public Producer<String,Object> producer()//here object represent any Json data you want to publish to kafka
	{
		return new KafkaProducer<String, Object>(getkafkaproperties());
	}
	
}
