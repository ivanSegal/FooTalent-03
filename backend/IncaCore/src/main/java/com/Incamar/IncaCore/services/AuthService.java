package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.auth.*;
import com.Incamar.IncaCore.dtos.auth.LoginRes;
import com.Incamar.IncaCore.models.User;

import java.util.Optional;

public interface AuthService {

  void register(RegisterReq request);

  LoginRes login(LoginReq request);

  void logout(String token);

  void changePassword(ChangePasswordReq request);

  void forgotPassword(ForgotPasswordReq request);

  void resetPassword(ResetPasswordReq request);

  Optional<User> getAuthenticatedUser();
}
