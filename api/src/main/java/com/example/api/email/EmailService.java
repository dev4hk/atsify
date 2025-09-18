package com.example.api.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendTemplate(String to, String from, String replyTo, String subject, String template, Map<String, Object> model)
            throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MULTIPART_MODE_MIXED, UTF_8.name());
        helper.setTo(to);
        if (replyTo != null && !replyTo.isBlank()) helper.setReplyTo(replyTo);
        helper.setFrom(from);
        helper.setSubject(subject);

        Context ctx = new Context();
        ctx.setVariables(model);
        String html = templateEngine.process(template, ctx);
        helper.setText(html, true);

        mailSender.send(mimeMessage);
    }
}