package com.example.backend.controller;

import com.example.backend.util.QRCodeGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QRTestController {

    @GetMapping("/api/test-qr")
    public String generateQR() {
        try {
            String text = "TEST-MACHINE-001";
            String filePath = "qr-test.png";

            QRCodeGenerator.generateQRCode(text, filePath);

            return "QR Code Generated Successfully!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
