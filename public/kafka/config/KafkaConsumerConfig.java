package com.java.kafka.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.boot.autoconfigure.kafka.ConcurrentKafkaListenerContainerFactoryConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;


@EnableKafka
@Configuration
public class KafkaConsumerConfig {

	
	@Bean
	public ConsumerFactory<String, String> consumerFactory()
	{
		Map<String, Object> map = new HashMap<>();
		 map.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "");
	        map.put(ConsumerConfig.GROUP_ID_CONFIG, "");
	        map.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
	        map.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
	        //put whatever properties you want to set here
	        return new DefaultKafkaConsumerFactory<>(map);
	}
	
	
	
	@Bean
	ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory()
	{
		Integer concurrency = 1;
		ConcurrentKafkaListenerContainerFactory<String, String> containerFactory = new ConcurrentKafkaListenerContainerFactory<>();
		containerFactory.setConsumerFactory(consumerFactory());
		containerFactory.setConcurrency(concurrency);
		//can add multiple dependencies here
		return containerFactory;
	}
}
