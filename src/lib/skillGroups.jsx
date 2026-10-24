import { Database, FileText, Layout, Palette, Server, Wrench } from 'lucide-react'

// The technical groups, in display order. The database stores a skill's group as
// `key`; "core" is the separate competencies list above them.
export const SKILL_GROUPS = [
    { key: 'frontend', label: 'Frontend', icon: <Layout size={14} /> },
    { key: 'backend', label: 'Backend', icon: <Server size={14} /> },
    { key: 'database', label: 'Database', icon: <Database size={14} /> },
    { key: 'tools', label: 'Tech Tools', icon: <Wrench size={14} /> },
    { key: 'creative', label: 'Creative Tools', icon: <Palette size={14} /> },
    { key: 'office', label: 'Office Tools', icon: <FileText size={14} /> },
]
