export type ServiceIconMeta = {
  bg: string
  text: string
  fallbackInitials?: string
}

export function getServiceIconMeta(name: string): ServiceIconMeta {
  const lower = name.toLowerCase()
  if (lower.includes('netflix'))  return { bg: 'bg-red-500/15',    text: 'text-red-500' }
  if (lower.includes('youtube'))  return { bg: 'bg-red-500/15',    text: 'text-red-500' }
  if (lower.includes('chatgpt') || lower.includes('openai') || lower.includes('gpt'))
                                  return { bg: 'bg-emerald-500/15', text: 'text-emerald-500' }
  if (lower.includes('capcut'))   return { bg: 'bg-slate-600/30',  text: 'text-red-200' }
  if (lower.includes('canva'))    return { bg: 'bg-blue-500/15',   text: 'text-blue-500' }
  if (lower.includes('prime') || lower.includes('amazon'))
                                  return { bg: 'bg-amber-500/15',  text: 'text-amber-500' }
  if (lower.includes('spotify'))  return { bg: 'bg-emerald-500/15', text: 'text-emerald-500' }
  return { bg: 'bg-emerald-500/15', text: 'text-emerald-500' }
}
