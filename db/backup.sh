#!/bin/bash

echo 
echo 
echo 
echo -----------------------   Food Maniac DB Backup  -----------------------
echo 
echo       To be run from Mongo DB server
echo 
echo       Actions:
echo       - Creates a dump folder
echo       - Compresses this dump and timestamp it
echo       - Moves it to a local backup folder
echo       - Cleans the backup folder from old files older than 15 days
echo       - Sends it to a remote server
echo
echo       Use keychain to get a password-less sFTP access with NO passphrase
echo       Then put this script in crontab for automatic running:
echo "         @reboot sleep 60 && /home/lve/backup.sh &>> /home/lve/backup.log "
echo "         0 6,18 * * * /home/lve/backup.sh &>> /home/lve/backup.log "
echo 
echo ---------------------------- Prepares Backup ----------------------------
echo 
echo 

current_time=$(date "+%Y.%m.%d-%H.%M.%S")
echo "Start Backup at $current_time"

# DB variables 
server_host=51.254.221.25:27017
db=food_maniac
user=admin
password=maniacPwd
authenticationDatabase=admin

# Folder Location
folder_root=/home/lve

# Backup & sFTP variables
# (!) Delete backups older than 15 days (!)
delete_backups_older_than_this=15
backup_folder=db_backup
backup_folder_complete_path=$folder_root/$backup_folder
remote_backup_folder=db_backup
sftp_host=51.255.46.214
sftp_user=lve

# Dump & gz variables
dump_folder_base_name=food_maniac_dump_
dump_folder_complete_path=$folder_root/$dump_folder_base_name$current_time
archive_base_name=food_maniac_db_backup_
archive_complete_path=$backup_folder_complete_path/$archive_base_name$current_time.tar.gz

echo "Dump path : $dump_folder_complete_path"
echo "Archive name : $archive_complete_path"


echo 
echo ---------------------------- Runs Backup ----------------------------
echo 
echo 

mongodump -h $server_host --db $db --out $dump_folder_complete_path -u $user -p $password --authenticationDatabase $authenticationDatabase --ssl --sslPEMKeyFile /etc/ssl/mongodb.pem --sslCAFile /etc/ssl/mongodb-cert.crt --sslAllowInvalidHostnames


echo 
echo 
echo ---------------------------- Compresses Backup ----------------------------
echo 
echo 

tar cvzf $archive_complete_path $dump_folder_complete_path


echo 
echo 
echo ---------------------------- Cleans ----------------------------
echo 
echo 

rm -fr $dump_folder_complete_path

echo "Remove backups older than $delete_backups_older_than_this days"
echo "List of files removed:"
find $backup_folder_complete_path -type f -mtime +$delete_backups_older_than_this -name "$archive_base_name*.gz"
find $backup_folder_complete_path -type f -mtime +$delete_backups_older_than_this -name "$archive_base_name*.gz" -delete


echo 
echo 
echo ---------------------------- sFTP to App server ----------------------------
echo 
echo 

# Use keychain to avoid interactive input of password for sFTP
/usr/bin/keychain $HOME/.ssh/id_rsa_nophrase
source $HOME/.keychain/$HOSTNAME-sh

echo put $archive_complete_path | sftp -b- $sftp_user@$sftp_host:./$remote_backup_folder

current_end_time=$(date "+%Y.%m.%d-%H.%M.%S")
echo "End Backup at $current_end_time"
echo 
echo 
echo ---------------------------- Backup finished ----------------------------
echo 
echo 
