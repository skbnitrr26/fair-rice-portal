package com.sumitcoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.sumitcoder.dto.AnnouncementDto;
import com.sumitcoder.dto.GrievanceDto;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private GrievanceService grievanceService;

    @Value("${app.rice-per-person-kg}")
    private double ricePerPersonKg;

    // NEW: Injecting the new properties from application.properties
    @Value("${app.rice-price-per-kg:0}")
    private int ricePricePerKg;

    @Value("${app.contact.name:the admin}")
    private String contactName;

    @Value("${app.contact.number:the portal}")
    private String contactNumber;

    public String getResponse(String userQuestion) {
        String question = userQuestion.toLowerCase();

        Pattern numberPattern = Pattern.compile("\\d+");
        Matcher numberMatcher = numberPattern.matcher(question);

        // --- Question: Who are you? ---
        if (question.contains("who are you") || question.contains("your name") || question.contains("kya ho") || question.contains("kaun ho") || question.contains("नाम क्या है")) {
            return "मैं निष्पक्ष चावल वितरण पोर्टल के लिए एक चैटबॉट सहायक हूँ। मैं आपको चावल के हक़, वितरण की तारीखों और शिकायत की स्थिति के बारे में सवालों में मदद कर सकता हूँ। (I am a chatbot assistant for the Fair Rice Distribution Portal. I can help you with questions about rice entitlement, distribution dates, and grievance status.)";
        }
        
        // --- Question: How much rice for my family? ---
        if ((question.contains("kitna") || question.contains("how much")) && (question.contains("chawal") || question.contains("rice"))) {
            if (numberMatcher.find()) {
                int members = Integer.parseInt(numberMatcher.group());
                double entitlement = members * ricePerPersonKg;
                return String.format("%d सदस्यों के परिवार का हक़ %.1f किलो चावल है। (A family of %d is entitled to %.1f kg of rice.)", members, entitlement, members, entitlement);
            } else {
                return "चावल की मात्रा जानने के लिए, कृपया अपने परिवार के सदस्यों की संख्या बताएं। (To know the rice entitlement, please tell me the number of members in your family.)";
            }
        }

        // --- Question: When is the next distribution? ---
        if (question.contains("kab hai") || question.contains("when is") || question.contains("agla") || question.contains("next")) {
            // UPDATED: Use the paginated service to get only the single most recent announcement
            Pageable pageable = PageRequest.of(0, 1, Sort.by("createdAt").descending());
            Page<AnnouncementDto> announcementsPage = announcementService.getAllAnnouncements(pageable);
            if (announcementsPage.hasContent()) {
                AnnouncementDto latest = announcementsPage.getContent().get(0);
                return "नवीनतम घोषणा (Latest Announcement):\n" + latest.getTitle() + "\n" + latest.getContent();
            } else {
                return "अभी कोई नई घोषणा नहीं है। (There are no new announcements at the moment.)";
            }
        }
        
        // --- Question: What is the status of my grievance? ---
        if (question.contains("status") || question.contains("shikayat") || question.contains("स्थिति")) {
             Pattern trackingIdPattern = Pattern.compile("GRV-[A-Z0-9]{8}");
             Matcher trackingIdMatcher = trackingIdPattern.matcher(userQuestion.toUpperCase());
             if(trackingIdMatcher.find()){
                 String trackingId = trackingIdMatcher.group();
                 try {
                     GrievanceDto grievance = grievanceService.getGrievanceByTrackingId(trackingId);
                     return String.format("आपकी शिकायत %s की स्थिति '%s' है। (The status of your grievance %s is '%s'.)", trackingId, grievance.getStatus(), trackingId, grievance.getStatus());
                 } catch (Exception e) {
                     return String.format("ट्रैकिंग आईडी %s नहीं मिली। कृपया दोबारा जांचें। (Tracking ID %s was not found. Please check again.)", trackingId, trackingId);
                 }
             } else {
                 return "शिकायत की स्थिति जानने के लिए, कृपया अपनी ट्रैकिंग आईडी प्रदान करें, जैसे 'status GRV-1234ABCD'। (To check grievance status, please provide your tracking ID, e.g., 'status GRV-1234ABCD'.)";
             }
        }
        
        // --- NEW Question: What documents are required? ---
        if (question.contains("document") || question.contains("dastaavez") || question.contains("kagaz") || question.contains("कागजात")) {
            return "आपको अपना आधार कार्ड और राशन कार्ड लाना होगा। (You will need to bring your Aadhaar card and Ration card.)";
        }
        
        // --- NEW Question: What is the price? ---
        if (question.contains("price") || question.contains("daam") || question.contains("कीमत") || question.contains("kitne ka")) {
            if (ricePricePerKg <= 0) {
                return "चावल सरकारी योजना के तहत मुफ्त है। (The rice is free under the government scheme.)";
            } else {
                return String.format("चावल सरकारी योजना के तहत %d रुपये प्रति किलो है। (The rice is ₹%d per kg under the government scheme.)", ricePricePerKg, ricePricePerKg);
            }
        }

        // --- NEW Question: Who to contact for help? ---
        if (question.contains("help") || question.contains("madad") || question.contains("contact") || question.contains("सहायता") || question.contains("bat karni")) {
            return String.format("किसी भी समस्या के लिए, आप %s से इस नंबर पर संपर्क कर सकते हैं: %s। (For any issues, you can contact %s at this number: %s.)", contactName, contactNumber, contactName, contactNumber);
        }

        // --- Default Fallback Response ---
        return "माफ़ कीजिए, मैं आपका सवाल समझ नहीं पाया। आप चावल की मात्रा, अगली वितरण तिथि, या शिकायत की स्थिति के बारे में पूछ सकते हैं।\n(Sorry, I couldn't understand your question. You can ask about rice entitlement, the next distribution date, or grievance status.)";
    }
}

