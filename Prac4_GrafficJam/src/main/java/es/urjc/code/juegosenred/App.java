package es.urjc.code.juegosenred;

import org.springframework.boot.SpringApplication;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
@Configuration
public class App implements WebSocketConfigurer {
	
	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(gameHandler(), "/grafficjam").setAllowedOrigins("*");
		registry.addHandler(syncHandler(), "/sync").setAllowedOrigins("*");
	}

	@Bean
	public Handler gameHandler() {
		return new Handler();
	}

	@Bean
	public SyncHandler syncHandler() {
		return new SyncHandler();
	}
}