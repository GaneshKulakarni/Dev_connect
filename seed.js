import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const DUMMY_COMMUNITIES = [
  {
    name: "Web Dev Enthusiasts",
    description: "A community for web developers to share knowledge, showcase projects, and stay updated with the latest web technologies.",
  },
  {
    name: "AI & Machine Learning",
    description: "Discuss the latest trends in artificial intelligence, deep learning, and neural networks. Share your research and models here.",
  },
  {
    name: "Open Source Contributors",
    description: "A space dedicated to open source projects, contribution guides, and collaboration on global software initiatives.",
  },
  {
    name: "UI/UX Designers",
    description: "Connect with fellow designers, share your portfolio, and discuss the latest design systems and user experience trends.",
  }
];

const DUMMY_POSTS = [
  {
    title: "Getting Started with React Hooks",
    content: "React Hooks revolutionized how we write React components by allowing us to use state and other React features without writing a class. In this post, we'll explore the most commonly used hooks like useState, useEffect, and custom hooks.",
    image_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  },
  {
    title: "Advanced TypeScript Patterns",
    content: "TypeScript has become the go-to choice for large-scale JavaScript applications. Let's explore advanced patterns like conditional types, mapped types, and utility types that can make your code more robust and maintainable.",
    image_url: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&h=400&fit=crop",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    title: "Building Scalable APIs with Node.js",
    content: "Creating APIs that can handle millions of requests requires careful planning and the right architecture. We'll look at how to structure your Node.js application for maximum scalability and performance.",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    avatar_url: "https://images.unsplash.com/photo-1578176603894-57973e5d7d65?w=100&h=100&fit=crop&crop=face",
  }
];

async function seed() {
  console.log('Seeding communities...')
  const { data: communities, error: communityError } = await supabase
    .from('communities')
    .insert(DUMMY_COMMUNITIES)
    .select()

  if (communityError) {
    console.error('Error seeding communities:', communityError)
    return
  }
  console.log(`Seeded ${communities.length} communities.`)

  console.log('Fetching users...')
  const { data: users, error: userError } = await supabase.from('profiles').select('id').limit(1)
  
  if (userError || !users || users.length === 0) {
    console.warn('No users found in profiles table. Posts will be created with null user_id if allowed, or might fail.')
  }
  const userId = users?.[0]?.id

  console.log('Seeding posts...')
  const postsWithCommunity = DUMMY_POSTS.map((post, index) => ({
    ...post,
    community_id: communities[index % communities.length].id,
    user_id: userId // Use an existing user ID if available
  }))

  const { data: posts, error: postError } = await supabase
    .from('posts')
    .insert(postsWithCommunity)
    .select()

  if (postError) {
    console.error('Error seeding posts:', postError)
    return
  }
  console.log(`Seeded ${posts.length} posts.`)

  console.log('Database seeding completed successfully!')
}

seed()
