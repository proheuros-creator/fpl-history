import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Users, Award, Star, Globe, Medal, Crown } from 'lucide-react';

// 시즌별 승점 데이터
const rawData = [
  { season: "2010/11", "이지용": null, "임우람": 1838, "장용석": 1346, "장재윤": 1416, "전민호": null, "정세현": null, "정용우": null, "정재훈": 1367, "정창영": 1889, "천영석": null, "하원석": null, "한지상": null, "한상진": null },
  { season: "2011/12", "이지용": null, "임우람": 1919, "장용석": null, "장재윤": 1751, "전민호": 2047, "정세현": null, "정용우": null, "정재훈": 2015, "정창영": 1912 },
  { season: "2012/13", "이지용": null, "임우람": 1984, "장용석": null, "장재윤": 1743, "전민호": 2069, "정세현": 1735, "정재훈": 1967, "정창영": 1966, "천영석": 1879 },
  { season: "2013/14", "이지용": null, "임우람": 2220, "장재윤": 1745, "전민호": 2168, "정세현": 2036, "정재훈": 1974, "정창영": 2041, "천영석": 1931 },
  { season: "2014/15", "이지용": 1580, "임우람": 1848, "장재윤": 1763, "전민호": 1908, "정세현": 2027, "정재훈": 1695, "정창영": 1964, "천영석": 1891 },
  { season: "2015/16", "이지용": 1890, "임우람": 1982, "장재윤": 1954, "전민호": 2060, "정세현": 1906, "정용우": 2039, "정재훈": 1944, "정창영": 2103, "천영석": 1943 },
  { season: "2016/17", "이지용": 1586, "임우람": 2118, "장용석": 2330, "장재윤": 2009, "전민호": 1951, "정세현": 1913, "정용우": 2160, "정재훈": 1762, "정창영": 1963, "천영석": 1878 },
  { season: "2017/18", "이지용": 1636, "임우람": 2010, "장용석": 2197, "장재윤": 1969, "전민호": 2270, "정세현": 2231, "정용우": 2167, "정재훈": 2199, "정창영": 2137, "천영석": 2018, "하원석": 1961, "한지상": 1700 },
  { season: "2018/19", "임우람": 2120, "장용석": 2334, "장재윤": 2025, "전민호": 2204, "정세현": 2081, "정용우": 2204, "정재훈": 2151, "정창영": 2211, "천영석": 2056, "하원석": 1786, "한지상": 2270 },
  { season: "2019/20", "임우람": 2151, "장용석": 2414, "장재윤": 2190, "전민호": 2169, "정세현": 2250, "정용우": 2298, "정재훈": 2187, "정창영": 2289, "천영석": 2055, "하원석": 2269, "한지상": 2274, "한상진": 1716 },
  { season: "2020/21", "임우람": 2368, "장용석": 2297, "장재윤": 2285, "전민호": 2140, "정세현": 2420, "정용우": 2302, "정재훈": 2406, "정창영": 2409, "천영석": 2447, "하원석": 2022, "한지상": 2368, "한상진": 1871 },
  { season: "2021/22", "임우람": 2307, "장용석": 2423, "장재윤": 2383, "전민호": 2048, "정세현": 1963, "정창영": 2339, "천영석": 1959, "하원석": 2257, "한상진": 1919 },
  { season: "2022/23", "임우람": 2273, "장용석": 2558, "장재윤": 2333, "전민호": 2203, "정세현": 2469, "정창영": 2464, "천영석": 1955, "하원석": 2150, "한상진": 2055 },
  { season: "2023/24", "임우람": 2216, "장용석": 2465, "장재윤": 2323, "전민호": 2375, "정세현": 2164, "정창영": 2305, "하원석": 2079, "한상진": 1994 },
  { season: "2024/25", "임우람": 2405, "장용석": 1792, "장재윤": 2240, "전민호": 1949, "정세현": 2294, "정창영": 2265, "천영석": 2265, "하원석": 2050, "한상진": 1883 }
];

// 시즌별 세계 순위 데이터
const rankData = [
  { season: "2010/11", "이지용": null, "임우람": 488858, "장용석": 2044453, "장재윤": 1919854, "정재훈": 2010131, "정창영": 320870 },
  { season: "2011/12", "임우람": 367085, "장재윤": 1026060, "전민호": 91994, "정재훈": 138279, "정창영": 389776 },
  { season: "2012/13", "임우람": 264342, "장재윤": 1253182, "전민호": 99067, "정세현": 1290044, "정재훈": 311838, "정창영": 315403, "천영석": 635078 },
  { season: "2013/14", "임우람": 236645, "장재윤": 1890898, "전민호": 393568, "정세현": 899505, "정재훈": 1140409, "정창영": 878573, "천영석": 1299089 },
  { season: "2014/15", "이지용": 2199131, "임우람": 852480, "장재윤": 1306012, "전민호": 548999, "정세현": 151328, "정재훈": 1646552, "정창영": 320759, "천영석": 628997 },
  { season: "2015/16", "이지용": 1286580, "임우람": 747000, "장재윤": 907113, "전민호": 364313, "정세현": 1195929, "정용우": 454652, "정재훈": 965642, "정창영": 213623, "천영석": 971034 },
  { season: "2016/17", "이지용": 3144335, "임우람": 197136, "장용석": 5882, "장재윤": 564450, "전민호": 861550, "정세현": 1087148, "정용우": 118309, "정재훈": 2085800, "정창영": 795337, "천영석": 1304172 },
  { season: "2017/18", "이지용": 4016193, "임우람": 1100809, "장용석": 132207, "장재윤": 1431587, "전민호": 30851, "정세현": 72189, "정용우": 211329, "정재훈": 127232, "정창영": 316724, "천영석": 1031065, "하원석": 1498748, "한지상": 3569025 },
  { season: "2018/19", "임우람": 694211, "장용석": 31160, "장재윤": 1589264, "전민호": 256535, "정세현": 1011675, "정용우": 258014, "정재훈": 493419, "정창영": 234075, "천영석": 1250565, "하원석": 4176389, "한지상": 97859 },
  { season: "2019/20", "임우람": 548058, "장용석": 1485, "장재윤": 337871, "전민호": 440940, "정세현": 134969, "정용우": 51944, "정재훈": 352286, "정창영": 62604, "천영석": 1315076, "하원석": 95030, "한지상": 85191, "한상진": 5151898 },
  { season: "2020/21", "임우람": 149364, "장용석": 375991, "장재윤": 427962, "전민호": 1357913, "정세현": 59523, "정용우": 356857, "정재훈": 77566, "정창영": 73420, "천영석": 32660, "하원석": 2410493, "한지상": 147457, "한상진": 3861290 },
  { season: "2021/22", "임우람": 630610, "장용석": 251837, "장재윤": 357532, "전민호": 2356910, "정세현": 3147382, "정창영": 501060, "천영석": 3180491, "하원석": 866734, "한상진": 3582231 },
  { season: "2022/23", "임우람": 1826166, "장용석": 47291, "장재윤": 1197568, "전민호": 2656613, "정세현": 279357, "정창영": 300559, "천영석": 5794022, "하원석": 3334400, "한상진": 4555938 },
  { season: "2023/24", "임우람": 1983212, "장용석": 144543, "장재윤": 837533, "전민호": 486351, "정세현": 2672608, "정창영": 990135, "하원석": 3806677, "한상진": 4857744 },
  { season: "2024/25", "임우람": 542178, "장용석": 7586555, "장재윤": 2277431, "전민호": 6036128, "정세현": 1578299, "정창영": 1939953, "천영석": 1938678, "하원석": 4923350, "한상진": 6681248 }
];

const playersList = ["이지용", "임우람", "장용석", "장재윤", "전민호", "정세현", "정용우", "정재훈", "정창영", "천영석", "하원석", "한지상", "한상진"];

// 클럽 정보 매핑
const clubMapping = {
  "임우람": { name: "AC 밀란", color: "#fb090b", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  "장용석": { name: "맨체스터 시티", color: "#6caddf", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  "전민호": { name: "아스날", color: "#ef0107", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  "정세현": { name: "리버풀", color: "#c8102e", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  "정재훈": { name: "맨체스터 유나이티드", color: "#da291c", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  "정창영": { name: "첼시", color: "#034694", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  "천영석": { name: "토트넘", color: "#132257", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
  "default": { name: "기타", color: "#3d195b", logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" }
};

const getClub = (name) => clubMapping[name] || clubMapping.default;

const App = () => {
  const [activeTab, setActiveTab] = useState('winners');
  const [highlightedUser, setHighlightedUser] = useState(null);

  const seasonStats = useMemo(() => {
    return rawData.map(d => {
      const scores = playersList
        .map(p => ({ name: p, score: d[p] }))
        .filter(x => typeof x.score === 'number');
      
      if (scores.length === 0) return null;
      const winner = scores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
      return { season: d.season, winner: winner.name, score: winner.score, maxScore: winner.score };
    }).filter(x => x !== null);
  }, []);

  const playerHonors = useMemo(() => {
    const winCounts = {};
    playersList.forEach(p => winCounts[p] = 0);
    seasonStats.forEach(sw => { if (sw && sw.winner) winCounts[sw.winner]++; });

    return playersList.map(name => {
      const scores = rawData.map(d => d[name]).filter(s => typeof s === 'number');
      const ranks = rankData.map(d => d[name]).filter(r => typeof r === 'number');
      
      const wins = winCounts[name] || 0;
      const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
      const maxScoreSeason = scores.length > 0 ? (rawData.find(d => d[name] === maxScore)?.season || '-') : '-';
      const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;
      const bestRankSeason = ranks.length > 0 ? (rankData.find(d => d[name] === bestRank)?.season || '-') : '-';
      
      return { name, wins, maxScore, maxScoreSeason, bestRank, bestRankSeason };
    }).sort((a, b) => b.wins - a.wins || (a.bestRank || Infinity) - (b.bestRank || Infinity));
  }, [seasonStats]);

  const mostWinsPlayer = playerHonors[0] || { name: '-', wins: 0 };
  const bestScorePlayer = playerHonors.reduce((prev, current) => (prev.maxScore > current.maxScore) ? prev : current, { name: '-', maxScore: 0, maxScoreSeason: '-' });
  const bestRankPlayer = playerHonors.reduce((prev, current) => {
    if (prev.bestRank === null) return current;
    if (current.bestRank === null) return prev;
    return (prev.bestRank < current.bestRank) ? prev : current;
  }, { name: '-', bestRank: null, bestRankSeason: '-' });

  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey, stroke } = props;
    if (!cx || !cy || !payload || !dataKey) return null;
    const scores = playersList.map(p => payload[p]).filter(v => typeof v === 'number');
    const max = scores.length > 0 ? Math.max(...scores) : -1;
    const isWinner = payload[dataKey] === max && payload[dataKey] > 0;
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-[#3d195b] text-white p-6 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter leading-none text-white">BAEKDOO FANTASY LEAGUE</h1>
              <p className="text-sm text-[#00ff85] font-bold mt-1 tracking-widest uppercase">History of 15 Seasons</p>
            </div>
          </div>
          <nav className="flex bg-white/10 rounded-2xl p-1 backdrop-blur-sm border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {[{ id: 'winners', label: '역대 우승자', icon: <Medal size={16}/> }, { id: 'honors', label: '명예의 전당', icon: <Star size={16}/> }, { id: 'trend', label: '트렌드 분석', icon: <TrendingUp size={16}/> }, { id: 'data', label: '전체 데이터', icon: <Users size={16}/> }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00ff85] text-[#3d195b] shadow-lg scale-105' : 'hover:bg-white/10 text-white/70'}`}>
                {tab.icon} <span>{tab.label}</span>
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
                const rank = rankData.find(d => d.season === win.season)?.[win.winner];
                return (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-xl group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center p-2 bg-slate-50 rounded-2xl shadow-inner group-hover:bg-white transition-colors">
                      <img src={club.logo} alt={club.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-xs font-black text-slate-400 mb-1 tracking-tighter">{win.season}</p>
                    <p className="text-lg font-black text-slate-900 mb-2 leading-tight">{win.winner}</p>
                    <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black w-full flex items-center justify-center gap-1 border border-indigo-100 shadow-sm"><Globe size={10} /> {typeof rank === 'number' ? `#${rank.toLocaleString()}` : '-'}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{typeof win.score === 'number' ? `${win.score.toLocaleString()} pts` : '-'}</div>
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
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-[#3d195b] flex items-center justify-between group hover:shadow-md transition">
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">역대 최다 우승자</p><p className="text-3xl font-black text-[#3d195b]">{mostWinsPlayer.name}</p><p className="text-sm font-bold text-slate-500 mt-1">총 {mostWinsPlayer.wins}회 챔피언</p></div><div className="bg-slate-50 p-3 rounded-2xl"><Medal className="w-10 h-10 text-[#3d195b]" /></div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-[#00ff85] flex items-center justify-between group hover:shadow-md transition">
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">역대 최고 점수</p><p className="text-3xl font-black text-[#3d195b]">{bestScorePlayer.maxScore?.toLocaleString() || '0'}</p><p className="text-sm font-bold text-slate-500 mt-1">{bestScorePlayer.name} ({bestScorePlayer.maxScoreSeason})</p></div><div className="bg-slate-50 p-3 rounded-2xl"><TrendingUp className="w-10 h-10 text-[#00ff85]" /></div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-[#0075ff] flex items-center justify-between group hover:shadow-md transition">
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">역대 최고 세계 순위</p><p className="text-3xl font-black text-[#3d195b]">{bestRankPlayer.bestRank ? `#${bestRankPlayer.bestRank.toLocaleString()}` : '-'}</p><p className="text-sm font-bold text-slate-500 mt-1">{bestRankPlayer.name} ({bestRankPlayer.bestRankSeason})</p></div><div className="bg-slate-50 p-3 rounded-2xl"><Globe className="w-10 h-10 text-[#0075ff]" /></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerHonors.map((player, idx) => (
                <div key={player.name} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-[#00ff85] transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div><span className="text-slate-100 text-6xl font-black absolute -left-3 -top-3 select-none group-hover:text-slate-50 transition-colors">#{idx + 1}</span><h3 className="text-2xl font-black text-slate-800 relative z-10 pl-2">{player.name}</h3></div><img src={getClub(player.name).logo} alt="Club" className="w-10 h-10 object-contain opacity-20 group-hover:opacity-100 transition duration-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">우승 횟수</span><span className="text-xl font-black text-[#e90052]">{player.wins} Wins</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">최고 점수</span><span className="text-base font-black text-slate-700">{player.maxScore?.toLocaleString() || '0'} pts</span></div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">베스트 랭킹</span><span className="text-base font-black text-[#0075ff]">{player.bestRank ? `#${player.bestRank.toLocaleString()}` : '-'}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trend' && (
          <section className="animate-in fade-in duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div><h2 className="text-2xl font-black flex items-center gap-3 italic text-slate-800"><TrendingUp className="text-[#0075ff] w-8 h-8" /> SEASONAL TRENDS</h2><p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider italic">이름을 클릭하면 강조됩니다</p></div><div className="bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-500 flex items-center gap-1"><Crown size={12} fill="#FFD700" color="#B8860B" /> SEASON CHAMPION</div>
              </div>
              <div className="h-[480px] w-full mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rawData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="season" fontSize={10} fontWeight="900" tickMargin={15} stroke="#cbd5e1" /><YAxis domain={['auto', 'auto']} fontSize={10} fontWeight="900" stroke="#cbd5e1" /><Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }} itemStyle={{ fontWeight: '900', fontSize: '12px', padding: '2px 0' }} />
                    {playersList.map((name) => (<Line key={name} type="monotone" dataKey={name} stroke={getClub(name).color} strokeWidth={highlightedUser === null || highlightedUser === name ? 5 : 1.5} strokeOpacity={highlightedUser === null || highlightedUser === name ? 1 : 0.08} dot={<CustomDot />} activeDot={{ r: 8, strokeWidth: 0 }} connectNulls animationDuration={1500} />))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-10 border-t border-slate-50">
                {playersList.map((name) => (<button key={name} onClick={() => setHighlightedUser(highlightedUser === name ? null : name)} className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 ${highlightedUser === name ? 'bg-slate-900 text-white shadow-xl scale-110 z-10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}><div className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: getClub(name).color }} /><span className="text-xs font-black tracking-tight">{name}</span></button>))}
                {highlightedUser && (<button onClick={() => setHighlightedUser(null)} className="ml-4 px-4 py-3 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors">전체 보기</button>)}
              </div>
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
                    {playersList.map(p => (<th key={p} className="p-6 min-w-[150px] border-r border-slate-50 last:border-0 group"><div className="flex items-center gap-3"><img src={getClub(p).logo} alt="" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0" /><span className="font-black text-[11px] text-slate-700">{p}</span></div></th>))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((row, idx) => {
                    const seasonScores = playersList.map(pl => row[pl]).filter(s => typeof s === 'number');
                    const max = seasonScores.length > 0 ? Math.max(...seasonScores) : -1;
                    const currentRank = rankData.find(d => d.season === row.season);
                    return (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150"><td className="p-6 font-black text-xs text-[#3d195b] sticky left-0 bg-white z-10 border-r border-slate-50 italic">{row.season}</td>
                        {playersList.map(p => {
                          const score = row[p];
                          const isMax = score !== null && typeof score === 'number' && score === max;
                          const rank = currentRank?.[p];
                          return (<td key={p} className={`p-6 border-r border-slate-50 last:border-0 ${isMax ? 'bg-indigo-50/40' : ''}`}>{typeof score === 'number' ? (<div className="flex flex-col gap-2"><div className="flex items-center justify-between"><span className={`text-sm font-black ${isMax ? 'text-[#e90052]' : 'text-slate-700'}`}>{score.toLocaleString()}</span>{isMax && <div className="bg-yellow-400 p-1 rounded-md"><Crown size={12} fill="#fff" color="#fff" /></div>}</div><div className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-indigo-500 flex items-center justify-center gap-1 shadow-xs ring-1 ring-black/2 transition-all hover:scale-105"><Globe size={9} /> {typeof rank === 'number' ? `#${rank.toLocaleString()}` : '-'}</div></div>) : (<span className="text-slate-100 font-bold">-</span>)}</td>);
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

      <footer className="mt-20 p-16 text-center border-t border-slate-100"><div className="flex flex-col items-center gap-6"><img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL" className="w-16 h-16 grayscale opacity-20" /><div className="px-8 py-3 rounded-full bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Baekdoo Fantasy Legends Archive</div></div></footer>
    </div>
  );
};

export default App;
