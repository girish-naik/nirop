provider "aws" {
  profile    = var.profile
  region     = var.region
}

resource "aws_dynamodb_table" "user_table" {
  name           = var.user_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "uId"

  attribute {
    name = "uId"
    type = "S"
  }

  attribute {
    name = "displayName"
    type = "S"
  }

  global_secondary_index {
    name               = var.user_table_index
    hash_key           = "uId"
    range_key          = "displayName"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  tags = {
    Name        = var.user_table_name
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "conversation_table" {
  name           = var.convo_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pId"
  range_key      = "cId"

  attribute {
    name = "pId"
    type = "S"
  }

  attribute {
    name = "cId"
    type = "S"
  }

  attribute {
     name = "uDate"
     type = "S"
  }

  global_secondary_index {
    name               = var.convotable_udate_index
    hash_key           = "pId"
    range_key          = "uDate"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = var.convotable_cid_index
    hash_key           = "cId"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  tags = {
    Name        = var.convo_table_name
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "message_table" {
  name           = var.message_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "mId"
  range_key      = "sId"

  attribute {
    name = "mId"
    type = "S"
  }

  attribute {
    name = "sId"
    type = "S"
  }

  attribute {
    name = "cId"
    type = "S"
  }

  attribute {
    name = "cDate"
    type = "S"
  }

  global_secondary_index {
    name               = var.message_table_index
    hash_key           = "cId"
    range_key          = "cDate"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  tags = {
    Name        = var.user_table_name
    Environment = var.environment
  }
}