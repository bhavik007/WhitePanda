ALTER TABLE `tbl_OtpMaster` 
ADD COLUMN `isExpired` TINYINT(1) NULL AFTER `expiryDate`;