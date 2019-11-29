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


-- -----------------------------------------------------
-- Table `tbl_EventMaster`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_EventMaster` (
  `pk_eventMasterID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `theme` VARCHAR(200) NULL,
  `description` TEXT NULL,
  `logo` VARCHAR(300) NULL DEFAULT NULL,
  `banner` VARCHAR(300) NULL DEFAULT NULL,
  `fk_cityID` INT NULL DEFAULT NULL,
  `minAge` INT(3) NULL DEFAULT NULL,
  `maxAge` INT(3) NULL DEFAULT NULL,
  `gender` VARCHAR(20) NULL DEFAULT NULL,
  `slots` INT NULL,
  `minVote` INT NULL DEFAULT 1,
  `maxVote` INT NULL DEFAULT 1,
  `price` INT NULL,
  `eventStartTime` DATETIME NULL,
  `eventEndTime` DATETIME NULL,
  `uploadStartTime` DATETIME NULL,
  `uploadEndTime` DATETIME NULL,
  `voteStartTime` DATETIME NULL,
  `voteEndTime` DATETIME NULL,
  `reviewStartTime` DATETIME NULL,
  `reviewEndTime` DATETIME NULL,
  `isActive` TINYINT(1) NULL,
  `createdBy` INT NOT NULL,
  `modifiedBy` INT NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`pk_eventMasterID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tbl_EventRuleMapping`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_EventRuleMapping` (
  `pk_eventRuleMappingID` INT NOT NULL AUTO_INCREMENT,
  `fk_eventMasterID` INT NOT NULL,
  `rule` TEXT NULL,
  `isActive` TINYINT(1) NULL DEFAULT 1,
  `createdBy` INT NOT NULL,
  `modifiedBy` INT NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP  DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`pk_eventRuleMappingID`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `tbl_CountryMaster`
-- -----------------------------------------------------
drop table if exists tbl_CountryMaster;
CREATE TABLE `tbl_CountryMaster` (
  `pk_countryID` int(11) NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(10) NOT NULL,
  `countryName` varchar(100) NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_countryID`),
  UNIQUE KEY `countryName_UNIQUE` (`countryName`)
) ;

-- -----------------------------------------------------
-- Table `tbl_StateMaster`
-- -----------------------------------------------------
drop table if exists tbl_StateMaster;
CREATE TABLE `tbl_StateMaster` (
  `pk_stateID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_countryID` int(11) NOT NULL,
  `stateName` varchar(100) NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_stateID`,`fk_countryID`),
  UNIQUE KEY `stateName_unique` (`stateName`),
  KEY `fk_tbl_StateMaster_tbl_CountryMaster_idx` (`fk_countryID`),
  CONSTRAINT `fk_tbl_StateMaster_tbl_CountryMaster` FOREIGN KEY (`fk_countryID`) REFERENCES `tbl_CountryMaster` (`pk_countryID`) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `tbl_CityMaster`
-- -----------------------------------------------------
drop table if exists tbl_CityMaster;
CREATE TABLE `tbl_CityMaster` (
  `pk_cityID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_countryID` int(11) NOT NULL,
  `fk_stateID` int(11) NOT NULL,
  `cityName` varchar(100) NOT NULL,
  `createdDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_cityID`,`fk_countryID`,`fk_stateID`),
  UNIQUE KEY `city_unique` (`fk_countryID`,`fk_stateID`,`cityName`),
  KEY `fk_tbl_CityMaster_tbl_StateMaster2_idx` (`fk_stateID`),
  KEY `fk_tbl_CityMaster_tbl_CountryMaster1_idx` (`fk_countryID`),
  CONSTRAINT `fk_tbl_CityMaster_tbl_CountryMaster1` FOREIGN KEY (`fk_countryID`) REFERENCES `tbl_CountryMaster` (`pk_countryID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_CityMaster_tbl_StateMaster2` FOREIGN KEY (`fk_stateID`) REFERENCES `tbl_StateMaster` (`pk_stateID`) ON DELETE CASCADE ON UPDATE NO ACTION
);

ALTER TABLE `tbl_OtpMaster` 
CHANGE COLUMN `isExpired` `isExpired` TINYINT(1) NULL DEFAULT 0 ;

ALTER TABLE `tbl_UserMaster` 
CHANGE COLUMN `isActive` `isActive` TINYINT(1) NULL DEFAULT 1 ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
