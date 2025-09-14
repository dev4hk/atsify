package com.example.api.service.impl;

import com.example.api.service.IResumeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ResumeServiceImpl implements IResumeService {
    @Override
    public String extractText(MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            if (filename == null) {
                throw new IllegalArgumentException("File must have a name");
            }

            if (filename.endsWith(".pdf")) {
                return extractFromPdf(file.getInputStream());
            } else if (filename.endsWith(".docx")) {
                return extractFromDocx(file.getInputStream());
            } else {
                throw new IllegalArgumentException("Unsupported file type. Only PDF and DOCX are allowed.");
            }
        } catch (Exception e) {
            log.error("Error extracting resume text", e);
            throw new RuntimeException("Failed to extract resume text");
        }
    }

    private String extractFromPdf(InputStream inputStream) throws Exception {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromDocx(InputStream inputStream) throws Exception {
        try (XWPFDocument doc = new XWPFDocument(inputStream)) {
            List<String> paragraphs = doc.getParagraphs()
                    .stream()
                    .map(XWPFParagraph::getText)
                    .collect(Collectors.toList());
            return String.join("\n", paragraphs);
        }
    }
}
