package com.Incamar.IncaCore.service;

import java.util.Map;

public interface EmailService {

    void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables);

}
