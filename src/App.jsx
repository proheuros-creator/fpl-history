import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Users, Award, Star, Globe, Medal, Crown, X, Calendar, ListOrdered, Loader2, BarChart2, ChevronDown, ChevronUp, Activity } from 'lucide-react';

// ==========================================
// 1. 데이터 정의 (Data Definitions)
// ==========================================

const playersList = ["이지용", "임우람", "장용석", "장재윤", "전민호", "정세현", "정용우", "정재훈", "정창영", "천영석", "하원석", "한지상", "한상진"];

// 시즌별 점수 데이터 (Points Data)
const rawData = [
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

// 시즌별 세계 순위 데이터 (World Rank Data)
const rankData = [
  { season: "2010/11", "이지용": null, "임우람": 488858, "장용석": 2044453, "장재윤": 1919854, "전민호": null, "정세현": null, "정용우": null, "정재훈": 2010131, "정창영": 320870, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2011/12", "이지용": null, "임우람": 367085, "장용석": null, "장재윤": 1026060, "전민호": 91994, "정세현": null, "정용우": null, "정재훈": 138279, "정창영": 389776, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2012/13", "이지용": null, "임우람": 264342, "장용석": null, "장재윤": 1253182, "전민호": 99067, "정세현": 1290044, "정용우": null, "정재훈": 311838, "정창영": 315403, "천영석": 635078, "하원석": null, "한지상": null, "한상진": null },
  { season: "2013/14", "이지용": null, "임우람": 236645, "장용석": null, "장재윤": 1890898, "전민호": 393568, "정세현": 899505, "정용우": null, "정재훈": 1140409, "정창영": 878573, "천영석": 1299089, "하원석": null, "한지상": null, "한상진": null },
  { season: "2014/15", "이지용": 2199131, "임우람": 852480, "장용석": null, "장재윤": 1306012, "전민호": 548999, "정세현": 151328, "정용우": null, "정재훈": 1646552, "정창영": 320759, "천영석": 628997, "하원석": null, "한지상": null, "한상진": null },
  { season: "2015/16", "이지용": 1286580, "임우람": 747000, "장용석": null, "장재윤": 907113, "전민호": 364313, "정세현": 1195929, "정용우": 454652, "정재훈": 965642, "정창영": 213623, "천영석": 971034, "하원석": null, "한지상": null, "한상진": null },
  { season: "2016/17", "이지용": 3144335, "임우람": 197136, "장용석": 5882, "장재윤": 564450, "전민호": 861550, "정세현": 1087148, "정용우": 118309, "정재훈": 2085800, "정창영": 795337, "천영석": 1304172, "하원석": null, "한지상": null, "한상진": null },
  { season: "2017/18", "이지용": 4016193, "임우람": 1100809, "장용석": 132207, "장재윤": 1431587, "전민호": 30851, "정세현": 72189, "정용우": 211329, "정재훈": 127232, "정창영": 316724, "천영석": 1031065, "하원석": 1498748, "한지상": 3569025, "한상진": null },
  { season: "2018/19", "이지용": null, "임우람": 694211, "장용석": 31160, "장재윤": 1589264, "전민호": 256535, "정세현": 1011675, "정용우": 258014, "정재훈": 493419, "정창영": 234075, "천영석": 1250565, "하원석": 4176389, "한지상": 97859, "한상진": null },
  { season: "2019/20", "이지용": null, "임우람": 548058, "장용석": 1485, "장재윤": 337871, "전민호": 440940, "정세현": 134969, "정용우": 51944, "정재훈": 352286, "정창영": 62604, "천영석": 1315076, "하원석": 95030, "한지상": 85191, "한상진": 5151898 },
  { season: "2020/21", "이지용": null, "임우람": 149364, "장용석": 375991, "장재윤": 427962, "전민호": 1357913, "정세현": 59523, "정용우": 356857, "정재훈": 77566, "정창영": 73420, "천영석": 32660, "하원석": 2410493, "한지상": 147457, "한상진": 3861290 },
  { season: "2021/22", "이지용": null, "임우람": 630610, "장용석": 251837, "장재윤": 357532, "전민호": 2356910, "정세현": 3147382, "정용우": null, "정재훈": 91145, "정창영": 501060, "천영석": 3180491, "하원석": 866734, "한지상": null, "한상진": 3582231 },
  { season: "2022/23", "이지용": null, "임우람": 1826166, "장용석": 47291, "장재윤": 1197568, "전민호": 2656613, "정세현": 279357, "정용우": null, "정재훈": null, "정창영": 300559, "천영석": 5794022, "하원석": 3334400, "한지상": 4726, "한상진": 4555938 },
  { season: "2023/24", "이지용": null, "임우람": 1983212, "장용석": 144543, "장재윤": 837533, "전민호": 486351, "정세현": 2672608, "정용우": null, "정재훈": null, "정창영": 990135, "천영석": null, "하원석": 3806677, "한지상": null, "한상진": 4857744 },
  { season: "2024/25", "이지용": null, "임우람": 542178, "장용석": 7586555, "장재윤": 2277431, "전민호": 6036128, "정세현": 1578299, "정용우": null, "정재훈": null, "정창영": 1939953, "천영석": 1938678, "하원석": 4923350, "한지상": null, "한상진": 6681248 }
];

// 클럽 정보 매핑
const clubMapping = {
  "임우람": { name: "AC Milan", color: "#fb090b", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  "장용석": { name: "Manchester City", color: "#6caddf", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  "전민호": { name: "Arsenal FC", color: "#ef0107", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  "정세현": { name: "Liverpool FC", color: "#c8102e", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  "정재훈": { name: "Paris Saint-Germain", color: "#004170", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  "정창영": { name: "Chelsea FC", color: "#034694", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  "천영석": { name: "Tottenham Hotspur", color: "#132257", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
  "한지상": { name: "San Antonio Spurs", color: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg" },
  "default": { name: "Premier League", color: "#3d195b", logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" }
};

const getClub = (name) => clubMapping[name] || clubMapping.default;

// ==========================================
// 2. Helper Functions (Colors)
// ==========================================

// 세계 순위 색상 (Log Scale) - 이름 변경 getWorldRankColor
const getWorldRankColor = (rank) => {
  if (typeof rank !== 'number') return { backgroundColor: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0' };
  
  const RANK_1 = 1;
  const RANK_10K = 10000;
  const RANK_50K = 50000;
  const RANK_500K = 500000;
  const RANK_WORST = 8000000;

  let hue, saturation, lightness, alpha, fontWeight, boxShadow;
  
  if (rank <= RANK_10K) {
    const ratio = (Math.log(rank) - Math.log(RANK_1)) / (Math.log(RANK_10K) - Math.log(RANK_1));
    hue = 170 - (ratio * 15); saturation = 95; lightness = 35; alpha = 0.25; fontWeight = '900'; 
    boxShadow = `0 0 6px hsla(${hue}, 80%, 40%, 0.4)`; 
  } else if (rank <= RANK_50K) {
    const ratio = (Math.log(rank) - Math.log(RANK_10K)) / (Math.log(RANK_50K) - Math.log(RANK_10K));
    hue = 150 - (ratio * 25); saturation = 90; lightness = 40; alpha = 0.2; fontWeight = '800';
  } else if (rank <= RANK_500K) {
    const ratio = (Math.log(rank) - Math.log(RANK_50K)) / (Math.log(RANK_500K) - Math.log(RANK_50K));
    hue = 120 - (ratio * 60); saturation = 85; lightness = 45; alpha = 0.15; fontWeight = '700';
  } else {
    const ratio = (Math.log(rank) - Math.log(RANK_500K)) / (Math.log(RANK_WORST) - Math.log(RANK_500K));
    const safeRatio = Math.min(Math.max(ratio, 0), 1);
    hue = 60 - (safeRatio * 60); saturation = 90; lightness = 50; alpha = 0.1; fontWeight = '600';
  }
  
  return {
    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`,
    color: `hsl(${hue}, ${saturation}%, ${Math.max(20, lightness - 20)}%)`,
    borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`,
    fontWeight: fontWeight || 'normal',
    boxShadow: boxShadow || 'none'
  };
};

// 리그 순위 색상
const getLeagueRankColorStyle = (rank, total = 13) => {
  if (rank === 1) return { 
    backgroundColor: '#fbbf24', 
    color: '#ffffff', 
    fontWeight: '900',
    boxShadow: '0 2px 4px rgba(251, 191, 36, 0.4)',
    border: 'none'
  };
  
  if (typeof rank !== 'number' || rank < 1) return { backgroundColor: '#f1f5f9', color: '#94a3b8' };

  const maxIndex = Math.max(total - 1, 1);
  const currentIndex = rank - 2; 
  const ratio = Math.min(Math.max(currentIndex / maxIndex, 0), 1);
  
  const hue = 140 - (ratio * 140); 
  
  return {
    backgroundColor: `hsla(${hue}, 80%, 45%, 0.1)`,
    color: `hsl(${hue}, 80%, 35%)`,
    borderColor: `hsla(${hue}, 80%, 45%, 0.3)`,
    fontWeight: '800',
    borderWidth: '1px'
  };
};

const App = () => {
  const [activeTab, setActiveTab] = useState('winners');
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [modalPlayer, setModalPlayer] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]); 

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const seasonStats = useMemo(() => {
    return rawData.map(d => {
      const scores = playersList
        .map(p => ({ name: p, score: d[p] }))
        .filter(x => typeof x.score === 'number')
        .sort((a, b) => b.score - a.score);
      
      if (scores.length === 0) return null;
      
      const winner = scores[0];
      const winnerRank = rankData.find(r => r.season === d.season)?.[winner.name];
      
      const leagueRanks = {};
      const sortedPlayers = [];
      
      scores.forEach((s, idx) => {
        leagueRanks[s.name] = idx + 1;
        sortedPlayers[idx] = s.name;
      });

      return { 
        season: d.season, 
        winner: winner.name, 
        score: winner.score, 
        worldRank: winnerRank ? `#${winnerRank.toLocaleString()}` : "N/A",
        rawWorldRank: winnerRank,
        leagueRanks,
        sortedPlayers,
        totalParticipants: scores.length
      };
    }).filter(x => x !== null);
  }, []);

  const allTimeRecords = useMemo(() => {
    const records = [];
    rawData.forEach(seasonData => {
      playersList.forEach(player => {
        const score = seasonData[player];
        const rankDataForSeason = rankData.find(r => r.season === seasonData.season);
        const rank = rankDataForSeason ? rankDataForSeason[player] : null;

        if (typeof score === 'number') {
           records.push({
             name: player,
             season: seasonData.season,
             score: score,
             rank: typeof rank === 'number' ? rank : null
           });
        }
      });
    });
    return records;
  }, []);

  const top10AllTimeScores = useMemo(() => [...allTimeRecords].sort((a, b) => b.score - a.score).slice(0, 10), [allTimeRecords]);
  const top10AllTimeRanks = useMemo(() => [...allTimeRecords].filter(r => r.rank !== null).sort((a, b) => a.rank - b.rank).slice(0, 10), [allTimeRecords]);

  const playerHonors = useMemo(() => {
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

      const winningSeasons = seasonStats
        .filter(s => s.winner === name)
        .map(s => s.season)
        .sort();

      return { name, wins, maxScore, maxScoreSeason, bestRank, bestRankSeason, winningSeasons, participationCount };
    }).filter(p => p.maxScore > 0).sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        const rankA = a.bestRank !== null ? a.bestRank : Infinity;
        const rankB = b.bestRank !== null ? b.bestRank : Infinity;
        return rankA - rankB;
    });
  }, [seasonStats]);

  const top10Wins = useMemo(() => [...playerHonors].filter(p => p.wins > 0).sort((a, b) => b.wins - a.wins).slice(0, 10), [playerHonors]);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      const currentSeasonStats = seasonStats.find(s => s.season === label);
      // type: 'score' -> 내림차순, 'worldRank' or 'rank' -> 오름차순 (1위가 위로)
      const sortedPayload = [...payload].sort((a, b) => {
        if (type === 'worldRank' || type === 'rank') return a.value - b.value;
        return b.value - a.value;
      });

      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[180px]">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">{label}</p>
          <div className="space-y-2">
            {sortedPayload.map((entry, index) => {
              const leagueRank = currentSeasonStats?.leagueRanks[entry.name];
              const displayVal = entry.value.toLocaleString();
              
              const isWorldRank = type === 'worldRank' || type === 'rank';
              const formattedVal = isWorldRank ? `#${displayVal}` : displayVal;
              const rankStyle = isWorldRank ? getWorldRankColor(entry.value) : {};

              const leagueRankStyle = getLeagueRankColorStyle(leagueRank, currentSeasonStats?.totalParticipants || 13);

              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span 
                        className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-transparent"
                        style={{
                            backgroundColor: leagueRankStyle.backgroundColor,
                            color: leagueRankStyle.color,
                            borderColor: leagueRankStyle.borderColor,
                            boxShadow: leagueRank === 1 ? leagueRankStyle.boxShadow : 'none'
                        }}
                    >
                      {leagueRank}
                    </span>
                    <span className="text-xs font-bold text-slate-700" style={{ color: entry.stroke }}>{entry.name}</span>
                  </div>
                  <span 
                    className="text-xs font-black text-slate-900 px-1.5 rounded-md"
                    style={isWorldRank ? { backgroundColor: rankStyle.backgroundColor, color: rankStyle.color } : {}}
                  >
                    {formattedVal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const ScoreCustomDot = (props) => {
    const { cx, cy, payload, dataKey, stroke } = props;
    if (!cx || !cy || !payload || !dataKey) return null;
    const currentScores = playersList.map(p => payload[p]).filter(v => typeof v === 'number');
    const maxVal = Math.max(...currentScores);
    const isWinner = payload[dataKey] === maxVal && payload[dataKey] > 0;
    const isFocused = highlightedUser === null || highlightedUser === dataKey;
    if (!isFocused || !payload[dataKey]) return null;
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

  const RankCustomDot = (props) => {
    const { cx, cy, payload, dataKey, stroke } = props;
    if (!cx || !cy || !payload || !dataKey) return null;
    const currentRanks = playersList.map(p => payload[p]).filter(v => typeof v === 'number');
    const minVal = Math.min(...currentRanks);
    const isBest = payload[dataKey] === minVal && payload[dataKey] > 0;
    const isFocused = highlightedUser === null || highlightedUser === dataKey;
    if (!isFocused || !payload[dataKey]) return null;
    return (
      <g>
        {isBest && (
          <foreignObject x={cx - 10} y={cy - 28} width="20" height="20">
            <Crown size={18} fill="#FFD700" color="#B8860B" />
          </foreignObject>
        )}
        <circle cx={cx} cy={cy} r={isBest ? 5 : 3} fill={stroke} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };

  const renderModal = () => {
    if (!modalPlayer) return null;
    const playerRecord = rawData.map(d => {
      const seasonInfo = seasonStats.find(s => s.season === d.season);
      const score = d[modalPlayer.name];
      const leagueRank = seasonInfo?.leagueRanks[modalPlayer.name];
      const worldRank = rankData.find(r => r.season === d.season)?.[modalPlayer.name];
      if (score === null || score === undefined) return null;
      return { season: d.season, score, leagueRank, worldRank };
    }).filter(x => x !== null);

    const rankCounts = {};
    playerRecord.forEach(rec => {
      if (!rankCounts[rec.leagueRank]) rankCounts[rec.leagueRank] = [];
      rankCounts[rec.leagueRank].push(rec.season);
    });
    
    const winningSeasons = playerRecord.filter(r => r.leagueRank === 1).map(r => r.season);
    const stats = playerHonors.find(p => p.name === modalPlayer.name) || {};
    const totalSeasons = rawData.length;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalPlayer(null)} />
        <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-500 flex flex-col">
          <div className="bg-[#3d195b] p-8 text-white flex justify-between items-start shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <img src={getClub(modalPlayer.name).logo} className="w-10 h-10 object-contain" alt="" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic">{modalPlayer.name}</h3>
                <p className="text-[#00ff85] font-bold text-xs uppercase tracking-widest mt-1">{getClub(modalPlayer.name).name}</p>
              </div>
            </div>
            <button onClick={() => setModalPlayer(null)} className="p-2 hover:bg-white/10 rounded-xl transition">
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto p-6 no-scrollbar">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center">
                <Trophy size={20} className="mx-auto text-yellow-500 mb-2" />
                <div className="text-xs font-bold text-slate-400 uppercase">Wins</div>
                <div className="text-xl font-black text-slate-800 mb-1">{stats.wins}</div>
                {winningSeasons.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {winningSeasons.map(season => (
                      <span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500">
                        {season}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center">
                <Activity size={20} className="mx-auto text-orange-500 mb-2" />
                <div className="text-xs font-bold text-slate-400 uppercase">Participation</div>
                <div className="text-xl font-black text-slate-800 mb-1">
                    <span className="text-2xl">{stats.participationCount}</span>
                    <span className="text-slate-400 text-sm font-bold ml-1">/ {totalSeasons}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Seasons</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center">
                <TrendingUp size={20} className="mx-auto text-green-500 mb-2" />
                <div className="text-xs font-bold text-slate-400 uppercase">Best Points</div>
                <div className="text-xl font-black text-slate-800 mb-1">{stats.maxScore?.toLocaleString()}</div>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500">
                  {stats.maxScoreSeason}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center">
                <Globe size={20} className="mx-auto text-blue-500 mb-2" />
                <div className="text-xs font-bold text-slate-400 uppercase">Best Rank</div>
                <div className="text-xl font-black text-slate-800 mb-1">#{stats.bestRank?.toLocaleString()}</div>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500">
                  {stats.bestRankSeason}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500"/> Rank Distribution
              </h4>
              <div className="space-y-2">
                {Object.keys(rankCounts).sort((a, b) => Number(a) - Number(b)).map(rank => {
                  const r = Number(rank);
                  const leagueRankStyle = getLeagueRankColorStyle(r, 13);
                  return (
                  <div key={rank} className="flex items-start text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black mr-3 shrink-0 border border-transparent`}
                        style={{
                            backgroundColor: leagueRankStyle.backgroundColor,
                            color: leagueRankStyle.color,
                            borderColor: leagueRankStyle.borderColor,
                            boxShadow: r === 1 ? leagueRankStyle.boxShadow : 'none'
                        }}
                    >
                      {rank}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 mb-1 flex items-center">
                        {rank === '1' ? 'Champion' : `${rank}위`}
                        <span className="text-slate-900 font-black ml-1">: {rankCounts[rank].length}회</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rankCounts[rank].map(season => (
                          <span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-500">{season}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                <ListOrdered size={16} className="text-indigo-500"/> Full History
              </h4>
              <div className="space-y-2">
                <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 rounded-xl">
                  <span>Season</span>
                  <span className="text-center">Points</span>
                  <span className="text-center">League</span>
                  <span className="text-right">Global</span>
                </div>
                {playerRecord.reverse().map((rec, i) => {
                  const rankStyle = typeof rec.worldRank === 'number' ? getWorldRankColor(rec.worldRank) : {};
                  const leagueRankStyle = getLeagueRankColorStyle(rec.leagueRank, 13);
                  return (
                  <div key={i} className="grid grid-cols-4 items-center bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 p-3 rounded-xl transition group">
                    <span className="text-xs font-black text-slate-500 group-hover:text-indigo-600 italic">{rec.season}</span>
                    <span className="text-sm font-bold text-slate-700 text-center">{rec.score.toLocaleString()}</span>
                    <div className="flex justify-center">
                      <span 
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black border border-transparent`}
                        style={{
                            backgroundColor: leagueRankStyle.backgroundColor,
                            color: leagueRankStyle.color,
                            borderColor: leagueRankStyle.borderColor,
                            boxShadow: rec.leagueRank === 1 ? leagueRankStyle.boxShadow : 'none'
                        }}
                      >
                        {rec.leagueRank}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span 
                        className="text-[9px] font-bold flex items-center justify-center px-2 py-0.5 rounded-lg transition-all"
                        style={rankStyle}
                      >
                        #{rec.worldRank?.toLocaleString() || '-'}
                      </span>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0">
             <button onClick={() => setModalPlayer(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-slate-200 w-full">Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {renderModal()}
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
            {[
              { id: 'winners', label: '역대 우승자', icon: <Medal size={16}/> },
              { id: 'honors', label: '명예의 전당', icon: <Star size={16}/> },
              { id: 'trend', label: '트렌드 분석', icon: <TrendingUp size={16}/> },
              { id: 'rankTrend', label: '리그 순위 변화', icon: <ListOrdered size={16}/> },
              { id: 'data', label: '전체 데이터', icon: <Users size={16}/> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00ff85] text-[#3d195b] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70'}`}>
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
                      <img src={club.logo} alt={club.name} className="w-full h-full object-contain" />
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

        {/* ... (명예의 전당 등 다른 탭들은 이전과 동일) ... */}
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
                          <div className="flex justify-between items-center mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-white shadow-md"><Crown size={16} fill="white" /></span><span className="text-xl font-black text-slate-900">{p.name}</span></div><span className="text-3xl font-black text-[#3d195b]">{p.wins}회</span></div>
                          <div className="flex flex-wrap gap-1 pl-11">{p.winningSeasons.map(season => (<span key={season} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-bold shadow-sm">{season}</span>))}</div>
                        </div>
                      ))}
                      {expandedSections.includes('wins') && top10Wins.slice(1).map((p, idx) => (
                        <div key={p.name} onClick={() => setModalPlayer(p)} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><div className="flex flex-wrap gap-1 mt-0.5">{p.winningSeasons.map(season => (<span key={season} className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded">{season}</span>))}</div></div></div><span className="font-black text-[#3d195b]">{p.wins}회</span>
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
                          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md"><Crown size={16} fill="white" /></span><div><div className="text-xl font-black text-slate-900">{p.name}</div><span className="px-2 py-0.5 bg-white border border-green-100 rounded text-[10px] text-slate-500 font-bold shadow-sm inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div></div><div className="text-right"><span className="text-3xl font-black text-[#3d195b]">{p.score.toLocaleString()}</span><span className="text-xs font-bold text-slate-400 ml-1">pts</span></div>
                        </div>
                      )})}
                      {expandedSections.includes('scores') && top10AllTimeScores.slice(1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><span className="text-[10px] text-slate-400 inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div><span className="font-black text-[#3d195b]">{p.score.toLocaleString()}</span>
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
                          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><span className="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md"><Crown size={16} fill="white" /></span><div><div className="text-xl font-black text-slate-900">{p.name}</div><span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-[10px] text-slate-500 font-bold shadow-sm inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div></div><div className="text-right"><span className="text-2xl font-black text-[#3d195b]">#{p.rank.toLocaleString()}</span></div>
                        </div>
                      )})}
                      {expandedSections.includes('ranks') && top10AllTimeRanks.slice(1).map((p, idx) => {
                        const isWinnerInSeason = seasonStats.find(s => s.season === p.season)?.winner === p.name;
                        return (
                        <div key={`${p.name}-${p.season}`} onClick={() => setModalPlayer({ name: p.name })} className="flex justify-between items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition animate-in slide-in-from-top-2 fade-in">
                          <div className="flex items-center gap-3"><span className="text-xs font-black w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">{idx + 2}</span><div><div className="font-bold text-slate-700 group-hover:text-[#3d195b] transition">{p.name}</div><span className="text-[10px] text-slate-400 inline-flex items-center gap-1">{p.season}{isWinnerInSeason && <Crown size={10} fill="#FFD700" color="#B8860B" />}</span></div></div><span className="font-black text-[#3d195b]">#{p.rank.toLocaleString()}</span>
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
                    <div><span className="text-slate-100 text-6xl font-black absolute -left-3 -top-3 select-none group-hover:text-slate-50 transition-colors">#{idx + 1}</span><h3 className="text-2xl font-black text-slate-800 relative z-10 pl-2">{player.name}</h3></div><img src={getClub(player.name).logo} alt="Club" className="w-10 h-10 object-contain opacity-20 group-hover:opacity-100 transition duration-500" />
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="season" fontSize={10} fontWeight="900" tickMargin={15} stroke="#cbd5e1" /><YAxis scale="log" domain={['dataMin - 100', 'dataMax + 100']} fontSize={10} fontWeight="900" stroke="#cbd5e1" /><Tooltip content={<CustomTooltip type="score" />} />
                      {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={highlightedUser === null || highlightedUser === name ? 5 : 1.5} strokeOpacity={highlightedUser === null || highlightedUser === name ? 1 : 0.08} dot={<ScoreCustomDot />} activeDot={{ r: 8, strokeWidth: 0 }} connectNulls animationDuration={1500} />))}
                    </LineChart>
                  </ResponsiveContainer></div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Globe size={16} className="text-blue-500" /> 2. 세계 순위 추이 (World Rank Trend - Log Scale)</h3>
                <div className="h-[400px] w-full"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rankData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="season" fontSize={10} fontWeight="900" tickMargin={15} stroke="#cbd5e1" /><YAxis reversed scale="log" domain={['dataMin', 'dataMax']} fontSize={10} fontWeight="900" stroke="#cbd5e1" /><Tooltip content={<CustomTooltip type="worldRank" />} />
                      {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={highlightedUser === null || highlightedUser === name ? 5 : 1.5} strokeOpacity={highlightedUser === null || highlightedUser === name ? 1 : 0.08} dot={<RankCustomDot />} activeDot={{ r: 8, strokeWidth: 0 }} connectNulls animationDuration={1500} />))}
                    </LineChart>
                  </ResponsiveContainer></div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-10 mt-10 border-t border-slate-50">
                {playersList.map((name) => (<button key={name} onClick={() => setHighlightedUser(highlightedUser === name ? null : name)} className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${highlightedUser === name ? 'bg-slate-900 text-white shadow-xl scale-110 z-10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}><div className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: getClub(name).color }} /><span className="text-xs font-black tracking-tight">{name}</span></button>))}
                {highlightedUser && (<button onClick={() => setHighlightedUser(null)} className="ml-4 px-4 py-3 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors uppercase tracking-widest">Show All</button>)}
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
                        onClick={() => setHighlightedUser(highlightedUser === name ? null : name)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                          highlightedUser === name 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                    {highlightedUser && (
                      <button onClick={() => setHighlightedUser(null)} className="px-2 py-1 text-[10px] font-black text-indigo-500 hover:underline">Reset</button>
                    )}
                 </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100">
                    <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] text-center min-w-[80px]">Rank</th>
                    {seasonStats.map(stat => (
                      <th key={stat.season} className="p-6 min-w-[140px] border-r border-slate-50 last:border-0 text-center">
                        <span className="font-black text-xs text-slate-700">{stat.season}</span>
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
                          const isHighlighted = highlightedUser && highlightedUser === playerName;
                          const isDimmed = highlightedUser && highlightedUser !== playerName;
                          
                          // 리그 순위 변화 표에서도 세계 순위에 색상 적용
                          const rankStyle = typeof worldRank === 'number' ? getWorldRankColor(worldRank) : {};

                          // 리그 순위 배경색 적용 (1등은 골드, 나머지는 순위에 따라 그라데이션)
                          const cellStyle = getLeagueRankColorStyle(rank, stat.totalParticipants);

                          return (
                            <td key={stat.season} className={`p-4 border-r border-slate-50 last:border-0 align-top transition-opacity duration-300 ${isDimmed ? 'opacity-20 blur-[1px]' : 'opacity-100'}`} style={{ backgroundColor: rankStyle.backgroundColor }}>
                              <div className={`flex flex-col items-center gap-1.5 ${isHighlighted ? 'scale-110 transform transition-transform' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <img src={club.logo} alt="" className="w-5 h-5 object-contain" />
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

        {activeTab === 'data' && (
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"><h2 className="font-black italic flex items-center gap-3 text-[#3d195b] text-xl"><Users size={22}/> 통합 성적 아카이브</h2></div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-100"><th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">시즌</th>
                    {playersList.map(p => (<th key={p} className="p-6 min-w-[150px] border-r border-slate-50 last:border-0 group"><div className="flex items-center gap-3"><img src={getClub(p).logo} alt="" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" /><span className="font-black text-[11px] text-slate-700">{p}</span></div></th>))}
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
