package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.exceptions.EmailSendingException;
import com.Incamar.IncaCore.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Override
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariables(variables);

            String htmlBody = templateEngine.process(templateName, context);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new EmailSendingException("Failed to send email", e);
        }
    }

    @Override
    public void sendStockAlertEmail(String to, String recipientName, String productName, Long currentStock, String warehouseName, Long minimumStock) {
        Map<String, Object> variables = Map.of(
                "recipientName", recipientName,
                "productName", productName,
                "warehouseName", warehouseName, // <-- agregamos el almacén
                "currentStock", currentStock,
                "minimumStock", minimumStock
        );

        sendHtmlEmail(to, "Alerta de Stock Mínimo", "stock-alert-email", variables);
    }


}
