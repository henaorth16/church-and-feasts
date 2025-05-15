-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: church_history
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Church`
--

DROP TABLE IF EXISTS `Church`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Church` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `profileImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `servantCount` int DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Church_userId_key` (`userId`),
  CONSTRAINT `Church_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Church`
--

LOCK TABLES `Church` WRITE;
/*!40000 ALTER TABLE `Church` DISABLE KEYS */;
INSERT INTO `Church` VALUES ('c1','St. Paul Cathedral','Addis Ababa, Piassa','paulos@church.et','0911111111',9.0301,38.752,NULL,20,'Head cathedral of Ethiopia.','u1','2025-05-02 02:00:36.000','2025-05-02 02:00:36.000'),('c2','St. Matthew Church','Adama','matewos@church.et','0922222222',8.54,39.27,NULL,12,'Known for community outreach.','u2','2025-05-02 02:00:36.000','2025-05-02 02:00:36.000'),('c3','St. Kewstos Church','Gondar','kewstos@church.et','0933333333',12.6,37.46,NULL,15,'Historic and spiritual center.','u3','2025-05-02 02:00:36.000','2025-05-02 02:00:36.000'),('c4','St. Tewodros Church','Bahir Dar','tewodros@church.et','0944444444',11.6,37.38,NULL,18,'Popular for youth ministry.','u4','2025-05-02 02:00:36.000','2025-05-02 02:00:36.000'),('c5','St. Filpos Church','Mekelle','filpos@church.et','0955555555',13.5,39.47,NULL,10,'Serves the northern region.','u5','2025-05-02 02:00:36.000','2025-05-02 02:00:36.000'),('cma5y4gtv0005caxfg0i71v18','arada giorgis','piaza','arada@gmail.com','0923221134',9.036807,38.751411,NULL,12,'this is the main place of our church','cma5x9vjr0000caxffygajkxr','2025-05-01 22:37:59.731','2025-05-13 14:38:49.039');
/*!40000 ALTER TABLE `Church` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChurchFeast`
--

DROP TABLE IF EXISTS `ChurchFeast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChurchFeast` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `churchId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feastId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialNotes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ChurchFeast_churchId_feastId_key` (`churchId`,`feastId`),
  KEY `ChurchFeast_feastId_fkey` (`feastId`),
  CONSTRAINT `ChurchFeast_churchId_fkey` FOREIGN KEY (`churchId`) REFERENCES `Church` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ChurchFeast_feastId_fkey` FOREIGN KEY (`feastId`) REFERENCES `Feast` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChurchFeast`
--

LOCK TABLES `ChurchFeast` WRITE;
/*!40000 ALTER TABLE `ChurchFeast` DISABLE KEYS */;
INSERT INTO `ChurchFeast` VALUES ('cf1','c1','f1','Major yearly celebration.','2025-05-02 02:01:20.000','2025-05-02 02:01:20.000'),('cf10','c1','f9','Apostolic tribute.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf11','c2','f10','Special Liturgy.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf12','c3','f11',NULL,'2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf13','c5','f12','Youth-led celebrations.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf14','c5','f13',NULL,'2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf15','c4','f14','Water blessing ceremony.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf2','c1','f2',NULL,'2025-05-02 02:01:20.000','2025-05-02 02:01:20.000'),('cf3','c2','f3',NULL,'2025-05-02 02:01:20.000','2025-05-02 02:01:20.000'),('cf4','c3','f4','Pilgrimage site on this date.','2025-05-02 02:01:20.000','2025-05-02 02:01:20.000'),('cf5','c5','f2','Family gathering.','2025-05-02 02:01:20.000','2025-05-02 02:01:20.000'),('cf6','c2','f5','Annual horse parade.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf7','c3','f6',NULL,'2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf8','c4','f7','Early morning baptism services.','2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cf9','c4','f8',NULL,'2025-05-02 02:12:11.000','2025-05-02 02:12:11.000'),('cma5ydy2m0008caxfgndbjwg4','cma5y4gtv0005caxfg0i71v18','cma5ydy2h0006caxfsr4xp649','any','2025-05-01 22:45:21.982','2025-05-01 22:45:21.982'),('cma60zlch000ccaxfg4uj3atr','c1','f10','egnam gar ywetal','2025-05-01 23:58:11.152','2025-05-01 23:58:11.152'),('cma61wo9v000ecaxfmw0tjozl','c1','f14','we celebrated it also','2025-05-02 00:23:54.596','2025-05-02 00:23:54.596'),('cmaf9to0m0001cao7iyqvezhk','cma5y4gtv0005caxfg0i71v18','f5','klacj','2025-05-08 11:15:26.806','2025-05-08 11:15:26.806'),('cmahyuhnm0001ca2s11xf805z','cma5y4gtv0005caxfg0i71v18','f10',NULL,'2025-05-10 08:31:27.970','2025-05-10 08:31:27.970'),('cmahyumt50003ca2shp5hjncy','cma5y4gtv0005caxfg0i71v18','f8',NULL,'2025-05-10 08:31:34.649','2025-05-10 08:31:34.649'),('cmahyutuq0005ca2scnki7pzh','cma5y4gtv0005caxfg0i71v18','f13',NULL,'2025-05-10 08:31:43.778','2025-05-10 08:31:43.778'),('cmahyv1630007ca2sr30gcli8','cma5y4gtv0005caxfg0i71v18','f14',NULL,'2025-05-10 08:31:53.260','2025-05-10 08:31:53.260'),('cmahyv60m0009ca2s1de4ddez','cma5y4gtv0005caxfg0i71v18','f7',NULL,'2025-05-10 08:31:59.542','2025-05-10 08:31:59.542'),('cmajsm5gu0002cafyw991u2t7','cma5y4gtv0005caxfg0i71v18','cmajsm5g40000cafybomtbauw',NULL,'2025-05-11 15:12:33.583','2025-05-11 15:12:33.583');
/*!40000 ALTER TABLE `ChurchFeast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feast`
--

DROP TABLE IF EXISTS `Feast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feast` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `saintName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commemorationDate` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feast`
--

LOCK TABLES `Feast` WRITE;
/*!40000 ALTER TABLE `Feast` DISABLE KEYS */;
INSERT INTO `Feast` VALUES ('cma5ydy2h0006caxfsr4xp649','giyorgis','angetu yetekoretebet','2025-04-23 00:00:00.000','2025-05-01 22:45:21.978','2025-05-01 22:45:21.978'),('cmajsm5g40000cafybomtbauw','st. jared',NULL,'2025-05-11 00:00:00.000','2025-05-11 15:12:33.557','2025-05-11 15:12:33.557'),('f1','St. Michael','Archangel Michael commemoration.','2025-06-12 00:00:00.000','2025-05-02 02:01:03.000','2025-05-02 02:01:03.000'),('f10','Holy Trinity','Feast of the Holy Trinity.','2025-06-15 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f11','St. Mark','Evangelist and martyr.','2025-04-25 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f12','St. Luke','Author of the Gospel of Luke.','2025-10-18 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f13','St. Matthew','Apostle and Gospel writer.','2025-09-21 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f14','Epiphany','Revelation of Christ to the Gentiles.','2025-01-06 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f2','St. Mary','The Holy Virgin Mary feast.','2025-08-15 00:00:00.000','2025-05-02 02:01:03.000','2025-05-02 02:01:03.000'),('f3','St. Gabriel','Angel Gabriel celebration.','2025-07-26 00:00:00.000','2025-05-02 02:01:03.000','2025-05-02 02:01:03.000'),('f4','St. Teklehaimanot','Ethiopian Saint Teklehaimanot day.','2025-09-01 00:00:00.000','2025-05-02 02:01:03.000','2025-05-02 02:01:03.000'),('f5','St. George','Feast of St. George the Martyr.','2025-04-23 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f6','St. Stephen','First martyr of Christianity.','2025-12-26 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f7','St. John the Baptist','Celebration of John the Baptist.','2025-06-24 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f8','St. Peter','Feast of Apostle Peter.','2025-06-29 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000'),('f9','St. Paul','Apostle Paul commemoration.','2025-06-29 00:00:00.000','2025-05-02 02:03:54.000','2025-05-02 02:03:54.000');
/*!40000 ALTER TABLE `Feast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','CHURCH') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHURCH',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cma5x9vjr0000caxffygajkxr','arada','$2a$10$PJTnL5nhhE.pRMHxFew69eH0QpWjo8zDQci/mgm5pDB0p9hn7J6WK','CHURCH','2025-05-01 22:14:12.471','2025-05-01 22:14:12.471'),('cma5xadst0001caxfi4bt0uss','amanuel','$2a$10$61m9wiDMunGV8DXbh6bEeOEYk77WFmJlCHJvLoF3sjb.3I3yt/EQq','CHURCH','2025-05-01 22:14:36.126','2025-05-01 22:14:36.126'),('cma5xaqb50002caxfvi1yaw1d','michael','$2a$10$Ra3.aw.irNVEXM51IWLPPOxCTx8HAPrReX3Votv6MeqtOdwT/z3g2','CHURCH','2025-05-01 22:14:52.337','2025-05-01 23:25:20.776'),('cma5xbcdg0003caxf94jn3asm','george','$2a$10$/1NCRkKLxf1dhaNKjmi7C.SptGpWgF/229tuhPGmtGDFBdBuB.C2y','CHURCH','2025-05-01 22:15:20.932','2025-05-01 23:25:01.665'),('u1','paulos','$2a$10$Nn.UYcOxjCH5Duf1HpiFHe7rds64x77bOgwReWRNe37VpKGLsTXx6','CHURCH','2025-05-02 01:58:39.000','2025-05-01 23:23:11.993'),('u2','matewos','$2a$10$VpNkgNFNkcdTgr8InpWib./pdLHX3cVg3SsZVNAmjhUO9Cic8Qviu','CHURCH','2025-05-02 01:58:39.000','2025-05-01 23:23:35.962'),('u3','kewstos','$2a$10$kerJtWoFXNZsT1kQcNN5W.uZbCd//.7SGUi7.SdpiGda0kL9xPVp2','CHURCH','2025-05-02 01:58:39.000','2025-05-01 23:24:00.650'),('u4','tewodros','$2a$10$FFUpTjUuwj0DooWJ1kQTmuyhKVIgEpO7KOvy02M3v3lH8zRV0sc.i','CHURCH','2025-05-02 01:58:39.000','2025-05-01 23:24:20.590'),('u5','filpos','$2a$10$MLTJfOZ0nhY7Y3HbbbzEGuDupB9UN6zvkYtbqsHQZi8rEdPTsnf5.','CHURCH','2025-05-02 01:58:39.000','2025-05-01 23:24:41.228');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('33ecca8f-2ef3-4cc7-830a-7113c38b9fdf','6ee2aadcab1b1ad73421d799d0d9bf736b0f0b51f9b0f4c9cdc5b2e1391992f9','2025-05-01 22:05:52.475','20250501220538_dev',NULL,NULL,'2025-05-01 22:05:45.224',1),('4d35a950-a577-44fe-bb71-95a92bf5522d','6923bc6c6dfc2e6835f7ab9d2f0f397aeddbdaf72aa9cfee20041fc8a71f0245','2025-05-01 22:04:38.081','20250428233235_dev',NULL,NULL,'2025-05-01 22:04:33.686',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-15  0:11:24
