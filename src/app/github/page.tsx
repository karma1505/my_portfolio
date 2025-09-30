"use client";
import { useState, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { useWindowContext } from "@/contexts/WindowContext";

interface GitHubStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributionsThisYear: number;
  contributionsLastYear: number;
  averagePerWeek: number;
  mostActiveDay: string;
  mostActiveMonth: string;
}

interface ContributionData {
  date: string;
  count: number;
  level: number;
}

export default function GitHub() {
  const { isWindowMinimized, minimizeWindow } = useWindowContext();
  const windowId = "github";
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGitHubStats();
  }, []);

  const fetchGitHubStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get username from environment or use default
      const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'your-username';
      const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      
      console.log('GitHub API Debug:', { 
        username, 
        hasToken: !!githubToken,
        tokenLength: githubToken?.length 
      });
      
      if (githubToken && githubToken !== 'your_github_token_here') {
        console.log('Using GitHub API with token');
        await fetchRealGitHubData(username, githubToken);
      } else {
        console.log('Using fallback data - no valid token found');
        await fetchContributionGraphImage(username);
      }
      
    } catch (err) {
      console.error("GitHub stats error:", err);
      setError(`Failed to fetch GitHub stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchContributionGraphImage = async (username: string) => {
    // This uses GitHub's contribution graph image
    // It's a simple approach that doesn't require API authentication
    const contributionImageUrl = `https://github.com/${username}`;
    
    // For now, we'll use mock data but you can display the actual GitHub profile
    const mockStats: GitHubStats = {
      totalContributions: 2847,
      currentStreak: 12,
      longestStreak: 45,
      contributionsThisYear: 1247,
      contributionsLastYear: 1600,
      averagePerWeek: 12.3,
      mostActiveDay: "Monday",
      mostActiveMonth: "October"
    };

    const mockContributions: ContributionData[] = generateMockContributions();
    
    setStats(mockStats);
    setContributions(mockContributions);
  };

  const fetchRealGitHubData = async (username: string, token: string) => {
    try {
      console.log(`Fetching GitHub data for user: ${username}`);
      
      // Fetch user data first
      const userResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`User API failed: ${userResponse.status} - ${errorText}`);
      }

      const userData = await userResponse.json();
      console.log('User data fetched:', userData.login);

      // Fetch contribution data using GitHub's GraphQL API for 2025
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01T00:00:00Z`;
      const endDate = `${currentYear}-12-31T23:59:59Z`;
      
      console.log('Fetching contributions for date range:', { startDate, endDate, currentYear });
      
      const contributionQuery = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }
      `;

      const graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: contributionQuery,
          variables: { 
            username,
            from: startDate,
            to: endDate
          }
        })
      });

      if (!graphqlResponse.ok) {
        const errorText = await graphqlResponse.text();
        throw new Error(`GraphQL API failed: ${graphqlResponse.status} - ${errorText}`);
      }

      const graphqlData = await graphqlResponse.json();
      
      if (graphqlData.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(graphqlData.errors)}`);
      }

      const contributions = graphqlData.data.user.contributionsCollection;
      console.log('2025 Contribution data fetched:', contributions.contributionCalendar.totalContributions);
      console.log('2025 Detailed contributions:', {
        commits: contributions.totalCommitContributions,
        issues: contributions.totalIssueContributions,
        pullRequests: contributions.totalPullRequestContributions,
        reviews: contributions.totalPullRequestReviewContributions,
        calendar: contributions.contributionCalendar.totalContributions
      });
      
      // Fetch all-time contributions for comparison
      const allTimeQuery = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `;
      
      const allTimeResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: allTimeQuery,
          variables: { username }
        })
      });
      
      let allTimeContributions = null;
      if (allTimeResponse.ok) {
        const allTimeData = await allTimeResponse.json();
        if (!allTimeData.errors) {
          allTimeContributions = allTimeData.data.user.contributionsCollection;
          console.log('All-time contributions:', allTimeContributions);
          console.log('All-time calendar total:', allTimeContributions.contributionCalendar.totalContributions);
        }
      }
      
      // Calculate additional stats from contribution data
      const contributionData: ContributionData[] = [];
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const dayStats: { [key: string]: number } = {};
      const monthStats: { [key: string]: number } = {};
      
      contributions.contributionCalendar.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          
          // Track day and month activity
          dayStats[dayName] = (dayStats[dayName] || 0) + day.contributionCount;
          monthStats[monthName] = (monthStats[monthName] || 0) + day.contributionCount;
          
          // Calculate streaks
          if (day.contributionCount > 0) {
            tempStreak++;
            currentStreak = Math.max(currentStreak, tempStreak);
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
          }
          
          contributionData.push({
            date: day.date,
            count: day.contributionCount,
            level: Math.min(4, Math.floor(day.contributionCount / 3))
          });
        });
      });

      // Find most active day and month
      const mostActiveDay = Object.keys(dayStats).reduce((a, b) => dayStats[a] > dayStats[b] ? a : b);
      const mostActiveMonth = Object.keys(monthStats).reduce((a, b) => monthStats[a] > monthStats[b] ? a : b);
      
      // Calculate average per week
      const totalWeeks = contributions.contributionCalendar.weeks.length;
      const averagePerWeek = totalWeeks > 0 ? contributions.contributionCalendar.totalContributions / totalWeeks : 0;
      
      // Process the real data
      // Use contribution calendar total for 2025 (this matches what GitHub shows)
      const contributions2025 = contributions.contributionCalendar.totalContributions;
      
      // For all-time, use the contribution calendar total (this is what GitHub shows)
      const totalAllTime = allTimeContributions ? 
        allTimeContributions.contributionCalendar.totalContributions : contributions2025;
        
      console.log('Final calculations:', {
        contributions2025,
        totalAllTime,
        calendarTotal: contributions.contributionCalendar.totalContributions
      });
        
      const realStats: GitHubStats = {
        totalContributions: totalAllTime,
        currentStreak: currentStreak,
        longestStreak: Math.max(longestStreak, tempStreak),
        contributionsThisYear: contributions2025,
        contributionsLastYear: 0, // Would need additional API call for previous year
        averagePerWeek: Math.round(averagePerWeek * 10) / 10,
        mostActiveDay: mostActiveDay,
        mostActiveMonth: mostActiveMonth
      };

      console.log('Processed stats:', realStats);
      setStats(realStats);
      setContributions(contributionData);
      
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setError(`GitHub API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to mock data
      const mockStats: GitHubStats = {
        totalContributions: 2847,
        currentStreak: 12,
        longestStreak: 45,
        contributionsThisYear: 1247,
        contributionsLastYear: 1600,
        averagePerWeek: 12.3,
        mostActiveDay: "Monday",
        mostActiveMonth: "October"
      };

      const mockContributions: ContributionData[] = generateMockContributions();
      
      setStats(mockStats);
      setContributions(mockContributions);
    }
  };

  const generateMockContributions = (): ContributionData[] => {
    const contributions: ContributionData[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const count = Math.floor(Math.random() * 10);
      const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 2));
      
      contributions.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return contributions;
  };

  const getContributionColor = (level: number) => {
    const colors = [
      '#ebedf0', // No contributions
      '#c6e48b', // 1-3 contributions
      '#7bc96f', // 4-6 contributions
      '#239a3b', // 7-9 contributions
      '#196127'  // 10+ contributions
    ];
    return colors[level] || colors[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleMinimize = () => {
    minimizeWindow(windowId);
  };

  if (isWindowMinimized(windowId)) {
    return null;
  }

  return (
    <WindowWrapper
      title="GitHub Activity"
      onMinimize={handleMinimize}
      isMinimized={isWindowMinimized(windowId)}
      width="900px"
      height="700px"
    >
      <div className="h-full flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading GitHub stats...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchGitHubStats}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">GitHub Activity</h2>
              <button
                onClick={fetchGitHubStats}
                disabled={loading}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
            </div>


            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{stats?.totalContributions}</div>
                <div className="text-sm text-gray-600">All-Time Contributions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">{stats?.contributionsThisYear}</div>
                <div className="text-sm text-green-700 font-medium">2025 Contributions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.longestStreak}</div>
                <div className="text-sm text-gray-600">Longest Streak</div>
              </div>
            </div>

            {/* Contribution Graph */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">2025 Contribution Activity</h3>
              <div className="bg-white border rounded-lg p-4">
                {/* Option 1: Custom contribution grid */}
                <div className="grid grid-cols-53 gap-1 mb-4">
                  {contributions.slice(-365).map((contribution, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getContributionColor(contribution.level) }}
                      title={`${formatDate(contribution.date)}: ${contribution.count} contributions`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getContributionColor(level) }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
                
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Activity Insights</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>Most active day: <span className="font-medium">{stats?.mostActiveDay}</span></p>
                  <p>Most active month: <span className="font-medium">{stats?.mostActiveMonth}</span></p>
                  <p>Average per week: <span className="font-medium">{stats?.averagePerWeek}</span> contributions</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Year Comparison</h4>
                <div className="space-y-1 text-sm text-green-800">
                  <p>This year: <span className="font-medium">{stats?.contributionsThisYear}</span> contributions</p>
                  <p>Last year: <span className="font-medium">{stats?.contributionsLastYear}</span> contributions</p>
                  <p>Change: <span className="font-medium text-red-600">-{((stats?.contributionsLastYear || 0) - (stats?.contributionsThisYear || 0))}</span></p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WindowWrapper>
  );
}
