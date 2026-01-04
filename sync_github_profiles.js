import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchGitHubData(username) {
  console.log(`Fetching GitHub data for ${username}...`);
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const reposData = await reposRes.json();

    if (!Array.isArray(reposData)) {
      console.error(`Could not fetch repos for ${username}:`, reposData);
      return null;
    }

    // Sort by stars for famous repos
    const famousRepos = reposData
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map(r => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        description: r.description
      }));

    // Calculate most used languages
    const languagesMap = {};
    reposData.forEach(r => {
      if (r.language) {
        languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      }
    });

    const mostUsedLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(l => l[0]);

    return {
      bio: userData.bio,
      github_url: userData.html_url,
      repos_count: userData.public_repos,
      famous_repos: famousRepos,
      most_used_languages: mostUsedLanguages
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${username}:`, error);
    return null;
  }
}

async function updateProfilesWithGitHub() {
  console.log('Starting profile updates with GitHub data...');

  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, username');

  if (pError) {
    console.error('Error fetching profiles:', pError.message);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profiles found in database.');
    return;
  }

  for (const profile of profiles) {
    if (!profile.username) continue;

    const githubData = await fetchGitHubData(profile.username);
    if (githubData) {
      const { error: uError } = await supabase
        .from('profiles')
        .update(githubData)
        .eq('id', profile.id);

      if (uError) {
        console.error(`Error updating profile for ${profile.username}:`, uError.message);
      } else {
        console.log(`Successfully updated profile for ${profile.username}`);
      }
    }
  }
}

updateProfilesWithGitHub();
