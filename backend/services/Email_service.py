import smtplib
from email.mime.text import MIMEText
from config import Config

def send_verification_email(email, token):
    verification_link = f"{Config.API_BASE_URL}/auth/verify-email/{token}"
    message = MIMEText(f"Click to verify your email: {verification_link}")
    message["Subject"] = "Email Verification"
    message["From"] = Config.EMAIL_USER
    message["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(Config.EMAIL_USER, Config.EMAIL_PASS)
        server.sendmail(Config.EMAIL_USER, email, message.as_string())

def send_password_reset_email(email, reset_token):
    reset_link = f"{Config.API_BASE_URL}/auth/reset-password/{reset_token}"
    message = MIMEText(f"Click the link to reset your password: {reset_link}")
    message["Subject"] = "Password Reset Request"
    message["From"] = Config.EMAIL_USER
    message["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(Config.EMAIL_USER, Config.EMAIL_PASS)
        server.sendmail(Config.EMAIL_USER, email, message.as_string())
