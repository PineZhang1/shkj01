/*
Navicat MySQL Data Transfer

Source Server         : APA-BEMP
Source Server Version : 50528
Source Host           : 192.168.55.22:3306
Source Database       : eas

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2017-11-21 17:36:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dict_dept_contractor`
-- ----------------------------
DROP TABLE IF EXISTS `dict_dept_contractor`;
CREATE TABLE `dict_dept_contractor` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `dkey` varchar(120) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dict_dept_contractor
-- ----------------------------

-- ----------------------------
-- Table structure for `dict_os`
-- ----------------------------
DROP TABLE IF EXISTS `dict_os`;
CREATE TABLE `dict_os` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `dkey` varchar(120) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dict_os
-- ----------------------------

-- ----------------------------
-- Table structure for `dict_part_type`
-- ----------------------------
DROP TABLE IF EXISTS `dict_part_type`;
CREATE TABLE `dict_part_type` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `dkey` varchar(120) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dict_part_type
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_device`
-- ----------------------------
DROP TABLE IF EXISTS `sys_device`;
CREATE TABLE `sys_device` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(40) NOT NULL DEFAULT '',
  `series_num` varchar(60) NOT NULL DEFAULT '',
  `capacity` varchar(200) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT '',
  `protect_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `price` varchar(20) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_device_fix`
-- ----------------------------
DROP TABLE IF EXISTS `sys_device_fix`;
CREATE TABLE `sys_device_fix` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(40) NOT NULL DEFAULT '',
  `series_num` varchar(60) NOT NULL DEFAULT '',
  `fixtime` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `ma` varchar(100) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_device_ol`
-- ----------------------------
DROP TABLE IF EXISTS `sys_device_ol`;
CREATE TABLE `sys_device_ol` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `idc` varchar(80) NOT NULL DEFAULT '',
  `cabinet` varchar(40) NOT NULL DEFAULT '',
  `layer` varchar(4) NOT NULL DEFAULT '',
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(40) NOT NULL DEFAULT '',
  `ip1` varchar(20) NOT NULL DEFAULT '',
  `ip2` varchar(20) NOT NULL DEFAULT '',
  `ip3` varchar(20) NOT NULL DEFAULT '',
  `ip4` varchar(20) NOT NULL DEFAULT '',
  `ip5` varchar(20) NOT NULL DEFAULT '',
  `ip6` varchar(20) NOT NULL DEFAULT '',
  `capacity` varchar(200) NOT NULL DEFAULT '',
  `os` varchar(100) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT '',
  `user` varchar(20) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_idc`
-- ----------------------------
DROP TABLE IF EXISTS `sys_idc`;
CREATE TABLE `sys_idc` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `idc` varchar(100) NOT NULL DEFAULT '',
  `contact` varchar(40) NOT NULL DEFAULT '',
  `mobile` varchar(60) NOT NULL DEFAULT '',
  `email` varchar(120) NOT NULL DEFAULT '',
  `address` varchar(200) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_ip_private`
-- ----------------------------
DROP TABLE IF EXISTS `sys_ip_private`;
CREATE TABLE `sys_ip_private` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `ip` varchar(20) NOT NULL DEFAULT '',
  `network` varchar(25) NOT NULL DEFAULT '',
  `gateway` varchar(20) NOT NULL DEFAULT '',
  `idc` varchar(80) NOT NULL DEFAULT '',
  `NatIP` varchar(25) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT '',
  `user` varchar(20) NOT NULL DEFAULT '',
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4581 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_ip_public`
-- ----------------------------
DROP TABLE IF EXISTS `sys_ip_public`;
CREATE TABLE `sys_ip_public` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `ip` varchar(20) NOT NULL DEFAULT '',
  `network` varchar(25) NOT NULL DEFAULT '',
  `gateway` varchar(20) NOT NULL DEFAULT '',
  `idc` varchar(80) NOT NULL DEFAULT '',
  `operator` varchar(40) NOT NULL DEFAULT '',
  `leaseterm` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `status` varchar(20) NOT NULL DEFAULT '',
  `user` varchar(20) NOT NULL DEFAULT '',
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_logs`
-- ----------------------------
DROP TABLE IF EXISTS `sys_logs`;
CREATE TABLE `sys_logs` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `type` varchar(40) NOT NULL DEFAULT '',
  `logdate` datetime NOT NULL,
  `operator` varchar(40) NOT NULL DEFAULT '',
  `obj` varchar(50) NOT NULL DEFAULT '',
  `log` varchar(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_nets`
-- ----------------------------
DROP TABLE IF EXISTS `sys_nets`;
CREATE TABLE `sys_nets` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `idc` varchar(80) NOT NULL DEFAULT '',
  `network` varchar(25) NOT NULL DEFAULT '',
  `gateway` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_parts`
-- ----------------------------
DROP TABLE IF EXISTS `sys_parts`;
CREATE TABLE `sys_parts` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(40) NOT NULL DEFAULT '',
  `series_num` varchar(60) NOT NULL DEFAULT '',
  `capacity` varchar(200) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT '',
  `serv` varchar(50) NOT NULL DEFAULT '',
  `protect_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `price` varchar(20) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_services`
-- ----------------------------
DROP TABLE IF EXISTS `sys_services`;
CREATE TABLE `sys_services` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `service_id` varchar(20) NOT NULL DEFAULT '',
  `service` varchar(100) NOT NULL DEFAULT '',
  `manufacturer` varchar(100) NOT NULL DEFAULT '',
  `price` varchar(10) NOT NULL DEFAULT '',
  `buy_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `protect_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `status` varchar(20) NOT NULL DEFAULT '',
  `user` varchar(20) NOT NULL DEFAULT '',
  `purpose` varchar(200) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_supplier`
-- ----------------------------
DROP TABLE IF EXISTS `sys_supplier`;
CREATE TABLE `sys_supplier` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `supplier` varchar(100) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `contact` varchar(40) NOT NULL DEFAULT '',
  `mobile` varchar(60) NOT NULL DEFAULT '',
  `email` varchar(120) NOT NULL DEFAULT '',
  `address` varchar(200) NOT NULL DEFAULT '',
  `note` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_usrdb`
-- ----------------------------
DROP TABLE IF EXISTS `sys_usrdb`;
CREATE TABLE `sys_usrdb` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `usrname` varchar(90) DEFAULT NULL,
  `passwd` varchar(120) DEFAULT NULL,
  `fullname` varchar(120) DEFAULT NULL,
  `dept` varchar(150) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  `email` varchar(90) DEFAULT NULL,
  `mobile` varchar(45) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_usrdb
-- ----------------------------
INSERT INTO `sys_usrdb` VALUES ('1', 'admin', 'fce', 'admin', null, '管理员', null, null, 'local');

-- ----------------------------
-- Table structure for `sys_vm`
-- ----------------------------
DROP TABLE IF EXISTS `sys_vm`;
CREATE TABLE `sys_vm` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(40) NOT NULL DEFAULT '',
  `os` varchar(100) NOT NULL DEFAULT '',
  `cpu` int(10) NOT NULL DEFAULT '0',
  `mem` int(10) NOT NULL DEFAULT '0',
  `disk` int(10) NOT NULL DEFAULT '0',
  `ip` varchar(20) NOT NULL DEFAULT '',
  `user` varchar(20) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `des` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `sys_vmm_phy_server`
-- ----------------------------
DROP TABLE IF EXISTS `sys_vmm_phy_server`;
CREATE TABLE `sys_vmm_phy_server` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `idc` varchar(80) NOT NULL DEFAULT '',
  `asset_id` varchar(50) NOT NULL DEFAULT '',
  `ipaddr` varchar(20) NOT NULL DEFAULT '',
  `locate` varchar(100) NOT NULL DEFAULT '',
  `vm_num` int(10) NOT NULL DEFAULT '0',
  `cpu` int(10) NOT NULL DEFAULT '0',
  `mem` int(10) NOT NULL DEFAULT '0',
  `disk` int(10) NOT NULL DEFAULT '0',
  `cpu_used` int(10) NOT NULL DEFAULT '0',
  `cpu_rate_usage` varchar(10) NOT NULL DEFAULT '0',
  `mem_used` int(10) NOT NULL DEFAULT '0',
  `mem_rate_usage` varchar(10) NOT NULL DEFAULT '0',
  `disk_used` int(10) NOT NULL DEFAULT '0',
  `disk_rate_usage` varchar(10) NOT NULL DEFAULT '0',
  `cpu_usable` int(10) NOT NULL DEFAULT '0',
  `disk_usable` int(10) NOT NULL DEFAULT '0',
  `mem_usable` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
