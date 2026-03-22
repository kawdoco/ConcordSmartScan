package com.example.backend.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.FileSystems;
import java.nio.file.Path;

@RestController
public class QRController {

    @GetMapping("/api/qrcode")
    public String generateQR(@RequestParam String text) {
        try {
            String filePath = "D:/qr_codes/" + text + ".png";

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 300, 300);

            Path path = FileSystems.getDefault().getPath(filePath);
            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

            return "QR Code generated at: " + filePath;

        } catch (Exception e) {
            return "Error generating QR: " + e.getMessage();
        }
    }
}