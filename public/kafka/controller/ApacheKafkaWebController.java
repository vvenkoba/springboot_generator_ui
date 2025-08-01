package com.java.kafka.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kafka.service.kafkaServiceAPI;

@RestController
@RequestMapping
public class ApacheKafkaWebController {

	@Autowired
	kafkaServiceAPI kafkaServiceAPI;
	
	@KafkaListener(topics = "" )
	public String onMesage(ConsumerRecord<String, String> datConsumedFromkafka , Acknowledgment ack)
	{
		
		datConsumedFromkafka.value();//gives you the Json messaged published on the kafka topic
		// call your service layer here
		
		kafkaServiceAPI.publishTokafka(datConsumedFromkafka.value());
		try{
			
		}catch(Exception ex)
		{
			//catch your business exception
		}finally
		{
			if(null!= datConsumedFromkafka)
			{
				Map<TopicPartition , OffsetAndMetadata> commitMessage = new HashMap<>();
				commitMessage.put(new TopicPartition(datConsumedFromkafka.topic(),datConsumedFromkafka.partition())
						, new OffsetAndMetadata(datConsumedFromkafka.offset() + 1));
				try {
					ack.acknowledge();
				}catch (Exception ex)
				{
					//catch exception related to acknowledgement
				}
			}
		}
		return "someThing";
	}
}

