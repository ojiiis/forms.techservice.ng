-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 02, 2026 at 01:23 PM
-- Server version: 11.4.10-MariaDB-cll-lve-log
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doksummz_form`
--

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `id` int(11) NOT NULL,
  `owner_id` varchar(500) NOT NULL,
  `form_id` varchar(50) NOT NULL,
  `form_label` varchar(100) NOT NULL,
  `last_active` varchar(100) NOT NULL,
  `redirect_url` text DEFAULT NULL,
  `success_message` varchar(100) DEFAULT 'Your form has been submited to with https://techservice.ng',
  `date` varchar(100) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`id`, `owner_id`, `form_id`, `form_label`, `last_active`, `redirect_url`, `success_message`, `date`, `status`) VALUES
(1, 'MdKQtXd29CgVs830oXNId', 'dj84Xsud0', 'Tech service enquire form', '1766123816', NULL, 'Your form has been submited to with https://techservice.ng	', '0', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `form_submission`
--

CREATE TABLE `form_submission` (
  `id` int(11) NOT NULL,
  `form_id` varchar(50) NOT NULL,
  `owner_id` varchar(500) NOT NULL,
  `data` longtext NOT NULL,
  `view` int(11) NOT NULL DEFAULT 0,
  `date` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `form_submission`
--

INSERT INTO `form_submission` (`id`, `form_id`, `owner_id`, `data`, `view`, `date`) VALUES
(1, 'dj84Xsud0', 'MdKQtXd29CgVs830oXNId', '{\"name\":\"Tech Service\",\"email\":\"official.ojingirisamuel@gmail.com\",\"phone\":\"+2348030914844\",\"company\":\"tech service Nigeria\",\"service\":\"mobile-app\",\"message\":\"testing first submit, testing first submit, testing first submit, \"}', 0, '17644928155'),
(4, 'dj84Xsud0', 'MdKQtXd29CgVs830oXNId', '{\"name\":\"Ojingiri Samuel\",\"email\":\"official.ojingirisamuel@gmail.com\",\"phone\":\"+2348030914844\",\"company\":\"tech service Nigeria\",\"service\":\"web-dev\",\"message\":\"Shasa Shasa Shasa Shasa Shasa Shasa \"}', 0, '17646730916'),
(5, 'dj84Xsud0', 'MdKQtXd29CgVs830oXNId', '{\"name\":\"Ojingiri Samuel\",\"email\":\"official.ojingirisamuel@gmail.com\",\"phone\":\"+2348030914844\",\"company\":\"tech service Nigeria\",\"service\":\"it-consulting\",\"message\":\"Hello world Hello world Hello world .\"}', 0, '17647865987'),
(6, 'dj84Xsud0', 'MdKQtXd29CgVs830oXNId', '{\"name\":\"Oep Fintech\",\"email\":\"ojingirisolomon@gmail.com\",\"phone\":\"07057766333\",\"company\":\"Filmhouse\",\"service\":\"web-dev\",\"message\":\"Yesterday testing \"}', 0, '17655098867'),
(7, 'dj84Xsud0', 'MdKQtXd29CgVs830oXNId', '{\"name\":\"Manas Jain\",\"email\":\"manasjain@bugsmirror.com\",\"phone\":\"\",\"company\":\"Bugsmirror\",\"service\":\"mobile-app\",\"message\":\"Hey, looking for partnership opportunities in Mobile application security domain. \"}', 0, '17661238166');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(200) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `uid` varchar(200) NOT NULL,
  `public_key` varchar(500) NOT NULL,
  `date` varchar(200) NOT NULL,
  `status` enum('active','disabled') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `fullname`, `uid`, `public_key`, `date`, `status`) VALUES
(1, 'official.ojingirisamuel@gmail.com', '', 'Tech Service Nigeria', 'hJk89LsjxyP67', 'MdKQtXd29CgVs830oXNId', '209282892', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_submission`
--
ALTER TABLE `form_submission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `form_submission`
--
ALTER TABLE `form_submission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
