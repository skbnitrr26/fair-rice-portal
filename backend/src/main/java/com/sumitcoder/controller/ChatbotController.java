package com.sumitcoder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sumitcoder.service.ChatbotService;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/public/ask")
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String response = chatbotService.getResponse(question);
        
        // Return the response in a simple JSON object: { "answer": "..." }
        return ResponseEntity.ok(Map.of("answer", response));
    }
}
