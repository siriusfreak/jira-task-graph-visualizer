terraform {
  backend "s3" {
    bucket = "tf-state"
    key = "swiss-knife-frontend.tfstate"

    endpoint = "https://api.minio.i.siriusfrk.ru/"

    access_key = var.access_key
    secret_key = var.secret_key

    region = "main"
    skip_credentials_validation = true
    skip_metadata_api_check = true
    skip_region_validation = true
    force_path_style = true
  }
}
