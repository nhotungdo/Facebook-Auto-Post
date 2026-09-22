"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useWorkspace() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsLoading(false)
          return
        }

        // Fetch user's workspaces
        const { data, error } = await supabase
          .from("workspaces")
          .select("id")
          .limit(1)

        if (error) throw error

        if (data && data.length > 0) {
          setWorkspaceId(data[0].id)
        } else {
          // Fallback if no workspace found - normally shouldn't happen if user creation trigger works
          // Or we could auto-create a workspace here, but the Python backend does that via API.
          // For now, set to null.
          setWorkspaceId(null)
        }
      } catch (err) {
        console.error("Error fetching workspace:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspace()
  }, [])

  return { workspaceId, isLoading }
}
