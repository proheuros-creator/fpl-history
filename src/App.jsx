import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Users, Award, Star, Globe, Medal, Crown, X, Calendar, ListOrdered, Loader2, BarChart2, ChevronDown, ChevronUp, Activity, Shield, Shirt } from 'lucide-react';

// ==========================================
// 1. 데이터 소스 및 설정 (Data Source & Config)
// ==========================================

// 캐시 방지를 위해 타임스탬프 쿼리 추가
//const timestamp = new Date().getTime();
//const POINTS_CSV_URL = `https://raw.githubusercontent.com/proheuros-creator/fpl-history/main/rawdata/Baekdoo_FPL_Points_History.csv?t=${timestamp}`;
//const RANK_CSV_URL = `https://raw.githubusercontent.com/proheuros-creator/fpl-history/main/rawdata/Baekdoo_FPL_Rank_History.csv?t=${timestamp}`;
const POINTS_CSV_URL = `https://raw.githubusercontent.com/proheuros-creator/fpl-history/main/rawdata/Baekdoo_FPL_Points_History.csv`;
const RANK_CSV_URL = `https://raw.githubusercontent.com/proheuros-creator/fpl-history/main/rawdata/Baekdoo_FPL_Rank_History.csv`;

// FPL 역대 시즌별 Top 5 득점자 데이터 (FPL Global Top 5 Scorers) - 요약용
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

// ... (클럽 매핑 및 로고 컴포넌트, 색상 함수 등은 기존과 동일) ...
const clubMapping = {
  "임우람": { name: "AC Milan", color: "#fb090b", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  "장용석": { name: "Manchester City", color: "#6caddf", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  "전민호": { name: "Arsenal FC", color: "#ef0107", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  "정세현": { name: "Liverpool FC", color: "#c8102e", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  "정재훈": { name: "Paris Saint-Germain", color: "#004170", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  "정창영": { name: "Chelsea FC", color: "#034694", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  "천영석": { name: "Tottenham Hotspur", color: "#132257", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", bg: "white" },
  "한지상": { name: "San Antonio Spurs", color: "#000000", logo: "https://i.namu.wiki/i/jXW27nYvH6FGFt1S2J1s0esALy93M3owCOQ5QNcR8FCYuGceYCncYGUciG0DMEsTpfm1dH2MyL5egcbks0yVmw.svg", bg: "white" },
  "장재윤": { name: "McLaren", color: "#FF8000", logo: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg", bg: "white" },
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
const getWorldRankColor = (rank) => {
  if (typeof rank !== 'number') return { backgroundColor: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0' };
  const RANK_1 = 1; const RANK_10K = 10000; const RANK_50K = 50000; const RANK_500K = 500000; const RANK_WORST = 8000000;
  let hue, saturation, lightness, alpha, fontWeight, boxShadow;
  if (rank <= RANK_10K) { const ratio = (Math.log(rank) - Math.log(RANK_1)) / (Math.log(RANK_10K) - Math.log(RANK_1)); hue = 170 - (ratio * 15); saturation = 95; lightness = 35; alpha = 0.25; fontWeight = '900'; boxShadow = `0 0 6px hsla(${hue}, 80%, 40%, 0.4)`; } 
  else if (rank <= RANK_50K) { const ratio = (Math.log(rank) - Math.log(RANK_10K)) / (Math.log(RANK_50K) - Math.log(RANK_10K)); hue = 150 - (ratio * 25); saturation = 90; lightness = 40; alpha = 0.2; fontWeight = '800'; } 
  else if (rank <= RANK_500K) { const ratio = (Math.log(rank) - Math.log(RANK_50K)) / (Math.log(RANK_500K) - Math.log(RANK_50K)); hue = 120 - (ratio * 60); saturation = 85; lightness = 45; alpha = 0.15; fontWeight = '700'; } 
  else { const ratio = (Math.log(rank) - Math.log(RANK_500K)) / (Math.log(RANK_WORST) - Math.log(RANK_500K)); const safeRatio = Math.min(Math.max(ratio, 0), 1); hue = 60 - (safeRatio * 60); saturation = 90; lightness = 50; alpha = 0.1; fontWeight = '600'; }
  return { backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`, color: `hsl(${hue}, ${saturation}%, ${Math.max(20, lightness - 20)}%)`, borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`, fontWeight: fontWeight || 'normal', boxShadow: boxShadow || 'none' };
};
const getLeagueRankColorStyle = (rank, total = 13) => {
  if (rank === 1) return { backgroundColor: '#fbbf24', color: '#ffffff', fontWeight: '900', boxShadow: '0 2px 4px rgba(251, 191, 36, 0.4)', border: 'none' };
  if (typeof rank !== 'number' || rank < 1) return { backgroundColor: '#f1f5f9', color: '#94a3b8' };
  const maxIndex = Math.max(total - 1, 1); const currentIndex = rank - 2; const ratio = Math.min(Math.max(currentIndex / maxIndex, 0), 1); const hue = 140 - (ratio * 140); 
  return { backgroundColor: `hsla(${hue}, 80%, 45%, 0.1)`, color: `hsl(${hue}, 80%, 35%)`, borderColor: `hsla(${hue}, 80%, 45%, 0.3)`, fontWeight: '800', borderWidth: '1px' };
};
const parseCSV = (text) => {
    const lines = text.trim().split('\n'); const headers = lines[0].split(',').map(h => h.trim()); const players = headers.slice(1); 
    const data = lines.slice(1).map(line => { if (!line.trim()) return null; const values = line.split(','); const obj = { season: values[0].trim() }; players.forEach((player, index) => { const val = values[index + 1] ? values[index + 1].trim() : ''; obj[player] = val && !isNaN(val) ? Number(val) : null; }); return obj; }).filter(x => x !== null);
    return { data, players };
};

const App = () => {
  const [activeTab, setActiveTab] = useState('winners');
  const [highlightedUsers, setHighlightedUsers] = useState([]); 
  const [modalPlayer, setModalPlayer] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]); 
  const [rawData, setRawData] = useState([]);
  const [rankData, setRankData] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try { setIsLoading(true); const [pointsRes, ranksRes] = await Promise.all([fetch(POINTS_CSV_URL), fetch(RANK_CSV_URL)]); if (!pointsRes.ok || !ranksRes.ok) throw new Error("Failed to fetch CSV data"); const pointsText = await pointsRes.text(); const ranksText = await ranksRes.text(); const pointsParsed = parseCSV(pointsText); const ranksParsed = parseCSV(ranksText); setRawData(pointsParsed.data); setRankData(ranksParsed.data); setPlayersList(pointsParsed.players); } catch (err) { console.error(err); setError("데이터 로딩 실패"); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const toggleSection = (section) => setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  const toggleHighlightUser = (name) => setHighlightedUsers(prev => prev.includes(name) ? prev.filter(u => u !== name) : [...prev, name]);

  const seasonStats = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    return rawData.map(d => {
      const scores = playersList.map(p => ({ name: p, score: d[p] })).filter(x => typeof x.score === 'number').sort((a, b) => b.score - a.score);
      if (scores.length === 0) return null;
      const winner = scores[0]; const rankRow = rankData.find(r => r.season === d.season); const winnerRank = rankRow ? rankRow[winner.name] : null;
      const leagueRanks = {}; const sortedPlayers = []; scores.forEach((s, idx) => { leagueRanks[s.name] = idx + 1; sortedPlayers[idx] = s.name; });
      return { season: d.season, winner: winner.name, score: winner.score, worldRank: typeof winnerRank === 'number' ? `#${winnerRank.toLocaleString()}` : "N/A", rawWorldRank: winnerRank, leagueRanks, sortedPlayers, totalParticipants: scores.length };
    }).filter(x => x !== null);
  }, [rawData, rankData, playersList]);

  const allTimeRecords = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    const records = []; rawData.forEach(seasonData => { playersList.forEach(player => { const score = seasonData[player]; const rankRow = rankData.find(r => r.season === seasonData.season); const rank = rankRow ? rankRow[player] : null; if (typeof score === 'number') records.push({ name: player, season: seasonData.season, score, rank }); }); }); return records;
  }, [rawData, rankData, playersList]);

  const top10AllTimeScores = useMemo(() => [...allTimeRecords].sort((a, b) => b.score - a.score).slice(0, 10), [allTimeRecords]);
  const top10AllTimeRanks = useMemo(() => [...allTimeRecords].filter(r => r.rank !== null).sort((a, b) => a.rank - b.rank).slice(0, 10), [allTimeRecords]);
  const playerHonors = useMemo(() => {
    if (rawData.length === 0 || rankData.length === 0) return [];
    return playersList.map(name => {
      const scores = rawData.map(d => d[name]).filter(s => typeof s === 'number');
      const wins = seasonStats.filter(s => s.winner === name).length;
      const participationCount = scores.length;
      const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
      const maxScoreSeason = scores.length > 0 ? (rawData.find(d => d[name] === maxScore)?.season || '-') : '-';
      const playerRanks = rankData.map(d => ({ season: d.season, rank: d[name] })).filter(r => typeof r.rank === 'number');
      const bestRankObj = playerRanks.sort((a, b) => a.rank - b.rank)[0];
      const bestRank = bestRankObj ? bestRankObj.rank : null;
      const bestRankSeason = bestRankObj ? bestRankObj.season : '-';
      const winningSeasons = seasonStats.filter(s => s.winner === name).map(s => s.season).sort();
      return { name, wins, maxScore, maxScoreSeason, bestRank, bestRankSeason, winningSeasons, participationCount };
    }).filter(p => p.maxScore > 0).sort((a, b) => { if (b.wins !== a.wins) return b.wins - a.wins; const rankA = a.bestRank !== null ? a.bestRank : Infinity; const rankB = b.bestRank !== null ? b.bestRank : Infinity; return rankA - rankB; });
  }, [seasonStats, rawData, rankData, playersList]);
  const top10Wins = useMemo(() => [...playerHonors].filter(p => p.wins > 0).sort((a, b) => b.wins - a.wins).slice(0, 10), [playerHonors]);

  // Components (Tooltip, Dots, Modal) - Same logic, omitted for brevity but included in full file
  const CustomTooltip = ({ active, payload, label, type }) => { if (active && payload && payload.length) { const currentSeasonStats = seasonStats.find(s => s.season === label); const sortedPayload = [...payload].sort((a, b) => { if (type === 'worldRank' || type === 'rank') return a.value - b.value; return b.value - a.value; }); return ( <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[180px]"> <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">{label}</p> <div className="space-y-2"> {sortedPayload.map((entry, index) => { const leagueRank = currentSeasonStats?.leagueRanks[entry.name]; const displayVal = entry.value.toLocaleString(); const formattedVal = (type === 'worldRank' || type === 'rank') ? `#${displayVal}` : displayVal; const rankStyle = (type === 'worldRank' || type === 'rank') ? getWorldRankColor(entry.value) : {}; const leagueRankStyle = getLeagueRankColorStyle(leagueRank, currentSeasonStats?.totalParticipants || 13); return ( <div key={index} className="flex items-center justify-between gap-4"> <div className="flex items-center gap-2"> <span className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-transparent" style={{ backgroundColor: leagueRankStyle.backgroundColor, color: leagueRankStyle.color, borderColor: leagueRankStyle.borderColor, boxShadow: leagueRank === 1 ? leagueRankStyle.boxShadow : 'none' }}> {leagueRank} </span> <ClubLogo name={entry.name} size="w-4 h-4" /> <span className="text-xs font-bold text-slate-700" style={{ color: entry.stroke }}>{entry.name}</span> </div> <span className="text-xs font-black text-slate-900 px-1.5 rounded-md" style={(type === 'worldRank' || type === 'rank') ? { backgroundColor: rankStyle.backgroundColor, color: rankStyle.color } : {}}> {formattedVal} </span> </div> ); })} </div> </div> ); } return null; };
  const ScoreCustomDot = (props) => { const { cx, cy, payload, dataKey, stroke } = props; if (!cx || !cy || !payload || !dataKey) return null; const currentScores = playersList.map(p => payload[p]).filter(v => typeof v === 'number'); const maxVal = Math.max(...currentScores); const isWinner = payload[dataKey] === maxVal && payload[dataKey] > 0; const isFocused = highlightedUsers.length === 0 || highlightedUsers.includes(dataKey); if (!isFocused) return null; if (typeof payload[dataKey] !== 'number') return null; return ( <g> {isWinner && ( <foreignObject x={cx - 10} y={cy - 28} width="20" height="20"> <Crown size={18} fill="#FFD700" color="#B8860B" /> </foreignObject> )} <circle cx={cx} cy={cy} r={isWinner ? 5 : 3} fill={stroke} stroke="#fff" strokeWidth={2} /> </g> ); };
  const RankCustomDot = (props) => { const { cx, cy, payload, dataKey, stroke } = props; if (!cx || !cy || !payload || !dataKey) return null; const currentRanks = playersList.map(p => payload[p]).filter(v => typeof v === 'number'); const minVal = Math.min(...currentRanks); const isBest = payload[dataKey] === minVal && payload[dataKey] > 0; const isFocused = highlightedUsers.length === 0 || highlightedUsers.includes(dataKey); if (!isFocused) return null; if (typeof payload[dataKey] !== 'number') return null; return ( <g> {isBest && ( <foreignObject x={cx - 10} y={cy - 28} width="20" height="20"> <Crown size={18} fill="#FFD700" color="#B8860B" /> </foreignObject> )} <circle cx={cx} cy={cy} r={isBest ? 5 : 3} fill={stroke} stroke="#fff" strokeWidth={2} /> </g> ); };
  const RenderModal = () => { if (!modalPlayer) return null; const playerRecord = rawData.map(d => { const seasonInfo = seasonStats.find(s => s.season === d.season); const score = d[modalPlayer.name]; const leagueRank = seasonInfo?.leagueRanks[modalPlayer.name]; const worldRankRow = rankData.find(r => r.season === d.season); const worldRank = worldRankRow ? worldRankRow[modalPlayer.name] : null; if (score === null || score === undefined) return null; return { season: d.season, score, leagueRank, worldRank }; }).filter(x => x !== null); const rankCounts = {}; playerRecord.forEach(rec => { if (!rankCounts[rec.leagueRank]) rankCounts[rec.leagueRank] = []; rankCounts[rec.leagueRank].push(rec.season); }); const winningSeasons = playerRecord.filter(r => r.leagueRank === 1).map(r => r.season); const stats = playerHonors.find(p => p.name === modalPlayer.name) || {}; const totalSeasons = rawData.length; const club = getClub(modalPlayer.name); return ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"> <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalPlayer(null)} /> <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-500 flex flex-col"> <div className="bg-[#3d195b] p-8 text-white flex justify-between items-start shrink-0"> <div className="flex items-center gap-5"> <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md"> <ClubLogo name={modalPlayer.name} size="w-16 h-16" /> </div> <div> <h3 className="text-2xl font-black italic">{modalPlayer.name}</h3> <p className="text-[#00ff85] font-bold text-xs uppercase tracking-widest mt-1">{club.name}</p> </div> </div> <button onClick={() => setModalPlayer(null)} className="p-2 hover:bg-white/10 rounded-xl transition"> <X size={24} /> </button> </div> <div className="overflow-y-auto p-6 no-scrollbar"> <div className="grid grid-cols-2 gap-3 mb-6"> <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> <Trophy size={20} className="mx-auto text-yellow-500 mb-2" /> <div className="text-xs font-bold text-slate-400 uppercase">Wins</div> <div className="text-xl font-black text-slate-800 mb-1">{stats.wins}</div> {winningSeasons.length > 0 && ( <div className="flex flex-wrap justify-center gap-1 mt-1"> {winningSeasons.map(season => ( <span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500"> {season} </span> ))} </div> )} </div> <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> <Activity size={20} className="mx-auto text-orange-500 mb-2" /> <div className="text-xs font-bold text-slate-400 uppercase">Participation</div> <div className="text-xl font-black text-slate-800 mb-1"> <span className="text-2xl">{stats.participationCount}</span> <span className="text-slate-400 text-sm font-bold ml-1">/ {totalSeasons}</span> </div> <span className="text-[9px] font-bold text-slate-400">Seasons</span> </div> <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> <TrendingUp size={20} className="mx-auto text-green-500 mb-2" /> <div className="text-xs font-bold text-slate-400 uppercase">Best Points</div> <div className="text-xl font-black text-slate-800 mb-1">{stats.maxScore?.toLocaleString()}</div> <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500"> {stats.maxScoreSeason} </span> </div> <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center"> <Globe size={20} className="mx-auto text-blue-500 mb-2" /> <div className="text-xs font-bold text-slate-400 uppercase">Best Rank</div> <div className="text-xl font-black text-slate-800 mb-1">#{stats.bestRank?.toLocaleString()}</div> <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500"> {stats.bestRankSeason} </span> </div> </div> <div className="mb-6"> <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"> <BarChart2 size={16} className="text-indigo-500"/> Rank Distribution </h4> <div className="space-y-2"> {Object.keys(rankCounts).sort((a, b) => Number(a) - Number(b)).map(rank => { const r = Number(rank); const leagueRankStyle = getLeagueRankColorStyle(r, 13); return ( <div key={rank} className="flex items-start text-xs bg-slate-50 p-3 rounded-xl border border-slate-100"> <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black mr-3 shrink-0 border border-transparent`} style={{ backgroundColor: leagueRankStyle.backgroundColor, color: leagueRankStyle.color, borderColor: leagueRankStyle.borderColor, boxShadow: r === 1 ? leagueRankStyle.boxShadow : 'none' }} > {rank} </div> <div> <div className="font-black text-slate-900 mb-1 flex items-center"> {rank === '1' ? 'Champion' : `${rank}위`} <span className="text-slate-900 font-black ml-1">: {rankCounts[rank].length}회</span> </div> <div className="flex flex-wrap gap-1"> {rankCounts[rank].map(season => ( <span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-500">{season}</span> ))} </div> </div> </div> )})} </div> </div> <div> <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"> <ListOrdered size={16} className="text-indigo-500"/> Full History </h4> <div className="space-y-2"> <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 rounded-xl"> <span>Season</span> <span className="text-center">Points</span> <span className="text-center">League</span> <span className="text-right">Global</span> </div> {playerRecord.reverse().map((rec, i) => { const rankStyle = typeof rec.worldRank === 'number' ? getWorldRankColor(rec.worldRank) : {}; const leagueRankStyle = getLeagueRankColorStyle(rec.leagueRank, 13); return ( <div key={i} className="grid grid-cols-4 items-center bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 p-3 rounded-xl transition group"> <span className="text-xs font-black text-slate-500 group-hover:text-indigo-600 italic">{rec.season}</span> <span className="text-sm font-bold text-slate-700 text-center">{rec.score.toLocaleString()}</span> <div className="flex justify-center"> <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black border border-transparent`} style={{ backgroundColor: leagueRankStyle.backgroundColor, color: leagueRankStyle.color, borderColor: leagueRankStyle.borderColor, boxShadow: rec.leagueRank === 1 ? leagueRankStyle.boxShadow : 'none' }} > {rec.leagueRank} </span> </div> <div className="flex justify-end"> <span className="text-[9px] font-bold flex items-center justify-center px-2 py-0.5 rounded-lg transition-all" style={rankStyle} > #{rec.worldRank?.toLocaleString() || '-'} </span> </div> </div> )})} </div> </div> </div> <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0"> <button onClick={() => setModalPlayer(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-slate-200 w-full">Close</button> </div> </div> </div> ); };

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
            {[{ id: 'winners', label: '역대 우승자', icon: <Medal size={16}/> }, { id: 'honors', label: '명예의 전당', icon: <Star size={16}/> }, { id: 'trend', label: '트렌드 분석', icon: <TrendingUp size={16}/> }, { id: 'rankTrend', label: '리그 순위 변화', icon: <ListOrdered size={16}/> }, { id: 'fplLegends', label: 'FPL 레전드', icon: <Crown size={16}/> }, { id: 'data', label: '전체 데이터', icon: <Users size={16}/> }].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setHighlightedUsers([]); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00ff85] text-[#3d195b] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70'}`}>
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
                const club = getClub(win.winner);
                const rankStyle = typeof win.rawWorldRank === 'number' ? getWorldRankColor(win.rawWorldRank) : {};
                return (
                  <div key={idx} onClick={() => setModalPlayer({ name: win.winner })} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-xl group cursor-pointer">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center p-2 bg-slate-50 rounded-2xl shadow-inner group-hover:bg-white transition-colors">
                      <ClubLogo name={win.winner} size="w-16 h-16" />
                    </div>
                    <p className="text-xs font-black text-slate-400 mb-1 tracking-tighter">{win.season}</p>
                    <p className="text-lg font-black text-slate-900 mb-2 leading-tight">{win.winner}</p>
                    <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
                      <div className="px-3 py-1 rounded-lg text-[10px] font-black w-full flex items-center justify-center gap-1 border shadow-sm transition-all" style={rankStyle}><Globe size={10} /> {win.worldRank}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{win.score.toLocaleString()} pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Honor Tab: 생략 (이전과 동일) */}
        {activeTab === 'honors' && (
             // ... honors code ... 
             <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-slate-800"><Award className="text-[#3d195b] w-8 h-8" /> 명예의 전당</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {/* ... Top 10 cards ... */}
                 {/* Wins Top 10 */}
                 <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#3d195b] transition-all">
                    <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => toggleSection('wins')}>
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Most Titles</p><h3 className="text-xl font-black text-[#3d195b]">역대 최다 우승자</h3></div>
                      <div className="flex items-center gap-2"><div className="bg-slate-50 p-2 rounded-xl"><Medal className="w-6 h-6 text-[#3d195b]" /></div>{expandedSections.includes('wins') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                    </div>
                    <div className="space-y-3">
                      {top10Wins.slice(0, 1).map((p, idx) => (
                        <div key={p.name} onClick={() => setModalPlayer(p)} className="cursor-pointer group rounded-2xl p-4 bg-yellow-50/50 border border-yellow-200 shadow-sm transition hover:scale-105">
                          <div className="flex justify-between items-center mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-white shadow-md"><Crown size={16} fill="white" /></span><ClubLogo name={p.name} size="w-8 h-8" /><span className="text-xl font-black text-slate-900">{p.name}</span></div><span className="text-3xl font-black text-[#3d195b]">{p.wins}회</span></div>
                          <div className="flex flex-wrap gap-1 pl-14">{p.winningSeasons.map(season => (<span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-bold shadow-sm">{season}</span>))}</div>
                        </div>
                      ))}
                      {expandedSections.includes('wins') && top10Wins.slice(1).map((p, idx) => (
                        <div key={p.name} onClick={() => setModalPlayer(p)} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><ClubLogo name={p.name} size="w-6 h-6" /><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><div className="flex flex-wrap gap-1 mt-0.5">{p.winningSeasons.map(season => (<span key={season} className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded">{season}</span>))}</div></div></div><span className="font-black text-[#3d195b]">{p.wins}회</span>
                        </div>
                      ))}
                      {!expandedSections.includes('wins') && (<div onClick={() => toggleSection('wins')} className="text-center text-xs text-slate-400 font-bold cursor-pointer hover:text-[#3d195b] py-2">+ View Top 10</div>)}
                    </div>
                  </div>
                  
                  {/* Scores Top 10 */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#00ff85]">
                     <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => toggleSection('scores')}>
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Highest Points</p><h3 className="text-xl font-black text-[#3d195b]">역대 최고 점수</h3></div>
                      <div className="flex items-center gap-2"><div className="bg-slate-50 p-2 rounded-xl"><TrendingUp className="w-6 h-6 text-[#00ff85]" /></div>{expandedSections.includes('scores') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                    </div>
                    <div className="space-y-3">
                      {top10AllTimeScores.slice(0, 1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="cursor-pointer group rounded-2xl p-4 bg-green-50/50 border border-green-200 shadow-sm transition hover:scale-105">
                          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md"><Crown size={16} fill="white" /></span><ClubLogo name={p.name} size="w-8 h-8" /><div><div className="text-xl font-black text-slate-900">{p.name}</div><span className="px-2 py-0.5 bg-white border border-green-100 rounded text-[10px] text-slate-500 font-bold shadow-sm inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div></div><div className="text-right"><span className="text-3xl font-black text-[#3d195b]">{p.score.toLocaleString()}</span><span className="text-xs font-bold text-slate-400 ml-1">pts</span></div>
                        </div>
                      )})}
                      {expandedSections.includes('scores') && top10AllTimeScores.slice(1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><ClubLogo name={p.name} size="w-6 h-6" /><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><span className="text-[10px] text-slate-400 inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div><span className="font-black text-[#3d195b]">{p.score.toLocaleString()}</span>
                        </div>
                      )})}
                      {!expandedSections.includes('scores') && (<div onClick={() => toggleSection('scores')} className="text-center text-xs text-slate-400 font-bold cursor-pointer hover:text-[#3d195b] py-2">+ View Top 10</div>)}
                    </div>
                  </div>

                  {/* Ranks Top 10 */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-[#0075ff]">
                     <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => toggleSection('ranks')}>
                      <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Best Rank</p><h3 className="text-xl font-black text-[#3d195b]">역대 최고 세계 순위</h3></div>
                      <div className="flex items-center gap-2"><div className="bg-slate-50 p-2 rounded-xl"><Globe className="w-6 h-6 text-[#0075ff]" /></div>{expandedSections.includes('ranks') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                    </div>
                    <div className="space-y-3">
                      {top10AllTimeRanks.slice(0, 1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="cursor-pointer group rounded-2xl p-4 bg-blue-50/50 border border-blue-200 shadow-sm transition hover:scale-105">
                          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md"><Crown size={16} fill="white" /></span><ClubLogo name={p.name} size="w-8 h-8" /><div><div className="text-xl font-black text-slate-900">{p.name}</div><span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-[10px] text-slate-500 font-bold shadow-sm inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div></div><div className="text-right"><span className="text-2xl font-black text-[#3d195b]">#{p.rank.toLocaleString()}</span></div>
                        </div>
                      )})}
                      {expandedSections.includes('ranks') && top10AllTimeRanks.slice(1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><ClubLogo name={p.name} size="w-6 h-6" /><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><span className="text-[10px] text-slate-400 inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div><span className="font-black text-[#3d195b]">{p.rank.toLocaleString()}</span>
                        </div>
                      )})}
                      {!expandedSections.includes('ranks') && (<div onClick={() => toggleSection('ranks')} className="text-center text-xs text-slate-400 font-bold cursor-pointer hover:text-[#3d195b] py-2">+ View Top 10</div>)}
                    </div>
                  </div>
            </div>
            
             {/* 전체 플레이어 카드 그리드 (이전과 동일) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerHonors.map((player, idx) => (
                <div key={player.name} onClick={() => setModalPlayer(player)} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-[#00ff85] transition-all cursor-pointer hover:translate-y-[-4px] hover:shadow-xl">
                  <div className="flex justify-between items-start mb-8">
                    <div><span className="text-slate-100 text-6xl font-black absolute -left-3 -top-3 select-none group-hover:text-slate-50 transition-colors">#{idx + 1}</span><h3 className="text-2xl font-black text-slate-800 relative z-10 pl-2">{player.name}</h3></div><img src={getClub(player.name).logo} alt="Club" className="w-10 h-10 object-contain opacity-20 group-hover:opacity-100 transition duration-500" onError={(e) => e.currentTarget.src = clubMapping.default.logo} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">우승 횟수</span><span className="text-xl font-black text-[#e90052]">{player.wins} Wins</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">최고 점수</span><span className="text-base font-black text-slate-700">{player.maxScore?.toLocaleString() || '0'} pts</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">최고 세계 순위</span><span className="text-base font-black text-[#0075ff]">{player.bestRank ? `#${player.bestRank.toLocaleString()}` : '-'}</span></div>
                    {/* 참여 횟수 추가 */}
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

        {/* 트렌드 분석 (점수 & 세계 순위) */}
        {activeTab === 'trend' && (
          <section className="animate-in fade-in duration-700 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div><h2 className="text-2xl font-black flex items-center gap-3 italic text-slate-800 uppercase"><TrendingUp className="text-[#0075ff] w-8 h-8" /> 시즌별 점수 및 순위 추이</h2><p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider italic">이름을 클릭하여 전체 그래프를 하이라이트 하세요</p></div><div className="bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase tracking-widest"><Crown size={12} fill="#FFD700" color="#B8860B" /> Season Best</div>
              </div>
              <div className="mb-16">
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Award size={16} className="text-indigo-500" /> 1. 시즌 점수 추이 (Points Trend)</h3>
                <div className="h-[400px] w-full"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rawData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="season" fontSize={10} fontWeight="900" tickMargin={15} stroke="#cbd5e1" /><YAxis domain={['auto', 'auto']} fontSize={10} fontWeight="900" stroke="#cbd5e1" /><Tooltip content={<CustomTooltip type="score" />} />
                      {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={highlightedUsers && highlightedUsers.includes(name) ? 5 : (highlightedUsers && highlightedUsers.length > 0 ? 0.3 : 1.5)} strokeOpacity={highlightedUsers && highlightedUsers.includes(name) ? 1 : (highlightedUsers && highlightedUsers.length > 0 ? 0.2 : 0.8)} dot={<ScoreCustomDot />} activeDot={{ r: 8, strokeWidth: 0 }} connectNulls animationDuration={1500} />))}
                    </LineChart>
                  </ResponsiveContainer></div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Globe size={16} className="text-blue-500" /> 2. 세계 순위 추이 (World Rank Trend - Log Scale)</h3>
                <div className="h-[400px] w-full"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rankData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="season" fontSize={10} fontWeight="900" tickMargin={15} stroke="#cbd5e1" /><YAxis reversed scale="log" domain={['dataMin', 'dataMax']} fontSize={10} fontWeight="900" stroke="#cbd5e1" /><Tooltip content={<CustomTooltip type="worldRank" />} />
                      {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={highlightedUsers && highlightedUsers.includes(name) ? 5 : (highlightedUsers && highlightedUsers.length > 0 ? 0.3 : 1.5)} strokeOpacity={highlightedUsers && highlightedUsers.includes(name) ? 1 : (highlightedUsers && highlightedUsers.length > 0 ? 0.2 : 0.8)} dot={<RankCustomDot />} activeDot={{ r: 8, strokeWidth: 0 }} connectNulls animationDuration={1500} />))}
                    </LineChart>
                  </ResponsiveContainer></div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-10 mt-10 border-t border-slate-50">
                {playersList.map((name) => (<button key={name} onClick={() => toggleHighlightUser(name)} className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${highlightedUsers && highlightedUsers.includes(name) ? 'bg-slate-900 text-white shadow-xl scale-110 z-10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}><div className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: getClub(name).color }} /><ClubLogo name={name} size="w-4 h-4" /><span className="text-xs font-black tracking-tight">{name}</span></button>))}
                {highlightedUsers && highlightedUsers.length > 0 && (<button onClick={() => setHighlightedUsers([])} className="ml-4 px-4 py-3 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors uppercase tracking-widest">Reset</button>)}
              </div>
            </div>
          </section>
        )}

        {/* 리그 순위 변화 (NEW: Table View) */}
        {activeTab === 'rankTrend' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl">
                 <ListOrdered size={22}/> 리그 순위 변화 (League Rank Table)
               </h2>
               <div className="flex flex-col items-end">
                 <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">
                   * Click player name below to highlight
                 </div>
                 <div className="flex flex-wrap justify-end gap-1">
                    {playersList.map((name) => (
                      <button 
                        key={name} 
                        onClick={() => toggleHighlightUser(name)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                          highlightedUsers && highlightedUsers.includes(name)
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <img src={getClub(name).logo} alt="" className="w-3 h-3 object-contain" onError={(e) => e.currentTarget.src = clubMapping.default.logo} />
                        {name}
                      </button>
                    ))}
                    {highlightedUsers && highlightedUsers.length > 0 && (
                      <button onClick={() => setHighlightedUsers([])} className="px-2 py-1 text-[10px] font-black text-indigo-500 hover:underline">Reset</button>
                    )}
                 </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar" ref={rankTrendScrollRef}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100">
                    <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] text-center min-w-[80px]">Rank</th>
                    {seasonStats.map(stat => (
                      <th key={stat.season} className="p-6 min-w-[140px] border-r border-slate-50 last:border-0 text-center relative group">
                        <div className="flex flex-col items-center">
                           <span className="font-black text-xs text-slate-700 mb-1">{stat.season}</span>
                           {fplTopScorers[stat.season] && (
                             <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-xl border border-yellow-100 z-50 w-48">
                               <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest border-b border-slate-50 pb-1">FPL Global Top 5</div>
                               {fplSeasonTop20[stat.season] ? (
                                   fplSeasonTop20[stat.season].sort((a, b) => b.points - a.points).slice(0, 5).map((player, idx) => (
                                     <div key={idx} className="flex justify-between items-center text-[10px] mb-1">
                                       <div className="flex items-center gap-1.5">
                                          <span className={`w-3 h-3 flex items-center justify-center rounded-full font-bold ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</span>
                                          <span className={`font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-600'}`}>{player.name}</span>
                                       </div>
                                       <span className="font-black text-slate-800">{player.points || player.score}</span>
                                     </div>
                                   ))
                               ) : (
                                  <div className="text-[10px] text-slate-400">Data not available</div>
                               )}
                             </div>
                           )}
                           {fplTopScorers[stat.season] && (
                             <div className="flex items-center gap-1.5 bg-yellow-50/80 px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 whitespace-nowrap border border-yellow-100/50 shadow-sm mt-1 cursor-help">
                               <Crown size={10} className="text-yellow-500 fill-current" />
                               <span>{fplTopScorers[stat.season].name}</span>
                               <span className="text-slate-900 font-black">({fplTopScorers[stat.season].score})</span>
                             </div>
                           )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 최대 참가자 수만큼 행(Rank) 생성 (1위 ~ 13위) */}
                  {Array.from({ length: playersList.length }).map((_, rankIndex) => {
                    const rank = rankIndex + 1;
                    return (
                      <tr key={rank} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                        <td className="p-4 font-black text-sm text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                          {rank === 1 ? <Crown size={16} className="text-yellow-400 mx-auto fill-current" /> : rank}
                        </td>
                        {seasonStats.map(stat => {
                          // 해당 시즌의 해당 순위(rank)인 플레이어 찾기
                          const playerName = stat.sortedPlayers[rankIndex]; // 0-based index
                          
                          if (!playerName) {
                            return <td key={stat.season} className="p-4 border-r border-slate-50 last:border-0"></td>;
                          }

                          const club = getClub(playerName);
                          const isWinner = rank === 1;
                          const score = rawData.find(d => d.season === stat.season)?.[playerName];
                          const worldRank = rankData.find(d => d.season === stat.season)?.[playerName];
                          const isHighlighted = highlightedUsers && highlightedUsers.includes(playerName);
                          const isDimmed = highlightedUsers && highlightedUsers.length > 0 && !isHighlighted;
                          
                          // 리그 순위 변화 표에서도 세계 순위에 색상 적용
                          const rankStyle = typeof worldRank === 'number' ? getWorldRankColor(worldRank) : {};

                          // 리그 순위 배경색 적용 (1등은 골드, 나머지는 순위에 따라 그라데이션)
                          const cellStyle = getLeagueRankColorStyle(rank, stat.totalParticipants);

                          return (
                            <td key={stat.season} className={`p-4 border-r border-slate-50 last:border-0 align-top transition-opacity duration-300 ${isDimmed ? 'opacity-20 blur-[1px]' : 'opacity-100'}`} style={{ backgroundColor: rankStyle.backgroundColor }}>
                              <div className={`flex flex-col items-center gap-1.5 ${isHighlighted ? 'scale-110 transform transition-transform' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <img src={club.logo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.currentTarget.src = clubMapping.default.logo} />
                                  <span className={`text-sm font-black ${isWinner ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {playerName}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className="text-[10px] font-bold text-slate-400">{score?.toLocaleString()} pts</span>
                                  <span 
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all border"
                                    style={rankStyle}
                                  >
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

        {/* FPL Legends Tab */}
        {activeTab === 'fplLegends' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl"><Crown className="text-yellow-500 w-8 h-8" /> FPL LEGENDS ARCHIVE</h2>
               <div className="flex gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
                  {/* 여기서는 가로 스크롤로 시즌을 모두 보여줄 필요 없이, 테이블 헤더로 시즌을 보여줌 */}
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar" ref={fplLegendsScrollRef}>
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white border-b-2 border-slate-100">
                     <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] text-center min-w-[60px]">Rank</th>
                     {/* 시즌 헤더: 과거 -> 최신 순 정렬 */}
                     {Object.keys(fplSeasonTop20).sort().map(season => (
                       <th key={season} className="p-6 min-w-[180px] border-r border-slate-50 last:border-0 text-center">
                         <span className="font-black text-xs text-slate-700 block mb-2">{season}</span>
                         {/* 1위 선수 정보 (요약) */}
                         <div className="bg-slate-100 rounded-lg px-2 py-1 inline-flex items-center gap-1.5">
                            <Crown size={10} className="text-yellow-500 fill-current"/>
                            <span className="text-[10px] font-bold text-slate-600">{fplSeasonTop20[season].sort((a,b) => b.points - a.points)[0].name}</span>
                         </div>
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                    {/* 1위 ~ 20위 행 생성 */}
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const rank = idx + 1;
                      return (
                        <tr key={rank} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                           <td className="p-4 font-black text-sm text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                             {rank === 1 ? <Crown size={16} className="text-yellow-400 mx-auto fill-current" /> : rank}
                           </td>
                           {Object.keys(fplSeasonTop20).sort().map(season => {
                             // 자동 정렬 적용
                             const sortedPlayers = [...fplSeasonTop20[season]].sort((a, b) => b.points - a.points);
                             const player = sortedPlayers[idx];
                             
                             if (!player) return <td key={`${season}-${rank}`} className="border-r border-slate-50"></td>;
                             
                             const posStyle = getPositionStyle(player.pos);
                             return (
                               <td key={`${season}-${rank}`} className="p-3 border-r border-slate-50 last:border-0 align-top">
                                 <div className={`flex items-center justify-between p-2 rounded-xl border ${rank === 1 ? 'bg-yellow-50/50 border-yellow-200' : 'bg-white border-slate-100 hover:border-slate-200'} transition group`}>
                                   <div>
                                      <div className={`text-[11px] font-black ${rank === 1 ? 'text-slate-900' : 'text-slate-700'}`}>{player.name}</div>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>{posStyle.label}</span>
                                        <span className="text-[9px] font-bold text-slate-400">{player.team}</span>
                                      </div>
                                   </div>
                                   <div className="text-right pl-2">
                                     <div className={`text-sm font-black ${rank === 1 ? 'text-[#3d195b]' : 'text-slate-800'}`}>{player.points}</div>
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

        {activeTab === 'data' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"><h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl"><Users size={22}/> 통합 성적 아카이브</h2></div>
            <div className="overflow-x-auto no-scrollbar" ref={dataScrollRef}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100"><th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">시즌</th>
                    {playersList.map(p => (<th key={p} className="p-6 min-w-[150px] border-r border-slate-50 last:border-0 group"><div className="flex items-center gap-3"><img src={getClub(p).logo} alt="" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" onError={(e) => e.currentTarget.src = clubMapping.default.logo} /><span className="font-black text-[11px] text-slate-700">{p}</span></div></th>))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((row, idx) => {
                    const seasonScores = playersList.map(pl => row[pl]).filter(s => typeof s === 'number');
                    const maxScore = seasonScores.length > 0 ? Math.max(...seasonScores) : -1;
                    const currentSeasonStats = seasonStats.find(s => s.season === row.season);
                    const currentSeasonRankData = rankData.find(d => d.season === row.season);
                    
                    return (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150"><td className="p-6 font-black text-xs text-[#3d195b] sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] italic">{row.season}</td>
                        {playersList.map(p => {
                          const score = row[p];
                          const leagueRank = currentSeasonStats?.leagueRanks[p];
                          const isMax = score !== null && typeof score === 'number' && score === maxScore;
                          const worldRank = currentSeasonRankData?.[p];
                          
                          // 배경색 스타일 계산 (Log Scale)
                          const rankStyle = typeof worldRank === 'number' ? getWorldRankColor(worldRank) : {};

                          // 리그 순위 배경색 적용 (1등은 골드, 나머지는 순위에 따라 그라데이션)
                          const cellStyle = getLeagueRankColorStyle(leagueRank, currentSeasonStats?.totalParticipants || 13);

                          return (
                            <td key={p} className={`p-6 border-r border-slate-50 last:border-0 ${isMax ? 'bg-indigo-50/40' : ''}`} style={rankStyle.backgroundColor ? { backgroundColor: rankStyle.backgroundColor } : {}}>
                              {typeof score === 'number' ? (
                                <div className="flex items-start gap-3">
                                  <div 
                                    className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shadow-sm border`}
                                    style={leagueRank ? cellStyle : {}}
                                  >
                                    {leagueRank}
                                  </div>
                                  <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="flex items-center justify-between"><span className={`text-sm font-black ${isMax ? 'text-[#e90052]' : 'text-slate-700'}`}>{score.toLocaleString()}</span>{isMax && <div className="bg-yellow-400 p-0.5 rounded shadow-sm"><Crown size={10} fill="#fff" color="#fff" /></div>}</div>
                                    <div 
                                      className="px-2 py-0.5 border rounded-lg text-[9px] font-black flex items-center justify-center gap-1 shadow-xs transition-all hover:scale-105"
                                      style={rankStyle}
                                    >
                                      <Globe size={9} /> {typeof worldRank === 'number' ? `#${worldRank.toLocaleString()}` : '-'}
                                    </div>
                                  </div>
                                </div>
                              ) : (<span className="text-slate-100 font-bold">-</span>)}
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
      </main>

      <footer className="mt-20 p-16 text-center border-t border-slate-100"><div className="flex flex-col items-center gap-6"><img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL" className="w-16 h-16 grayscale opacity-20 hover:opacity-100 transition duration-700" /><div className="px-8 py-3 rounded-full bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] shadow-inner ring-1 ring-black/5">Baekdoo Fantasy Legends Archive & History</div></div></footer>
    </div>
  );
};

export default App;
