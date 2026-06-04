import type {
  CommunityPost,
  ContactMessage,
  GameTag,
  IssueRecord,
  ScheduledSlot,
  SiteSettings,
  UserRecord,
  VisitorRecord,
} from '@/lib/types'

export const siteSettings: SiteSettings = {
  title: 'LivePatch',
  description:
    'LivePatch tracks live game bugs, patch changes, community fixes, and live issue reports across the biggest online games.',
  keywords: [
    'game bug reports',
    'gaming issue tracker',
    'patch notes',
    'live bug fixes',
    'PUBG crash fix',
    'Call of Duty Warzone issues',
    'Counter-Strike 2 bug report',
    'Apex Legends fix',
    'Fortnite bug report',
    'Valorant performance issues',
  ],
  games: [
    'Call of Duty: Warzone',
    'Counter-Strike 2',
    'Apex Legends',
    'PUBG: Battlegrounds',
    'Valorant',
    'Garena Free Fire',
    'Tom Clancy\'s Rainbow Six Siege',
    'Overwatch 2',
    'Fortnite',
    'Roblox',
    'Minecraft',
    'Ark: Survival Ascended',
    'Rust',
    'Dead by Daylight',
    'Palworld',
    "No Man's Sky",
    'EA Sports FC',
    'Grand Theft Auto Online',
    'Rocket League',
    'The Sims 4',
    'NBA 2K',
    'Forza Horizon 5',
    'Destiny 2',
    'World of Warcraft',
    'Warframe',
    'Genshin Impact',
    'Honkai: Star Rail',
    'Elden Ring',
    'The Elder Scrolls Online',
    'Fallout 76',
    'Helldivers 2',
    'Cyberpunk 2077',
    'League of Legends',
    'Dota 2',
    'Mobile Legends: Bang Bang',
    'Diablo IV',
    'Path of Exile',
    'Baldur\'s Gate 3',
    'Lost Ark',
    'Teamfight Tactics',
    'Tekken 8',
  ],
  scheduledSlots: [],
  canonicalUrl: 'https://livepatch.online',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico',
  smtpEnabled: true,
  otpRequired: true,
  smtpHost: 'smtp.resend.net',
  smtpPort: '587',
  smtpSender: 'noreply@livepatch.online',
  adminReceivers: ['allinoneg46@gmail.com'],
}

export const gameTags: GameTag[] = [
  { id: 'pubg', name: 'PUBG', color: 'from-fuchsia-500 to-violet-500' },
  { id: 'gta5', name: 'GTA 5', color: 'from-amber-400 to-orange-500' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', color: 'from-violet-500 to-blue-500' },
  { id: 'fifa25', name: 'FIFA 25', color: 'from-sky-500 to-cyan-400' },
  { id: 'fortnite', name: 'Fortnite', color: 'from-emerald-500 to-teal-400' },
  { id: 'valorant', name: 'Valorant', color: 'from-rose-500 to-orange-400' },
  { id: 'apex', name: 'Apex Legends', color: 'from-pink-500 to-fuchsia-400' },
]

export const defaultScheduledSlots: ScheduledSlot[] = []

export const issues: IssueRecord[] = [
  {
    id: 'issue-1',
    slug: 'pubg-crash-fix-patch-31-2-erangel-parachute',
    game: 'PUBG',
    patch: 'Patch 31.2',
    severity: 'Critical',
    title: 'Game crashes to desktop after parachute landing on Erangel',
    summary:
      'AI suggestions point to memory spikes in high density landing zones. Players are avoiding early crashes by switching shadows to medium and disabling replays before queueing.',
    content: [
      'LivePatch detected a spike in player reports after the latest PUBG update, especially around Erangel hot-drop locations. Reports mention the game freezing for two to four seconds before closing without a visible error.',
      'Our AI workflow combines player submissions, patch note diffs, and community fixes. AI suggestions summarize similar reports, emerging workarounds, and whether the issue is likely client side, server side, or asset related.',
      'Current community consensus points to replay capture and high shadow rendering causing the largest frame-time spikes. Until Krafton ships an official fix, the safest temporary path is lowering shadows, disabling replays, and verifying local files after the patch.',
    ],
    affected: 1243,
    fixes: 89,
    reportedAgo: '14 min ago',
    aiSource: 'AI suggestions',
    keywords: ['PUBG crash fix', 'PUBG patch 31.2 bug', 'Erangel parachute crash'],
    metaTitle: 'PUBG crash fix patch 31.2 Erangel parachute landing',
    metaDescription:
      'Track the PUBG patch 31.2 Erangel parachute crash, current workarounds, AI summary, and community fixes on LivePatch.',
    status: 'Live',
    comments: [
      {
        id: 'c-1',
        author: 'viper_knight',
        role: 'Player',
        message: 'Turning off replay capture fixed it on my 4070 instantly.',
        createdAt: '6 minutes ago',
      },
      {
        id: 'c-2',
        author: 'mod_echo',
        role: 'Moderator',
        message: 'We pinned the current workaround while waiting for a PUBG official response.',
        createdAt: '3 minutes ago',
      },
    ],
  },
  {
    id: 'issue-2',
    slug: 'pubg-invisible-wall-pochinki-church-patch-31-2',
    game: 'PUBG',
    patch: 'Patch 31.2',
    severity: 'High',
    title: 'Invisible wall collision bug near Pochinki church',
    summary:
      'AI clustering shows a map geometry mismatch after the latest asset pass. Players can avoid the dead zone by entering from the northern side path.',
    content: [
      'Players started sharing clips of a collision issue around the eastern entry point of the Pochinki church zone. The obstruction is invisible but blocks bullets and movement.',
      'AI suggestions grouped this report with map collision regressions from earlier seasonal patches. The issue is likely tied to world mesh cleanup rather than anti-cheat or latency.',
    ],
    affected: 878,
    fixes: 34,
    reportedAgo: '1 hour ago',
    aiSource: 'AI suggestions',
    keywords: ['PUBG invisible wall', 'Pochinki church collision bug'],
    metaTitle: 'PUBG invisible wall bug near Pochinki church patch 31.2',
    metaDescription:
      'Latest AI summary and player fixes for the invisible wall collision bug near the Pochinki church in PUBG patch 31.2.',
    status: 'Investigating',
    comments: [
      {
        id: 'c-3',
        author: 'sniper_x99',
        role: 'Player',
        message: 'Northern stairs route works every time. East entrance is still blocked.',
        createdAt: '24 minutes ago',
      },
    ],
  },
  {
    id: 'issue-3',
    slug: 'pubg-looting-animation-stuck-m416-backpack-full',
    game: 'PUBG',
    patch: 'Patch 31.1',
    severity: 'Medium',
    title: 'Looting animation stuck when picking up M416 with backpack full',
    summary:
      'This looks like an inventory state desync. The fastest workaround is disabling auto pickup and freeing one slot before interacting with weapons.',
    content: [
      'Community clips show the looting animation locking the character for several seconds when interacting with an M416 while the backpack inventory is already full.',
      'LivePatch AI notes this pattern matches older inventory desync bugs. It is disruptive but recoverable, making it lower severity than the live crash reports.',
    ],
    affected: 312,
    fixes: 21,
    reportedAgo: '3 hours ago',
    aiSource: 'AI suggestions',
    keywords: ['PUBG looting bug', 'M416 inventory stuck'],
    metaTitle: 'PUBG looting animation stuck M416 backpack full bug',
    metaDescription:
      'Follow the PUBG M416 looting animation bug, player workarounds, and AI generated fix summary on LivePatch.',
    status: 'Live',
    comments: [
      {
        id: 'c-4',
        author: 'admin_livepatch',
        role: 'Admin',
        message: 'We are collecting clips for the dev report. Keep posting your steps to reproduce.',
        createdAt: '1 hour ago',
      },
    ],
  },
]

export const communityPosts: CommunityPost[] = [
  {
    id: 'p-1',
    user: 'viper_knight',
    avatar: 'VK',
    game: 'PUBG',
    title: 'Replay capture off fixed the latest crash',
    message: 'Lowering shadows and disabling replay capture stabilized the build for me on Erangel.',
    helpful: 234,
    replies: 17,
  },
  {
    id: 'p-2',
    user: 'sniper_x99',
    avatar: 'SX',
    game: 'Cyberpunk 2077',
    title: 'DLSS plus frame generation stutter workaround',
    message: 'Driver rollback to the previous stable branch stopped the microstutter for my RTX 4080 setup.',
    helpful: 187,
    replies: 11,
  },
]

export const contactMessages: ContactMessage[] = [
  {
    id: 'ct-1',
    name: 'Areeb Khan',
    email: 'areeb@playermail.gg',
    topic: 'Advertising partnership',
    message: 'We would like to discuss a sponsorship slot around the issue feed and patch note carousel.',
    createdAt: '2026-06-02 14:20',
    status: 'Unread',
  },
  {
    id: 'ct-2',
    name: 'Lara Vincent',
    email: 'lara@email.gg',
    topic: 'False moderation flag',
    message: 'My comment was hidden after I linked a workaround thread. Can someone review the moderation action?',
    createdAt: '2026-06-01 19:45',
    status: 'In Review',
  },
]

export const visitors: VisitorRecord[] = [
  {
    id: 'v-1',
    ip: '103.88.42.11',
    location: 'Karachi, PK',
    page: '/',
    referrer: 'google.com',
    timestamp: '2026-06-04T11:58:00.000Z',
    visitedAt: '2 min ago',
    session: 'sess_4KQ12',
    type: 'New',
  },
  {
    id: 'v-2',
    ip: '66.214.88.31',
    location: 'Dallas, US',
    page: '/issues/pubg-crash-fix-patch-31-2-erangel-parachute',
    referrer: 'reddit.com',
    timestamp: '2026-06-04T11:49:00.000Z',
    visitedAt: '11 min ago',
    session: 'sess_29A7L',
    type: 'Return',
  },
  {
    id: 'v-3',
    ip: '52.91.17.99',
    location: 'London, UK',
    page: '/contact',
    referrer: 'discord.com',
    timestamp: '2026-06-04T11:38:00.000Z',
    visitedAt: '22 min ago',
    session: 'sess_6NM8R',
    type: 'New',
  },
]

export const users: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Viper Knight',
    email: 'viper@livepatch.online',
    role: 'User',
    joinedAt: '2026-04-12',
    status: 'Active',
    reportedMessages: 0,
  },
  {
    id: 'u-2',
    name: 'Echo Moderator',
    email: 'echo@livepatch.online',
    role: 'Moderator',
    joinedAt: '2026-03-19',
    status: 'Active',
    reportedMessages: 1,
  },
  {
    id: 'u-3',
    name: 'Rogue Pixel',
    email: 'rogue@livepatch.online',
    role: 'User',
    joinedAt: '2026-05-28',
    status: 'Flagged',
    reportedMessages: 4,
  },
]

export const trendingSearches = [
  { rank: '01', title: 'PUBG crash fix after patch 31.2', growth: '+380% today' },
  { rank: '02', title: 'Cyberpunk 2.2 stuttering RTX 4080', growth: '+210% today' },
  { rank: '03', title: 'FIFA 25 server error code CE-34878', growth: '+145% today' },
]

export const gameIssueStats = [
  { name: 'PUBG', count: 47, width: '92%' },
  { name: 'Cyberpunk', count: 31, width: '68%' },
  { name: 'GTA 5', count: 23, width: '52%' },
  { name: 'FIFA 25', count: 14, width: '34%' },
]

export function getIssueBySlug(slug: string) {
  return issues.find((issue) => issue.slug === slug)
}

export function canonicalUrl(pathname = '/') {
  return new URL(pathname, siteSettings.canonicalUrl).toString()
}
