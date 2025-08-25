resource "local_file" "jks_file" {
  content_base64 = data.aws_secretsmanager_secret_version.jks_file.secret_binary
  filename       = "./keystore.jks"
}

resource "local_file" "p12_file" {
  content_base64 = data.aws_secretsmanager_secret_version.p12_file.secret_binary
  filename       = "./keystore.p12"
}

resource "local_file" "password_file" {
  content  = data.aws_secretsmanager_secret_version.password.secret_string
  filename       = "./keystore_password.txt"
}

# Write binary files directly
resource "local_file" "jks_file" {
 content_base64 = data.aws_secretsmanager_secret_version.jks_file.secret_binary
 filename       = "/tmp/keystore.jks"
}

resource "local_file" "p12_file" {
 content_base64 = data.aws_secretsmanager_secret_version.p12_file.secret_binary
 filename       = "/tmp/keystore.p12"
}

resource "local_file" "password_file" {
 content  = data.aws_secretsmanager_secret_version.password.secret_string
 filename = "/tmp/keystore_password.txt"
}

data "aws_secretsmanager_secret_version" "jks_file" {
  secret_id = "/application/platform-data/kafka-lambda/pks-msk-jks"
}

data "aws_secretsmanager_secret_version" "p12_file" {
  secret_id = "/application/platform-data/kafka-lambda/pks-msk-p12"
}

data "aws_secretsmanager_secret_version" "password" {
  secret_id = "/application/platform-data/kafka-lambda/pks-msk-password"
}

output "debug_jks_b64" {
  value     = data.aws_secretsmanager_secret_version.jks_file.secret_binary
  sensitive = false
}

output "debug_p12_b64" {
  value     = data.aws_secretsmanager_secret_version.p12_file.secret_binary
  sensitive = false
}

output "debug_password" {
  value     = data.aws_secretsmanager_secret_version.password.secret_string
  sensitive = false
}
