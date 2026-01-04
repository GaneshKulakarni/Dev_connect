const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'PRESENT' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DUMMY_PROFILES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Sarah Drasner',
    username: 'sdras',
    avatar_url: 'https://github.com/sdras.png',
    bio: 'VP of Developer Experience at Netlify. Vue Core Team member.',
    github_url: 'https://github.com/sdras',
    repos_count: 142,
    famous_repos: JSON.stringify([
      { name: 'intro-to-vue', url: 'https://github.com/sdras/intro-to-vue', stars: 4500, description: 'Intro to Vue.js Workshop' },
      { name: 'vue-sample-kanban', url: 'https://github.com/sdras/vue-sample-kanban', stars: 1200, description: 'A sample kanban board' }
    ]),
    most_used_languages: JSON.stringify(['Vue', 'JavaScript', 'CSS', 'HTML'])
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Dan Abramov',
    username: 'gaearon',
    avatar_url: 'https://github.com/gaearon.png',
    bio: 'Working on React at Meta. Co-author of Redux and Create React App.',
    github_url: 'https://github.com/gaearon',
    repos_count: 280,
    famous_repos: JSON.stringify([
      { name: 'redux', url: 'https://github.com/reduxjs/redux', stars: 60000, description: 'Predictable state container for JavaScript apps' },
      { name: 'react-hot-loader', url: 'https://github.com/gaearon/react-hot-loader', stars: 12000, description: 'Tweak React components in real time' }
    ]),
    most_used_languages: JSON.stringify(['JavaScript', 'TypeScript', 'React'])
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Addy Osmani',
    username: 'addyosmani',
    avatar_url: 'https://github.com/addyosmani.png',
    bio: 'Engineering Manager at Google working on Chrome. Author of Learning JavaScript Design Patterns.',
    github_url: 'https://github.com/addyosmani',
    repos_count: 350,
    famous_repos: JSON.stringify([
      { name: 'critical', url: 'https://github.com/addyosmani/critical', stars: 9500, description: 'Extract & Inline Critical-path CSS in HTML pages' },
      { name: 'psi', url: 'https://github.com/addyosmani/psi', stars: 3000, description: 'PageSpeed Insights for Node' }
    ]),
    most_used_languages: JSON.stringify(['JavaScript', 'HTML', 'CSS'])
  }
];

async function seedProfiles() {
  console.log('Seeding dummy profiles...');

  for (const profileData of DUMMY_PROFILES) {
    // Parse JSON strings back for the client if it handles objects, 
    // but often for direct SQL or some clients, objects are better.
    // Supabase JS client handles objects for JSONB columns.
    const profile = {
        ...profileData,
        famous_repos: JSON.parse(profileData.famous_repos),
        most_used_languages: JSON.parse(profileData.most_used_languages)
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding profile ${profile.username}:`, error.message);
    } else {
      console.log(`Successfully seeded profile: ${profile.username}`);
    }
  }

  console.log('Seeding complete!');
}

seedProfiles();
