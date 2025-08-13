package com.Incamar.IncaCore.service;

import com.Incamar.IncaCore.dto.request.*;
import com.Incamar.IncaCore.dto.request.auth.*;
import com.Incamar.IncaCore.dto.response.ChangePasswordTempRes;
import com.Incamar.IncaCore.dto.response.LoginRes;
import com.Incamar.IncaCore.dto.response.CredentialsRes;

public interface AuthService {

    CredentialsRes register(RegisterReq request);

    LoginRes login(LoginReq request);

    void logout(String token);

    ChangePasswordTempRes changePassword(ChangePasswordReq request);

    void forgotPassword(ForgotPasswordReq request);

    void resetPassword(ResetPasswordReq request);

    CredentialsRes adminResetPassword(AdminResetPasswordReq request);
}
