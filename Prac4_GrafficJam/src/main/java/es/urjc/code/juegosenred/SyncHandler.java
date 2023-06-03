package es.urjc.code.juegosenred;

import java.util.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Random;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import discord4j.common.close.CloseStatus;

import java.time.*;
import java.time.temporal.ChronoUnit;

public class SyncHandler extends TextWebSocketHandler{
    public Map<String, WebSocketSession> users = new ConcurrentHashMap<>();
    
	public void afterConnectionEstablished(WebSocketSession session)throws Exception{
		if(users.size() < 2)
		{
			users.put(session.getId(), session);
		}
	}

    @Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = mapper.readTree(message.getPayload());
		
		for(WebSocketSession user : users.values()) {
			if(session != user)
			{
				user.sendMessage(message);
				System.err.println("SyncHanlder: He enviado el mensaje");
			}
		}
	}

    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		users.remove(session.getId());
	}
}