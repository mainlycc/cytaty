'use server'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function approveMeme(memeId: number) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('memes')
    .update({ status: 'approved' })
    .eq('id', memeId)

  return { success: !error }
}

export async function rejectMeme(memeId: number) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('memes')
    .update({ status: 'rejected' })
    .eq('id', memeId)

  return { success: !error }
}

// Podobne funkcje dla quizów 