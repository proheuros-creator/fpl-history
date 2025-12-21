import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Users, Award, Star, Globe, Medal, Crown, X, Calendar, ListOrdered, Loader2, BarChart2, ChevronDown, ChevronUp, Activity, Shield, Shirt, Percent, Filter } from 'lucide-react';

// ==========================================
// 1. 데이터 소스 (검증된 데이터)
// ==========================================

// 참가자 목록
const PLAYERS = ["이지용", "임우람", "장용석", "장재윤", "전민호", "정세현", "정용우", "정재훈", "정창영", "천영석", "하원석", "한지상", "한상진"];

// 시즌별 전체 참가자 수 (Total Players)
const TOTAL_PLAYERS = {
  "2010/11": 2351622,
  "2011/12": 2781485,
  "2012/13": 2608634,
  "2013/14": 3218998,
  "2014/15": 3502998,
  "2015/16": 3734001,
  "2016/17": 4503345,
  "2017/18": 5910135,
  "2018/19": 6296699,
  "2019/20": 7628968,
  "2020/21": 8240321,
  "2021/22": 9167407,
  "2022/23": 11447257,
  "2023/24": 10911213,
  "2024/25": 11515690
};

// 점수 데이터 (Points)
const POINTS_DATA = [
  { season: "2010/11", "이지용": null, "임우람": 1838, "장용석": 1346, "장재윤": 1416, "전민호": null, "정세현": null, "정용우": null, "정재훈": 1367, "정창영": 1889, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2011/12", "이지용": null, "임우람": 1919, "장용석": null, "장재윤": 1751, "전민호": 2047, "정세현": null, "정용우": null, "정재훈": 2015, "정창영": 1912, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2012/13", "이지용": null, "임우람": 1984, "장용석": null, "장재윤": 1743, "전민호": 2069, "정세현": 1735, "정용우": null, "정재훈": 1967, "정창영": 1966, "천영석": 1879, "하원석": null, "한지상": null, "한상진": null },
  { season: "2013/14", "이지용": null, "임우람": 2220, "장용석": null, "장재윤": 1745, "전민호": 2168, "정세현": 2036, "정용우": null, "정재훈": 1974, "정창영": 2041, "천영석": 1931, "하원석": null, "한지상": null, "한상진": null },
  { season: "2014/15", "이지용": 1580, "임우람": 1848, "장용석": null, "장재윤": 1763, "전민호": 1908, "정세현": 2027, "정용우": null, "정재훈": 1695, "정창영": 1964, "천영석": 1891, "하원석": null, "한지상": null, "한상진": null },
  { season: "2015/16", "이지용": 1890, "임우람": 1982, "장용석": null, "장재윤": 1954, "전민호": 2060, "정세현": 1906, "정용우": 2039, "정재훈": 1944, "정창영": 2103, "천영석": 1943, "하원석": null, "한지상": null, "한상진": null },
  { season: "2016/17", "이지용": 1586, "임우람": 2118, "장용석": 2330, "장재윤": 2009, "전민호": 1951, "정세현": 1913, "정용우": 2160, "정재훈": 1762, "정창영": 1963, "천영석": 1878, "하원석": null, "한지상": null, "한상진": null },
  { season: "2017/18", "이지용": 1636, "임우람": 2010, "장용석": 2197, "장재윤": 1969, "전민호": 2270, "정세현": 2231, "정용우": 2167, "정재훈": 2199, "정창영": 2137, "천영석": 2018, "하원석": 1961, "한지상": 1700, "한상진": null },
  { season: "2018/19", "이지용": null, "임우람": 2120, "장용석": 2334, "장재윤": 2025, "전민호": 2204, "정세현": 2081, "정용우": 2204, "정재훈": 2151, "정창영": 2211, "천영석": 2056, "하원석": 1786, "한지상": 2270, "한상진": null },
  { season: "2019/20", "이지용": null, "임우람": 2151, "장용석": 2414, "장재윤": 2190, "전민호": 2169, "정세현": 2250, "정용우": 2298, "정재훈": 2187, "정창영": 2289, "천영석": 2055, "하원석": 2269, "한지상": 2274, "한상진": 1716 },
  { season: "2020/21", "이지용": null, "임우람": 2368, "장용석": 2297, "장재윤": 2285, "전민호": 2140, "정세현": 2420, "정용우": 2302, "정재훈": 2406, "정창영": 2409, "천영석": 2447, "하원석": 2022, "한지상": 2368, "한상진": 1871 },
  { season: "2021/22", "이지용": null, "임우람": 2307, "장용석": 2423, "장재윤": 2383, "전민호": 2048, "정세현": 1963, "정용우": null, "정재훈": 2551, "정창영": 2339, "천영석": 1959, "하원석": 2257, "한지상": null, "한상진": 1919 },
  { season: "2022/23", "이지용": null, "임우람": 2273, "장용석": 2558, "장재윤": 2333, "전민호": 2203, "정세현": 2469, "정용우": null, "정재훈": null, "정창영": 2464, "천영석": 1955, "하원석": 2150, "한지상": 2625, "한상진": 2055 },
  { season: "2023/24", "이지용": null, "임우람": 2216, "장용석": 2465, "장재윤": 2323, "전민호": 2375, "정세현": 2164, "정용우": null, "정재훈": null, "정창영": 2305, "천영석": null, "하원석": 2079, "한지상": null, "한상진": 1994 },
  { season: "2024/25", "이지용": null, "임우람": 2405, "장용석": 1792, "장재윤": 2240, "전민호": 1949, "정세현": 2294, "정용우": null, "정재훈": null, "정창영": 2265, "천영석": 2265, "하원석": 2050, "한지상": null, "한상진": 1883 }
];

// 순위 데이터 (Rank)
const RANK_DATA = [
  { season: "2010/11", total_players: 2351622, "이지용": null, "임우람": 488858, "장용석": 2044453, "장재윤": 1919854, "전민호": null, "정세현": null, "정용우": null, "정재훈": 2010131, "정창영": 320870, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2011/12", total_players: 2781485, "이지용": null, "임우람": 367085, "장용석": null, "장재윤": 1026060, "전민호": 91994, "정세현": null, "정용우": null, "정재훈": 138279, "정창영": 389776, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2012/13", total_players: 2608634, "이지용": null, "임우람": 264342, "장용석": null, "장재윤": 1253182, "전민호": 99067, "정세현": 1290044, "정용우": null, "정재훈": 311838, "정창영": 315403, "천영석": 635078, "하원석": null, "한지상": null, "한상진": null },
  { season: "2013/14", total_players: 3218998, "이지용": null, "임우람": 236645, "장용석": null, "장재윤": 1890898, "전민호": 393568, "정세현": 899505, "정용우": null, "정재훈": 1140409, "정창영": 878573, "천영석": 1299089, "하원석": null, "한지상": null, "한상진": null },
  { season: "2014/15", total_players: 3502998, "이지용": 2199131, "임우람": 852480, "장용석": null, "장재윤": 1306012, "전민호": 548999, "정세현": 151328, "정용우": null, "정재훈": 1646552, "정창영": 320759, "천영석": 628997, "하원석": null, "한지상": null, "한상진": null },
  { season: "2015/16", total_players: 3734001, "이지용": 1286580, "임우람": 747000, "장용석": null, "장재윤": 907113, "전민호": 364313, "정세현": 1195929, "정용우": 454652, "정재훈": 965642, "정창영": 213623, "천영석": 971034, "하원석": null, "한지상": null, "한상진": null },
  { season: "2016/17", total_players: 4503345, "이지용": 3144335, "임우람": 197136, "장용석": 5882, "장재윤": 564450, "전민호": 861550, "정세현": 1087148, "정용우": 118309, "정재훈": 2085800, "정창영": 795337, "천영석": 1304172, "하원석": null, "한지상": null, "한상진": null },
  { season: "2017/18", total_players: 5910135, "이지용": 4016193, "임우람": 1100809, "장용석": 132207, "장재윤": 1431587, "전민호": 30851, "정세현": 72189, "정용우": 211329, "정재훈": 127232, "정창영": 316724, "천영석": 1031065, "하원석": 1498748, "한지상": 3569025, "한상진": null },
  { season: "2018/19", total_players: 6296699, "이지용": null, "임우람": 694211, "장용석": 31160, "장재윤": 1589264, "전민호": 256535, "정세현": 1011675, "정용우": 258014, "정재훈": 493419, "정창영": 234075, "천영석": 1250565, "하원석": 4176389, "한지상": 97859, "한상진": null },
  { season: "2019/20", total_players: 7628968, "이지용": null, "임우람": 548058, "장용석": 1485, "장재윤": 337871, "전민호": 440940, "정세현": 134969, "정용우": 51944, "정재훈": 352286, "정창영": 62604, "천영석": 1315076, "하원석": 95030, "한지상": 85191, "한상진": 5151898 },
  { season: "2020/21", total_players: 8240321, "이지용": null, "임우람": 149364, "장용석": 375991, "장재윤": 427962, "전민호": 1357913, "정세현": 59523, "정용우": 356857, "정재훈": 77566, "정창영": 73420, "천영석": 32660, "하원석": 2410493, "한지상": 147457, "한상진": 3861290 },
  { season: "2021/22", total_players: 9167407, "이지용": null, "임우람": 630610, "장용석": 251837, "장재윤": 357532, "전민호": 2356910, "정세현": 3147382, "정용우": null, "정재훈": 91145, "정창영": 501060, "천영석": 3180491, "하원석": 866734, "한지상": null, "한상진": 3582231 },
  { season: "2022/23", total_players: 11447257, "이지용": null, "임우람": 1826166, "장용석": 47291, "장재윤": 1197568, "전민호": 2656613, "정세현": 279357, "정용우": null, "정재훈": null, "정창영": 300559, "천영석": 5794022, "하원석": 3334400, "한지상": 4726, "한상진": 4555938 },
  { season: "2023/24", total_players: 10911213, "이지용": null, "임우람": 1983212, "장용석": 144543, "장재윤": 837533, "전민호": 486351, "정세현": 2672608, "정용우": null, "정재훈": null, "정창영": 990135, "천영석": null, "하원석": 3806677, "한지상": null, "한상진": 4857744 },
  { season: "2024/25", total_players: 11515690, "이지용": null, "임우람": 542178, "장용석": 7586555, "장재윤": 2277431, "전민호": 6036128, "정세현": 1578299, "정용우": null, "정재훈": null, "정창영": 1939953, "천영석": 1938678, "하원석": 4923350, "한지상": null, "한상진": 6681248 }
];

// FPL 역대 시즌별 Top 5 득점자 데이터 (요약용)
const fplTopScorers = {
  "2010/11": { name: "Nani", score: 198 },
  "2011/12": { name: "Van Persie", score: 269 },
  "2012/13": { name: "Van Persie", score: 262 },
  "2013/14": { name: "L.Suarez", score: 295 },
  "2014/15": { name: "E.Hazard", score: 233 },
  "2015/16": { name: "R.Mahrez", score: 240 },
  "2016/17": { name: "A.Sanchez", score: 264 },
  "2017/18": { name: "M.Salah", score: 303 },
  "2018/19": { name: "M.Salah", score: 259 },
  "2019/20": { name: "De Bruyne", score: 251 },
  "2020/21": { name: "B.Fernandes", score: 244 },
  "2021/22": { name: "M.Salah", score: 265 },
  "2022/23": { name: "E.Haaland", score: 272 },
  "2023/24": { name: "C.Palmer", score: 244 },
  "2024/25": { name: "M.Salah", score: 344 }
};

// FPL 시즌별 Top 20 상세 데이터 (포지션 포함)
const fplSeasonTop20 = {
    "2010/11": [
        { rank: 1, name: "Nani", team: "MUN", pos: "MID", points: 198 }, { rank: 2, name: "C.Adam", team: "BLP", pos: "MID", points: 192 }, { rank: 3, name: "C.Tevez", team: "MCI", pos: "FWD", points: 186 }, { rank: 4, name: "Van der Vaart", team: "TOT", pos: "MID", points: 184 }, { rank: 5, name: "D.Drogba", team: "CHE", pos: "FWD", points: 178 }, { rank: 6, name: "L.Baines", team: "EVE", pos: "DEF", points: 178 }, { rank: 7, name: "F.Malouda", team: "CHE", pos: "MID", points: 172 }, { rank: 8, name: "D.Kuyt", team: "LIV", pos: "MID", points: 168 }, { rank: 9, name: "R.Van Persie", team: "ARS", pos: "FWD", points: 166 }, { rank: 10, name: "D.Bent", team: "AVL", pos: "FWD", points: 163 },
        { rank: 11, name: "P.Odemwingie", team: "WBA", pos: "FWD", points: 159 }, { rank: 12, name: "C.Dempsey", team: "FUL", pos: "MID", points: 157 }, { rank: 13, name: "Y.Toure", team: "MCI", pos: "MID", points: 156 }, { rank: 14, name: "N.Vidic", team: "MUN", pos: "DEF", points: 155 }, { rank: 15, name: "A.Cole", team: "CHE", pos: "DEF", points: 152 }, { rank: 16, name: "S.Downing", team: "AVL", pos: "MID", points: 151 }, { rank: 17, name: "J.Hart", team: "MCI", pos: "GKP", points: 150 }, { rank: 18, name: "B.Hangeland", team: "FUL", pos: "DEF", points: 148 }, { rank: 19, name: "R.Huth", team: "STK", pos: "DEF", points: 147 }, { rank: 20, name: "D.Berbatov", team: "MUN", pos: "FWD", points: 146 }
    ],
    "2011/12": [
        { rank: 1, name: "Van Persie", team: "ARS", pos: "FWD", points: 269 }, { rank: 2, name: "W.Rooney", team: "MUN", pos: "FWD", points: 230 }, { rank: 3, name: "C.Dempsey", team: "FUL", pos: "MID", points: 209 }, { rank: 4, name: "S.Aguero", team: "MCI", pos: "FWD", points: 195 }, { rank: 5, name: "D.Silva", team: "MCI", pos: "MID", points: 184 }, { rank: 6, name: "V.Kompany", team: "MCI", pos: "DEF", points: 170 }, { rank: 7, name: "G.Bale", team: "TOT", pos: "MID", points: 168 }, { rank: 8, name: "E.Adebayor", team: "TOT", pos: "FWD", points: 165 }, { rank: 9, name: "J.Hart", team: "MCI", pos: "GKP", points: 164 }, { rank: 10, name: "A.Valencia", team: "MUN", pos: "MID", points: 158 },
        { rank: 11, name: "J.Lescott", team: "MCI", pos: "DEF", points: 156 }, { rank: 12, name: "G.Sigurdsson", team: "SWA", pos: "MID", points: 154 }, { rank: 13, name: "N.Vorm", team: "SWA", pos: "GKP", points: 154 }, { rank: 14, name: "J.Mata", team: "CHE", pos: "MID", points: 153 }, { rank: 15, name: "S.Sessegnon", team: "SUN", pos: "MID", points: 150 }, { rank: 16, name: "T.Krul", team: "NEW", pos: "GKP", points: 149 }, { rank: 17, name: "B.Friedel", team: "TOT", pos: "GKP", points: 148 }, { rank: 18, name: "K.Walker", team: "TOT", pos: "DEF", points: 145 }, { rank: 19, name: "F.Lampard", team: "CHE", pos: "MID", points: 144 }, { rank: 20, name: "D.Sturridge", team: "CHE", pos: "FWD", points: 142 }
    ],
    "2012/13": [
        { rank: 1, name: "Van Persie", team: "MUN", pos: "FWD", points: 262 }, { rank: 2, name: "G.Bale", team: "TOT", pos: "MID", points: 249 }, { rank: 3, name: "J.Mata", team: "CHE", pos: "MID", points: 212 }, { rank: 4, name: "T.Walcott", team: "ARS", pos: "MID", points: 194 }, { rank: 5, name: "S.Cazorla", team: "ARS", pos: "MID", points: 191 }, { rank: 6, name: "L.Suarez", team: "LIV", pos: "FWD", points: 188 }, { rank: 7, name: "M.Fellaini", team: "EVE", pos: "MID", points: 182 }, { rank: 8, name: "C.Benteke", team: "AVL", pos: "FWD", points: 180 }, { rank: 9, name: "S.Michu", team: "SWA", pos: "MID", points: 178 }, { rank: 10, name: "E.Hazard", team: "CHE", pos: "MID", points: 175 },
        { rank: 11, name: "L.Baines", team: "EVE", pos: "DEF", points: 170 }, { rank: 12, name: "R.Lambert", team: "SOU", pos: "FWD", points: 168 }, { rank: 13, name: "S.Gerrard", team: "LIV", pos: "MID", points: 165 }, { rank: 14, name: "R.Lukaku", team: "WBA", pos: "FWD", points: 162 }, { rank: 15, name: "D.Silva", team: "MCI", pos: "MID", points: 161 }, { rank: 16, name: "C.Tevez", team: "MCI", pos: "FWD", points: 159 }, { rank: 17, name: "P.Evra", team: "MUN", pos: "DEF", points: 155 }, { rank: 18, name: "B.Ivanovic", team: "CHE", pos: "DEF", points: 153 }, { rank: 19, name: "J.Hart", team: "MCI", pos: "GKP", points: 152 }, { rank: 20, name: "S.Mignolet", team: "SUN", pos: "GKP", points: 150 }
    ],
    "2013/14": [
        { rank: 1, name: "L.Suarez", team: "LIV", pos: "FWD", points: 295 }, { rank: 2, name: "Y.Toure", team: "MCI", pos: "MID", points: 241 }, { rank: 3, name: "S.Gerrard", team: "LIV", pos: "MID", points: 205 }, { rank: 4, name: "E.Hazard", team: "CHE", pos: "MID", points: 202 }, { rank: 5, name: "W.Rooney", team: "MUN", pos: "FWD", points: 198 }, { rank: 6, name: "A.Ramsey", team: "ARS", pos: "MID", points: 191 }, { rank: 7, name: "D.Sturridge", team: "LIV", pos: "FWD", points: 197 }, { rank: 8, name: "S.Coleman", team: "EVE", pos: "DEF", points: 180 }, { rank: 9, name: "O.Giroud", team: "ARS", pos: "FWD", points: 187 }, { rank: 10, name: "A.Lallana", team: "SOU", pos: "MID", points: 179 },
        { rank: 11, name: "J.Rodriguez", team: "SOU", pos: "FWD", points: 174 }, { rank: 12, name: "R.Lukaku", team: "EVE", pos: "FWD", points: 171 }, { rank: 13, name: "S.Mignolet", team: "LIV", pos: "GKP", points: 170 }, { rank: 14, name: "T.Howard", team: "EVE", pos: "GKP", points: 169 }, { rank: 15, name: "P.Cech", team: "CHE", pos: "GKP", points: 168 }, { rank: 16, name: "J.Terry", team: "CHE", pos: "DEF", points: 166 }, { rank: 17, name: "B.Ivanovic", team: "CHE", pos: "DEF", points: 164 }, { rank: 18, name: "L.Baines", team: "EVE", pos: "DEF", points: 162 }, { rank: 19, name: "W.Szczesny", team: "ARS", pos: "GKP", points: 160 }, { rank: 20, name: "E.Dzeko", team: "MCI", pos: "FWD", points: 160 }
    ],
    "2014/15": [
        { rank: 1, name: "E.Hazard", team: "CHE", pos: "MID", points: 233 }, { rank: 2, name: "S.Aguero", team: "MCI", pos: "FWD", points: 216 }, { rank: 3, name: "A.Sanchez", team: "ARS", pos: "MID", points: 207 }, { rank: 4, name: "H.Kane", team: "TOT", pos: "FWD", points: 191 }, { rank: 5, name: "D.Silva", team: "MCI", pos: "MID", points: 191 }, { rank: 6, name: "C.Austin", team: "QPR", pos: "FWD", points: 176 }, { rank: 7, name: "J.Terry", team: "CHE", pos: "DEF", points: 177 }, { rank: 8, name: "B.Ivanovic", team: "CHE", pos: "DEF", points: 175 }, { rank: 9, name: "S.Cazorla", team: "ARS", pos: "MID", points: 168 }, { rank: 10, name: "C.Fabregas", team: "CHE", pos: "MID", points: 165 },
        { rank: 11, name: "L.Fabianski", team: "SWA", pos: "GKP", points: 161 }, { rank: 12, name: "D.Costa", team: "CHE", pos: "FWD", points: 160 }, { rank: 13, name: "C.Eriksen", team: "TOT", pos: "MID", points: 158 }, { rank: 14, name: "G.Sigurdsson", team: "SWA", pos: "MID", points: 154 }, { rank: 15, name: "N.Chadli", team: "TOT", pos: "MID", points: 152 }, { rank: 16, name: "R.Sterling", team: "LIV", pos: "MID", points: 151 }, { rank: 17, name: "S.Mignolet", team: "LIV", pos: "GKP", points: 150 }, { rank: 18, name: "O.Giroud", team: "ARS", pos: "FWD", points: 149 }, { rank: 19, name: "D.De Gea", team: "MUN", pos: "GKP", points: 148 }, { rank: 20, name: "G.Pelle", team: "SOU", pos: "FWD", points: 147 }
    ],
    "2015/16": [
        { rank: 1, name: "R.Mahrez", team: "LEI", pos: "MID", points: 240 }, { rank: 2, name: "J.Vardy", team: "LEI", pos: "FWD", points: 211 }, { rank: 3, name: "H.Kane", team: "TOT", pos: "FWD", points: 211 }, { rank: 4, name: "M.Ozil", team: "ARS", pos: "MID", points: 200 }, { rank: 5, name: "S.Aguero", team: "MCI", pos: "FWD", points: 184 }, { rank: 6, name: "O.Ighalo", team: "WAT", pos: "FWD", points: 175 }, { rank: 7, name: "R.Lukaku", team: "EVE", pos: "FWD", points: 174 }, { rank: 8, name: "D.Payet", team: "WHU", pos: "MID", points: 171 }, { rank: 9, name: "C.Eriksen", team: "TOT", pos: "MID", points: 170 }, { rank: 10, name: "D.Alli", team: "TOT", pos: "MID", points: 166 },
        { rank: 11, name: "O.Giroud", team: "ARS", pos: "FWD", points: 163 }, { rank: 12, name: "T.Alderweireld", team: "TOT", pos: "DEF", points: 160 }, { rank: 13, name: "H.Bellerin", team: "ARS", pos: "DEF", points: 158 }, { rank: 14, name: "P.Cech", team: "ARS", pos: "GKP", points: 158 }, { rank: 15, name: "W.Morgan", team: "LEI", pos: "DEF", points: 152 }, { rank: 16, name: "K.Schmeichel", team: "LEI", pos: "GKP", points: 151 }, { rank: 17, name: "G.Sigurdsson", team: "SWA", pos: "MID", points: 150 }, { rank: 18, name: "M.Arnautovic", team: "STK", pos: "MID", points: 149 }, { rank: 19, name: "S.Mane", team: "SOU", pos: "MID", points: 147 }, { rank: 20, name: "C.Fuchs", team: "LEI", pos: "DEF", points: 146 }
    ],
    "2016/17": [
        { rank: 1, name: "A.Sanchez", team: "ARS", pos: "MID", points: 264 }, 
        { rank: 2, name: "D.Alli", team: "TOT", pos: "MID", points: 225 }, 
        { rank: 3, name: "E.Hazard", team: "CHE", pos: "MID", points: 224 }, 
        { rank: 4, name: "H.Kane", team: "TOT", pos: "FWD", points: 224 }, 
        { rank: 5, name: "R.Lukaku", team: "EVE", pos: "FWD", points: 221 }, 
        { rank: 6, name: "C.Eriksen", team: "TOT", pos: "MID", points: 218 },
        { rank: 7, name: "K.De Bruyne", team: "MCI", pos: "MID", points: 199 }, 
        { rank: 8, name: "D.Costa", team: "CHE", pos: "FWD", points: 196 }, 
        { rank: 9, name: "G.Sigurdsson", team: "SWA", pos: "MID", points: 181 }, 
        { rank: 10, name: "R.Firmino", team: "LIV", pos: "FWD", points: 180 },
        { rank: 11, name: "J.King", team: "BOU", pos: "MID", points: 178 },
        { rank: 12, name: "G.Cahill", team: "CHE", pos: "DEF", points: 178 },
        { rank: 13, name: "M.Alonso", team: "CHE", pos: "DEF", points: 177 }, 
        { rank: 14, name: "S.Aguero", team: "MCI", pos: "FWD", points: 175 }, 
        { rank: 15, name: "Heung-Min Son", team: "TOT", pos: "MID", points: 174 },
        { rank: 16, name: "P.Coutinho", team: "LIV", pos: "MID", points: 171 }, 
        { rank: 17, name: "C.Azpilicueta", team: "CHE", pos: "DEF", points: 170 }, 
        { rank: 18, name: "C.Benteke", team: "CRY", pos: "FWD", points: 170 }, 
        { rank: 19, name: "S.Mane", team: "LIV", pos: "MID", points: 168 }, 
        { rank: 20, name: "T.Heaton", team: "BUR", pos: "GKP", points: 149 }
    ],
    "2017/18": [
        { rank: 1, name: "M.Salah", team: "LIV", pos: "MID", points: 303 }, { rank: 2, name: "R.Sterling", team: "MCI", pos: "MID", points: 229 }, { rank: 3, name: "H.Kane", team: "TOT", pos: "FWD", points: 217 }, { rank: 4, name: "K.De Bruyne", team: "MCI", pos: "MID", points: 209 }, { rank: 5, name: "C.Eriksen", team: "TOT", pos: "MID", points: 199 }, { rank: 6, name: "R.Mahrez", team: "LEI", pos: "MID", points: 195 }, { rank: 7, name: "J.Vardy", team: "LEI", pos: "FWD", points: 183 }, { rank: 8, name: "R.Firmino", team: "LIV", pos: "FWD", points: 181 }, { rank: 9, name: "L.Sane", team: "MCI", pos: "MID", points: 179 }, { rank: 10, name: "Heung-Min Son", team: "TOT", pos: "MID", points: 178 },
        { rank: 11, name: "C.Azpilicueta", team: "CHE", pos: "DEF", points: 175 }, { rank: 12, name: "E.Hazard", team: "CHE", pos: "MID", points: 173 }, { rank: 13, name: "D.De Gea", team: "MUN", pos: "GKP", points: 172 }, { rank: 14, name: "S.Aguero", team: "MCI", pos: "FWD", points: 169 }, { rank: 15, name: "D.Silva", team: "MCI", pos: "MID", points: 169 }, { rank: 16, name: "M.Alonso", team: "CHE", pos: "DEF", points: 165 }, { rank: 17, name: "P.Gross", team: "BHA", pos: "MID", points: 164 }, { rank: 18, name: "Lukaku", team: "MUN", pos: "FWD", points: 162 }, { rank: 19, name: "Ederson", team: "MCI", pos: "GKP", points: 158 }, { rank: 20, name: "N.Otamendi", team: "MCI", pos: "DEF", points: 156 }
    ],
    "2018/19": [
        { rank: 1, name: "M.Salah", team: "LIV", pos: "MID", points: 259 }, { rank: 2, name: "E.Hazard", team: "CHE", pos: "MID", points: 238 }, { rank: 3, name: "R.Sterling", team: "MCI", pos: "MID", points: 234 }, { rank: 4, name: "S.Mane", team: "LIV", pos: "MID", points: 231 }, { rank: 5, name: "A.Robertson", team: "LIV", pos: "DEF", points: 213 }, { rank: 6, name: "V.Van Dijk", team: "LIV", pos: "DEF", points: 208 }, { rank: 7, name: "P.Aubameyang", team: "ARS", pos: "FWD", points: 205 }, { rank: 8, name: "S.Aguero", team: "MCI", pos: "FWD", points: 201 }, { rank: 9, name: "T.Alexander-Arnold", team: "LIV", pos: "DEF", points: 185 }, { rank: 10, name: "G.Sigurdsson", team: "EVE", pos: "MID", points: 182 },
        { rank: 11, name: "R.Fraser", team: "BOU", pos: "MID", points: 181 }, { rank: 12, name: "R.Jimenez", team: "WOL", pos: "FWD", points: 181 }, { rank: 13, name: "P.Pogba", team: "MUN", pos: "MID", points: 179 }, { rank: 14, name: "A.Laporte", team: "MCI", pos: "DEF", points: 177 }, { rank: 15, name: "Alisson", team: "LIV", pos: "GKP", points: 176 }, { rank: 16, name: "J.Vardy", team: "LEI", pos: "FWD", points: 174 }, { rank: 17, name: "Ederson", team: "MCI", pos: "GKP", points: 169 }, { rank: 18, name: "C.Wilson", team: "BOU", pos: "FWD", points: 168 }, { rank: 19, name: "L.Milivojevic", team: "CRY", pos: "MID", points: 166 }, { rank: 20, name: "David Luiz", team: "CHE", pos: "DEF", points: 164 }
    ],
    "2019/20": [
        { rank: 1, name: "K.De Bruyne", team: "MCI", pos: "MID", points: 251 }, { rank: 2, name: "M.Salah", team: "LIV", pos: "MID", points: 233 }, { rank: 3, name: "S.Mane", team: "LIV", pos: "MID", points: 221 }, { rank: 4, name: "T.Alexander-Arnold", team: "LIV", pos: "DEF", points: 210 }, { rank: 5, name: "J.Vardy", team: "LEI", pos: "FWD", points: 210 }, { rank: 6, name: "P.Aubameyang", team: "ARS", pos: "FWD", points: 205 }, { rank: 7, name: "R.Sterling", team: "MCI", pos: "MID", points: 204 }, { rank: 8, name: "A.Martial", team: "MUN", pos: "MID", points: 200 }, { rank: 9, name: "D.Ings", team: "SOU", pos: "FWD", points: 198 }, { rank: 10, name: "Raul Jimenez", team: "WOL", pos: "FWD", points: 194 },
        { rank: 11, name: "A.Robertson", team: "LIV", pos: "DEF", points: 181 }, { rank: 12, name: "V.Van Dijk", team: "LIV", pos: "DEF", points: 178 }, { rank: 13, name: "M.Rashford", team: "MUN", pos: "MID", points: 177 }, { rank: 14, name: "R.Mahrez", team: "MCI", pos: "MID", points: 175 }, { rank: 15, name: "N.Pope", team: "BUR", pos: "GKP", points: 170 }, { rank: 16, name: "Heung-Min Son", team: "TOT", pos: "MID", points: 169 }, { rank: 17, name: "Willian", team: "CHE", pos: "MID", points: 168 }, { rank: 18, name: "Richarlison", team: "EVE", pos: "MID", points: 165 }, { rank: 19, name: "D.Henderson", team: "SHU", pos: "GKP", points: 160 }, { rank: 20, name: "H.Kane", team: "TOT", pos: "FWD", points: 158 }
    ],
    "2020/21": [
        { rank: 1, name: "B.Fernandes", team: "MUN", pos: "MID", points: 244 }, { rank: 2, name: "H.Kane", team: "TOT", pos: "FWD", points: 242 }, { rank: 3, name: "M.Salah", team: "LIV", pos: "MID", points: 231 }, { rank: 4, name: "Heung-Min Son", team: "TOT", pos: "MID", points: 228 }, { rank: 5, name: "P.Bamford", team: "LEE", pos: "FWD", points: 194 }, { rank: 6, name: "J.Vardy", team: "LEI", pos: "FWD", points: 187 }, { rank: 7, name: "E.Martinez", team: "AVL", pos: "GKP", points: 186 }, { rank: 8, name: "S.Mane", team: "LIV", pos: "MID", points: 176 }, { rank: 9, name: "M.Rashford", team: "MUN", pos: "MID", points: 174 }, { rank: 10, name: "S.Dallas", team: "LEE", pos: "DEF", points: 171 },
        { rank: 11, name: "O.Watkins", team: "AVL", pos: "FWD", points: 168 }, { rank: 12, name: "D.Calvert-Lewin", team: "EVE", pos: "FWD", points: 165 }, { rank: 13, name: "A.Robertson", team: "LIV", pos: "DEF", points: 161 }, { rank: 14, name: "T.Alexander-Arnold", team: "LIV", pos: "DEF", points: 160 }, { rank: 15, name: "Ederson", team: "MCI", pos: "GKP", points: 160 }, { rank: 16, name: "I.Gundogan", team: "MCI", pos: "MID", points: 157 }, { rank: 17, name: "I.Meslier", team: "LEE", pos: "GKP", points: 154 }, { rank: 18, name: "A.Cresswell", team: "WHU", pos: "DEF", points: 153 }, { rank: 19, name: "T.Soucek", team: "WHU", pos: "MID", points: 147 }, { rank: 20, name: "R.Sterling", team: "MCI", pos: "MID", points: 154 } 
    ],
    "2021/22": [
        { rank: 1, name: "M.Salah", team: "LIV", pos: "MID", points: 265 }, { rank: 2, name: "Heung-Min Son", team: "TOT", pos: "MID", points: 258 }, { rank: 3, name: "T.Alexander-Arnold", team: "LIV", pos: "DEF", points: 208 }, { rank: 4, name: "J.Bowen", team: "WHU", pos: "MID", points: 206 }, { rank: 5, name: "J.Cancelo", team: "MCI", pos: "DEF", points: 201 }, { rank: 6, name: "K.De Bruyne", team: "MCI", pos: "MID", points: 196 }, { rank: 7, name: "H.Kane", team: "TOT", pos: "FWD", points: 192 }, { rank: 8, name: "A.Robertson", team: "LIV", pos: "DEF", points: 186 }, { rank: 9, name: "S.Mane", team: "LIV", pos: "MID", points: 183 }, { rank: 10, name: "V.Van Dijk", team: "LIV", pos: "DEF", points: 183 },
        { rank: 11, name: "J.Maddison", team: "LEI", pos: "MID", points: 181 }, { rank: 12, name: "B.Saka", team: "ARS", pos: "MID", points: 179 }, { rank: 13, name: "Alisson", team: "LIV", pos: "GKP", points: 176 }, { rank: 14, name: "D.Jota", team: "LIV", pos: "MID", points: 175 }, { rank: 15, name: "Joel Matip", team: "LIV", pos: "DEF", points: 170 }, { rank: 16, name: "Mason Mount", team: "CHE", pos: "MID", points: 169 }, { rank: 17, name: "A.Laporte", team: "MCI", pos: "DEF", points: 160 }, { rank: 18, name: "C.Ronaldo", team: "MUN", pos: "FWD", points: 159 }, { rank: 19, name: "H.Lloris", team: "TOT", pos: "GKP", points: 158 }, { rank: 20, name: "Ederson", team: "MCI", pos: "GKP", points: 155 }
    ],
    "2022/23": [
        { rank: 1, name: "E.Haaland", team: "MCI", pos: "FWD", points: 272 }, { rank: 2, name: "H.Kane", team: "TOT", pos: "FWD", points: 263 }, { rank: 3, name: "M.Salah", team: "LIV", pos: "MID", points: 239 }, { rank: 4, name: "M.Odegaard", team: "ARS", pos: "MID", points: 212 }, { rank: 5, name: "M.Rashford", team: "MUN", pos: "MID", points: 205 }, { rank: 6, name: "B.Saka", team: "ARS", pos: "MID", points: 202 }, { rank: 7, name: "G.Martinelli", team: "ARS", pos: "MID", points: 198 }, { rank: 8, name: "K.Trippier", team: "NEW", pos: "DEF", points: 198 }, { rank: 9, name: "K.De Bruyne", team: "MCI", pos: "MID", points: 183 }, { rank: 10, name: "I.Toney", team: "BRE", pos: "FWD", points: 182 },
        { rank: 11, name: "B.Fernandes", team: "MUN", pos: "MID", points: 176 }, { rank: 12, name: "O.Watkins", team: "AVL", pos: "FWD", points: 175 }, { rank: 13, name: "D.Raya", team: "BRE", pos: "GKP", points: 166 }, { rank: 14, name: "Alisson", team: "LIV", pos: "GKP", points: 162 }, { rank: 15, name: "E.Eze", team: "CRY", pos: "MID", points: 159 }, { rank: 16, name: "P.Gross", team: "BHA", pos: "MID", points: 159 }, { rank: 17, name: "T.Almiron", team: "NEW", pos: "MID", points: 158 }, { rank: 18, name: "T.Alexander-Arnold", team: "LIV", pos: "DEF", points: 156 }, { rank: 19, name: "B.White", team: "ARS", pos: "DEF", points: 156 }, { rank: 20, name: "J.Pope", team: "NEW", pos: "GKP", points: 157 }
    ],
    "2023/24": [
        { rank: 1, name: "C.Palmer", team: "CHE", pos: "MID", points: 244 }, { rank: 2, name: "P.Foden", team: "MCI", pos: "MID", points: 230 }, { rank: 3, name: "O.Watkins", team: "AVL", pos: "FWD", points: 228 }, { rank: 4, name: "B.Saka", team: "ARS", pos: "MID", points: 226 }, { rank: 5, name: "E.Haaland", team: "MCI", pos: "FWD", points: 217 }, { rank: 6, name: "Son", team: "TOT", pos: "MID", points: 213 }, { rank: 7, name: "M.Salah", team: "LIV", pos: "MID", points: 211 }, { rank: 8, name: "Gordon", team: "NEW", pos: "MID", points: 183 }, { rank: 9, name: "Bowen", team: "WHU", pos: "MID", points: 182 }, { rank: 10, name: "White", team: "ARS", pos: "DEF", points: 182 },
        { rank: 11, name: "Havertz", team: "ARS", pos: "MID", points: 180 }, { rank: 12, name: "Solanke", team: "BOU", pos: "FWD", points: 175 }, { rank: 13, name: "A.Isak", team: "NEW", pos: "FWD", points: 172 }, { rank: 14, name: "Douglas Luiz", team: "AVL", pos: "MID", points: 171 }, { rank: 15, name: "B.Fernandes", team: "MUN", pos: "MID", points: 166 }, { rank: 16, name: "Mateta", team: "CRY", pos: "FWD", points: 165 }, { rank: 17, name: "Saliba", team: "ARS", pos: "DEF", points: 164 }, { rank: 18, name: "J.Alvarez", team: "MCI", pos: "FWD", points: 158 }, { rank: 19, name: "Pickford", team: "EVE", pos: "GKP", points: 153 }, { rank: 20, name: "G.Gabriel", team: "ARS", pos: "DEF", points: 149 }
    ],
    "2024/25": [
        { rank: 1, name: "M.Salah", team: "LIV", pos: "MID", points: 344 }, { rank: 2, name: "B.Mbeumo", team: "BRE", pos: "MID", points: 236 }, { rank: 3, name: "C.Palmer", team: "CHE", pos: "MID", points: 214 }, { rank: 4, name: "A.Isak", team: "NEW", pos: "FWD", points: 211 }, { rank: 5, name: "C.Wood", team: "NFO", pos: "FWD", points: 200 }, { rank: 6, name: "E.Haaland", team: "MCI", pos: "FWD", points: 198 }, { rank: 7, name: "B.Saka", team: "ARS", pos: "MID", points: 195 }, { rank: 8, name: "L.Diaz", team: "LIV", pos: "MID", points: 188 }, { rank: 9, name: "N.Jackson", team: "CHE", pos: "FWD", points: 185 }, { rank: 10, name: "O.Watkins", team: "AVL", pos: "FWD", points: 182 },
        { rank: 11, name: "K.Havertz", team: "ARS", pos: "FWD", points: 180 }, { rank: 12, name: "D.Jota", team: "LIV", pos: "MID", points: 175 }, { rank: 13, name: "Son", team: "TOT", pos: "MID", points: 172 }, { rank: 14, name: "J.Bowen", team: "WHU", pos: "MID", points: 170 }, { rank: 15, name: "A.Gordon", team: "NEW", pos: "MID", points: 168 }, { rank: 16, name: "G.Gvardiol", team: "MCI", pos: "DEF", points: 165 }, { rank: 17, name: "Pedro Porro", team: "TOT", pos: "DEF", points: 162 }, { rank: 18, name: "Gabriel", team: "ARS", pos: "DEF", points: 160 }, { rank: 19, name: "D.Raya", team: "ARS", pos: "GKP", points: 158 }, { rank: 20, name: "Alisson", team: "LIV", pos: "GKP", points: 155 }
    ]
};

const plTeamLogos = {
  "ARS": "https://resources.premierleague.com/premierleague/badges/50/t3.png",
  "AVL": "https://resources.premierleague.com/premierleague/badges/50/t7.png",
  "BOU": "https://resources.premierleague.com/premierleague/badges/50/t91.png",
  "BRE": "https://resources.premierleague.com/premierleague/badges/50/t94.png",
  "BHA": "https://resources.premierleague.com/premierleague/badges/50/t36.png",
  "BUR": "https://resources.premierleague.com/premierleague/badges/50/t90.png",
  "CHE": "https://resources.premierleague.com/premierleague/badges/50/t8.png",
  "CRY": "https://resources.premierleague.com/premierleague/badges/50/t31.png",
  "EVE": "https://resources.premierleague.com/premierleague/badges/50/t11.png",
  "FUL": "https://resources.premierleague.com/premierleague/badges/50/t54.png",
  "LEE": "https://resources.premierleague.com/premierleague/badges/50/t2.png",
  "LEI": "https://resources.premierleague.com/premierleague/badges/50/t13.png",
  "LIV": "https://resources.premierleague.com/premierleague/badges/50/t14.png",
  "MCI": "https://resources.premierleague.com/premierleague/badges/50/t43.png",
  "MUN": "https://resources.premierleague.com/premierleague/badges/50/t1.png",
  "NEW": "https://resources.premierleague.com/premierleague/badges/50/t4.png",
  "NFO": "https://resources.premierleague.com/premierleague/badges/50/t17.png",
  "SHU": "https://resources.premierleague.com/premierleague/badges/50/t49.png",
  "SOU": "https://resources.premierleague.com/premierleague/badges/50/t20.png",
  "TOT": "https://resources.premierleague.com/premierleague/badges/50/t6.png",
  "WAT": "https://resources.premierleague.com/premierleague/badges/50/t57.png",
  "WBA": "https://resources.premierleague.com/premierleague/badges/50/t35.png",
  "WHU": "https://resources.premierleague.com/premierleague/badges/50/t21.png",
  "WOL": "https://resources.premierleague.com/premierleague/badges/50/t39.png",
  "QPR": "https://resources.premierleague.com/premierleague/badges/50/t52.png",
  "SWA": "https://resources.premierleague.com/premierleague/badges/50/t80.png",
  "STK": "https://resources.premierleague.com/premierleague/badges/50/t110.png",
  "BLP": "https://resources.premierleague.com/premierleague/badges/50/t55.png"
};

const getPLTeamLogo = (teamCode) => {
    return plTeamLogos[teamCode] || "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg";
};

// 포지션별 색상 및 아이콘
const getPositionStyle = (pos) => {
    switch (pos) {
        case 'GKP': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', label: 'GK' };
        case 'DEF': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'DF' };
        case 'MID': return { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', label: 'MF' };
        case 'FWD': return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', label: 'FW' };
        default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: pos };
    }
};

const clubMapping = {
  "임우람": { name: "AC Milan", color: "#fb090b", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  "장용석": { name: "Manchester City", color: "#6caddf", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  "전민호": { name: "Arsenal FC", color: "#ef0107", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  "정세현": { name: "Liverpool FC", color: "#c8102e", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  "정재훈": { name: "Paris Saint-Germain", color: "#004170", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  "정창영": { name: "Chelsea FC", color: "#034694", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  "천영석": { name: "Tottenham Hotspur", color: "#132257", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", bg: "white" },
  "한지상": { name: "San Antonio Spurs", color: "#000000", logo: "https://i.namu.wiki/i/jXW27nYvH6FGFt1S2J1s0esALy93M3owCOQ5QNcR8FCYuGceYCncYGUciG0DMEsTpfm1dH2MyL5egcbks0yVmw.svg", bg: "white" },
  "장재윤": { name: "Scuderia Ferrari HP", color: "#ef1a2d", logo: "https://i.namu.wiki/i/ElOImHWWpTsx6WNKEMOVq8HoK5_x74fkiJL5TybVZtQU5ci4lfJ-e9kNf6dTMIEYrWymQoyvkPryyZKjovM1fzSX_wGwiarKr33I9akSu_G4N7ChQUVdooW0ISEFyF4zSBJU0ZGcbonWlWtDa-LHBw.svg", bg: "white" },
  "하원석": { name: "Chung-Ang Univ", color: "#21409A", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/CAU_emblem.png", bg: "white" },
  "정용우": { name: "SSC Napoli", color: "#003E99", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/SSC_Napoli_2025_%28white_and_azure%29.svg" },
  "이지용": { name: "Phoenix Suns", color: "#1D1160", logo: "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg" },
  "한상진": { name: "Germany", color: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg" },
  "default": { name: "Premier League", color: "#3d195b", logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" }
};

const getClub = (name) => clubMapping[name] || clubMapping.default;

const ClubLogo = ({ name, size = "w-6 h-6" }) => {
  const club = getClub(name);
  return (
    <img src={club.logo} alt={name} className={`${size} object-contain rounded-md`} style={{ backgroundColor: club.bg || 'transparent' }} onError={(e) => { e.currentTarget.src = clubMapping.default.logo; e.currentTarget.onerror = null; }} />
  );
};

// 백분위에 따른 색상 및 스타일 계산 (구간별 명확한 구분)
const getPercentileColor = (percentile) => {
    if (percentile === null || percentile === undefined) return { backgroundColor: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0' };
    
    // 백분위는 작을수록 좋음 (Top 1%, 5% 등)
    let hue, saturation, lightness, alpha, fontWeight, boxShadow;
    
    if (percentile <= 1) { // Top 1% (Deep Teal/Emerald - 진한 청록)
        hue = 170; saturation = 95; lightness = 30; alpha = 0.25; fontWeight = '950'; boxShadow = '0 0 8px rgba(5, 150, 105, 0.4)';
    } else if (percentile <= 5) { // Top 5% (Green - 초록)
        hue = 145; saturation = 80; lightness = 40; alpha = 0.2; fontWeight = '900';
    } else if (percentile <= 10) { // Top 10% (Light Green - 연두)
        hue = 100; saturation = 85; lightness = 45; alpha = 0.15; fontWeight = '800';
    } else if (percentile <= 25) { // Top 25% (Yellow - 노랑)
        hue = 55; saturation = 90; lightness = 50; alpha = 0.15; fontWeight = '700';
    } else if (percentile <= 50) { // Top 50% (Orange - 주황)
        hue = 30; saturation = 95; lightness = 60; alpha = 0.1; fontWeight = '600';
    } else { // 그 외 (Red - 빨강)
        hue = 0; saturation = 85; lightness = 65; alpha = 0.05; fontWeight = '500';
    }
    
    return { 
        backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`, 
        color: `hsl(${hue}, ${saturation}%, ${Math.max(20, lightness - 20)}%)`, 
        borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`, 
        fontWeight,
        boxShadow: boxShadow || 'none'
    };
};

// 테이블 배경용 색상 (좀 더 진하게 표시)
const getPercentileColorFullRange = (percentile) => {
    if (percentile === null || percentile === undefined) return { backgroundColor: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0' };
    
    let hue, saturation, lightness, alpha;
    
    if (percentile <= 1) { 
        hue = 170; saturation = 85; lightness = 90; alpha = 0.9; // 진한 청록
    } else if (percentile <= 5) { 
        hue = 145; saturation = 80; lightness = 92; alpha = 0.85; // 초록
    } else if (percentile <= 10) { 
        hue = 100; saturation = 80; lightness = 94; alpha = 0.8; // 연두
    } else if (percentile <= 25) { 
        hue = 55; saturation = 90; lightness = 95; alpha = 0.8; // 노랑
    } else if (percentile <= 50) { 
        hue = 30; saturation = 95; lightness = 96; alpha = 0.7; // 주황
    } else { 
        hue = 0; saturation = 90; lightness = 97; alpha = 0.6; // 빨강
    }
    
    return { 
        backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`, 
        color: `hsl(${hue}, 90%, 30%)`,
        borderColor: `hsla(${hue}, 85%, 80%, 1)`
    };
};

const getLeagueRankColorStyle = (rank, total = 13) => {
  if (rank === 1) return { backgroundColor: '#fbbf24', color: '#ffffff', fontWeight: '900', boxShadow: '0 2px 4px rgba(251, 191, 36, 0.4)', border: 'none' };
  if (typeof rank !== 'number' || rank < 1) return { backgroundColor: '#f1f5f9', color: '#94a3b8' };
  const maxIndex = Math.max(total - 1, 1); const currentIndex = rank - 2; const ratio = Math.min(Math.max(currentIndex / maxIndex, 0), 1); const hue = 140 - (ratio * 140); 
  return { backgroundColor: `hsla(${hue}, 80%, 45%, 0.1)`, color: `hsl(${hue}, 80%, 35%)`, borderColor: `hsla(${hue}, 80%, 45%, 0.3)`, fontWeight: '800', borderWidth: '1px' };
};

const App = () => {
  const [activeTab, setActiveTab] = useState('winners');
  const [trendHighlightedUsers, setTrendHighlightedUsers] = useState([]); // 트렌드 탭용 하이라이트
  const [rankHighlightedUsers, setRankHighlightedUsers] = useState([]);   // 리그 순위 탭용 하이라이트
  const [dataVisibleColumns, setDataVisibleColumns] = useState([...PLAYERS, 'Total Players']); // 전체 데이터 탭용 열 필터
  const [modalPlayer, setModalPlayer] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]); 
  const [selectedSeasonPlayer, setSelectedSeasonPlayer] = useState(null);
  
  const [rawData, setRawData] = useState(POINTS_DATA);
  const [rankData, setRankData] = useState(RANK_DATA);
  const [playersList, setPlayersList] = useState(PLAYERS);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const rankTrendScrollRef = useRef(null);
  const dataScrollRef = useRef(null);
  const fplLegendsScrollRef = useRef(null);

  const useDragScroll = (ref) => {
    useEffect(() => {
      const slider = ref.current;
      if (!slider) return;
      let isDown = false; let startX; let scrollLeft;
      const onMouseDown = (e) => { isDown = true; slider.style.cursor = 'grabbing'; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; };
      const onMouseLeave = () => { isDown = false; slider.style.cursor = 'grab'; };
      const onMouseUp = () => { isDown = false; slider.style.cursor = 'grab'; };
      const onMouseMove = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk; };
      slider.style.cursor = 'grab'; slider.addEventListener('mousedown', onMouseDown); slider.addEventListener('mouseleave', onMouseLeave); slider.addEventListener('mouseup', onMouseUp); slider.addEventListener('mousemove', onMouseMove);
      return () => { slider.removeEventListener('mousedown', onMouseDown); slider.removeEventListener('mouseleave', onMouseLeave); slider.removeEventListener('mouseup', onMouseUp); slider.removeEventListener('mousemove', onMouseMove); };
    }, [ref, activeTab, isLoading]);
  };
  useDragScroll(rankTrendScrollRef);
  useDragScroll(dataScrollRef);
  useDragScroll(fplLegendsScrollRef);

  const calculatePercentile = (rank, total) => {
    if (!rank || !total) return null;
    return (rank / total) * 100;
  };

  const toggleTrendHighlightUser = (name) => setTrendHighlightedUsers(prev => prev.includes(name) ? prev.filter(u => u !== name) : [...prev, name]);
  const toggleRankHighlightUser = (name) => setRankHighlightedUsers(prev => prev.includes(name) ? prev.filter(u => u !== name) : [...prev, name]);
  
  // 전체 데이터 탭용 컬럼 선택 로직 수정 (요청 반영)
  const toggleDataVisibleColumn = (name) => {
      // 현재 모든 플레이어가 선택되어 있는지 확인 (Total Players 제외)
      const allPlayersVisible = playersList.every(p => dataVisibleColumns.includes(p));

      if (allPlayersVisible) {
          // 모든 플레이어가 보일 때 한 명을 클릭하면 -> 그 사람만 남기고 나머지 플레이어 숨김 (Isolate)
          // Total Players 열이 켜져있었다면 유지
          const isTotalVisible = dataVisibleColumns.includes('Total Players');
          const newCols = [name];
          if(isTotalVisible) newCols.push('Total Players');
          setDataVisibleColumns(newCols);
      } else {
          // 일부만 보일 때 -> 토글 동작 (추가/제거)
          setDataVisibleColumns(prev => {
              if (prev.includes(name)) {
                  // 제거
                  return prev.filter(c => c !== name);
              } else {
                  // 추가
                  return [...prev, name];
              }
          });
      }
  };

  // 전체 데이터 탭 리셋 함수
  const resetDataVisibleColumns = () => {
      setDataVisibleColumns([...PLAYERS, 'Total Players']);
  };

  const seasonStats = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    return rawData.map(d => {
      const scores = playersList.map(p => ({ name: p, score: d[p] })).filter(x => typeof x.score === 'number').sort((a, b) => b.score - a.score);
      if (scores.length === 0) return null;
      
      const winner = scores[0]; 
      const rankRow = rankData.find(r => r.season === d.season); 
      const winnerRank = rankRow ? rankRow[winner.name] : null;
      const totalPlayers = rankRow ? rankRow.total_players : null;
      
      const leagueRanks = {}; 
      const sortedPlayers = []; 
      scores.forEach((s, idx) => { leagueRanks[s.name] = idx + 1; sortedPlayers[idx] = s.name; });
      
      return { 
          season: d.season, 
          winner: winner.name, 
          score: winner.score, 
          worldRank: typeof winnerRank === 'number' ? `#${winnerRank.toLocaleString()}` : "N/A", 
          rawWorldRank: winnerRank,
          totalPlayers,
          percentile: calculatePercentile(winnerRank, totalPlayers),
          leagueRanks, 
          sortedPlayers, 
          totalParticipants: scores.length 
      };
    }).filter(x => x !== null);
  }, [rawData, rankData, playersList]);

  const allTimeRecords = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    const records = []; 
    rawData.forEach(seasonData => { 
        playersList.forEach(player => { 
            const score = seasonData[player]; 
            const rankRow = rankData.find(r => r.season === seasonData.season); 
            const rank = rankRow ? rankRow[player] : null; 
            const totalPlayers = rankRow ? rankRow.total_players : null;
            if (typeof score === 'number') {
                records.push({ 
                    name: player, 
                    season: seasonData.season, 
                    score, 
                    rank, 
                    totalPlayers,
                    percentile: calculatePercentile(rank, totalPlayers)
                }); 
            }
        }); 
    }); 
    return records;
  }, [rawData, rankData, playersList]);

  const top10AllTimeScores = useMemo(() => [...allTimeRecords].sort((a, b) => b.score - a.score).slice(0, 10), [allTimeRecords]);
  const top10AllTimePercentiles = useMemo(() => [...allTimeRecords].filter(r => r.percentile !== null).sort((a, b) => a.percentile - b.percentile).slice(0, 10), [allTimeRecords]);
  
  const playerHonors = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    return playersList.map(name => {
      const scores = rawData.map(d => d[name]).filter(s => typeof s === 'number');
      const wins = seasonStats.filter(s => s.winner === name).length;
      const participationCount = scores.length;
      const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
      const maxScoreSeason = scores.length > 0 ? (rawData.find(d => d[name] === maxScore)?.season || '-') : '-';
      
      const playerRanks = rankData.map(d => ({ 
          season: d.season, 
          rank: d[name], 
          total: d.total_players,
          percentile: calculatePercentile(d[name], d.total_players)
      })).filter(r => typeof r.rank === 'number');
      
      const bestRankObj = playerRanks.sort((a, b) => a.rank - b.rank)[0];
      const bestPercentileObj = playerRanks.sort((a, b) => a.percentile - b.percentile)[0];
      
      return { 
          name, 
          wins, 
          maxScore, 
          maxScoreSeason, 
          bestRank: bestRankObj?.rank || null, 
          bestRankSeason: bestRankObj?.season || '-', 
          bestPercentile: bestPercentileObj?.percentile || null,
          bestPercentileSeason: bestPercentileObj?.season || '-',
          winningSeasons: seasonStats.filter(s => s.winner === name).map(s => s.season).sort(), 
          participationCount 
      };
    }).filter(p => p.maxScore > 0).sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (a.bestPercentile || 100) - (b.bestPercentile || 100);
    });
  }, [seasonStats, rawData, rankData, playersList]);

  const top10Wins = useMemo(() => [...playerHonors].filter(p => p.wins > 0).sort((a, b) => b.wins - a.wins).slice(0, 10), [playerHonors]);

  const isWinningSeason = (player, season) => {
      const seasonStat = seasonStats.find(s => s.season === season);
      return seasonStat && seasonStat.winner === player;
  };

  const CustomTooltip = ({ active, payload, label, type }) => { 
      if (active && payload && payload.length) { 
          const currentSeasonStats = seasonStats.find(s => s.season === label); 
          const currentRankRow = rankData.find(r => r.season === label);
          const totalPlayers = currentRankRow?.total_players;
          
          const sortedPayload = [...payload].sort((a, b) => { 
              if (type === 'percentile' || type === 'worldRank' || type === 'rank') return a.value - b.value; 
              return b.value - a.value; 
          }); 
          
          return ( 
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[200px]"> 
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p> 
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border">
                        <Users size={10} /> {totalPlayers?.toLocaleString()}
                    </div>
                </div>
                <div className="space-y-2"> 
                    {sortedPayload.map((entry, index) => { 
                        const leagueRank = currentSeasonStats?.leagueRanks[entry.name]; 
                        const displayVal = entry.value.toLocaleString(); 
                        const formattedVal = (type === 'worldRank' || type === 'rank') ? `#${displayVal}` : (type === 'percentile' ? `Top ${entry.value.toFixed(2)}%` : displayVal); 
                        
                        // Calculate percentile for all types to apply color
                        const percentile = calculatePercentile(currentRankRow?.[entry.name], totalPlayers);
                        
                        const pStyle = getPercentileColor(percentile);
                        const leagueRankStyle = getLeagueRankColorStyle(leagueRank, currentSeasonStats?.totalParticipants || 13); 
                        
                        return ( 
                          <div key={index} className="flex flex-col gap-0.5">
                              <div className="flex items-center justify-between gap-4"> 
                                <div className="flex items-center gap-2"> 
                                  <span className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-transparent" style={{ backgroundColor: leagueRankStyle.backgroundColor, color: leagueRankStyle.color, borderColor: leagueRankStyle.borderColor }}> {leagueRank} </span> 
                                  <ClubLogo name={entry.name} size="w-4 h-4" /> 
                                  <span className="text-xs font-bold text-slate-700" style={{ color: entry.stroke }}>{entry.name}</span> 
                                </div> 
                                {/* Apply style to all types where we want visualization color */}
                                <span className="text-xs font-black text-slate-900 px-1.5 rounded-md" style={{ backgroundColor: pStyle.backgroundColor, color: pStyle.color }}> 
                                  {formattedVal} 
                                </span> 
                              </div> 
                          </div> 
                        ); 
                    })} 
                </div> 
            </div> 
          ); 
      } 
      return null; 
  };

  const ChartCustomDot = (props) => { 
      const { cx, cy, payload, dataKey, stroke } = props; 
      if (!cx || !cy || !payload || !dataKey) return null; 
      
      const isFocused = trendHighlightedUsers.length === 0 || trendHighlightedUsers.includes(dataKey); 
      if (!isFocused) return null; 
      if (typeof payload[dataKey] !== 'number') return null; 

      const isWinner = isWinningSeason(dataKey, payload.season);

      return ( 
        <g> 
            {isWinner && ( 
                <foreignObject x={cx - 10} y={cy - 28} width="20" height="20"> 
                    <Crown size={18} fill="#FFD700" color="#B8860B" /> 
                </foreignObject> 
            )} 
            <circle cx={cx} cy={cy} r={isWinner ? 5 : 3} fill={stroke} stroke="#fff" strokeWidth={2} /> 
        </g> 
      ); 
  };
  
  const RenderModal = () => { 
      if (!modalPlayer) return null; 
      const playerRecord = rawData.map(d => { 
          const seasonInfo = seasonStats.find(s => s.season === d.season); 
          const score = d[modalPlayer.name]; 
          const leagueRank = seasonInfo?.leagueRanks[modalPlayer.name]; 
          const rankRow = rankData.find(r => r.season === d.season); 
          const worldRank = rankRow ? rankRow[modalPlayer.name] : null; 
          const totalPlayers = rankRow ? rankRow.total_players : null;
          if (score === null || score === undefined) return null; 
          
          const totalParticipants = seasonInfo?.totalParticipants || 13;
          
          return { season: d.season, score, leagueRank, worldRank, percentile: calculatePercentile(worldRank, totalPlayers), totalParticipants }; 
      }).filter(x => x !== null); 

      const stats = playerHonors.find(p => p.name === modalPlayer.name) || {}; 
      const club = getClub(modalPlayer.name); 

      return ( 
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"> 
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalPlayer(null)} /> 
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col"> 
            <div className="bg-[#3d195b] p-8 text-white flex justify-between items-start shrink-0"> 
                <div className="flex items-center gap-5"> 
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md"> <ClubLogo name={modalPlayer.name} size="w-16 h-16" /> </div> 
                    <div> <h3 className="text-2xl font-black italic">{modalPlayer.name}</h3> <p className="text-[#00ff85] font-bold text-xs uppercase tracking-widest mt-1">{club.name}</p> </div> 
                </div> 
                <button onClick={() => setModalPlayer(null)} className="p-2 hover:bg-white/10 rounded-xl transition"> <X size={24} /> </button> 
            </div> 
            <div className="overflow-y-auto p-6 no-scrollbar"> 
                <div className="grid grid-cols-2 gap-3 mb-6"> 
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> 
                        <Trophy size={20} className="mx-auto text-yellow-500 mb-2" /> 
                        <div className="text-xs font-bold text-slate-400 uppercase">Wins</div> 
                        <div className="text-xl font-black text-slate-800 mb-1">{stats.wins}</div>
                         <div className="flex flex-wrap gap-1 justify-center mt-1">
                            {stats.winningSeasons.map(s => <span key={s} className="bg-white border rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-bold">{s}</span>)}
                        </div> 
                    </div> 
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> 
                        <TrendingUp size={20} className="mx-auto text-pink-500 mb-2" /> 
                        <div className="text-xs font-bold text-slate-400 uppercase">Highest Points</div> 
                        <div className="text-xl font-black text-slate-800 mb-1">{stats.maxScore.toLocaleString()}</div> 
                        <div className="bg-white border rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-bold mt-1">{stats.maxScoreSeason}</div>
                    </div> 
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> 
                        <Globe size={20} className="mx-auto text-blue-500 mb-2" /> 
                        <div className="text-xs font-bold text-slate-400 uppercase">Best Rank</div> 
                        <div className="text-2xl font-black text-slate-800 mb-0">#{stats.bestRank?.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">Top {stats.bestPercentile?.toFixed(2)}%</div>
                        <div className="bg-white border rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-bold mt-1">{stats.bestRankSeason}</div>
                    </div> 
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> 
                        <Percent size={20} className="mx-auto text-emerald-500 mb-2" /> 
                        <div className="text-xs font-bold text-slate-400 uppercase">Best Top %</div> 
                        <div className="text-xl font-black text-emerald-600 mb-0">Top {stats.bestPercentile?.toFixed(2)}%</div> 
                        <div className="text-[10px] font-bold text-slate-400 mt-1">#{stats.bestRank?.toLocaleString()}</div>
                        <div className="bg-white border rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-bold mt-1">{stats.bestPercentileSeason}</div>
                    </div> 
                </div> 
                
                {/* 참여 횟수 추가 */}
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Activity size={20} className="text-orange-500" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Participation</span>
                    </div>
                    <div className="text-xl font-black text-slate-800">{stats.participationCount} / {rawData.length}</div>
                </div>

                <div> 
                    <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"> <ListOrdered size={16} className="text-indigo-500"/> Full History </h4> 
                    <div className="space-y-2"> 
                        <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 rounded-xl"> 
                            <span>Season</span> <span className="text-center">Pts</span> <span className="text-center">League</span> <span className="text-right">Global</span> 
                        </div> 
                        {playerRecord.reverse().map((rec, i) => { 
                            const pStyle = getPercentileColor(rec.percentile); 
                            const leagueRankStyle = getLeagueRankColorStyle(rec.leagueRank, rec.totalParticipants); 
                            return ( 
                                <div key={i} className="grid grid-cols-4 items-center bg-white border border-slate-100 p-3 rounded-xl transition hover:border-indigo-200"> 
                                    <span className="text-xs font-black text-slate-500 italic">{rec.season}</span> 
                                    <span className="text-sm font-bold text-slate-700 text-center">{rec.score.toLocaleString()}</span> 
                                    <div className="flex justify-center"> 
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black border border-transparent" style={{ backgroundColor: leagueRankStyle.backgroundColor, color: leagueRankStyle.color, borderColor: leagueRankStyle.borderColor }} > {rec.leagueRank} </span> 
                                    </div> 
                                    <div className="flex flex-col items-end gap-1"> 
                                        <span className="text-[11px] font-black text-slate-800"> #{rec.worldRank?.toLocaleString()} </span> 
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md border" style={{ backgroundColor: pStyle.backgroundColor, color: pStyle.color, borderColor: pStyle.borderColor }}>
                                            Top {rec.percentile?.toFixed(2)}%
                                        </span>
                                    </div> 
                                </div> 
                            )})} 
                    </div> 
                </div> 
            </div> 
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0"> 
                <button onClick={() => setModalPlayer(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest w-full">Close</button> 
            </div> 
          </div> 
        </div> 
      ); 
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /><p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Data...</p></div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4"><X className="w-12 h-12 text-red-500" /><p className="text-lg font-bold text-slate-800">{error}</p><button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Retry</button></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <RenderModal />
      <header className="bg-[#3d195b] text-white p-6 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-lg flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter leading-none text-white uppercase">BAEKDOO FANTASY LEAGUE</h1>
              <p className="text-sm text-[#00ff85] font-bold mt-1 tracking-widest uppercase">History of 15 Seasons</p>
            </div>
          </div>
          <nav className="flex bg-white/10 rounded-2xl p-1 backdrop-blur-sm border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {[{ id: 'winners', label: '역대 우승자', icon: <Medal size={16}/> }, { id: 'honors', label: '명예의 전당', icon: <Star size={16}/> }, { id: 'trend', label: '트렌드 분석', icon: <TrendingUp size={16}/> }, { id: 'rankTrend', label: '리그 순위', icon: <ListOrdered size={16}/> }, { id: 'fplLegends', label: 'FPL 레전드', icon: <Crown size={16}/> }, { id: 'data', label: '전체 데이터', icon: <Users size={16}/> }].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setTrendHighlightedUsers([]); setRankHighlightedUsers([]); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00ff85] text-[#3d195b] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70'}`}>
                {tab.icon} <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {activeTab === 'winners' && (
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-slate-800"><Trophy className="text-yellow-500 w-8 h-8" /> CHAMPIONS WALL</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...seasonStats].reverse().map((win, idx) => {
                const pStyle = getPercentileColor(win.percentile);
                return (
                  <div key={idx} onClick={() => setModalPlayer({ name: win.winner })} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-xl group cursor-pointer">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center p-2 bg-slate-50 rounded-2xl shadow-inner group-hover:bg-white transition-colors">
                      <ClubLogo name={win.winner} size="w-16 h-16" />
                    </div>
                    <p className="text-xs font-black text-slate-400 mb-1 tracking-tighter">{win.season}</p>
                    <p className="text-lg font-black text-slate-900 mb-2 leading-tight">{win.winner}</p>
                    <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
                      <div className="px-2 py-1 rounded-lg text-[10px] font-black w-full flex justify-center items-center gap-1 border shadow-sm transition-all bg-white text-slate-800 border-slate-100 whitespace-nowrap">
                         <Globe size={10} /> 
                         {win.worldRank} 
                         <span className="text-[9px] font-black px-1.5 py-0.5 rounded whitespace-nowrap" style={pStyle}>Top {win.percentile?.toFixed(2)}%</span>
                      </div>
                      <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">{win.score.toLocaleString()} pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'honors' && (
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-slate-800"><Award className="text-[#3d195b] w-8 h-8" /> 명예의 전당</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {/* 최다 우승 */}
                 <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#3d195b]">
                    <div className="flex items-center justify-between mb-6">
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Most Titles</p><h3 className="text-xl font-black text-[#3d195b]">역대 최다 우승자</h3></div>
                      <Medal className="w-6 h-6 text-[#3d195b]" />
                    </div>
                    <div className="space-y-3">
                      {top10Wins.slice(0, 10).map((p, idx) => (
                        <div key={p.name} onClick={() => setModalPlayer(p)} className={`flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition ${idx === 0 ? 'bg-yellow-50/50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</span>
                            <ClubLogo name={p.name} size="w-6 h-6" />
                            <div className="flex flex-col items-start">
                                <span className="font-bold text-slate-700">{p.name}</span>
                                <div className="flex gap-1 flex-wrap mt-1">
                                    {p.winningSeasons.map(s => <span key={s} className="bg-white border text-[8px] font-bold px-1 rounded text-slate-400 flex items-center gap-0.5">{s}</span>)}
                                </div>
                            </div>
                          </div>
                          <span className="font-black text-[#3d195b] whitespace-nowrap">{p.wins}회</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 최고 점수 */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#00ff85]">
                     <div className="flex items-center justify-between mb-6">
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Highest Points</p><h3 className="text-xl font-black text-[#3d195b]">역대 최고 점수</h3></div>
                      <TrendingUp className="w-6 h-6 text-[#00ff85]" />
                    </div>
                    <div className="space-y-3">
                      {top10AllTimeScores.map((p, idx) => {
                          const isWin = isWinningSeason(p.name, p.season);
                          return (
                            <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition">
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 1}</span>
                                 <ClubLogo name={p.name} size="w-6 h-6" />
                                 <div className="flex flex-col">
                                     <span className="font-bold text-slate-700 leading-none text-sm">{p.name}</span>
                                     <div className="flex items-center gap-1 mt-1">
                                         <span className="bg-white border text-[8px] font-black px-1.5 rounded text-slate-400">{p.season}</span>
                                         {isWin && <Crown size={10} className="text-yellow-500 fill-current" />}
                                     </div>
                                 </div>
                              </div>
                              <span className="font-black text-slate-800">{p.score.toLocaleString()}</span>
                            </div>
                          )
                      })}
                    </div>
                  </div>

                  {/* 최고 백분위 (순위 가치) */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#0075ff]">
                     <div className="flex items-center justify-between mb-6">
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Quality Rank</p><h3 className="text-xl font-black text-[#3d195b]">역대 최고 백분위</h3></div>
                      <Percent className="w-6 h-6 text-[#0075ff]" />
                    </div>
                    <div className="space-y-3">
                      {top10AllTimePercentiles.map((p, idx) => {
                        const pStyle = getPercentileColor(p.percentile);
                        const isWin = isWinningSeason(p.name, p.season);
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 1}</span>
                             <ClubLogo name={p.name} size="w-6 h-6" />
                             <div className="flex flex-col">
                                 <span className="font-bold text-slate-700 leading-none text-sm">{p.name}</span>
                                 <div className="flex items-center gap-1 mt-1">
                                     <span className="bg-white border text-[8px] font-black px-1.5 rounded text-slate-400">{p.season}</span>
                                     {isWin && <Crown size={10} className="text-yellow-500 fill-current" />}
                                 </div>
                             </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                              <span className="font-black text-xs" style={{ color: pStyle.color }}>Top {p.percentile?.toFixed(2)}%</span>
                              <span className="text-[10px] font-bold text-slate-700">#{p.rank.toLocaleString()}</span>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
            </div>
            
             {/* 전체 플레이어 카드 (복구됨) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerHonors.map((player, idx) => (
                <div key={player.name} onClick={() => setModalPlayer(player)} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-[#00ff85] transition-all cursor-pointer hover:translate-y-[-4px] hover:shadow-xl">
                  <div className="flex justify-between items-start mb-8">
                    <div><span className="text-slate-100 text-6xl font-black absolute -left-3 -top-3 select-none group-hover:text-slate-50 transition-colors">#{idx + 1}</span><h3 className="text-2xl font-black text-slate-800 relative z-10 pl-2">{player.name}</h3></div><ClubLogo name={player.name} size="w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">우승 횟수</span><span className="text-xl font-black text-[#e90052]">{player.wins} Wins</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">최고 점수</span><span className="text-base font-black text-slate-700">{player.maxScore?.toLocaleString() || '0'} pts</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">최고 백분위</span><span className="text-base font-black text-[#0075ff]">{player.bestPercentile ? `Top ${player.bestPercentile.toFixed(2)}%` : '-'}</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">참여 횟수</span>
                      <span className="text-base font-black text-slate-700">{player.participationCount} / {rawData.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trend' && (
          <section className="animate-in fade-in duration-700 space-y-12">
            
             {/* 범례 및 컨트롤러 (트렌드 탭용) - Moved to top */}
             <div className="flex flex-wrap justify-center gap-3 mb-8">
                {playersList.map((name) => {
                    const club = getClub(name);
                    return (
                        <button key={name} onClick={() => toggleTrendHighlightUser(name)} className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all border ${trendHighlightedUsers.includes(name) ? 'bg-slate-900 text-white shadow-xl scale-110 z-10 border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: club.color }} />
                            <img src={club.logo} alt="" className="w-4 h-4 object-contain" />
                            <span className="text-xs font-bold">{name}</span>
                        </button>
                    )
                })}
              </div>

            {/* 1. 시즌 점수 추이 */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Award size={16} className="text-indigo-500" /> 1. 시즌 점수 추이 (Points Trend)</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rawData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="season" fontSize={10} fontWeight="900" stroke="#cbd5e1" />
                          <YAxis domain={['auto', 'auto']} fontSize={10} fontWeight="900" stroke="#cbd5e1" />
                          <Tooltip content={<CustomTooltip type="score" />} />
                          {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={trendHighlightedUsers.includes(name) ? 4 : (trendHighlightedUsers.length > 0 ? 0.2 : 1.5)} dot={<ChartCustomDot />} connectNulls />))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. 세계 순위 추이 (Log Scale) */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Globe size={16} className="text-blue-500" /> 2. 세계 순위 추이 (Ranks Trend - Log Scale)</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rankData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="season" fontSize={10} fontWeight="900" stroke="#cbd5e1" />
                          <YAxis scale="log" domain={['auto', 'auto']} fontSize={10} fontWeight="900" stroke="#cbd5e1" reversed={true} />
                          <Tooltip content={<CustomTooltip type="worldRank" />} />
                          {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={trendHighlightedUsers.includes(name) ? 4 : (trendHighlightedUsers.length > 0 ? 0.2 : 1.5)} dot={<ChartCustomDot />} connectNulls />))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 3. 세계 백분위 추이 (Percentile Trend) */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Percent size={16} className="text-emerald-500" /> 3. 세계 백분위 추이 (Top % Trend)</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={allTimeRecords.reduce((acc, curr) => {
                            const existing = acc.find(item => item.season === curr.season) || { season: curr.season };
                            existing[curr.name] = curr.percentile;
                            if(!acc.find(item => item.season === curr.season)) acc.push(existing);
                            return acc;
                        }, [])} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="season" fontSize={10} fontWeight="900" stroke="#cbd5e1" />
                          {/* Log Scale removed as requested */}
                          <YAxis domain={[0, 100]} fontSize={10} fontWeight="900" stroke="#cbd5e1" reversed={true} />
                          <Tooltip content={<CustomTooltip type="percentile" />} />
                          {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={trendHighlightedUsers.includes(name) ? 4 : (trendHighlightedUsers.length > 0 ? 0.2 : 1.5)} dot={<ChartCustomDot />} connectNulls />))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* 4. 세계 백분위 추이 (Top 10%) - New Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-purple-500" /> 4. 세계 백분위 추이 (Top 10% High Performance)</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={allTimeRecords.reduce((acc, curr) => {
                            const existing = acc.find(item => item.season === curr.season) || { season: curr.season };
                            // Only include if percentile is <= 10
                            existing[curr.name] = curr.percentile <= 10 ? curr.percentile : null;
                            if(!acc.find(item => item.season === curr.season)) acc.push(existing);
                            return acc;
                        }, [])} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="season" fontSize={10} fontWeight="900" stroke="#cbd5e1" />
                          <YAxis domain={[0, 10]} fontSize={10} fontWeight="900" stroke="#cbd5e1" reversed={true} />
                          <Tooltip content={<CustomTooltip type="percentile" />} />
                          {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={trendHighlightedUsers.includes(name) ? 4 : (trendHighlightedUsers.length > 0 ? 0.2 : 1.5)} dot={<ChartCustomDot />} connectNulls />))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'rankTrend' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
               <h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl">
                 <ListOrdered size={22}/> 리그 순위 (League Rank)
               </h2>
               
               {/* 참여자 필터 버튼 (리그 순위 탭용) */}
               <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-[650px]">
                    {playersList.map((name) => {
                        const club = getClub(name);
                        return (
                            <button key={name} onClick={() => toggleRankHighlightUser(name)} className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all border text-[10px] font-bold ${rankHighlightedUsers.includes(name) ? 'bg-indigo-600 text-white shadow-md border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                                <img src={club.logo} alt="" className="w-3 h-3 object-contain" />
                                <span>{name}</span>
                            </button>
                        )
                    })}
                    {rankHighlightedUsers.length > 0 && (
                        <button onClick={() => setRankHighlightedUsers([])} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">Reset</button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto no-scrollbar" ref={rankTrendScrollRef}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100">
                    <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] text-center min-w-[80px]">Rank</th>
                    {seasonStats.map(stat => {
                      // FPL Global 1위 선수 가져오기
                      const globalTopPlayer = fplSeasonTop20[stat.season]?.[0];
                      const totalPlayers = rankData.find(d => d.season === stat.season)?.total_players;

                      return (
                      <th key={stat.season} className="p-6 min-w-[140px] border-r border-slate-50 last:border-0 text-center relative group">
                        <div className="flex flex-col items-center">
                           <span className="font-black text-xs text-slate-700 mb-1">{stat.season}</span>
                           {globalTopPlayer && (
                               <div className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded mt-1 border border-amber-200 flex flex-col items-center cursor-pointer hover:bg-amber-200 transition shadow-sm" onClick={() => setSelectedSeasonPlayer(selectedSeasonPlayer === stat.season ? null : stat.season)}>
                                   <div className="flex items-center gap-1"><Crown size={8} className="fill-current"/> <span>{globalTopPlayer.name}</span></div>
                                   <span className="text-[8px] font-normal opacity-75">{globalTopPlayer.points} pts</span>
                               </div>
                           )}
                           <div className="text-[9px] font-black text-white mt-2 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md shadow-sm border border-slate-900">
                               <Users size={10}/> {totalPlayers?.toLocaleString()}
                           </div>
                           {/* Global Top 5 표시 (선택 시) */}
                           {selectedSeasonPlayer === stat.season && (
                               <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl z-50 border border-indigo-100 p-2 text-left animate-in fade-in zoom-in-95 duration-200">
                                   <p className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">FPL World Top 5</p>
                                   <div className="space-y-1">
                                       {fplSeasonTop20[stat.season]?.slice(0, 5).map(p => (
                                           <div key={p.rank} className="flex justify-between items-center text-[9px]">
                                               <span className="font-bold text-slate-700">{p.rank}. {p.name}</span>
                                               <span className="font-black text-indigo-600">{p.points}</span>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}
                        </div>
                      </th>
                    )})}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: playersList.length }).map((_, rankIndex) => {
                    const rank = rankIndex + 1;
                    return (
                      <tr key={rank} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                        <td className="p-4 font-black text-sm text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                          {rank === 1 ? <Crown size={16} className="text-yellow-400 mx-auto fill-current" /> : rank}
                        </td>
                        {seasonStats.map(stat => {
                          const playerName = stat.sortedPlayers[rankIndex]; 
                          if (!playerName) return <td key={stat.season} className="p-4 border-r border-slate-50 last:border-0"></td>;

                          const club = getClub(playerName);
                          const isWinner = rank === 1;
                          const score = rawData.find(d => d.season === stat.season)?.[playerName];
                          
                          // 순위 및 백분위 가져오기
                          const rankRow = rankData.find(d => d.season === stat.season);
                          const worldRank = rankRow?.[playerName];
                          const totalPlayers = rankRow?.total_players;
                          const percentile = calculatePercentile(worldRank, totalPlayers);
                          const pStyle = getPercentileColorFullRange(percentile);
                          
                          // 하이라이트 여부 확인 (필터링)
                          const isHighlighted = rankHighlightedUsers.length === 0 || rankHighlightedUsers.includes(playerName);

                          return (
                            <td key={stat.season} className={`p-4 border-r border-slate-50 last:border-0 align-top transition-all duration-300 ${isHighlighted ? 'opacity-100' : 'opacity-30 blur-[1px]'}`} style={{ backgroundColor: pStyle.backgroundColor }}>
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="flex items-center gap-2 mb-1">
                                  <img src={club.logo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.currentTarget.src = clubMapping.default.logo} />
                                  <span className={`text-sm font-black ${isWinner ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {playerName}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 w-full">
                                  <span className="text-[10px] font-bold text-slate-700">{score?.toLocaleString()} pts</span>
                                  <span 
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all border w-full text-center"
                                    style={{ color: pStyle.color, borderColor: pStyle.borderColor, backgroundColor: 'rgba(255,255,255,0.6)' }}
                                  >
                                    Top {percentile?.toFixed(2)}%
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500 border px-1.5 py-0.5 rounded-md w-full text-center bg-white/40">
                                      #{worldRank?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'fplLegends' && (
           <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                      <h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl"><Crown size={22}/> FPL Global Legends</h2>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">역대 FPL 전체 시즌별 최다 득점자 Top 20</p>
                  </div>
              </div>
              <div className="overflow-x-auto no-scrollbar" ref={fplLegendsScrollRef}>
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-white border-b-2 border-slate-100">
                              <th className="p-4 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] text-center min-w-[60px]">Rank</th>
                              {Object.keys(fplSeasonTop20).map(season => (
                                  <th key={season} className="p-4 min-w-[160px] border-r border-slate-50 last:border-0 text-center font-black text-xs text-[#3d195b] italic">{season}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {Array.from({ length: 20 }).map((_, i) => (
                              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                                  <td className="p-3 font-black text-xs text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                      {i + 1}
                                  </td>
                                  {Object.keys(fplSeasonTop20).map(season => {
                                      const player = fplSeasonTop20[season][i];
                                      if (!player) return <td key={season} className="border-r border-slate-50"></td>;
                                      const posStyle = getPositionStyle(player.pos);
                                      const teamLogo = getPLTeamLogo(player.team);
                                      return (
                                          <td key={season} className="p-3 border-r border-slate-50">
                                              <div className={`flex items-center gap-3 p-3 rounded-xl w-full h-full transition hover:bg-slate-50 ${i===0 ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
                                                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                                      <img src={teamLogo} alt={player.team} className="w-full h-full object-contain" />
                                                  </div>
                                                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                      <div className="flex items-center gap-1.5 w-full">
                                                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${posStyle.bg} ${posStyle.text} border ${posStyle.border}`}>{player.pos}</span>
                                                          <span className="text-[9px] font-black text-slate-400 uppercase">{player.team}</span>
                                                      </div>
                                                      <span className="text-sm font-black text-slate-800 leading-none truncate">{player.name}</span>
                                                      <span className="text-xs font-black text-[#3d195b]">{player.points} pts</span>
                                                  </div>
                                              </div>
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
           </section>
        )}

        {activeTab === 'data' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#3d195b]">
                        <Users size={24}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-black italic text-[#3d195b] text-xl">통합 성적 아카이브</h2>
                    </div>
                </div>
                
                {/* 데이터 컬럼 필터 (전체 데이터 탭용) */}
               <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-[650px]">
                    {playersList.map((name) => {
                        const club = getClub(name);
                        const isVisible = dataVisibleColumns.includes(name);
                        return (
                            <button key={name} onClick={() => toggleDataVisibleColumn(name)} className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all border text-[10px] font-bold ${isVisible ? 'bg-indigo-600 text-white shadow-md border-indigo-600' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>
                                <img src={club.logo} alt="" className="w-3 h-3 object-contain" style={{ filter: isVisible ? 'none' : 'grayscale(100%) opacity(50%)' }} />
                                <span>{name}</span>
                            </button>
                        )
                    })}
                    <button onClick={() => toggleDataVisibleColumn('Total Players')} className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all border text-[10px] font-bold ${dataVisibleColumns.includes('Total Players') ? 'bg-slate-700 text-white shadow-md border-slate-700' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>
                        <Users size={12} />
                        <span>Total Players</span>
                    </button>
                    {dataVisibleColumns.length < playersList.length + 1 && (
                         <button onClick={resetDataVisibleColumns} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            Show All
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto no-scrollbar" ref={dataScrollRef}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100">
                    <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">시즌</th>
                    {playersList.filter(p => dataVisibleColumns.includes(p)).map(p => (<th key={p} className="p-6 min-w-[160px] border-r border-slate-50 last:border-0 group"><div className="flex items-center gap-3"><img src={getClub(p).logo} alt="" className="w-6 h-6 object-contain" onError={(e) => e.currentTarget.src = clubMapping.default.logo} /><span className="font-black text-[11px] text-slate-700">{p}</span></div></th>))}
                    {dataVisibleColumns.includes('Total Players') && (
                        <th className="p-6 min-w-[120px] border-r border-slate-50 last:border-0 group">
                            <div className="flex items-center gap-2 text-slate-500"><Users size={14} /><span className="font-black text-[11px]">Total Players</span></div>
                        </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((row, idx) => {
                    const currentSeasonStats = seasonStats.find(s => s.season === row.season);
                    
                    const rankRow = rankData.find(r => r.season === row.season);
                    const totalPlayers = rankRow ? rankRow.total_players : null;
                    
                    return (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                        <td className="p-6 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col">
                                <span className="font-black text-xs text-[#3d195b] italic">{row.season}</span>
                            </div>
                        </td>
                        {playersList.filter(p => dataVisibleColumns.includes(p)).map(p => {
                          const score = row[p];
                          const leagueRank = currentSeasonStats?.leagueRanks[p];
                          
                          const rank = rankRow ? rankRow[p] : null;
                          const percentile = calculatePercentile(rank, totalPlayers);
                          const pStyle = getPercentileColorFullRange(percentile);
                          const leagueRankStyle = getLeagueRankColorStyle(leagueRank, currentSeasonStats?.totalParticipants || 13);

                          return (
                            <td key={p} className={`p-6 border-r border-slate-50 last:border-0`} style={percentile !== null ? { backgroundColor: pStyle.backgroundColor, borderColor: pStyle.borderColor } : {}}>
                              {typeof score === 'number' ? (
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shadow-sm border" style={leagueRankStyle}> {leagueRank} </div>
                                  <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex items-center justify-between"><span className="text-sm font-black text-slate-700">{score.toLocaleString()}</span></div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span className="text-[10px] font-bold text-slate-600">#{rank?.toLocaleString()}</span>
                                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md border" style={{ backgroundColor: pStyle.backgroundColor, color: pStyle.color, borderColor: pStyle.borderColor }}>
                                            Top {percentile?.toFixed(2)}%
                                        </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (<span className="text-slate-100 font-bold">-</span>)}
                            </td>
                          );
                        })}
                        {dataVisibleColumns.includes('Total Players') && (
                            <td className="p-6 border-r border-slate-50 last:border-0">
                                <span className="font-bold text-xs text-slate-600">{totalPlayers?.toLocaleString()}</span>
                            </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 p-16 text-center border-t border-slate-100">
          <div className="flex flex-col items-center gap-6">
              <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL" className="w-16 h-16 grayscale opacity-20" />
              <div className="px-8 py-3 rounded-full bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Baekdoo Fantasy Legends Archive & History</div>
          </div>
      </footer>
    </div>
  );
};

export default App;
