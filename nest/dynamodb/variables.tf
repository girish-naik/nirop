variable "region" {
    default = "us-east-2" 
}

variable "profile" {
    default = "default" 
}

variable "environment" {
    default = "dev"
}

variable "user_table_name" {
    default = "UserTable-dev" 
}

variable "user_table_index" {
    default = "UserTable-Idx1"
}

variable "convo_table_name" {
    default = "ConversationTable-dev" 
}

variable "convotable_udate_index" {
    default = "ConversationTable-Idx1"
}

variable "convotable_cid_index" {
    default = "ConversationTable-Idx2"
}

variable "message_table_name" {
    default = "MessageTable-dev" 
}

variable "message_table_index" {
    default = "MessageTable-Idx1"
}