import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../supabase-client";

interface AuthContextType {
    user: User | null;
    signInWithGithub: () => void;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    syncProfile: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) syncProfile(currentUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      // If user just logged in, trigger profile sync
      if (newUser && (newUser.user_metadata?.user_name || newUser.user_metadata?.preferred_username)) {
        syncProfile(newUser);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const syncProfile = async (user: User) => {
    const username = user.user_metadata?.user_name || user.user_metadata?.preferred_username;
    if (!username) {
        console.warn("No username found for profile sync");
        return;
    }

    try {
      console.log(`Starting profile sync for ${username}...`);
      // 1. Fetch GitHub data
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error(`GitHub user fetch failed: ${userRes.statusText}`);
      const userData = await userRes.json();
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!reposRes.ok) throw new Error(`GitHub repos fetch failed: ${reposRes.statusText}`);
      const reposData = await reposRes.json();

      const famousRepos = Array.isArray(reposData) ? reposData
        .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 3)
        .map((r: any) => ({
          name: r.name,
          url: r.html_url,
          stars: r.stargazers_count || 0,
          description: r.description || ""
        })) : [];

      const languagesMap: Record<string, number> = {};
      if (Array.isArray(reposData)) {
          reposData.forEach((repo: any) => {
            if (repo.language) {
              languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
            }
          });
      }
      
      const mostUsedLanguages = Object.entries(languagesMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang]) => lang);

      // 2. Update profiles table
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username,
        full_name: user.user_metadata?.full_name || username,
        avatar_url: user.user_metadata?.avatar_url || userData.avatar_url,
        bio: userData.bio || "",
        github_url: userData.html_url || `https://github.com/${username}`,
        repos_count: userData.public_repos || 0,
        famous_repos: famousRepos,
        most_used_languages: mostUsedLanguages
      });

      if (upsertError) throw upsertError;
      console.log(`Profile sync successful for ${username}`);
    } catch (err) {
      console.error("Error syncing profile:", err);
      throw err;
    }
  };

  const signInWithGithub = () => {
    const redirectTo = `${window.location.origin}/`;
    supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signInWithEmail, signOut, syncProfile }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
