  -- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Table `tbl_UserMaster`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_UserMaster` (
  `pk_userID` INT NOT NULL AUTO_INCREMENT,
  `fk_userTypeID` INT NOT NULL DEFAULT '2',
  `firstName` VARCHAR(200) NULL,
  `lastName` VARCHAR(200) NULL,
  `email` VARCHAR(100) NULL,
  `countryCode` VARCHAR(10) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `dob` VARCHAR(10) NULL DEFAULT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `fk_cityID` INT NULL,
  `fbToken` TEXT NULL,
  `isActive` TINYINT(1) NULL,
  `isVerified` TINYINT(1) NULL,
  `createdBy` INT NOT NULL,
  `modifiedBy` INT NOT NULL,
  `createdDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`pk_userID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tbl_OtpMaster`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_OtpMaster` (
  `pk_otpID` INT NOT NULL AUTO_INCREMENT,
  `countryCode` VARCHAR(10) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `createdDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiryDate` TIMESTAMP NULL,
  PRIMARY KEY (`pk_otpID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tbl_AccessToken`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_AccessToken` (
  `pk_accessTokenID` INT NOT NULL AUTO_INCREMENT,
  `fk_userID` INT NOT NULL,
  `deviceType` VARCHAR(100) NOT NULL,
  `deviceId` VARCHAR(100) NOT NULL,
  `accessToken` VARCHAR(500) NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expiryDate` TIMESTAMP NULL,
  `isActive` TINYINT(1) NULL,
  PRIMARY KEY (`pk_accessTokenID`))
ENGINE = InnoDB;

ALTER TABLE `tbl_OtpMaster` 
CHANGE COLUMN `isExpired` `isExpired` TINYINT(1) NULL DEFAULT 0 ;

ALTER TABLE `tbl_UserMaster` 
CHANGE COLUMN `isActive` `isActive` TINYINT(1) NULL DEFAULT 1 ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
