const NON_RELEVANT_IDS = [
  '22',
  '29',
  '36',
  '39',
  '42',
  '55',
  '73',
  '75',
  '81',
  '87',
  '98',
  '102',
  '109',
  '123',
  '137',
  '149',
  '150',
  '152',
  '172',
  '173',
  '176',
  '177',
  '178',
  '179',
  '198',
  '199',
  '203',
  '204',
  '209',
  '226',
  '227',
  '242',
  '247',
  '248',
  '249',
  '250',
  '255',
  '256',
  '257',
  '258',
  '259',
  '260',
  '261',
  '262',
  '269',
  '278',
  '282',
  '294',
  '295',
  '307',
  '308',
  '309',
  '326',
  '327',
  '328',
  '329',
  '331',
  '335',
  '339',
  '340',
  '342',
  '345',
  '346',
  '348',
  '349',
  '350',
  '351',
  '352',
  '353',
  '354',
  '357',
  '358',
  '360',
  '370',
  '371',
  '372',
  '373',
  '375',
  '401',
  '405',
  '406',
  '409',
  '410',
  '411',
  '416',
  '425',
  '431',
  '432',
  '435',
  '445',
  '446',
  '447',
  '448',
  '462',
  '476',
  '478',
  '479',
  '495',
  '496',
  '499',
  '500',
  '504',
  '505',
  '506',
  '508',
  '521',
  '522',
  '523',
  '524',
  '542',
  '543',
  '544',
  '556',
  '573',
  '579',
  '580',
  '591',
  '592',
  '593',
  '594',
  '605',
  '606',
  '614',
  '615',
  '635',
  '636',
  '640',
  '643',
  '667',
  '682',
  '683',
  '687',
  '688',
  '689',
  '691',
  '703',
  '719',
  '746',
  '747',
  '749',
  '752',
  '753',
  '754',
  '755',
  '756',
  '757',
  '758',
  '766',
  '767',
  '768',
  '787',
  '796',
  '805',
  '806',
  '809',
  '814',
  '838',
  '839',
  '841',
  '849',
  '851',
  '852',
  '853',
  '854',
  '855',
  '856',
  '878',
  '881',
  '894',
  '901',
  '902',
  '903',
  '904',
  '906',
  '908',
  '909',
  '910',
  '911',
  '912',
  '922',
  '923',
  '924',
  '927',
  '943',
  '944',
  '945',
  '946',
  '947',
  '948',
  '949',
  '951',
  '961',
  '962',
  '963',
  '964',
  '965',
  '966',
  '967',
  '968',
  '969',
  '970',
  '971',
  '972',
  '976',
  '977',
  '980',
  '991',
  '992',
  '993',
  '1011',
  '1014',
  '1015',
  '1021',
  '1026',
  '1032',
  '1037',
  '1041',
  '1042',
  '1043',
  '1044',
  '1048',
  '1049',
  '1050',
  '1055',
  '1057',
  '1058',
  '1059',
  '1064',
  '1066',
  '1067',
  '1083',
  '1087',
  '1088',
  '1092',
  '1097',
  '1101',
  '1102',
  '1103',
  '1106',
  '1125',
  '1129',
  '1130',
  '1131',
  '1137',
  '1146',
  '1150',
  '1165',
  '1179',
  '1180',
  '1181',
  '1182',
  '1183',
  '1202',
  '1203',
  '1204',
  '1205',
  '1212',
  '1213',
  '1214',
  '1217',
  '1218',
  '1227',
  '1233',
  '1235',
  '1238',
  '1239',
  '1243',
  '1296',
  '1315',
  '1316',
  '1318',
  '1319',
  '1320',
  '1321',
  '1326',
  '1329',
  '1335',
  '1336',
  '1361',
  '1366',
  '1382',
  '1385',
  '1386',
  '1390',
  '1391',
  '1401',
  '1403',
  '1404',
  '1405',
  '1415',
  '1421',
  '1422',
  '1429',
  '1440',
  '1446',
  '1476',
  '1477',
  '1495',
  '1499',
  '1500',
  '1507',
  '1514',
  '1515',
  '1522',
  '1542',
  '1562',
  '1568',
  '1569',
  '1574',
  '1578',
  '1579',
  '1590',
  '1605',
  '1640',
  '1657',
  '1659',
  '1675',
  '1681',
  '1688',
  '1701',
  '1722',
  '1726',
  '1736',
  '1739',
  '1740',
  '1747',
  '1754',
  '1758',
  '1759',
  '1762',
  '1764',
  '1765',
  '1766',
  '1767',
  '1768',
  '1769',
  '1770',
  '1779',
  '1793',
  '1800',
  '1806',
  '1829',
  '1830',
  '1831',
  '1832',
  '1833',
  '1834',
  '1844',
  '1845',
  '1846',
  '1857',
  '1874',
  '1875',
  '1876',
  '1881',
  '1886',
  '1895',
  '1896',
  '1897',
  '1898',
  '1899',
  '1902',
  '1903',
  '1904',
  '1908',
  '1910',
  '1914',
  '1916',
  '1917',
  '1923',
  '1931',
  '1933',
  '1948',
  '1949',
  '1950',
  '1984',
  '1987',
  '1988',
  '1993',
  '1997',
  '2006',
  '2008',
  '2009',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2033',
  '2043',
  '2055',
  '2085',
  '2086',
  '2095',
  '2108',
  '2109',
  '2112',
  '2115',
  '2126',
  '2127',
  '2128',
  '2131',
  '2138',
  '2139',
  '2153',
  '2154',
  '2155',
  '2180',
  '2182',
  '2183',
  '2184',
  '2185',
  '2203',
  '2208',
  '2209',
  '2210',
  '2211',
  '2213',
  '2217',
  '2219',
  '2220',
  '2222',
  '2224',
  '2227',
  '2236',
  '2240',
  '2241',
  '2242',
  '2244',
  '2249',
  '2265',
  '2266',
  '2274',
  '2282',
  '2286',
  '2287',
  '2291',
  '2292',
  '2295',
  '2363',
  '2364',
  '2368',
  '2377',
  '2384',
  '2394',
  '2395',
  '2404',
  '2405',
  '2406',
  '2410',
  '2418',
  '2419',
  '2421',
  '2426',
  '2432',
  '2435',
]
const DUPLICATES = [
  {
    main: '1',
    duplicates: [
      '1648',
      '145',
      '2084',
      '2261',
      '2278',
      '858',
      '1938',
      '240',
      '1979',
      '1980',
      '1935',
      '1937',
    ],
  },
  { main: '3', duplicates: ['1708'] },
  { main: '4', duplicates: ['238', '1952', '2074', '2366', '239', '139'] },
  {
    main: '5',
    duplicates: [
      '376',
      '377',
      '380',
      '381',
      '656',
      '1038',
      '2408',
      '2271',
      '2253',
      '2075',
      '1808',
      '1807',
      '1612',
      '1611',
      '1040',
      '1374',
      '315',
      '317',
      '1080',
      '1506',
      '1039',
    ],
  },
  {
    main: '6',
    duplicates: [
      '7',
      '8',
      '92',
      '383',
      '503',
      '597',
      '600',
      '603',
      '1081',
      '1100',
      '1244',
      '1245',
      '1325',
      '1349',
      '1350',
      '1356',
      '1444',
      '1509',
      '1660',
      '2076',
      '2077',
      '2458',
      '1355',
      '1556',
      '1750',
      '510',
      '502',
      '1357',
      '501',
      '1505',
      '1661',
      '2218',
    ],
  },
  {
    main: '10',
    duplicates: [
      '735',
      '2383',
      '2179',
      '2173',
      '2161',
      '2098',
      '1352',
      '1473',
      '1348',
    ],
  },
  {
    main: '13',
    duplicates: [
      '748',
      '750',
      '1143',
      '1721',
      '2136',
      '2420',
      '2355',
      '2293',
      '698',
      '1533',
      '868',
      '2149',
      '2165',
      '2166',
    ],
  },
  {
    main: '14',
    duplicates: [
      '818',
      '1817',
      '1818',
      '2189',
      '320',
      '652',
      '678',
      '819',
      '1115',
      '621',
      '1156',
      '1186',
      '1395',
      '1396',
      '1540',
      '1617',
      '1626',
      '1901',
      '2229',
      '2238',
      '2285',
      '2400',
      '2416',
      '817',
      '1468',
      '1998',
      '2001',
      '498',
      '1424',
      '1452',
      '1454',
      '1456',
      '1459',
      '1461',
    ],
  },
  {
    main: '15',
    duplicates: [
      '89',
      '560',
      '769',
      '1447',
      '1580',
      '1389',
      '1636',
      '1727',
      '2097',
      '2145',
      '2357',
      '1968',
      '1970',
      '1815',
      '1912',
      '1913',
      '1973',
    ],
  },
  { main: '16', duplicates: ['519', '1735', '2197', '1928', '1932', '1916'] },
  { main: '17', duplicates: ['1662'] },
  {
    main: '20',
    duplicates: [
      '369',
      '626',
      '538',
      '627',
      '628',
      '629',
      '630',
      '631',
      '718',
      '847',
      '958',
      '1163',
      '1369',
      '1370',
      '1469',
      '1511',
      '1719',
      '1625',
      '2412',
      '1714',
      '386',
      '1638',
      '1639',
      '2254',
      '1805',
    ],
  },
  { main: '22', duplicates: ['689', '416', '1130', '2180', '1084', '1131'] },
  {
    main: '23',
    duplicates: [
      '93',
      '134',
      '135',
      '585',
      '586',
      '588',
      '590',
      '774',
      '775',
      '778',
      '1148',
      '1149',
      '2118',
    ],
  },
  {
    main: '24',
    duplicates: [
      '165',
      '187',
      '733',
      '734',
      '737',
      '738',
      '740',
      '744',
      '587',
      '644',
      '722',
      '741',
      '743',
      '1045',
      '1139',
      '1142',
      '2178',
      '2177',
      '2172',
      '2162',
      '2158',
      '1671',
      '1685',
      '1618',
      '166',
      '844',
      '1959',
      '1359',
      '1402',
      '736',
      '2160',
      '167',
      '1209',
      '1208',
      '2193',
      '25',
      '1794',
    ],
  },
  {
    main: '26',
    duplicates: [
      '49',
      '216',
      '219',
      '241',
      '823',
      '824',
      '825',
      '826',
      '827',
      '2142',
      '2642',
      '1827',
      '1828',
    ],
  },
  {
    main: '27',
    duplicates: [
      '85',
      '193',
      '581',
      '831',
      '832',
      '833',
      '834',
      '835',
      '836',
      '837',
      '1160',
      '1398',
      '1399',
      '1400',
      '1663',
      '1738',
      '1742',
      '2071',
      '2143',
      '2144',
      '2228',
      '2389',
    ],
  },
  {
    main: '28',
    duplicates: ['32', '181', '840', '891', '940', '1375', '2026', '2106'],
  },
  {
    main: '30',
    duplicates: [
      '412',
      '439',
      '873',
      '1169',
      '1679',
      '1743',
      '1944',
      '2103',
      '1943',
      '142',
      '866',
      '1940',
      '143',
    ],
  },
  {
    main: '38',
    duplicates: [
      '233',
      '234',
      '235',
      '236',
      '1647',
      '1664',
      '1665',
      '1728',
      '1772',
      '1322',
      '583',
      '1785',
      '1771',
      '800',
      '1295',
      '1866',
      '1776',
      '1777',
    ],
  },
  {
    main: '39',
    duplicates: [
      '259',
      '261',
      '1846',
      '2086',
      '2185',
      '345',
      '350',
      '352',
      '354',
      '703',
      '796',
      '1319',
      '1320',
      '1321',
      '1405',
      '2095',
      '1908',
      '1874',
      '1845',
      '1875',
      '1125',
      '1767',
      '260',
      '262',
      '258',
      '1501',
      '346',
      '1876',
      '1984',
    ],
  },
  {
    main: '40',
    duplicates: [
      '276',
      '2192',
      '976',
      '1397',
      '2388',
      '1773',
      '1778',
      '2247',
      '1573',
      '1460',
      '1451',
      '1453',
      '1455',
      '1457',
    ],
  },
  { main: '41', duplicates: ['287', '293'] },
  {
    main: '42',
    duplicates: [
      '295',
      '278',
      '1032',
      '1495',
      '294',
      '543',
      '1026',
      '1779',
      '2013',
      '542',
      '544',
      '1088',
      '1800',
      '2020',
      '2021',
      '2022',
      '1931',
      '1857',
      '1910',
      '2017',
      '82',
      '1933',
      '2014',
      '2015',
      '2018',
      '2019',
      '2023',
      '305',
      '2016',
      '306',
    ],
  },
  { main: '45', duplicates: ['392', '397', '393'] },
  { main: '46', duplicates: ['1061', '2187'] },
  { main: '47', duplicates: ['215', '2080', '1841', '2194'] },
  {
    main: '48',
    duplicates: [
      '474',
      '475',
      '473',
      '471',
      '1074',
      '2284',
      '449',
      '472',
      '624',
    ],
  },
  { main: '50', duplicates: ['467', '974', '192', '470'] },
  { main: '52', duplicates: ['1787', '1989'] },
  { main: '53', duplicates: ['79', '692'] },
  {
    main: '54',
    duplicates: ['299', '1306', '1307', '2091', '2195', '2262', '1465', '1529'],
  },
  {
    main: '56',
    duplicates: ['541', '545', '546', '547', '1087', '2113', '1825', '1826'],
  },
  { main: '57', duplicates: ['283', '1731', '279', '535'] },
  { main: '59', duplicates: ['1119', '2379', '2417', '1623'] },
  { main: '60', duplicates: ['1623', '1666'] },
  {
    main: '61',
    duplicates: [
      '364',
      '365',
      '366',
      '368',
      '367',
      '383',
      '1054',
      '1323',
      '1518',
      '1650',
      '2212',
      '2365',
      '2270',
      '2267',
      '2096',
    ],
  },
  { main: '64', duplicates: ['1956'] },
  { main: '65', duplicates: ['480', '481', '729'] },
  { main: '66', duplicates: ['420'] },
  {
    main: '68',
    duplicates: ['668', '2004', '2053', '2060', '2070', '2356', '2460'],
  },
  {
    main: '69',
    duplicates: [
      '9',
      '72',
      '879',
      '1358',
      '1373',
      '1576',
      '2025',
      '2027',
      '2029',
      '2042',
      '2111',
    ],
  },
  { main: '70', duplicates: ['444', '959', '1207'] },
  {
    main: '71',
    duplicates: [
      '169',
      '170',
      '185',
      '186',
      '561',
      '562',
      '563',
      '564',
      '566',
      '595',
      '596',
      '598',
      '599',
      '601',
      '602',
      '604',
      '1006',
      '1007',
      '1008',
      '1009',
      '1010',
      '1093',
      '1094',
      '1095',
      '1105',
      '1107',
      '1108',
      '1228',
      '1231',
      '1232',
      '1480',
      '1481',
      '1620',
      '1683',
      '1802',
      '1836',
      '2120',
      '2157',
      '2163',
      '2221',
      '121',
      '168',
      '1240',
      '1597',
      '2461',
      '1362',
      '565',
      '1837',
      '1838',
      '1839',
      '1005',
      '1229',
      '1230',
      '2283',
      '1001',
      '1842',
      '1847',
      '1106',
    ],
  },
  {
    main: '73',
    duplicates: ['767', '1758', '353', '766', '768', '1917', '1766'],
  },
  { main: '74', duplicates: ['202', '1589', '2072', '2392'] },
  { main: '75', duplicates: ['851', '1165', '1404', '387', '2295'] },
  {
    main: '76',
    duplicates: ['286', '1755', '2199', '277', '1852', '1853', '2088', '1871'],
  },
  { main: '80', duplicates: ['938', '1427', '1674', '897'] },
  { main: '84', duplicates: ['1519'] },
  {
    main: '87',
    duplicates: ['446', '1066', '1243', '1318', '1659', '339', '340'],
  },
  { main: '88', duplicates: ['1036', '1309'] },
  { main: '90', duplicates: ['850'] },
  {
    main: '94',
    duplicates: [
      '132',
      '133',
      '212',
      '585',
      '590',
      '723',
      '770',
      '776',
      '777',
      '1091',
      '1149',
      '1388',
      '1417',
      '1536',
      '1570',
      '1293',
      '1637',
      '2079',
      '2133',
      '1381',
      '1537',
      '1538',
    ],
  },
  { main: '95', duplicates: ['1682', '1796', '1443'] },
  { main: '100', duplicates: ['764', '1474', '1760', '2050'] },
  { main: '101', duplicates: ['1757', '2048'] },
  { main: '103', duplicates: ['1004', '1957', '2011', '1551'] },
  { main: '104', duplicates: ['1749', '1696', '1877'] },
  { main: '106', duplicates: ['2002', '1900'] },
  { main: '107', duplicates: ['1695', '1706', '1864'] },
  {
    main: '108',
    duplicates: [
      '1516',
      '1697',
      '1712',
      '1803',
      '1951',
      '2116',
      '1110',
      '1443',
    ],
  },
  { main: '109', duplicates: ['1687', '1716'] },
  {
    main: '111',
    duplicates: [
      '1748',
      '1780',
      '1791',
      '1110',
      '1443',
      '1496',
      '1995',
      '2092',
      '2437',
    ],
  },
  { main: '112', duplicates: ['1694', '2061', '1781'] },
  { main: '113', duplicates: ['1786', '1784', '1775'] },
  {
    main: '114',
    duplicates: [
      '403',
      '404',
      '482',
      '483',
      '1513',
      '1997',
      '2109',
      '484',
      '759',
      '760',
      '1241',
      '1512',
      '1535',
      '1672',
      '1715',
      '2171',
      '2279',
      '2288',
      '2413',
    ],
  },
  { main: '115', duplicates: ['842', '1878', '1879'] },
  { main: '116', duplicates: ['183'] },
  { main: '117', duplicates: ['421'] },
  { main: '119', duplicates: ['872', '1723', '2007', '1704'] },
  { main: '120', duplicates: ['1525', '263', '264', '893', '1889', '1890'] },
  { main: '122', duplicates: ['670', '1698', '2005', '1906'] },
  { main: '124', duplicates: ['1942', '2052'] },
  { main: '125', duplicates: ['1700', '1941', '2051'] },
  { main: '129', duplicates: ['319'] },
  { main: '136', duplicates: ['1855', '2354'] },
  { main: '138', duplicates: ['1690'] },
  { main: '144', duplicates: ['882', '426'] },
  { main: '147', duplicates: ['641'] },
  { main: '149', duplicates: ['179', '1899', '1898', '1923', '1844', '1881'] },
  { main: '153', duplicates: ['2010', '1955'] },
  { main: '154', duplicates: ['231', '347'] },
  { main: '157', duplicates: ['2457'] },
  {
    main: '178',
    duplicates: ['348', '615', '1747', '2043', '1195', '1762', '1914'],
  },
  { main: '184', duplicates: ['771', '1848', '1850', '1177'] },
  { main: '189', duplicates: ['140', '2263'] },
  { main: '195', duplicates: ['229', '400'] },
  { main: '198', duplicates: ['966', '1097', '1214', '36', '81'] },
  { main: '208', duplicates: ['2208'] },
  { main: '217', duplicates: ['220', '846', '1288', '845'] },
  { main: '218', duplicates: ['1577'] },
  {
    main: '222',
    duplicates: [
      '11',
      '162',
      '224',
      '225',
      '251',
      '433',
      '477',
      '551',
      '552',
      '553',
      '554',
      '555',
      '807',
      '808',
      '997',
      '1491',
      '1602',
      '1801',
      '1811',
      '1907',
      '2000',
      '2114',
      '2289',
      '2370',
      '2401',
      '2414',
      '2428',
      '1810',
      '1018',
    ],
  },
  { main: '223', duplicates: ['1504'] },
  { main: '227', duplicates: ['226', '257'] },
  { main: '228', duplicates: ['1599', '2083'] },
  { main: '230', duplicates: ['1196'] },
  { main: '232', duplicates: ['1646', '2444'] },
  { main: '237', duplicates: ['1492', '1104'] },
  {
    main: '248',
    duplicates: [
      '250',
      '357',
      '805',
      '1050',
      '1296',
      '2244',
      '249',
      '247',
      '203',
      '358',
      '806',
      '2006',
    ],
  },
  {
    main: '254',
    duplicates: ['78', '714', '1023', '1046', '1299', '1493', '1300', '2281'],
  },
  { main: '255', duplicates: ['1572', '2082'] },
  {
    main: '266',
    duplicates: ['267', '131', '1301', '1730', '34', '265', '1024', '623'],
  },
  { main: '269', duplicates: ['270'] },
  { main: '275', duplicates: ['646', '647', '645', '148', '374', '1458'] },
  { main: '281', duplicates: ['954', '200', '2148', '1194'] },
  { main: '290', duplicates: ['289'] },
  { main: '291', duplicates: ['151', '1720'] },
  { main: '304', duplicates: ['1693', '2093', '1443'] },
  { main: '310', duplicates: ['311', '1071', '2186'] },
  {
    main: '312',
    duplicates: [
      '313',
      '314',
      '316',
      '318',
      '419',
      '127',
      '44',
      '2191',
      '512',
      '513',
      '571',
      '572',
      '816',
      '2073',
      '2101',
    ],
  },
  { main: '325', duplicates: ['1560', '1596'] },
  {
    main: '329',
    duplicates: [
      '327',
      '328',
      '911',
      '326',
      '948',
      '1041',
      '1042',
      '1043',
      '1044',
      '1315',
      '1390',
      '1722',
      '1834',
      '2209',
      '2282',
      '2364',
      '176',
      '373',
      '495',
      '839',
      '943',
      '944',
      '947',
      '949',
      '1202',
      '1203',
      '1014',
      '1015',
      '2363',
      '1832',
      '1833',
      '1227',
      '1366',
      '1391',
      '1401',
      '1106',
      '2274',
      '2240',
      '2236',
      '2227',
      '2220',
      '2217',
      '1515',
      '371',
      '372',
      '172',
      '173',
      '814',
      '838',
      '1361',
      '1768',
      '2115',
      '2286',
      '903',
      '902',
      '1522',
      '1150',
      '1736',
      '242',
      '462',
    ],
  },
  { main: '330', duplicates: ['1783'] },
  { main: '333', duplicates: ['43', '334', '815', '2094', '197'] },
  { main: '338', duplicates: ['1345'] },
  { main: '341', duplicates: ['1610'] },
  { main: '344', duplicates: ['2792'] },
  { main: '355', duplicates: ['1658'] },
  { main: '361', duplicates: ['362', '363'] },
  { main: '388', duplicates: ['389', '391'] },
  { main: '390', duplicates: ['2283', '1651', '2099', '1789', '1790'] },
  { main: '394', duplicates: ['395'] },
  { main: '396', duplicates: ['1056'] },
  { main: '408', duplicates: ['1628'] },
  {
    main: '410',
    duplicates: ['411', '1057', '1059', '1092', '1058', '2368', '1335'],
  },
  { main: '417', duplicates: ['418', '673', '1063', '1242', '1656'] },
  { main: '422', duplicates: ['424'] },
  { main: '434', duplicates: ['1337'] },
  { main: '437', duplicates: ['436'] },
  { main: '443', duplicates: ['751', '442'] },
  {
    main: '447',
    duplicates: [
      '448',
      '962',
      '2183',
      '2184',
      '2153',
      '1590',
      '971',
      '972',
      '1067',
    ],
  },
  { main: '457', duplicates: ['456', '1870', '1340', '1884'] },
  { main: '458', duplicates: ['459', '1571', '2107', '1557'] },
  {
    main: '461',
    duplicates: [
      '415',
      '637',
      '693',
      '1347',
      '1501',
      '1709',
      '1795',
      '2125',
      '137',
      '152',
      '463',
      '465',
      '414',
      '1378',
    ],
  },
  { main: '476', duplicates: ['2239'] },
  { main: '478', duplicates: ['479', '2108'] },
  { main: '491', duplicates: ['952'] },
  { main: '492', duplicates: ['490'] },
  {
    main: '507',
    duplicates: [
      '384',
      '385',
      '1053',
      '1082',
      '1508',
      '1613',
      '1718',
      '2367',
      '690',
    ],
  },
  { main: '516', duplicates: ['1289'] },
  { main: '517', duplicates: ['1096'] },
  { main: '518', duplicates: ['515'] },
  { main: '523', duplicates: ['688', '691'] },
  {
    main: '525',
    duplicates: [
      '526',
      '18',
      '530',
      '529',
      '1711',
      '2411',
      '1888',
      '1860',
      '1861',
      '527',
      '196',
      '1443',
      '441',
      '1118',
      '1157',
      '1175',
      '1189',
      '1192',
      '1226',
      '801',
    ],
  },
  { main: '532', duplicates: ['533'] },
  { main: '536', duplicates: ['164'] },
  { main: '550', duplicates: ['549', '1999', '2046'] },
  { main: '567', duplicates: ['568', '98'] },
  { main: '570', duplicates: ['569', '1467', '1737', '1751', '19', '1443'] },
  { main: '575', duplicates: ['1062', '2104'] },
  { main: '577', duplicates: ['2129', '126'] },
  { main: '584', duplicates: ['453'] },
  { main: '592', duplicates: ['2119'] },
  {
    main: '609',
    duplicates: [
      '97',
      '171',
      '608',
      '607',
      '611',
      '1109',
      '2122',
      '2223',
      '2372',
      '2373',
      '2374',
      '2375',
    ],
  },
  {
    main: '613',
    duplicates: ['1110', '1111', '1909', '1953', '2436', '612', '1622'],
  },
  { main: '618', duplicates: ['619'] },
  { main: '638', duplicates: ['745'] },
  { main: '639', duplicates: ['379', '1324', '1411'] },
  { main: '650', duplicates: ['163'] },
  {
    main: '654',
    duplicates: [
      '62',
      '655',
      '1472',
      '1905',
      '1930',
      '2030',
      '2031',
      '2032',
      '2033',
      '2034',
      '2035',
      '2036',
      '1929',
    ],
  },
  { main: '659', duplicates: ['658', '660', '677', '1117'] },
  {
    main: '669',
    duplicates: [
      '1120',
      '1121',
      '1122',
      '2226',
      '2380',
      '1154',
      '1155',
      '1365',
      '1539',
      '1623',
      '67',
      '1798',
    ],
  },
  { main: '672', duplicates: ['1126'] },
  { main: '674', duplicates: ['676'] },
  { main: '685', duplicates: ['684', '2273', '301'] },
  { main: '686', duplicates: ['859'] },
  { main: '694', duplicates: ['1532', '2424', '2255', '2137'] },
  {
    main: '697',
    duplicates: [
      '696',
      '699',
      '701',
      '702',
      '1133',
      '1020',
      '2381',
      '2382',
      '2254',
      '1530',
      '1607',
      '2168',
      '2169',
      '2188',
      '2296',
      '77',
      '243',
      '244',
      '12',
      '2130',
      '1812',
      '1813',
      '1799',
      '1774',
    ],
  },
  { main: '717', duplicates: ['1432', '1563'] },
  { main: '747', duplicates: ['1987', '1988', '749'] },
  {
    main: '753',
    duplicates: [
      '754',
      '757',
      '758',
      '1183',
      '756',
      '881',
      '1386',
      '1129',
      '951',
      '1429',
      '683',
      '431',
      '405',
      '1113',
      '1605',
      '1886',
      '2126',
      '2138',
      '2139',
      '606',
      '640',
      '643',
      '719',
      '910',
      '976',
      '1128',
      '1146',
      '977',
      '1179',
      '1180',
      '1181',
      '1336',
      '1385',
      '1477',
      '2249',
      '2395',
      '2426',
      '908',
      '1064',
      '755',
      '199',
      '342',
      '370',
      '375',
      '406',
      '409',
      '425',
      '432',
      '499',
      '500',
      '504',
      '505',
      '508',
      '593',
      '594',
      '605',
      '752',
      '2405',
      '282',
      '2394',
      '927',
      '909',
      '1021',
      '1182',
      '1326',
      '1476',
      '1562',
      '1640',
      '1657',
      '1739',
      '1756',
      '2008',
      '2182',
      '2213',
      '2265',
      '2287',
      '1507',
      '849',
      '1403',
      '1831',
      '1830',
      '1793',
      '1806',
      '2404',
    ],
  },
  { main: '763', duplicates: ['762'] },
  {
    main: '772',
    duplicates: ['1308', '1753', '2201', '99', '1034', '1497', '1918'],
  },
  { main: '780', duplicates: ['781'] },
  { main: '784', duplicates: ['2386', '731', '2279'] },
  { main: '789', duplicates: ['788', '303'] },
  { main: '792', duplicates: ['1030', '790'] },
  { main: '794', duplicates: ['793'] },
  { main: '797', duplicates: ['730'] },
  { main: '803', duplicates: ['804', '1922', '1153', '1921'] },
  { main: '810', duplicates: ['1945', '1863', '1869', '1919'] },
  { main: '812', duplicates: ['1098'] },
  { main: '821', duplicates: ['822', '1158', '2045', '2141'] },
  { main: '829', duplicates: ['828'] },
  {
    main: '830',
    duplicates: [
      '742',
      '811',
      '939',
      '1159',
      '2064',
      '739',
      '321',
      '1996',
      '1351',
    ],
  },
  { main: '843', duplicates: ['1561'] },
  {
    main: '854',
    duplicates: [
      '29',
      '102',
      '309',
      '401',
      '445',
      '521',
      '522',
      '524',
      '635',
      '852',
      '853',
      '855',
      '856',
      '878',
      '894',
      '901',
      '1137',
      '1233',
      '1499',
      '1500',
      '1542',
      '1688',
      '1754',
      '1759',
      '2112',
      '2203',
      '2410',
      '1829',
      '308',
      '1037',
      '150',
      '1087',
      '307',
      '667',
      '1011',
      '1235',
      '1948',
      '1949',
      '1950',
      '1902',
      '1903',
      '1904',
    ],
  },
  { main: '863', duplicates: ['191'] },
  { main: '876', duplicates: ['875', '1152', '1170', '1172', '2248'] },
  { main: '877', duplicates: ['31'] },
  { main: '880', duplicates: ['1414', '2215', '2233', '423'] },
  { main: '884', duplicates: ['885', '886', '2297'] },
  { main: '887', duplicates: ['2041'] },
  {
    main: '914',
    duplicates: [
      '33',
      '589',
      '726',
      '915',
      '916',
      '917',
      '918',
      '919',
      '920',
      '1423',
      '1478',
      '1140',
      '1490',
      '1667',
      '1686',
      '2134',
      '2198',
      '1862',
      '1920',
      '1443',
    ],
  },
  { main: '922', duplicates: ['923'] },
  { main: '926', duplicates: ['2300', '990', '2156'] },
  { main: '929', duplicates: ['2439', '860'] },
  { main: '932', duplicates: ['1200'] },
  { main: '933', duplicates: ['1201'] },
  { main: '941', duplicates: ['942', '1344', '1428'] },
  { main: '956', duplicates: ['957', '1548'] },
  { main: '960', duplicates: ['2252'] },
  { main: '964', duplicates: ['961', '965', '902', '1212', '2009', '1213'] },
  { main: '969', duplicates: ['968', '177', '1217', '1579'] },
  { main: '975', duplicates: ['37', '1219', '1549'] },
  { main: '978', duplicates: ['979'] },
  {
    main: '983',
    duplicates: ['980', '981', '982', '2055', '2154', '2155', '2399'],
  },
  { main: '988', duplicates: ['1134', '1431'] },
  { main: '989', duplicates: ['985'] },
  { main: '991', duplicates: ['992'] },
  { main: '994', duplicates: ['2409'] },
  { main: '996', duplicates: ['1550'] },
  { main: '1002', duplicates: ['1353', '1710'] },
  { main: '1003', duplicates: ['1354', '1246'] },
  {
    main: '1012',
    duplicates: ['1236', '1237', '1114', '466', '1641', '2430', '2431'],
  },
  { main: '1028', duplicates: ['83', '280', '1029', '2276'] },
  { main: '1048', duplicates: ['892'] },
  { main: '1051', duplicates: ['359', '848', '1591', '2294'] },
  { main: '1055', duplicates: ['1498', '1329', '2121'] },
  {
    main: '1077',
    duplicates: [
      '488',
      '489',
      '2369',
      '1070',
      '2449',
      '869',
      '2256',
      '1174',
      '888',
    ],
  },
  { main: '1138', duplicates: ['725', '721'] },
  { main: '1151', duplicates: ['1371', '2090'] },
  { main: '1176', duplicates: ['898'] },
  { main: '1184', duplicates: ['1185', '1947'] },
  { main: '1216', duplicates: ['2425'] },
  { main: '1223', duplicates: ['987', '1222'] },
  { main: '1224', duplicates: ['2298'] },
  { main: '1238', duplicates: ['1239'] },
  { main: '1294', duplicates: ['1210', '35', '1017', '928'] },
  { main: '1297', duplicates: ['1729', '509'] },
  { main: '1305', duplicates: ['296', '297', '782', '783', '1033', '2190'] },
  { main: '1313', duplicates: ['1314', '1311', '1312', '1310', '1426'] },
  {
    main: '1316',
    duplicates: ['1405', '1681', '2131', '2241', '2242', '1083', '935', '841'],
  },
  { main: '1339', duplicates: ['2269'] },
  { main: '1343', duplicates: ['1342'] },
  { main: '1383', duplicates: ['1537', '1538'] },
  { main: '1410', duplicates: ['130', '1545', '1575', '1409', '1411'] },
  { main: '1422', duplicates: ['1675'] },
  { main: '1430', duplicates: ['984', '1633', '1634', '188', '207'] },
  {
    main: '1433',
    duplicates: [
      '1621',
      '1894',
      '86',
      '105',
      '999',
      '1303',
      '2117',
      '2012',
      '1684',
      '1413',
      '63',
      '998',
      '1225',
      '2235',
      '1619',
    ],
  },
  { main: '1441', duplicates: ['1975', '2468'] },
  {
    main: '1442',
    duplicates: [
      '402',
      '1333',
      '1654',
      '2225',
      '454',
      '727',
      '1069',
      '2214',
      '2385',
    ],
  },
  { main: '1445', duplicates: ['1420'] },
  { main: '1449', duplicates: ['1425'] },
  { main: '1466', duplicates: ['1865'] },
  {
    main: '1470',
    duplicates: [
      '273',
      '271',
      '272',
      '398',
      '399',
      '21',
      '663',
      '664',
      '665',
      '666',
      '1809',
      '2087',
      '1630',
      '1752',
      '1745',
      '2100',
      '1652',
      '322',
      '514',
      '715',
      '716',
      '1287',
      '1782',
      '323',
      '324',
      '1554',
      '2',
      '1290',
      '1804',
      '2302',
      '1631',
      '1819',
      '1822',
      '1823',
      '1824',
      '2279',
    ],
  },
  {
    main: '1471',
    duplicates: ['1123', '1124', '1377', '671', '175', '1298', '1365', '1364'],
  },
  { main: '1510', duplicates: ['485'] },
  { main: '1520', duplicates: ['2204', '582', '2371'] },
  { main: '1521', duplicates: ['1601', '2147', '2232'] },
  { main: '1526', duplicates: ['651', '1629'] },
  { main: '1528', duplicates: ['2003', '1632'] },
  { main: '1534', duplicates: ['906', '1421'] },
  { main: '1553', duplicates: ['2044', '934', '1116'] },
  { main: '1568', duplicates: ['1769', '1770', '2292'] },
  { main: '1569', duplicates: ['2210'] },
  { main: '1583', duplicates: ['1887'] },
  { main: '1584', duplicates: ['2216'] },
  { main: '1594', duplicates: ['1363'] },
  { main: '1614', duplicates: ['1615', '1616'] },
  { main: '1627', duplicates: ['1628'] },
  { main: '1642', duplicates: ['616'] },
  { main: '1645', duplicates: ['1880', '1954'] },
  { main: '1653', duplicates: ['1867', '1868', '1332'] },
  { main: '1655', duplicates: ['1334', '407'] },
  { main: '1677', duplicates: ['2260'] },
  { main: '1699', duplicates: ['141', '865', '1939', '1544'] },
  { main: '1746', duplicates: ['1934', '1936'] },
  { main: '1763', duplicates: ['1725'] },
  { main: '1816', duplicates: ['1820', '1821'] },
  { main: '1843', duplicates: ['1882', '1883'] },
  { main: '1854', duplicates: ['1849', '1851'] },
  { main: '1858', duplicates: ['1859'] },
  { main: '1873', duplicates: ['1927', '1872'] },
  { main: '1891', duplicates: ['1892'] },
  { main: '1893', duplicates: ['1713'] },
  { main: '1895', duplicates: ['1896', '1897'] },
  {
    main: '1911',
    duplicates: ['2135', '2167', '1144', '1558', '1145', '813', '2062', '2200'],
  },
  { main: '1946', duplicates: ['1925', '1926'] },
  { main: '1963', duplicates: ['1962'] },
  { main: '1994', duplicates: ['1628'] },
  {
    main: '2038',
    duplicates: [
      '9',
      '180',
      '468',
      '469',
      '493',
      '494',
      '540',
      '1016',
      '1075',
      '1078',
      '1079',
      '1136',
      '1327',
      '1347',
      '1555',
      '1676',
      '1680',
      '1717',
      '1744',
      '1797',
      '2040',
      '2042',
      '2170',
      '2254',
      '2362',
      '557',
    ],
  },
  { main: '2039', duplicates: ['1703'] },
  { main: '2049', duplicates: ['2376', '205'] },
  { main: '2056', duplicates: ['1971', '1425'] },
  { main: '2057', duplicates: ['1188'] },
  { main: '2058', duplicates: ['1990'] },
  { main: '2059', duplicates: ['1991'] },
  { main: '2065', duplicates: ['2303', '2391'] },
  {
    main: '2105',
    duplicates: [
      '2110',
      '1792',
      '427',
      '795',
      '190',
      '1047',
      '1065',
      '1076',
      '1418',
      '1419',
      '1393',
      '1394',
      '1392',
      '1052',
    ],
  },
  { main: '2124', duplicates: ['2272'] },
  {
    main: '2128',
    duplicates: [
      '506',
      '579',
      '580',
      '636',
      '682',
      '746',
      '787',
      '945',
      '946',
      '963',
      '55',
      '1101',
      '1102',
      '1103',
      '1366',
      '1382',
      '2222',
      '2291',
      '2384',
      '2435',
    ],
  },
  { main: '2151', duplicates: ['2277', '2396'] },
  { main: '2174', duplicates: ['2175', '2159', '1958', '896', '706', '2176'] },
  { main: '2202', duplicates: ['2063', '2181'] },
  { main: '2206', duplicates: ['1494'] },
  {
    main: '2207',
    duplicates: ['284', '1164', '174', '1406', '1448', '791', '857', '58'],
  },
  { main: '2211', duplicates: ['360'] },
  { main: '2237', duplicates: ['1027', '1443', '1140'] },
  { main: '2246', duplicates: ['2231', '2146'] },
  { main: '2250', duplicates: ['925'] },
  { main: '2258', duplicates: ['2602'] },
  { main: '2259', duplicates: ['1300'] },
  { main: '2378', duplicates: ['662', '661'] },
  { main: '2387', duplicates: ['2245'] },
  { main: '2390', duplicates: ['2234'] },
  { main: '2402', duplicates: ['1587'] },
  { main: '2418', duplicates: ['2219', '1740', '2377'] },
  { main: '2443', duplicates: ['1443'] },
  { main: '2455', duplicates: ['1408'] },
  { main: '2456', duplicates: ['1450'] },
  { main: '2464', duplicates: ['2465'] },
  { main: '2470', duplicates: ['2466', '2467', '2469', '2474'] },
  { main: '2476', duplicates: ['2475'] },
  { main: '2532', duplicates: ['2682'] },
  { main: '2542', duplicates: ['2692'] },
  { main: '2552', duplicates: ['2702'] },
  { main: '2582', duplicates: ['2712'] },
  { main: '2632', duplicates: ['2722'] },
  { main: '2662', duplicates: ['2512'] },
  { main: '2832', duplicates: ['2822', '2842', '2852', '2862'] },
  { main: '2882', duplicates: ['2872', '2892', '2902', '2912'] },
]

module.exports = {
  NON_RELEVANT_IDS,
  DUPLICATES,
}
