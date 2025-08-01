package com.java.kafka.service;

import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class kafkaServiceAPI {
	
	@Autowired
	public Producer<String, Object> producer;
	
//here object emans the repsonse you are expecting
	public Object publishTokafka(String value) {
		// TODO Auto-generated method stub
		
		String topicname = "";//give your topicname here
		RecordMetadata recordMetadata;
		
		try
		{
			Future<RecordMetadata> result = producer.send(new ProducerRecord<String, Object>("", value));
			recordMetadata = result.get(30 , TimeUnit.SECONDS);
			result.isDone();
		}
		catch(Exception ex)
		{
			Thread.currentThread().interrupt();
			
			//write your exceptions here
		}
		producer.flush();
		return "";
	}
}
